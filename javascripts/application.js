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
    this.peers   = [];
    this.render();
  },

  render: function() {
    var container = $('<div id="' + this.source.attr('id') + ':prosopo"></div>');
    this.output = $('<div class="prosopo:chart"></div>').appendTo(container);
    this.source.before(container);

    this.render_persons();
    this.render_positions();
    this.render_relationships();
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

    var peer_left  = $('<div class="left"></div>');
    var peer_right = $('<div class="right"></div>');

    $(this.source.find('ul[rel=relationship] > li.peer')).each(function() {
      var top;
      var peer_set = [];

      $.each($(this).find('dt:contains(Person)').next('dd'), function() {
        var person_id  = $(this).attr('rel');
        var person_box = self.persons[person_id];

        peer_set.push(person_box);

        var box_top = person_box.output.position().top;
        top = (top != undefined) ? (top > box_top ? box_top : top) : box_top;
      });

      $.each(peer_set, function(i) {
        var peer = this;

        var chart_center = self.source.width() / 2;
        // var peer_width  = peer.width();

        var content = peer.output.remove();

        if(i % 2 == 0) {
          peer_left.append(content);
        }
        else {
          peer_right.append(content);
        }
      });

      self.peers.push(peer_set);
    });

    self.output.append(peer_left);
    self.output.append(peer_right);
  },

  render_relationships: function() {
    var self = this;

    $.each(this.peers, function() {
      var left;
      var right;
      var y;

      $.each(this, function() {
        var center = this.center();

        if(y == undefined) {
          y = center.y;
        }

        left  = (left  == undefined) ? center.x : (left  < center.x ? left  : center.x);
        right = (right == undefined) ? center.x : (right > center.x ? right : center.x);
      });

      var relationship = $('<div class="relationship" />');
          relationship.css({ position: 'absolute', top: (y - 10), left: (left - 5), height: 1, width: (right - left), background: '#999' });

      $('body').append(relationship);
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
