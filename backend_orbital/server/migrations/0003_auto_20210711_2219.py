# Generated by Django 3.2.3 on 2021-07-11 14:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0002_lesson_schedulelesson'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='endDateTime',
            field=models.DateTimeField(default='2017-05-24T10:30'),
        ),
        migrations.AddField(
            model_name='event',
            name='startDateTime',
            field=models.DateTimeField(default='2017-05-24T10:30Z'),
            preserve_default=False,
        ),
    ]