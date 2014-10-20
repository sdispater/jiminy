Template.settingsProfilesItem.helpers({
    ownQualities: function() {
        var qualities = []
        for (var i in this.qualities) {
            var qualityIndex = this.qualities[i];
            qualities.push({
                index: qualityIndex,
                name: Qualities[qualityIndex],
                cutoff: this.cutoff
            });
        }

        return qualities;
    },
    ownCutoff: function() {
        return Qualities[this.cutoff];
    },
    availableQualities: function() {
        var qualities = []
        var length = Qualities.length;
        for (var i = length - 1; i >= 0; i--) {
            var quality = Qualities[i];
            qualities.push({
                index: i,
                name: quality,
                hasQuality: this.qualities.indexOf(i) >= 0,
                profileId: this._id
            });
        }

        return qualities;
    }
});

Template.settingsProfilesItem.events({
    'change ul.qualities input.quality' : function(e) {
        var checkbox = $(e.target);
        var checked = checkbox.prop('checked');
        var profileId = checkbox.closest('form').data('profile');
        var quality = parseInt(checkbox.data('quality'));

        if (checked) {
            Profiles.update(profileId, {$push: {qualities: quality}});
            notify('Quality ' + Qualities[quality] + ' added')
        } else {
            Profiles.update(profileId, {$pull: {qualities: quality}});
            notify('Quality ' + Qualities[quality] + ' removed')
        }
    },
    'change select.cutoff' : function(e) {
        var select = $(e.target);
        var cutoff = parseInt(select.val());
        var profileId = select.closest('form').data('profile');

        Profiles.update(profileId, {$set: {cutoff: cutoff}});
        notify('Cutoff changed to ' + Qualities[cutoff]);
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
