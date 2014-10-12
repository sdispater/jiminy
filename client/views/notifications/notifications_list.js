Template.notificationsList.helpers({
    notifications: function(){
        return Notifications.find({}, {sort: {created_at: -1}, limit: 5});
    }
});
