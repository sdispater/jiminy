Template.notificationsMenu.helpers({
    unseenNotifications: function() {
        return Notifications.find({seen: false});
    },
    unseenNotificationsCount: function(){
        return Notifications.find({seen: false}).count();
    },
    notifications: function(){
        return Notifications.find({}, {sort: {created_at: -1}, limit: 5});
    }
});


Template.notificationsMenu.rendered = function(){
   $('#popover-notifications').popover({
       html: true,
       title: function() {
           return $("#popover-notifications-head").html();
       },
       content: function() {
           return $("#popover-notifications-content").html();
       }
   })
}
