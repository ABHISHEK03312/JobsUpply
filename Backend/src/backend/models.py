from __future__ import unicode_literals

from django.db import models
from django.core.mail import send_mail
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.translation import ugettext_lazy as _
from .managers import UserManager

# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
    """
    A class implementing a fully featured User model with admin-compliant
    permissions.

    Email and password are required. Other fields are optional.
    """

    email = models.EmailField(
        _('Email Address'), unique=True,
        error_messages={
            'unique': _("A user with that email already exists."),
        }
    )
    is_staff = models.BooleanField(
        _('Staff Status'), default=False,
        help_text=_('Designates whether the user can log into this admin '
                    'site.')
    )
    is_active = models.BooleanField(
        _('Active'), default=True,
        help_text=_('Designates whether this user should be treated as '
                    'active. Unselect this instead of deleting accounts.')
    )
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)

    objects = UserManager()

    name = models.CharField(max_length=30, blank=False, default='')
    university = models.CharField(max_length=100, blank=False, default='')
    major = models.CharField(max_length=100, blank=False, default='')
    minor = models.CharField(max_length=100, blank=False, default='')
    skills = models.JSONField(default=list, null=True, blank=True)

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'university', 'major']

    class Meta(object):
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        abstract = False

    def get_full_name(self):
        """
        Returns email instead of the fullname for the user.
        """
        return self.email

    def get_short_name(self):
        """
        Returns the short name for the user.
        This function works the same as `get_full_name` method.
        It's just included for django built-in user comparability.
        """
        return self.get_full_name()

    def __str__(self):
        return self.email

    def email_user(self, otp, **kwargs):
        subject="Password Reset"
        message="Your OTP for Resetting Password is {otp}" 
        from_email="JobsUpply Admin"
        send_mail(subject, message.format(otp=otp), from_email, [self.email], **kwargs)


class Skill(models.Model):
    name = models.CharField(max_length=100, blank=False, default='', unique=True)

    def __str__(self) -> str:
        return self.name

class JobQuery(models.Model):
    queryText = models.CharField(max_length=100, unique=True)
    jobList = models.JSONField(default=dict, null=True, blank=True)

    def __str__(self) -> str:
        return self.queryText


class Courses(models.Model):
    course = models.CharField(max_length=100, blank=False, default='')  # name
    url = models.CharField(max_length=100, unique=True)  # coursera url
    about = models.TextField(blank=False, default='')
    instructor = models.JSONField(default=dict, null=True, blank=True)  # list of instructors
    university = models.CharField(max_length=100, blank=False, default='')
    content = models.JSONField(default=dict, null=True, blank=True)  # brief list of contents covered
    rating = models.CharField(max_length=20, blank=False, default='')  # out of 5
    numratings = models.CharField(max_length=100, blank=False, default='')
    numenrolled = models.CharField(max_length=100, blank=False, default='')
    skills = models.JSONField(default=dict, null=True, blank=True)  # list of skills taught
