Template.showsSearch.events({
   'keyup input#shows-search-field': function(e) {
       delay(function() {
           Session.set('showsLoaded', false);
           Meteor.call('findTvShowMethod', e.target.value, true, function(e, r) {
               Session.set('showsLoaded', true);
               Session.set('shows-search-results', r);
           });
       }, 1000);
   }
});

Template.showsSearch.helpers({
    shows: function () {
        var result = Session.get('shows-search-results');
        if (result == undefined) {
            return [];
        }
        return result;
    },
    showsLoaded: function () {
        return Session.equals("showsLoaded", true)
    }
})
