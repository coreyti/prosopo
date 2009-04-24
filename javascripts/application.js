$().ready(function() {
  Prosopo.chart($('div#genealogy'));
});

Prosopo = function(source) {
  this.source = source;
};

$.extend(Prosopo, {
  chart: function(selector) {
    var self = new this(selector);
        self.initialize();
  },

  Person: function(source) {
    this.initialize(source);
  }
});

$.extend(Prosopo.prototype, {
  initialize: function() {
    this.persons = {};
    this.render();
  },

  render: function() {
    var container = $('<div id="' + this.source.attr('id') + ':prosopo"></div>');
    this.output = $('<div class="prosopo:chart"></div>').appendTo(container);
    this.source.before(container);

    this.render_persons();
    this.render_positions();
    // this.render_relationships();
  },

  render_persons: function() {
    var self = this;

    $(this.source.find('ul[rel=person] > li')).each(function() {
      var person = new Prosopo.Person(this);
      self.output.append(person.to_html());

      self.persons[person.identity] = person;
    });
  },

  render_positions: function() {
    var self = this;

    $(this.source.find('ul[rel=relationship] > li.peer')).each(function() {
      var top;
      var peers = [];

      $.each($(this).find('dt:contains(Person)').next('dd'), function() {
        var person_id  = $(this).attr('rel');
        var person_box = self.persons[person_id];

        peers.push(person_box);

        var box_top = person_box.output.position().top;
        top = (top != undefined) ? (top > box_top ? box_top : top) : box_top;
      });

      $.each(peers, function(i) {
        var peer = this;

        var chart_center = self.source.width() / 2;
        // var peer_width  = peer.width();

        if(i % 2 == 0) {
          peer.output.css({ position: 'absolute', top: top, right: chart_center });
        }
        else {
          peer.output.css({ position: 'absolute', top: top, left: chart_center });
        }
      });
    });
  }
});

$.extend(Prosopo.Person.prototype, {
  initialize: function(source) {
    this.source   = $(source);
    this.identity = this.source.attr('id');
    this.output   = this.build();
  },

  build: function() {
    return $('<div id="prosopo:' + this.identity + '" class="prosopo:person">' + this.source.html() + '</div>');
  },

  to_html: function() {
    return this.output;
  },

  center: function() {
    var position = this.output.position();
    return { x: position.left + (this.output.width() / 2), y: position.top + (this.output.height() / 2) };
  }
});
