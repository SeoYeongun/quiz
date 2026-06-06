from django.db import migrations, models


def blank_email_to_null(apps, schema_editor):
    User = apps.get_model('users', 'User')
    User.objects.filter(email='').update(email=None)


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(
                blank=True,
                max_length=254,
                null=True,
                unique=True,
                verbose_name='이메일',
            ),
        ),
        migrations.RunPython(blank_email_to_null, migrations.RunPython.noop),
    ]
