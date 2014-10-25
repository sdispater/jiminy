Template.settingsDownloadersItem.helpers({
});

Template.settingsDownloadersItem.events({
    'click .indexer-form .x-change-name' : function(e) {
        e.preventDefault();

        var target = $(e.target);
        var name = target.closest('.input-group').children('input').first().val();
        var indexerId = target.closest('form').data('indexer');

        Meteor.call('updateDownloader', indexerId, {name: name}, function(err) {
            if (err) {
                throw err;
            }
            notify('Name changed to ' + name);
        });
    },
    'change .indexer-form .x-change-property' : function(e) {
        e.preventDefault();

        var options = {}
        var target = $(e.target);
        var name = target.attr('name');
        var checked = target.prop('checked');
        var indexerId = target.closest('form').data('indexer');
        options[name] = checked;

        Meteor.call('updateDownloader', indexerId, options, function(err) {
            if (err) {
                throw err;
            }
            notify('Value changed');
        });
    },
    'click .indexer-form .x-change-setting' : function(e) {
        e.preventDefault();

        var target = $(e.target).closest('.input-group').children('input').first();
        var name = target.attr('name');
        var value = target.val();
        var indexerId = target.closest('form').data('indexer');

        Meteor.call('updateDownloaderSetting', indexerId, name, value, function(err) {
            if (err) {
                throw err;
            }
            notify('Value changed to ' + value);
        });
    },
    'click .x-edit-test-downloader': function(e) {
        var form = $('form#downloader-' + $(e.target).data('indexer'));
        //var formData = Mesosphere.Utils.getFormData(form);

        //var validator = Mesosphere.newznabForm;
        //var validated = validator.validate(formData);

        var validated = {
            'errors': null,
            formData: {}
        }


        for (var i in form.serializeArray()) {
            var data = form.serializeArray()[i];
            var _data = {}
            _data[data.name] = data.value;

            _.extend(validated.formData, _data);
        }

        if (validated.errors)  {
            var message = ''
            for (var name in validated.errors) {
                var error = validated.errors[name];
                message += '<p>Field ' + name + ': ' + error.message + '</p>';
            }
            notify(message, 'error');
        } else {
            var downloader = Downloaders.findOne(validated.formData.downloader);
            Meteor.call('testDownloader', validated.formData, downloader.implementation, function(err, res) {
                if (err) {
                    return notify(err.message, 'error');
                }

                notify('Test Succeeded', 'success');
            })
        }
    },
    'click .x-delete-indexer': function(e) {
        var button = $(e.target);
        var indexerId = button.data('indexer');
        Meteor.call('deleteDownloader', indexerId, function(err) {
            if (err) {
                return notify(err.message, 'error');
            }
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');

            notify('Downloader deleted', 'success');
        });
    }
});
