Profiles = new Meteor.Collection('profiles');

Profiles.allow({
    update: function() {
        return true;
    }
})
