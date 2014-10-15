Router.configure({
    layoutTemplate: 'baseLayout',
    waitOn: function() {
        return [
            Meteor.subscribe('latestNotifications'),
            Meteor.subscribe('images')
        ];
    }
});

Router.map(function() {
    this.route('showsList', {
        path: '/',
        waitOn: function() {
            return [
                Meteor.subscribe('shows'),
                Meteor.subscribe('seasons'),
                Meteor.subscribe('episodes')
            ]
        }
    });

    this.route('showsSearch', {
        path: '/add-shows',
        waitOn: function() {
            return [
                Meteor.subscribe('shows'),
                Meteor.subscribe('profiles')
            ]
        }
    });

    this.route('notificationsList', {
        path: '/notifications',
        waitOn: function() {
            return Meteor.subscribe('notifications');
        }
    });
});
