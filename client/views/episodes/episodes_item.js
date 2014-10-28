Template.episodesItem.helpers({
    download: function() {
        return Downloads.findOne(this.downloadId);
    },
    releases: function() {
        return Session.get('releases');
    },
    searchingReleases: function() {
        return Session.get('searchingReleases');
    }
});

Template.episodesItem.events({
    'shown.bs.tab a[data-toggle="tab"].releases': function(e) {
        Session.set('releases', null);
        Session.set('searchingReleases', true);
        var episodeId = $(e.target).closest('tr').data('episode');
        Meteor.call('searchReleases', episodeId, function(err, res) {
            Session.set('releases', res);
            Session.set('searchingReleases', false);
        });
    },
    'hidden.bs.modal .modal-episode': function(e) {
        var modal = $(e.target);
        modal.find('.nav-tabs li a').first().tab('show');
    },
    'click .x-display-releases': function(e) {
        var button = $(e.target);
        var id = button.closest('tr').data('episode');
        var modal = $('#modal-episode-' + id);

        // Display Releases tab
        modal.find('.nav-tabs a.releases').first().tab('show');
        modal.modal('show');
    },
    'click .x-download-release': function(e) {
        var button = $(e.target);
        var tr = button.closest('tr');
        var releaseId = tr.data('release');
        var indexerId = tr.data('indexer');
        var releaseName = tr.data('name');
        var episodeId = button.closest('.modal').data('episode');

        notify('Downloading release ' + releaseName, 'info');
        Meteor.call('downloadRelease', episodeId, releaseId, indexerId);
    }
});
