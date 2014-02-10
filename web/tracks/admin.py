from django.contrib import admin
from django.contrib.admin import ModelAdmin

from tracks.models import Track


class TrackAdmin(ModelAdmin):
    pass


admin.site.register(Track, TrackAdmin)
