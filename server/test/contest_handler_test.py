from test.test_base import TestBase
from datetime import datetime
from models import Contest
import random
import unittest
import json


class ContestHandlerTest(TestBase):
    # manual test for now
    def test_create_contest(self):
        input_data = {'title': 'lion'+str(random.randint(0, 10000000)),
                      'description': 'any old lion tattoo',
                      'prize': 27.50,
                      'deadline': datetime(2019, 12, 12, 12, 12).strftime("%m/%d/%Y, %H:%M:%S")}

        self.api.post('/contests', data=json.dumps(input_data),
                      content_type='application/json')

    # manual test for now
    def test_update_contest(self):
        self.api.post(
            '/contests/1',
            data=json.dumps({'prize': random.randint(0, 100000)}),
            content_type='application/json')

    if __name__ == "__main__":
        unittest.main()
