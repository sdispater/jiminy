Template.seasonsItem.helpers({
    episodes: function() {
        return Episodes.find({season_id: this._id}, {sort: {number: -1}});
    }
});

Template.seasonsItem.rendered = function(){
    $('.tip').tooltip();
}

Template.seasonsItem.events({
    'click .x-search-episode': function(e) {
        var button = $(e.target);
        var episodeId = button.closest('tr').data('episode');

        Meteor.call('searchEpisode', episodeId, function(err, res) {
            if (err) {
                return notify(err.message, 'error');
            }
        });
    }
});
