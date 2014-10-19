Template.showsSearchItem.helpers({
    seasonsCount: function() {
        if (!this.seasons || this.seasons.length == 0) {
            return 0;
        }

        return this.seasons.length;
    },
    seasons: function() {
        return this.seasons.sort(function (a, b) {
            if (a.season > b.season) {
                return -1
            }

            if (a.season < b.season) {
                return 1
            }

            return 0;
        });
    },
    profiles: function () {
        return Profiles.find();
    },
    exists: function() {
        return Shows.find({tvdb_id: this.tvdb_id}).count() >= 1;
    },
    paths: function() {
        return Paths.find();
    },
    searchPaths: function(query, callback) {
        Meteor.call('searchPaths', query, function(err, res) {
            if (err) {
                console.log(err);
                return;
            }
            callback(res.map(function(v){ return {value: v}; }));
        });
    }
})

Template.showsSearchItem.events({
    'click .x-add-show': function (e) {
        var tvdbId = parseInt($(e.target).data('tvdb-id'));
        var title = $(e.target).data('title');

        if (Shows.find({'tvdb_id': tvdbId}).count() > 0) {
            return notify('This show already exists in your collection', 'error');
        }

        var jobOptions = {
            tvdb_id: tvdbId,
            title: title,
            season_folders: false
        }


        var form = $('form#form-' + tvdbId);
        console.log(form);
        console.log(form.serializeArray());

        var formData = form.serializeArray()
        for (var i in formData) {
            var data = formData[i];

            switch (data.name) {
                case 'path':
                    jobOptions['path'] = data.value;
                    break;
                case 'starting_season':
                    jobOptions['starting_season'] = parseInt(data.value);
                    break;
                case 'profile':
                    jobOptions['profile'] = data.value;
                    break;
                case 'show_type':
                    jobOptions['show_type'] = data.value;
                    break;
                case 'season_folders':
                    jobOptions['season_folders'] = data.value == 'on';
                    break;
            }
        }

        Meteor.call('createJob', 'addShow', jobOptions, function(err) {
           Meteor.call('notify', 'Show <strong>' + title + '</strong> added', 'success');
        });
    },
    'change select[name="path"]': function(e) {
        var select = $(e.target);
        var tvdbId = select.data('tvdb-id');
        if (select.val() == 'add') {
            $('#modal-' + tvdbId).modal();
        }
    },
    'click .x-add-folder': function(e) {
        console.log('Adding folder');
        var button = $(e.target);
        var tvdbId = button.data('tvdb-id');
        var input = $('#folder-' + tvdbId);
        var folder = input.val();

        Meteor.call('addFolder', folder, function(err, res) {
            if (err) {
                input.closest('.form-group').children('.add-folder-error').html(err.message);
            } else {
                input.closest('.modal').modal('hide');
            }
        });
    }
});


Template.showsSearchItem.rendered = function() {
    Meteor.typeahead.inject($('.typeahead'));
}
