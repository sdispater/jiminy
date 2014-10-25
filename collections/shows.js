Shows = new Meteor.Collection('shows');


Meteor.methods({
    addShow: function(showData) {

    },
    updateShow: function(showId, showData) {
        console.log(showData);
        Shows.update(showId, {$set: showData});
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
