# Generated by Django 3.2.3 on 2021-06-21 16:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='downvote',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='post',
            name='numOfComments',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='post',
            name='upvote',
            field=models.IntegerField(default=0),
        ),
    ]