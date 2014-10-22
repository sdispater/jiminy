var wrappedFindTvShow = Meteor.wrapAsync(Meteor.Trakt().findTvShow, Meteor.Trakt());


findTvShow = function(name, seasons) {
    return wrappedFindTvShow(name, seasons);
}

Meteor.methods({
    findTvShowMethod: function(name, seasons) {
        try {
            var result = findTvShow(name, seasons);

            return result;
        } catch (e) {
            Meteor.call('notify', 'trakt.tv API Error (' + e.message + ')', 'error');
        }
    }
});

Meteor.startup(function() {
    Meteor.call('log', 'Server', 'info', 'Server started');
    Jobs.startJobs();
    Meteor.call('log', 'Server', 'info', 'Jobs started');
    SyncedCron.start();
    Meteor.call('log', 'Server', 'info', 'Scheduler started');
});
