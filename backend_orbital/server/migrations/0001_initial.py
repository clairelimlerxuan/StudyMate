<<<<<<< HEAD
# Generated by Django 3.2.3 on 2021-07-11 14:02
=======
# Generated by Django 3.2.3 on 2021-07-13 03:22
>>>>>>> 7c7503ca69d883ab0e6d12f07e5126bdbd986a2b

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdminUser',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='auth.user')),
                ('adminUserPassword', models.CharField(max_length=30)),
            ],
            options={
                'verbose_name': 'Admin User',
                'verbose_name_plural': 'Admin Users',
                'db_table': 'adminUser',
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('categoryID', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('categoryName', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name': 'Category',
                'verbose_name_plural': 'Categories',
                'db_table': 'category',
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('commentID', models.AutoField(primary_key=True, serialize=False)),
                ('textContent', models.TextField()),
                ('creationDate', models.DateTimeField(auto_now_add=True)),
                ('replyCount', models.IntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Comment',
                'db_table': 'comment',
            },
        ),
        migrations.CreateModel(
            name='Faculty',
            fields=[
                ('facultyID', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('facultyName', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name': 'Faculty',
                'verbose_name_plural': 'Faculties',
                'db_table': 'faculty',
            },
        ),
        migrations.CreateModel(
            name='Major',
            fields=[
                ('majorID', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('majorName', models.CharField(max_length=100)),
                ('facultyID', models.ForeignKey(db_column='facultyID', on_delete=django.db.models.deletion.RESTRICT, to='server.faculty')),
            ],
            options={
                'verbose_name': 'Major',
                'db_table': 'major',
            },
        ),
        migrations.CreateModel(
            name='MemberUser',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='auth.user')),
                ('userPassword', models.CharField(max_length=100)),
                ('userNUSEmail', models.EmailField(max_length=254)),
                ('username', models.CharField(max_length=100)),
                ('yearOfStudy', models.CharField(blank=True, choices=[('1', 'Year 1'), ('2', 'Year 2'), ('3', 'Year 3'), ('4', 'Year 4')], max_length=6)),
                ('creationDate', models.DateTimeField(auto_now_add=True)),
                ('facultyID', models.ForeignKey(db_column='facultyID', null=True, on_delete=django.db.models.deletion.RESTRICT, to='server.faculty')),
                ('majorID', models.ForeignKey(db_column='majorID', null=True, on_delete=django.db.models.deletion.RESTRICT, to='server.major')),
            ],
            options={
                'verbose_name': 'Member User',
                'verbose_name_plural': 'Member Users',
                'db_table': 'memberUser',
            },
        ),
        migrations.CreateModel(
            name='Module',
            fields=[
                ('moduleCode', models.CharField(max_length=15, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=100)),
            ],
            options={
                'verbose_name': 'Module',
                'db_table': 'module',
            },
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('postID', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=50)),
                ('textContent', models.TextField()),
                ('creationDate', models.DateTimeField(auto_now_add=True)),
                ('upvote', models.IntegerField(default=0)),
                ('downvote', models.IntegerField(default=0)),
                ('numOfComments', models.IntegerField(default=0)),
                ('categoryID', models.ForeignKey(db_column='categoryID', on_delete=django.db.models.deletion.RESTRICT, to='server.category')),
                ('moduleID', models.ForeignKey(blank=True, db_column='moduleID', null=True, on_delete=django.db.models.deletion.RESTRICT, to='server.module')),
            ],
            options={
                'verbose_name': 'Post',
                'db_table': 'post',
            },
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('taskID', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=50)),
               
                ('completed', models.BooleanField()),
                ('submitted', models.BooleanField()),
                ('creationDate', models.DateTimeField(auto_now_add=True)),
                ('userID', models.ForeignKey(db_column='userID', on_delete=django.db.models.deletion.CASCADE, to='server.memberuser')),
            ],
            options={
                'verbose_name': 'Task',
                'db_table': 'task',
            },
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('tagID', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('tagName', models.CharField(max_length=50)),
                ('categoryID', models.ForeignKey(db_column='categoryID', on_delete=django.db.models.deletion.RESTRICT, to='server.category')),
            ],
            options={
                'verbose_name': 'Tag',
                'db_table': 'tag',
            },
        ),
        migrations.CreateModel(
            name='Reply',
            fields=[
                ('replyID', models.AutoField(primary_key=True, serialize=False)),
                ('textContent', models.TextField()),
                ('creationDate', models.DateTimeField(auto_now_add=True)),
                ('commentID', models.ForeignKey(db_column='commentID', on_delete=django.db.models.deletion.CASCADE, to='server.comment')),
                ('postID', models.ForeignKey(db_column='postID', on_delete=django.db.models.deletion.CASCADE, to='server.post')),
                ('userID', models.ForeignKey(blank=True, db_column='userID', null=True, on_delete=django.db.models.deletion.SET_NULL, to='server.memberuser')),
            ],
            options={
                'verbose_name': 'Reply',
                'verbose_name_plural': 'Replies',
                'db_table': 'reply',
            },
        ),
        migrations.AddField(
            model_name='post',
            name='tagID',
            field=models.ForeignKey(db_column='tagID', on_delete=django.db.models.deletion.RESTRICT, to='server.tag'),
        ),
        migrations.AddField(
            model_name='post',
            name='userID',
            field=models.ForeignKey(blank=True, db_column='userID', null=True, on_delete=django.db.models.deletion.SET_NULL, to='server.memberuser'),
        ),
        migrations.AddField(
            model_name='module',
            name='tagID',
            field=models.ForeignKey(db_column='tagID', null=True, on_delete=django.db.models.deletion.RESTRICT, to='server.tag'),
        ),

        migrations.CreateModel(
            name='Event',
            fields=[
                ('eventID', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=100)),
                ('creationDate', models.DateTimeField(auto_now_add=True)),
                ('userID', models.ForeignKey(db_column='userID', on_delete=django.db.models.deletion.CASCADE, to='server.memberuser')),
            ],
            options={
                'verbose_name': 'Event',
                'db_table': 'event',
            },
        ),
        migrations.AddField(
            model_name='comment',
            name='postID',
            field=models.ForeignKey(db_column='postID', on_delete=django.db.models.deletion.CASCADE, to='server.post'),
        ),
        migrations.AddField(
            model_name='comment',
            name='userID',
            field=models.ForeignKey(blank=True, db_column='userID', null=True, on_delete=django.db.models.deletion.SET_NULL, to='server.memberuser'),
        ),
        migrations.CreateModel(
            name='Vote',
            fields=[
                ('voteID', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(choices=[('Upvote', 'Upvote'), ('Downvote', 'Downvote'), ('None', 'None')], default='None', max_length=20)),
                ('postID', models.ForeignKey(db_column='postID', on_delete=django.db.models.deletion.CASCADE, to='server.post')),
                ('userID', models.ForeignKey(db_column='userID', on_delete=django.db.models.deletion.CASCADE, to='server.memberuser')),
            ],
            options={
                'verbose_name': 'Vote',
                'db_table': 'vote',
                'unique_together': {('userID', 'postID')},
            },
        ),
    ]
