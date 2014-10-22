IndexersPresets = new Meteor.Collection('indexers_presets');
Indexers = new Meteor.Collection('indexers');

if (Meteor.isServer) {
    Meteor.methods({
        testIndexer: function(data, preset) {
            if (typeof preset == 'object') {
                preset = preset.preset;
            }
            if (preset == 'newznab') {
                var newznab = new Newznab(data.url, data.api_key)
                try {
                    return newznab.test();
                } catch (err) {
                    throw new Meteor.Error(err.code || 500, err.message);
                }
            } else {
                throw new Meteor.Error(400, 'Unsupported preset: ' + preset);
            }
        },
        addIndexer: function(data, presetId) {
            var preset = IndexersPresets.findOne(presetId);

            var indexerOptions = {
                name: data.name,
                rss: data.rss == 'on',
                search: data.search == 'on',
                preset: preset.preset,
                settings: []
            }

            for (var i in preset.fields) {
                var field = preset.fields[i];
                var fieldName = field.field_name;
                var name = field.name;

                indexerOptions['settings'].push({
                    field_name: fieldName,
                    name: name,
                    value: data[fieldName]
                });
            }

            Indexers.insert(indexerOptions);
        },
        updateIndexer: function(indexerId, data){
            Indexers.update(indexerId, {$set: data});
        },
        updateIndexerSetting: function(indexerId, name, value){
            Indexers.update(
                {_id: indexerId, 'settings.field_name': name},
                {$set: {'settings.$.value': value}}
            );
        },
        deleteIndexer: function(indexerId){
            Indexers.remove(indexerId);
        }
    });

    Indexers.allow({
        update: function() {
            return true;
        },
        remove: function() {
            return true;
        }
    })
}
