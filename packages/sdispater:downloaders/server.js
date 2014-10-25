Meteor.methods({
    testDownloader: function(data, implementation) {
        var downloader = new Downloader(implementation, data);

        return downloader.test();
    },
    addDownloader: function (data, implementationId) {
        var implementation = DownloadersImplementations.get(implementationId);
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

        Downloaders.insert(indexerOptions);
    },
    updateDownloader: function(indexerId, data){
        Downloaders.update(indexerId, {$set: data});
    },
    updateDownloaderSetting: function(indexerId, name, value){
        var settingUpdate = {};
        settingUpdate['settings.' + name + '.value'] = value;

        Downloaders.update(
            indexerId,
            {$set: settingUpdate}
        );
    },
    deleteDownloader: function(indexerId){
        Downloaders.remove(indexerId);
    }
});

Downloaders.allow({
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});
