Template.popoverNotificationsItem.helpers({
    icon: function () {
        switch (this.type) {
            case 'info':
                return 'fa-info'
            case 'success':
                return 'fa-check'
            case 'error':
                return 'fa-exclamation'
        }
    },
    time: function () {
        return moment(this.created_at).fromNow();
    }
})
