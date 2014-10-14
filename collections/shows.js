Shows = new Meteor.Collection('shows');


Meteor.methods({
    addShow: function(showData) {

    }
})

Shows.allow({
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
})
