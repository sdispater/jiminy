Template.settingsProfilesItem.helpers({
    ownQualities: function() {
        return this.qualities.map(function(quality){
            return Quality.findById(quality);
        }).sort(function (a, b) {
            if (a.id < b.id) {
                return 1;
            }
            if (a.id > b.id) {
                return -1;
            }

            return 0;
        });
    },
    ownCutoff: function() {
        return Quality.findById(this.cutoff);
    },
    availableQualities: function() {
        var self = this;
        try {
            return Quality.all().sort(function (a, b) {
                if (a.id < b.id) {
                    return 1;
                }
                if (a.id > b.id) {
                    return -1;
                }

                return 0;
            }).map(function (quality) {
                return _.extend(quality, {
                    profileId: self._id,
                    hasQuality: self.qualities.indexOf(quality.id) >= 0
                });
            });
        } catch (err) {
            console.log(err);
        }
    }
});

Template.settingsProfilesItem.events({
    'change ul.qualities input.quality' : function(e) {
        var checkbox = $(e.target);
        var checked = checkbox.prop('checked');
        var profileId = checkbox.closest('form').data('profile');
        var quality = parseInt(checkbox.data('quality'));

        if (checked) {
            Profiles.update(profileId, {$addToSet: {qualities: quality}});
            notify('Quality ' + Quality.findById(quality).name + ' added')
        } else {
            Profiles.update(profileId, {$pull: {qualities: quality}});
            notify('Quality ' + Quality.findById(quality).name + ' removed')
        }
    },
    'change select.cutoff' : function(e) {
        var select = $(e.target);
        var cutoff = parseInt(select.val());
        var profileId = select.closest('form').data('profile');

        Profiles.update(profileId, {$set: {cutoff: cutoff}});
        notify('Cutoff changed to ' + Quality.findById(cutoff).name);
    },
    'click .x-change-name' : function(e) {
        e.preventDefault();

        var target = $(e.target);
        var name = target.closest('.input-group').children('input').first().val();
        var profileId = target.closest('form').data('profile');

        Profiles.update(profileId, {$set: {name: name}});
        notify('Name changed to ' + name);
    }
});
