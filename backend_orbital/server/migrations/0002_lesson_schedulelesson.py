# Generated by Django 3.2.3 on 2021-07-11 14:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('lessonID', models.AutoField(primary_key=True, serialize=False)),
                ('classNo', models.CharField(max_length=5)),
                ('startTime', models.TimeField()),
                ('endTime', models.TimeField()),
                ('day', models.CharField(choices=[('MON', 'Monday'), ('TUE', 'Tuesday'), ('WED', 'Wednesday'), ('THU', 'Thursday'), ('FRI', 'Friday'), ('SAT', 'Saturday'), ('SUN', 'Sunday')], max_length=10)),
                ('lessonType', models.CharField(max_length=20)),
                ('moduleID', models.ForeignKey(db_column='moduleID', on_delete=django.db.models.deletion.CASCADE, to='server.module')),
            ],
            options={
                'verbose_name': 'Lesson',
                'db_table': 'lesson',
            },
        ),
        migrations.CreateModel(
            name='ScheduleLesson',
            fields=[
                ('scheduleID', models.AutoField(primary_key=True, serialize=False)),
                ('lessonID', models.ForeignKey(db_column='lessonID', on_delete=django.db.models.deletion.RESTRICT, to='server.lesson')),
                ('userID', models.ForeignKey(db_column='userID', on_delete=django.db.models.deletion.CASCADE, to='server.memberuser')),
            ],
            options={
                'verbose_name': 'Scheduled Lesson',
                'db_table': 'scheduleLesson',
                'unique_together': {('userID', 'lessonID')},
            },
        ),
    ]