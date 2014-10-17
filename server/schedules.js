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
