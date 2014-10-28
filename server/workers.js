var addShowWorker = Job.processJobs('queue', 'addShow', function(job, cb) {
        var data = job.data;

        try {
            addShow(data);

            job.done(function(err) {
                if (err) {
                    throw err;
                }

                Meteor.call('notify', 'Finished processing show ' + show.title, 'success');
                Meteor.call('log', 'Shows', 'info', 'Finished processing show ' + show.title);
            });
        } catch (err) {
            console.log(err);
            job.fail(err.message)

            return Meteor.call(
                'log',
                'Shows',
                'error',
                'An error occurred while adding show ' + data.title + ' (' + err.message + ')'
            );
        } finally {
            cb();
        }
    }
);

var updateShowWorker = Job.processJobs('queue', 'updateShow', function(job, cb) {
        var data = job.data;
        var show = Shows.findOne(data.show_id)

        try {
            updateShow(show);

            job.done(function(err) {
                if (err) {
                    throw err;
                }

                return Meteor.call('log', 'Shows', 'info', 'Finished updating show ' + show.name);
            });
        } catch (err) {
            console.log(err);
            job.fail(err.message)

            return Meteor.call(
                'log',
                'Shows',
                'error',
                'An error occurred while updating show ' + show.name
            );
        } finally {
            cb();
        }
    }
);

var refreshShowsWorker = Job.processJobs('queue', 'refreshShows', function(job, cb) {
    try {
        refreshShows();

        job.done(function(err) {
            if (err) {
                throw err;
            }
        });
    } catch (err) {
        console.log(err);
        job.fail(err.message)

        return Meteor.call(
            'log',
            'Shows',
            'error',
            'An error occurred while refreshing shows'
        );
    } finally {
        cb();
    }
});

var automaticSearchEpisodeWorker = Job.processJobs('queue', 'automaticSearchEpisode', function(job, cb) {
    try {
        automaticSearchEpisode(job.data.episodeId);

        job.done(function(err) {
            if (err) {
                throw err;
            }
        });
    } catch (err) {
        console.log('automaticSearchEpisode Failed'.red);
        console.log(err.message.red);
        job.fail(err.message)

        return Meteor.call(
            'log',
            'Episode Search',
            'error',
            err.message
        );
    } finally {
        cb();
    }
});

var searchWantedEpisodesDownloadsWorker = Job.processJobs('queue', 'searchWantedEpisodesDownloads', function(job, cb) {
    try {
        searchWantedEpisodesDownloads(job.data);

        job.done(function(err) {
            if (err) {
                throw err;
            }
        });
    } catch (err) {
        job.fail(err.message)

        return Meteor.call(
            'log',
            'Episode Search',
            'error',
            err.message
        );
    } finally {
        cb();
    }
});

var downloadCandidateWorker = Job.processJobs('queue', 'downloadCandidate', function(job, cb) {
    try {
        downloadCandidate(job.data.candidate, job.data.episodeId);

        job.done(function(err) {
            if (err) {
                throw err;
            }
        });
    } catch (err) {
        console.log('downloadCandidate failed'.red);
        console.log(err.message.red);
        job.fail(err.message)

        return Meteor.call(
            'log',
            'Episode Download',
            'error',
            err.message
        );
    } finally {
        cb();
    }
});
