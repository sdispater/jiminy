Template.settingsDownloaders.helpers({
    downloaders: function() {
        return Downloaders.find();
    },
    implementations: function() {
        try {
            return DownloadersImplementations.implementations;
        } catch (err) {
            console.log(err);
        }
    },
    chosenImplementation: function() {
        var implementation = Session.get('chosenImplementation');
        if (!implementation) {
            return null;
        }

        return DownloadersImplementations.get(implementation);
    },
    validated: function() {
        return Session.get('indexerValidated');
    }
});


Template.settingsDownloaders.events({
    'change .x-choose-implementation > input[type="radio"]': function(e) {
        var radio = $(e.target);
        var checked = radio.prop('checked');

        if (checked) {
            Session.set('chosenImplementation', radio.val());
        }
    },
    'click .x-test-downloader': function(e) {
        var form = $('#chosenImplementation');
        //var formData = Mesosphere.Utils.getFormData(form);

        //var validator = Mesosphere.newznabForm;
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
            var implementation = validated.formData.implementation;
            Meteor.call('testDownloader', validated.formData, implementation, function(err, test) {
                if (err) {
                    return notify(err.message, 'error');
                }

                if (!test.ok) {
                    return notify(test.message, 'error');
                }

                notify('Test Succeeded', 'success');
            })
        }
    },
    'click .x-add-downloader': function(e) {
        var form = $('#chosenImplementation');
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
            var implementation = validated.formData.implementation;
                Meteor.call('addDownloader', validated.formData, implementation, function(err, res) {
                if (err) {
                    return notify(err.message, 'error');
                }

                notify('Downloader successfully added', 'success');
            })
        }
    }
});
