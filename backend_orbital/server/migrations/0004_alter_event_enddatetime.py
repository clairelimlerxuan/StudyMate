# Generated by Django 3.2.3 on 2021-07-11 14:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0003_auto_20210711_2219'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='endDateTime',
            field=models.DateTimeField(),
        ),
    ]