SyncedCron.add({
    name: 'Refresh shows',
    schedule: function(parser) {
        return parser.text('every 1 minutes');
    },
    job: function() {
        refreshShows();

        return 'Shows Refreshed';
    }
});
