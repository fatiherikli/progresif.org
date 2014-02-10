from django import forms
from tracks.models import Track


class SendTrackForm(forms.ModelForm):
    class Meta:
        model = Track
        fields = ('title', 'band', 'url', 'sender_name')