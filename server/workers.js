var addShowWorker = Job.processJobs('queue', 'addShow', function(job, cb) {
        var data = job.data;

        try {
            addShow(data);
        } catch (err) {
            console.log(err);
            job.fail(err.message)

            return Meteor.call(
                'notify',
                '[Show Add] An error occurred while adding show ' + data.title,
                'error'
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
        } catch (err) {
            console.log(err);
            job.fail(err.message)

            return Meteor.call(
                'notify',
                '[Show Add] An error occurred while updating show ' + show.name,
                'error'
            );
        } finally {
            cb();
        }
    }
);

var refreshShowsWorker = Job.processJobs('queue', 'refreshShows', function(job, cb) {
    try {
        refreshShows();
    } catch (err) {
        console.log(err);
        job.fail(err.message)

        return Meteor.call(
            'notify',
            '[Shows Refresh] An error occurred while refreshing shows',
            'error'
        );
    } finally {
        cb();
    }
});
