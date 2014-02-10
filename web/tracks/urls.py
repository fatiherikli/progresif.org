from django.conf.urls import patterns, url

from tracks.views import HomeView, TrackDetailView, RandomTrackView


urlpatterns = patterns('',
    url(r'^$',
        HomeView.as_view(),
        name='home'),

    url(r'^random$',
        RandomTrackView.as_view(),
        name='random_track'),

    url(r'^(?P<band>[\w\d-]+)/(?P<slug>[\w\d-]+)',
        TrackDetailView.as_view(),
        name='track_detail'),
)
