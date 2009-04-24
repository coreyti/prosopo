$().ready(function() {
  Prosopo.initialize($('div#genealogy'));
});

Prosopo = function(source) {
  this.source = source;
};

$.extend(Prosopo, {
  initialize: function(selector) {
    var self = new this(selector);
        self.render();
  }
});

$.extend(Prosopo.prototype, {
  render: function() {
    var container = $('<div id="' + this.source.attr('id') + ':prosopo"></div>');
    this.output = $('<div class="prosopo:graph"></div>').appendTo(container);
    this.source.before(container);

    this.render_persons();
    this.render_relationships();
  },

  render_persons: function() {
    var self = this;

    $(this.source.find('ul[rel=person] > li')).each(function() {
      var person = $(this);
      self.output.append('<div id="prosopo:' + person.attr('id') + '" class="prosopo:person">' + person.html() + '</div>');
    });
  },

  render_relationships: function() {
    var self = this;

    $(this.source.find('ul[rel=relationship] > li.peer')).each(function() {
      var top;
      var peers = [];

      $.each($(this).find('dt:contains(Person)').next('dd'), function() {
        var person_id  = $(this).attr('rel');
        var person_box = self.output.find('div[id=prosopo:' + person_id + ']');

        peers.push(person_box);

        var box_top = person_box.position().top;
        top = (top != undefined) ? (top > box_top ? box_top : top) : box_top;
      });
      
      $.each(peers, function(i) {
        var peer = $(this);

        var graph_center = self.source.width() / 2;
        var peer_width  = peer.width();

        if(i % 2 == 0) {
          peer.css({ position: 'absolute', top: top, right: graph_center });
        }
        else {
          peer.css({ position: 'absolute', top: top, left: graph_center });
        }
      });
    });
  }
});
