# Generated by Django 3.2.3 on 2021-06-21 19:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0003_alter_post_moduleid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='moduleID',
            field=models.ForeignKey(blank=True, db_column='moduleID', null=True, on_delete=django.db.models.deletion.RESTRICT, to='server.module'),
        ),
    ]
