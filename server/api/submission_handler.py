import boto3
import uuid
from flask import Blueprint, jsonify, request, redirect, url_for, Response
from database import db
from config import S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET_REGION
from models import User, Submission, Contest
from datetime import datetime
from api.payment_handler import send_transfer, charge_payment
from sqlalchemy.exc import DataError, IntegrityError
from botocore.exceptions import BotoCoreError, ClientError
from utils import handle_database_error, handle_amazon_error, handle_stripe_error, handle_authentication_error, requires_authentication
import stripe
import jwt

submission_handler = Blueprint('submission_handler', __name__)

s3 = boto3.client(
    's3',
    region_name=S3_BUCKET_REGION,
    aws_access_key_id=S3_ACCESS_KEY_ID,
    aws_secret_access_key=S3_SECRET_ACCESS_KEY,
    config=boto3.session.Config(signature_version='s3v4')
)


@submission_handler.route('/')
@requires_authentication
def show_all(authenticated_user_id, contest_id):
    contest = Contest.query.get_or_404(contest_id)
    if contest.owner.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)
    submissions = Submission.query.filter_by(contest_id=contest_id).all()
    winner = Submission.query.filter_by(
        contest_id=contest_id, winner=True).first()

    submissionsURLs = []
    submissionKeys = []

    try:
        for submission in submissions:
            signedURL = s3.generate_presigned_url('get_object', Params={
                'Bucket': S3_BUCKET, 'Key': submission.image}, ExpiresIn=1000)
            submissionKeys.append(submission.image)
            submissionsURLs.append(signedURL)

    except BotoCoreError as e:
        return handle_amazon_error(e, "We could not retrieve the current contest's submissions from the S3 bucket.")

    return jsonify({"files": submissionsURLs,
                    "fileKeys": submissionKeys,
                    "submissionIDs": [submission.id for submission in submissions],
                    "winnerID": winner.id if winner else None})


@submission_handler.route('/upload', methods=['POST'])
@requires_authentication
def upload(authenticated_user_id, contest_id):
    file = request.files['file']

    try:
        s3_resource = boto3.resource('s3')
        my_bucket = s3_resource.Bucket(S3_BUCKET)
        file_key = str(uuid.uuid1()) + file.filename
        my_bucket.Object(file_key).put(Body=file)

        submission = Submission(
            user_id=authenticated_user_id, contest_id=contest_id, image=file_key)

        db.session.add(submission)
        db.session.commit()

    except (BotoCoreError, ClientError) as e:
        return handle_amazon_error(e, 'File could not be uploaded to S3 Bucket.')

    except (DataError, AssertionError, IntegrityError) as e:
        db.session.rollback()
        return handle_database_error(e, 'Submission could not be added.')

    return jsonify({"success": "true"})


@submission_handler.route('/<int:submission_id>')
@requires_authentication
def show_submission(authenticated_user_id, contest_id, submission_id):
    contest = Contest.query.get_or_404(contest_id)
    if contest.owner.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)
    submission = Submission.query.get_or_404(submission_id)
    return jsonify(submission.to_dict())


@submission_handler.route('/<int:submission_id>/edit')
@requires_authentication
def edit(authenticated_user_id, contest_id, submission_id):
    submission = Submission.query.get_or_404(submission_id)
    if submission.artist.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)
    return jsonify('Show form for editing this submission', submission.to_dict())


@submission_handler.route('/<int:submission_id>', methods=['PATCH', 'PUT'])
@requires_authentication
def update(authenticated_user_id, contest_id, submission_id):
    submission = Submission.query.get_or_404(submission_id)
    if submission.artist.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)
    try:
        # if there is no data (request.json is empty) should we return an error?
        if request.json:
            for key in request.json.keys():
                setattr(submission, key, request.json[key])
            db.session.commit()
    except (DataError, AssertionError, IntegrityError) as e:
        db.session.rollback()
        return handle_database_error(e, 'Submission was not updated.')

    return redirect(url_for('submission_handler.show_submission', contest_id=contest_id, submission_id=submission.id))


@submission_handler.route('/<int:submission_id>', methods=['DELETE'])
@requires_authentication
def delete(authenticated_user_id, contest_id, submission_id):
    submission = Submission.query.get_or_404(submission_id)
    if submission.artist.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)

    try:
        db.session.delete(submission)
        db.session.commit()
    except (DataError, AssertionError, IntegrityError) as e:
        db.session.rollback()
        return handle_database_error(e, 'Submission was not deleted.')

    return redirect(url_for('submission_handler.show_all', contest_id=contest_id))


@submission_handler.route('/winner', methods=['POST'])
@requires_authentication
def declare_winner(authenticated_user_id, contest_id):
    submission = Submission.query.get_or_404(request.json['submission_id'])
    if submission.contest.owner.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)
    try:
        submission.winner = True
        charge_payment(contest_id)
        send_transfer(contest_id)
        db.session.commit()

    except (DataError, AssertionError, IntegrityError) as e:
        db.session.rollback()
        return handle_database_error(e, 'Contest winner was not declared.')

    except stripe.error.StripeError as e:
        return handle_stripe_error(e, 'Contest owner was not charged and/or winner was not paid')

    return jsonify({'success': 'contest winner added to db'})


@submission_handler.route('/download', methods=['POST'])
@requires_authentication
def download(authenticated_user_id, contest_id):
    contest = Contest.query.get_or_404(contest_id)
    if contest.owner.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)
    key = str(request.json['key'])

    try:
        s3_resource = boto3.resource('s3')
        my_bucket = s3_resource.Bucket(S3_BUCKET)
        file_obj = my_bucket.Object(key).get()
    except (BotoCoreError, ClientError) as e:
        return handle_amazon_error(e, 'We failed to download image from S3 bucket.')

    return Response(
        file_obj['Body'].read(),
        mimetype='image/png',
        headers={"Content-Type": "image/png",
                 "Content-Disposition": "attachment;filename={}".format(key)}
    )
