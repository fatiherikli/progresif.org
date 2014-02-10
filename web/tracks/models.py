from urlparse import parse_qs, urlparse

from django.db import models
from django.utils.encoding import smart_unicode
from django.utils.text import slugify


class Track(models.Model):
    """
    Holds track data
    """
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, blank=True)
    band = models.CharField(max_length=255)
    band_slug = models.SlugField(max_length=255, blank=True)
    album_name = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    is_approved = models.BooleanField(default=False)
    sender_name = models.CharField(max_length=255)
    sender_url = models.CharField(max_length=255)
    sender_avatar = models.CharField(max_length=255)

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

        www.youtube.com/watch?v=lIh_wW3iF5o
        """
        parsed = parse_qs(urlparse(self.url).query)
        return parsed.get('v')[0]

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
            "absolute_url": self.get_absolute_url()
        }
