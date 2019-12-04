import boto3
import uuid
from flask import Blueprint, jsonify, request, redirect, url_for, Response
from database import db
from config import S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET_REGION
from models import User, Submission, Contest
from datetime import datetime
from api.payment_handler import send_transfer, charge_payment
from sqlalchemy.exc import DataError

submission_handler = Blueprint('submission_handler', __name__)

s3 = boto3.client(
    's3',
    region_name=S3_BUCKET_REGION,
    aws_access_key_id=S3_ACCESS_KEY_ID,
    aws_secret_access_key=S3_SECRET_ACCESS_KEY,
    config=boto3.session.Config(signature_version='s3v4')
)


@submission_handler.route('/')
def show_all(contest_id):
    submissions = Submission.query.filter_by(contest_id=contest_id).all()

    submissionsURLs = []
    submissionKeys = []
    for submission in submissions:
        signedURL = s3.generate_presigned_url('get_object', Params={
                                              'Bucket': S3_BUCKET, 'Key': submission.image}, ExpiresIn=1000)
        submissionKeys.append(submission.image)
        submissionsURLs.append(signedURL)

    return jsonify({"files": submissionsURLs, "fileKeys": submissionKeys, "submissionIDs": [submission.id for submission in submissions]})


@submission_handler.route('/upload', methods=['POST'])
def upload(contest_id):
    file = request.files['file']
    user_id = 1

    s3_resource = boto3.resource('s3')
    my_bucket = s3_resource.Bucket(S3_BUCKET)
    file_key = str(uuid.uuid1()) + file.filename
    my_bucket.Object(file_key).put(Body=file)

    try:
        submission = Submission(
            user_id=user_id, contest_id=contest_id, image=file_key)

        db.session.add(submission)
        db.session.commit()
    except (DataError, AssertionError) as e:
        print(
            f'Sorry we could not create your submission due to a {type(e).__name__}.')
        db.session.rollback()

    return jsonify({"success": "true"})


@submission_handler.route('/<int:submission_id>')
def show_submission(contest_id, submission_id):
    submission = Submission.query.get_or_404(submission_id)
    return jsonify(submission.to_dict())

# dedicated page for editing a contest, could potentially be combined with show_contest()
@submission_handler.route('/<int:submission_id>/edit')
def edit(contest_id, submission_id):
    submission = Submission.query.get_or_404(submission_id)
    return jsonify('Show form for editing this submission', submission.to_dict())


@submission_handler.route('/<int:submission_id>', methods=['PATCH', 'PUT'])
def update(contest_id, submission_id):
    submission = Submission.query.get_or_404(submission_id)
    try:
        for key in request.json.keys():
            setattr(submission, key, request.json[key])
        db.session.commit()
    except (DataError, AssertionError) as e:
        print(
            f'Sorry we could not update your submission due to a {type(e).__name__}.')
        db.session.rollback()

    return redirect(url_for('submission_handler.show_contest', contest_id=contest_id, submission_id=submission.id))


@submission_handler.route('/<int:submission_id>', methods=['DELETE'])
def delete(contest_id, submission_id):
    submission = Submission.query.get_or_404(submission_id)
    db.session.delete(submission)
    db.session.commit()
    return redirect(url_for('submission_handler.show_all', contest_id=contest_id))


@submission_handler.route('/winner', methods=['POST'])
def declare_winner(contest_id):
    submission = Submission.query.get_or_404(request.json['submission_id'])
    submission.winner = True
    charge_payment(contest_id)
    send_transfer(contest_id)
    db.session.commit()
    return jsonify({'success': 'contest winner added to db'})


@submission_handler.route('/download', methods=['POST'])
def download(contest_id):
    key = request.json['key']

    s3_resource = boto3.resource('s3')
    my_bucket = s3_resource.Bucket(S3_BUCKET)

    file_obj = my_bucket.Object(key).get()

    return Response(
        file_obj['Body'].read(),
        mimetype='image/png',
        headers={"Content-Type": "image/png",
                 "Content-Disposition": "attachment;filename={}".format(key)}
    )
