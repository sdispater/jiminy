Indexer = function(implementation, settings) {
    this.init(implementation, settings);
}

Indexer.prototype.init = function(implementation, settings) {
    var indexerSettings = {}
    for (var settingName in settings) {
        var setting = settings[settingName];
        if (typeof setting == 'object') {
            indexerSettings[settingName] = setting.value;
        } else {
            indexerSettings[settingName] = setting;
        }
    }

    this.implementation = new IndexersImplementations().implementations[implementation];
    this.indexerClass = this.implementation.class;
    this.indexer = new this.indexerClass(indexerSettings);
}

Indexer.prototype.searchEpisode = function(episode, show, maxAge, blacklist) {
    return this.indexer.searchEpisode(episode, show, maxAge, blacklist);
}

Indexer.prototype.searchRelease = function(releaseId, episode, show, maxAge, blacklist) {
    return this.indexer.searchRelease(releaseId, episode, show, maxAge, blacklist);
}

Indexer.prototype.test = function() {
    return this.indexer.test();
}
