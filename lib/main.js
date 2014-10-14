Meteor.startup(function () {
    Meteor.Trakt();

    FS.HTTP.setBaseUrl('/')
});
