# Generated by Django 3.2.3 on 2021-06-21 19:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0002_auto_20210622_0021'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='moduleID',
            field=models.OneToOneField(blank=True, db_column='moduleID', null=True, on_delete=django.db.models.deletion.RESTRICT, to='server.module'),
        ),
    ]