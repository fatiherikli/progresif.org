# coding=utf-8
from urlparse import parse_qs, urlparse
from django.conf import settings

from django.db import models
from django.utils.encoding import smart_unicode
from django.utils.text import slugify


class TrackManager(models.Manager):

    def approved(self):
        return self.filter(is_approved=True)

    def random(self):
        return self.approved().order_by('?')


class Track(models.Model):
    """
    Holds track data
    """
    title = models.CharField(max_length=255, verbose_name=u"Başlık")
    slug = models.SlugField(max_length=255, blank=True)
    band = models.CharField(max_length=255, verbose_name=u"Grup")
    band_slug = models.SlugField(max_length=255, blank=True)
    album_name = models.CharField(max_length=255, verbose_name="Albüm",
                                  blank=True, null=True)
    url = models.CharField(max_length=255, verbose_name="Youtube url")
    is_approved = models.BooleanField(default=False)
    sender_name = models.CharField(max_length=255, null=True, blank=True,
                                   verbose_name="Twitter kullanıcı adınız")
    sender_url = models.CharField(max_length=255, null=True, blank=True)
    sender_avatar = models.CharField(max_length=255, null=True, blank=True)

    objects = TrackManager()

    def __unicode__(self):
        return smart_unicode(self.title)

    @models.permalink
    def get_absolute_url(self):
        return 'track_detail', [self.band_slug, self.slug]

    def save(self, *args, **kwargs):
        """
        Override save method to slugify title ana band
        """
        if not self.slug:
            self.slug = slugify(self.title)

        if not self.band_slug:
            self.band_slug = slugify(self.band)

        super(Track, self).save(*args, **kwargs)

    def get_youtube_id(self):
        """
        Extracts youtube id from url
        """
        parsed = parse_qs(urlparse(self.url).query)
        return parsed.get('v')[0]

    def get_full_url(self):
        return "%(base)s%(path)s" % {
            'base': settings.SITE_URL,
            'path': self.get_absolute_url()
        }

    def serialize(self):
        return {
            "title": self.title,
            "slug": self.slug,
            "band": self.band,
            "band_slug": self.band_slug,
            "album_name": self.album_name,
            "sender_name": self.sender_name,
            "sender_url": self.sender_url,
            "sender_avatar": self.sender_avatar,
            "video_url": self.url,
            "youtube_id": self.get_youtube_id(),
            "absolute_url": self.get_absolute_url(),
            "full_url": self.get_full_url()
        }
