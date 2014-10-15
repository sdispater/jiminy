Template.showsSearchItem.helpers({
    seasonsCount: function() {
        if (!this.seasons || this.seasons.length == 0) {
            return 0;
        }

        return this.seasons.length;
    },
    seasons: function() {
        return this.seasons.sort(function (a, b) {
            if (a.season > b.season) {
                return -1
            }

            if (a.season < b.season) {
                return 1
            }

            return 0;
        });
    }
})

Template.showsSearchItem.events({
    'click .x-add-show': function (e) {
        var tvdbId = parseInt($(e.target).data('tvdb-id'));
        var title = $(e.target).data('title');

        if (Shows.find({'tvdb_id': tvdbId}).count() > 0) {
            return notify('This show already exists in your collection', 'error');
        }

        Meteor.call('createJob', 'addShow', {tvdb_id: tvdbId, title: title}, function(err) {
           Meteor.call('notify', 'Show <strong>' + title + '</strong> added', 'success');
        });
    }
});
