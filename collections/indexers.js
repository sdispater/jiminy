Indexers = new Meteor.Collection('indexers');

if (Meteor.isServer) {
    Meteor.methods({
        testIndexer: function(data, implementation) {
            var indexer = new Indexer(implementation, data);
            try {
                return indexer.test();
            } catch (err) {
                throw new Meteor.Error(err.code || 500, err.message);
            }
        },
        addIndexer: function (data, implementationId) {
            var implementation = new IndexersImplementations().implementations[implementationId];
            var indexerOptions = {
                name: data.name,
                rss: data.rss == 'on',
                search: data.search == 'on',
                implementation: implementationId,
                settings: {}
            }

            for (var settingName in implementation.settings) {
                var setting= implementation.settings[settingName];
                var name = setting.name;

                indexerOptions['settings'][settingName] = {
                    name: name,
                    value: data[settingName]
                };
            }

            Indexers.insert(indexerOptions);
        },
        updateIndexer: function(indexerId, data){
            Indexers.update(indexerId, {$set: data});
        },
        updateIndexerSetting: function(indexerId, name, value){
            var settingUpdate = {};
            settingUpdate['settings.' + name + '.value'] = value;

            Indexers.update(
                indexerId,
                {$set: settingUpdate}
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
