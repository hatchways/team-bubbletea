import unittest
from app import create_app
from database import db
import os


class TestBase(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.app.testing = True
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
            'TEST_DATABASE_URL') or 'postgresql://localhost/circulate'
        db.create_all()
        self.api = self.app.test_client()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    if __name__ == "__main__":
        unittest.main()
