Router.configure({
    layoutTemplate: 'baseLayout',
    waitOn: function() {
        return [Meteor.subscribe('shows'), Meteor.subscribe('latestNotifications')];
    }
});

Router.map(function() {
    this.route('showsList', {
        path: '/'
    });

    this.route('showsSearch', {
        path: '/add-shows'
    });

    this.route('notificationsList', {
        path: '/notifications',
        waitOn: function() {
            return Meteor.subscribe('notifications');
        }
    });
});
