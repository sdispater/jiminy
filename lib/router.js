Router.configure({
    layoutTemplate: 'baseLayout',
    waitOn: function() {
        return [Meteor.subscribe('shows')];
    }
});

Router.map(function() {
    this.route('showsList', {
        path: '/:showsLimit?'
    });
});
