# Generated by Django 3.2.22 on 2023-10-16 12:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0003_alter_task_due_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='attachment',
            field=models.FileField(blank=True, null=True, upload_to='task_attachments/'),
        ),
    ]
