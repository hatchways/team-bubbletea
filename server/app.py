import uuid 
import boto3
from flask import Flask, request, Response, jsonify
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from flask_sqlalchemy import SQLAlchemy
from config import POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_URL, POSTGRES_USERNAME, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET_REGION

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql+psycopg2://{POSTGRES_USERNAME}:{POSTGRES_PASSWORD}@{POSTGRES_URL}/{POSTGRES_DATABASE}'
db = SQLAlchemy(app)

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)

s3 = boto3.client(
	's3',
	region_name = S3_BUCKET_REGION,
	aws_access_key_id=S3_ACCESS_KEY_ID,
	aws_secret_access_key=S3_SECRET_ACCESS_KEY, 
	config= boto3.session.Config(signature_version='s3v4')
	)

app = Flask(__name__)

@app.route('/submissions')
def files():
	s3_resource = boto3.resource('s3')
	my_bucket = s3_resource.Bucket(S3_BUCKET)
	summaries = my_bucket.objects.all()

	submissionsURLs = []
	submissionKeys = []
	for summary in summaries:
		signedURL = s3.generate_presigned_url('get_object', Params={'Bucket': S3_BUCKET, 'Key': summary.key}, ExpiresIn=1000)
		submissionKeys.append(summary.key)
		submissionsURLs.append(signedURL)

	return jsonify({ "files" : submissionsURLs, "fileKeys" : submissionKeys })

@app.route('/upload', methods=['POST'])
def upload():
	file = request.files['file']

	s3_resource = boto3.resource('s3')
	my_bucket = s3_resource.Bucket(S3_BUCKET)
	my_bucket.Object(str(uuid.uuid1()) + file.filename).put(Body=file)

	return jsonify({ "success": "true" })

# I made a route for deleting as well, but I'm not sure if that's something we want our users to be able to do? 
# If we decide to keep it, I'll make a front-end API endpoint for it as well 

@app.route('/delete', methods=['POST'])
def delete():
	key = request.form['key']

	s3_resource = boto3.resource('s3')
	my_bucket = s3_resource.Bucket(S3_BUCKET)
	my_bucket.Object(key).delete()

	flash('Your file has been deleted successfully.')
	return redirect(url_for('files'))

@app.route('/download', methods=['POST'])
def download():
	key = request.json['key']

	s3_resource = boto3.resource('s3')
	my_bucket = s3_resource.Bucket(S3_BUCKET)

	file_obj = my_bucket.Object(key).get()

	return Response(
		file_obj['Body'].read(),
		mimetype='image/png', 
		headers={"Content-Type" : "image/png", "Content-Disposition" : "attachment;filename={}".format(key)}
	)

if __name__ == '__main__':
	app.run()