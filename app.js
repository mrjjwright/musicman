var SPOTIFY_API_PREFIX = "https://api.spotify.com/v1";

var h = React.createElement;

var model = mobx.observable({
  foundArtists: [],
  isShowingDetail: false,
  selectedArtist: null,
  selectedArtistTracks: [],
  get viewState() {
    return this.isShowingDetail ? " detail" : " grid";
  },
  get currentView() {
    return this.isShowingDetail ? ArtistDetail : Grid;
  },
  get currentProps() {
    return this.isShowingDetail ? { artist: this.selectedArtist } : null;
  },
  searchArtists: debounce(function(searchTerm) {
    this.isShowingDetail = false;
    var self = this;
    // var local = true;
    var local = false;
    var fetchURL = local
      ? "/sample-data.json"
      : `${SPOTIFY_API_PREFIX}/search?q=${searchTerm}&type=artist`;
    fetch(fetchURL)
      .then(function(r) {
        return r.json();
      })
      .then(function(res) {
        if (res.artists) {
          self.foundArtists = res.artists.items;
        } else self.foundArtists = [];
      });
  }, 500),
  getTracks: function() {
    // Gets the tracks for the currently selected user in Australia
    var artistId = this.selectedArtist.id;
    var self = this;
    fetch(`${SPOTIFY_API_PREFIX}/artists/${artistId}/top-tracks?country=AU`)
      .then(function(r) {
        return r.json();
      })
      .then(function(res) {
        self.selectedArtistTracks = res.tracks;
      });
  },
  toggleDetail: mobx.action(function(artist) {
    this.selectedArtistTracks = [];
    this.isShowingDetail = !this.isShowingDetail;
    this.selectedArtist = artist;
    if (this.isShowingDetail) this.getTracks();
  })
});

var Track = mobxReact.observer(
  React.createClass({
    render: function() {
      var track = this.props.track;
      return h("a", { href: track.preview_url, target: "top" }, track.name);
    }
  })
);

var Artist = mobxReact.observer(
  React.createClass({
    render: function() {
      var artist = this.props.artist;
      var imageURL = artist.images && artist.images.length > 0
        ? artist.images[0].url
        : "http://d30j0ipo6imng1.cloudfront.net/static/images/features/listen/album-placeholder.f97c23852f00.png";
      return h(
        "div",
        {
          className: "artist",
          onClick: function(e) {
            model.toggleDetail(artist);
          }
        },
        [
          h("img", { src: imageURL }, null),
          h("div", { className: "name" }, artist.name)
        ]
      );
    }
  })
);

var ArtistDetail = mobxReact.observer(
  React.createClass({
    render: function() {
      var artist = this.props.artist;
      var className = "artist-detail";
      if (model.viewState) className += model.viewState;

      return h(
        "div",
        {
          className: className
        },
        [
          h(
            "div",
            {
              className: "back-arrow",
              onClick: function(e) {
                model.toggleDetail(artist);
              }
            },
            model.isShowingDetail ? "⬅" : ""
          ),
          h(Artist, this.props),
          model.isShowingDetail
            ? h(
                "div",
                { className: "tracks" },
                model.selectedArtistTracks.map(function(track) {
                  return h(Track, { track: track });
                })
              )
            : h("div")
        ]
      );
    }
  })
);

var Grid = mobxReact.observer(
  React.createClass({
    render: function() {
      return h(
        "div",
        { className: "grid" },
        model.foundArtists.length == 0
          ? h("div", null, "0 found artists")
          : model.foundArtists.map(function(artist) {
              return h(ArtistDetail, { artist: artist });
            })
      );
    }
  })
);

var App = mobxReact.observer(
  React.createClass({
    render: function() {
      return h("div", null, [
        h(
          "div",
          { className: "header" },
          h("input", {
            type: "text",
            placeholder: "Search Artists",
            onChange: function(e) {
              model.searchArtists(e.currentTarget.value);
            }
          })
        ),
        h(model.currentView, model.currentProps)
      ]);
    }
  })
);

model.searchArtists("2Pac");

ReactDOM.render(h(App), document.getElementById("app"));
