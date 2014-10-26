SyncedCron.add({
    name: 'Refresh shows',
    schedule: function(parser) {
        return parser.text('every 1 hours');
    },
    job: function() {
        refreshShows();

        return 'Shows Refreshed';
    }
});

SyncedCron.add({
    name: 'Set Episodes Statuses',
    schedule: function(parser) {
        return parser.text('every 1 hours');
    },
    job: function() {
        setEpisodesStatuses();

        return 'Episodes Statuses Set';
    }
});

SyncedCron.add({
    name: 'Search Wanted Episodes Downloads',
    schedule: function(parser) {
        return parser.text('every 1 hours');
    },
    job: function() {
        setEpisodesStatuses();

        return 'Search Wanted Episodes Done';
    }
});

SyncedCron.add({
    name: 'Update Downloads',
    schedule: function(parser) {
        return parser.text('every 10 seconds');
    },
    job: function() {
        updateDownloads();

        return 'Download Updated';
    }
});
