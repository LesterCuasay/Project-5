from django.contrib.auth.models import User
from .models import Task
from rest_framework import status
from rest_framework.test import APITestCase


class TestListViewTests(APITestCase):

    def setUp(self):
        '''
        Sets up a user to be accessed in the Test Cases
        '''

        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword',
        )

    def test_logged_in_user_can_view_list_task(self):
        '''
        Tests if a logged in user to check if they can see the task list view
        '''

        self.client.login(
            username='testuser',
            password='testpassword',
        )

        Task.objects.create(owner=self.user, task_name='A task')

        response = self.client.get('/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_out_user_can_view_list_task(self):
        '''
        Tests if a logged out user can check the task list view
        '''

        Task.objects.create(owner=self.user, task_name='A task')

        response = self.client.get('/tasks/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logged_in_user_can_create_task(self):
        '''
        Tests if a logged in user can create a task
        '''

        self.client.login(
            username='testuser',
            password='testpassword',
        )

        response = self.client.post('/tasks/', {'task_name': 'A task'})
        count = Task.objects.count()
        self.assertEqual(count, 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_logged_out_user_can_create_task(self):
        '''
        Tests if a logged out user can create a task
        '''

        response = self.client.post('/tasks/', {'task_name': 'A task'})
        count = Task.objects.count()
        self.assertEqual(count, 0)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
