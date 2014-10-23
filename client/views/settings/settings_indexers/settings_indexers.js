Template.settingsIndexers.helpers({
    indexers: function() {
        return Indexers.find();
    },
    presets: function() {
        try {
            return new IndexersImplementations().implementations;
        } catch (err) {
            console.log(err);
        }
    },
    chosenIndexer: function() {
        var implementation = Session.get('chosenImplementation');
        if (!implementation) {
            return null;
        }

        return new IndexersImplementations().implementations[implementation];
    },
    validated: function() {
        return Session.get('indexerValidated');
    }
});


Template.settingsIndexers.events({
    'change .x-choose-preset > input[type="radio"]': function(e) {
        var radio = $(e.target);
        var checked = radio.prop('checked');

        if (checked) {
            Session.set('chosenImplementation', radio.val());
        }
    },
    'click .x-test-indexer': function(e) {
        var form = '#chosenPreset';
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
            var implementation = validated.formData.implementation;
            Meteor.call('testIndexer', validated.formData, implementation, function(err, res) {
                if (err) {
                    return notify(err.message, 'error');
                }

                notify('Test Succeeded', 'success');
            })
        }
    },
    'click .x-add-indexer': function(e) {
        var form = '#chosenPreset';
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
            var implementation = validated.formData.implementation;
                Meteor.call('addIndexer', validated.formData, implementation, function(err, res) {
                if (err) {
                    return notify(err.message, 'error');
                }

                notify('Indexer successfully added', 'success');
            })
        }
    }
});
