Template.showsList.helpers({
    shows: function() {
        return Shows.find({}, {sort: {name: 1}});
    }
})
