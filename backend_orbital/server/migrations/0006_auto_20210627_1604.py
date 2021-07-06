# Generated by Django 3.2.3 on 2021-06-27 08:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('server', '0005_comment_replycount'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='userID',
            field=models.ForeignKey(blank=True, db_column='userID', null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='reply',
            name='userID',
            field=models.ForeignKey(blank=True, db_column='userID', null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
    ]