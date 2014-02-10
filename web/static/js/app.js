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
            $(this.bandSelector).html(response.band);
            $(this.trackTitleSelector).html(response.title);
            history.pushState(response, response.title, response.absolute_url);
            this.turnOnTimeout = setTimeout(this.turnOnLights.bind(this), 1000);
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

        render: function () {
            this.player = this.loadPlayer();
            $(this.nextButtonSelector).on('click', this.getNextVideo.bind(this));
            $(this.prevButtonSelector).on('click', this.getPreviousVideo.bind(this));
            $(this.pauseButtonSelector).on('click', this.pauseVideo.bind(this));
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