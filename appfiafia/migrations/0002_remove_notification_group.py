# Generated by Django 2.1.3 on 2018-12-12 16:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('appfiafia', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='group',
        ),
    ]