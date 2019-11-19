from flask import Flask
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from flask_sqlalchemy import SQLAlchemy
from config import POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_URL, POSTGRES_USERNAME, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql+psycopg2://{POSTGRES_USERNAME}:{POSTGRES_PASSWORD}@{POSTGRES_URL}/{POSTGRES_DATABASE}'
db = SQLAlchemy(app)

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)

s3 = boto3.client(
	's3',
	aws_access_key_id=S3_ACCESS_KEY_ID,
	aws_secret_access_key=S3_SECRET_ACCESS_KEY
	)

Bootstrap(app)
app.secret_key = 'secret'

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/submissions')
def files():
	s3_resource = boto3.resource('s3')
	my_bucket = s3_resource.Bucket(S3_BUCKET)
	summaries = my_bucket.objects.all()

	return render_template('submissions.html', my_bucket=my_bucket, files=summaries)

@app.route('/upload', methods=['POST'])
def upload():
	print(request.files)
	file = request.files['picture']

	s3_resource = boto3.resource('s3')
	my_bucket = s3_resource.Bucket(S3_BUCKET)
	my_bucket.Object(file.filename).put(Body=file)

	flash('Your file has been uploaded successfully.')
	return redirect(url_for('files'))

if __name__ == '__main__':
	app.run()