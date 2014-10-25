Router.configure({
    layoutTemplate: 'baseLayout',
    loadingTemplate: 'loading',
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
                Meteor.subscribe('episodes'),
                Meteor.subscribe('profiles')
            ]
        }
    });

    this.route('showsPage', {
        path: '/shows/:_id',
        data: function() { return Shows.findOne(this.params._id); },
        waitOn: function () {
            return [
                Meteor.subscribe('singleShow', this.params._id),
                Meteor.subscribe('showSeasons', this.params._id),
                Meteor.subscribe('showEpisodes', this.params._id),
                Meteor.subscribe('profiles')
            ];
        }
    });

    this.route('showsSearch', {
        path: '/add-shows',
        waitOn: function() {
            return [
                Meteor.subscribe('shows'),
                Meteor.subscribe('profiles'),
                Meteor.subscribe('paths')
            ]
        }
    });

    this.route('settingsPage', {
        path: '/settings',
        waitOn: function () {
            return [
                Meteor.subscribe('profiles'),
                Meteor.subscribe('indexers'),
                Meteor.subscribe('downloaders')
            ];
        }
    });

    this.route('notificationsList', {
        path: '/notifications',
        waitOn: function() {
            return Meteor.subscribe('notifications');
        }
    });

    this.route('logsList', {
        path: '/logs',
        waitOn: function() {
            return Meteor.subscribe('logs');
        },
        data: function() {
            return {
                logs: Logs.find({}, {sort: {created_at: -1}})
            }
        }
    });
});
