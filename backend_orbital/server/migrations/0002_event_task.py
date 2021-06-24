# Generated by Django 3.2.3 on 2021-06-24 09:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('taskID', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=50)),
                ('isCompleted', models.BooleanField()),
                ('creationDate', models.DateTimeField(auto_now_add=True)),
                ('userID', models.ForeignKey(db_column='userID', on_delete=django.db.models.deletion.CASCADE, to='server.memberuser')),
            ],
            options={
                'verbose_name': 'Task',
                'db_table': 'task',
            },
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('eventID', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=100)),
                ('day', models.DateField()),
                ('startTime', models.TimeField()),
                ('endTime', models.TimeField()),
                ('creationDate', models.DateTimeField(auto_now_add=True)),
                ('userID', models.ForeignKey(db_column='userID', on_delete=django.db.models.deletion.CASCADE, to='server.memberuser')),
            ],
            options={
                'verbose_name': 'Event',
                'db_table': 'event',
            },
        ),
    ]
