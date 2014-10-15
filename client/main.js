Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'flat'
}

Deps.autorun(function() {
    Notifications.find({seen: false, created_at: {$gt: new Date().getTime()}}).observe({
        added: function (notification) {
            var options = {
                message: notification.message,
                type: notification.type
            }

            if (notification.url != undefined) {
                options['url'] = url
            }

            Messenger().post(options);

            Notifications.update(notification._id, {$set: {'seen': true}});
        }
    });
});

notify = function(message, type) {
    return Messenger().post({
        message: message,
        type: type || 'info'
    });
}


Meteor.Spinner.options = {
    lines: 17, // The number of lines to draw
    length: 0, // The length of each line
    width: 4, // The line thickness
    radius: 60, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#54C5CC', // #rgb or #rrggbb or array of colors
    speed: 1.1, // Rounds per second
    trail: 100, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
};
