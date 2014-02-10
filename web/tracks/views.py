import json

from django.http import Http404, HttpResponse
from django.views.generic import DetailView, RedirectView, View

from tracks.models import Track


class HomeView(RedirectView):

    def get_redirect_url(self, *args, **kwargs):
        tracks = Track.objects.order_by('?')
        try:
            track = tracks[0]
        except IndexError:
            raise Http404('Track not found.')
        return track.get_absolute_url()


class RandomTrackView(View):

    def get(self, request, *args, **kwargs):
        track = Track.objects.order_by('?')[0]
        data = json.dumps(track.serialize())
        return HttpResponse(data, content_type="application/json")

class TrackDetailView(DetailView):
    model = Track
    template_name = "index.html"
    context_object_name = "track"
