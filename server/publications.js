Meteor.publish('shows', function() {
    return Shows.find()
})
