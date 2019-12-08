from test.test_base import TestBase
import unittest
import json
import random
from models import User
from database import db


class UserHandlerTest(TestBase):
    def test_create_user(self):
        user = User()
        db.session.add(user)
        db.session.commit()
