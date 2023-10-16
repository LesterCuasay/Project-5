from django.contrib.auth.models import User
from .models import Task
from rest_framework import status
from rest_framework.test import APITestCase


class TestListViewTests(APITestCase):
    '''
    Tests for TaskList view
    '''

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


class TestDetailViewTests(APITestCase):
    '''
    Tests for TaskDetail view
    '''

    def setUp(self):
        '''
        Sets up a user to be accessed in the Test Cases
        '''

        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword',
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            password='testpassword2',
        )

        Task.objects.create(
            owner=self.user,
            task_name='A task'
        )
        Task.objects.create(
            owner=self.user2,
            task_name='A task2'
        )

    def test_can_retrieve_task_using_valid_id(self):
        '''
        Tests if a valid user can access their tasks with a valid id
        '''

        self.client.login(
            username='testuser',
            password='testpassword',
        )

        response = self.client.get('/tasks/1/')

        self.assertEqual(response.data['task_name'], 'A task')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_can_retrieve_task_using_valid_id(self):
        '''
        Tests if a user can access an invalid id
        '''

        response = self.client.get('/tasks/98/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_update_own_task(self):
        '''
        Tests if a valid user can access their tasks with a valid id
        '''

        self.client.login(
            username='testuser',
            password='testpassword',
        )

        response = self.client.put('/tasks/1/', {'task_name': 'A new task'})

        task = Task.objects.filter(pk=1).first()

        self.assertEqual(task.task_name, 'A new task')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_other_users_can_update_task(self):
        '''
        Tests if another user can update another users tasks
        '''

        self.client.login(
            username='testuser2',
            password='testpassword2',
        )

        response = self.client.put('/tasks/1/', {'task_name': 'A new task'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
