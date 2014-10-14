Template.showsSearch.events({
   'keyup input#shows-search-field': function(e) {
       delay(function() {
           Session.set('showsLoading', true);
           Meteor.call('findTvShowMethod', e.target.value, true, function(e, r) {
               Session.set('showsLoading', false);
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
    showsLoading: function () {
        return Session.equals("showsLoading", true)
    }
})
