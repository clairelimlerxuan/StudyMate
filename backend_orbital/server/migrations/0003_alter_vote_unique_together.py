# Generated by Django 3.2.3 on 2021-06-17 02:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0002_reply'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='vote',
            unique_together={('userID', 'postID')},
        ),
    ]
