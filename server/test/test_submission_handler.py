from test.test_base import TestBase
import unittest
import json
import random


class SubmissionHandlerTest(TestBase):
    # manual test for now
    def test_create_submission(self):
        input_data = {'user_id': 1, 'contest_id': 3, 'image': 'No Image'}

        self.api.post(f'/contests/{input_data["contest_id"]}/submissions',
                      data=json.dumps(input_data), content_type='application/json')

    # manual test for now
    def test_update_submission(self):
        active = True if random.choice(range(2)) == 1 else False
        contest_id = 3
        self.api.post(
            f'/contests/{contest_id}/submissions/1',
            data=json.dumps({'active': active}),
            content_type='application/json')

    if __name__ == "__main__":
        unittest.main()
