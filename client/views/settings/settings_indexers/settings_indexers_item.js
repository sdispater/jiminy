Template.settingsIndexersItem.helpers({
    settings: function() {
        return this.settings.map(function(setting, index) {
            setting.index = index;
            return setting;
        });
    }
});

Template.settingsIndexersItem.events({
    'click .indexer-form .x-change-name' : function(e) {
        e.preventDefault();

        var target = $(e.target);
        var name = target.closest('.input-group').children('input').first().val();
        var indexerId = target.closest('form').data('indexer');

        Meteor.call('updateIndexer', indexerId, {name: name}, function(err) {
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

        Meteor.call('updateIndexer', indexerId, options, function(err) {
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
        var index = target.data('index');
        var indexerId = target.closest('form').data('indexer');

        Meteor.call('updateIndexerSetting', indexerId, name, value, function(err) {
            if (err) {
                throw err;
            }
            notify('Value changed to ' + value);
        });
    },
    'click .x-edit-test-indexer': function(e) {
        var form = $('form#indexer-' + $(e.target).data('indexer'));
        var formData = Mesosphere.Utils.getFormData(form);

        var validator = Mesosphere.newznabForm;
        var validated = validator.validate(formData);

        if (validated.errors)  {
            var message = ''
            for (var name in validated.errors) {
                var error = validated.errors[name];
                message += '<p>Field ' + name + ': ' + error.message + '</p>';
            }
            notify(message, 'error');
        } else {
            var indexer = Indexers.findOne(validated.formData.indexer);
            Meteor.call('testIndexer', validated.formData, indexer.preset, function(err, res) {
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
        Meteor.call('deleteIndexer', indexerId, function(err) {
            if (err) {
                return notify(err.message, 'error');
            }
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
            
            notify('Indexer deleted', 'success');
        });
    }
});
