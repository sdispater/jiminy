Template.notificationsMenu.helpers({
    unseenNotifications: function() {
        return Notifications.find({seen: false});
    },
    unseenNotificationsCount: function(){
        return Notifications.find({seen: false}).count();
    }
});
