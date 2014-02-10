!function () {

    window.progresif = window.progresif || {};

    progresif.MusicPlayer = $.Class.extend({

        history: [],

        nextButtonSelector: ".next",
        prevButtonSelector: ".prev",
        pauseButtonSelector: ".pause",
        bandSelector: "h1",
        trackTitleSelector: "h2",
        maskSelector: ".mask",
        loadingSelector: ".loading",
        playerSelector: "#player",
        senderSelector: "#sender",
        twitterShareSelector: ".share .twitter",
        facebookShareSelector: ".share .facebook",
        sendButtonSelector: ".send",
        cancelButtonSelector: ".cancel",
        sendDialogSelector: "#send-dialog",
        sendFormSelector: '#send-dialog form',
        submitButtonSelector: '#send-dialog .send',

        twitterShareUrl: "http://twitter.com/home?status=",
        facebookShareUrl: "https://www.facebook.com/sharer.php?u=",

        init: function (options) {
            $.extend(this, options);
        },

        turnOnLights: function () {
            $(this.loadingSelector).hide();
            $(this.maskSelector).css("background-color", "transparent");
            $(this.playerSelector).animate({
                "height": "100%",
                "top": "0"
            });
        },

        turnOffLights: function () {
            $(this.maskSelector).css("background-color", "white");
            $(this.loadingSelector).show();
            $(this.playerSelector).css({
                "top": "50%",
                "height": "0"
            });
        },

        loadVideo: function (response) {
            if (this.turnOnTimeout) {
                clearTimeout(this.turnOnTimeout);
                this.turnOnTimeout = null;
            }
            this.turnOffLights();
            this.player.loadVideoById(response.youtube_id);
            this.player.playVideo();

            history.pushState(response, response.title, response.absolute_url);
            this.turnOnTimeout = setTimeout(this.turnOnLights.bind(this), 1000);

            $(this.bandSelector).html(response.band);
            $(this.trackTitleSelector).html(response.title);
            $(this.senderSelector)
                .attr("href", response.sender_url)
                .html("@" + response.sender_name);

            $(this.twitterShareSelector).attr("href", this.twitterShareUrl + this.getShareMessage(response));
            $(this.facebookShareSelector).attr("href", this.facebookShareUrl + response.full_url);
        },

        getShareMessage: function (response) {
            return [response.band, response.title, response.full_url].join(" ")
        },

        getNextVideo: function (event) {
            $.getJSON(this.randomTrackUrl, function (response) {
                this.loadVideo(response);
                this.history.push(response);
            }.bind(this));
            event.preventDefault();
        },

        getPreviousVideo: function (event) {
            if (this.history.length) {
                this.loadVideo(this.history.pop());
            }
            event.preventDefault();
        },

        pauseVideo: function (event) {
            $(this.pauseButtonSelector).toggleClass("paused");
            event.preventDefault();
            if (this.paused) {
                this.player.playVideo();
                this.paused = false;
            } else {
                this.player.pauseVideo();
                this.paused = true;
            }
        },

        showSendDialog: function (event) {
            event.preventDefault();
            $(this.sendDialogSelector).slideDown();
        },

        hideSendDialog: function (event, callback) {
            event.preventDefault();
            $(this.sendDialogSelector).slideUp((callback || function () {}));
        },

        showSuccessMessage: function () {
            $('.success').slideDown().delay(2000).slideUp();
        },

        submitForm: function (event) {
            var form = $(this.sendFormSelector),
                serialized = form.serialize();
            $.post(form.attr("action"), serialized, function () {
                this.hideSendDialog(event, this.showSuccessMessage);
            }.bind(this));
        },

        render: function () {
            this.player = this.loadPlayer();
            $(this.nextButtonSelector).on('click', this.getNextVideo.bind(this));
            $(this.prevButtonSelector).on('click', this.getPreviousVideo.bind(this));
            $(this.pauseButtonSelector).on('click', this.pauseVideo.bind(this));
            $(this.sendButtonSelector).on('click', this.showSendDialog.bind(this));
            $(this.cancelButtonSelector).on('click', this.hideSendDialog.bind(this));
            $(this.submitButtonSelector).on('click', this.submitForm.bind(this));
            this.turnOffLights();

            setTimeout(this.turnOnLights.bind(this), 3500);
        },

        onPlayerReady: function (event) {
            event.target.playVideo();
            event.target.mute();
        },

        loadPlayer: function () {
            return new YT.Player('player', {
              height: '100%',
              width: '100%',
              videoId: this.youtubeVideoId,
              events: {
                'onReady': this.onPlayerReady
              },
              playerVars: {
                  controls: 0,
                  autohide: 0,
                  showinfo: 0,
                  iv_load_policy: 3
              }
            });
        }
    });

}(window.jQuery);