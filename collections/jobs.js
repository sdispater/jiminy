Jobs = JobCollection();


Meteor.methods({
    createJob: function(name, data) {
        var job = Jobs.createJob(name, data);

        job.priority('normal').save();
    }
})


