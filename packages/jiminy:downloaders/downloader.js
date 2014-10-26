Downloader = function(implementation, settings) {
    this.init(implementation, settings);
}

Downloader.prototype.init = function(implementation, settings) {
    var downloaderSettings = {}
    for (var settingName in settings) {
        var setting = settings[settingName];
        if (typeof setting == 'object') {
            downloaderSettings[settingName] = setting.value;
        } else {
            downloaderSettings[settingName] = setting;
        }
    }

    this.downloaderClass = DownloadersImplementations.getClass(implementation);
    this.downloader = new this.downloaderClass(downloaderSettings);
}

Downloader.prototype.status = function() {
    return this.downloader.status();
}

Downloader.prototype.add = function(proposition) {
    return this.downloader.add(proposition);
}

Downloader.prototype.addUrl = function(url) {
    return this.downloader.addUrl(url);
}

Downloader.prototype.get = function(download) {
    return this.downloader.get(download);
}

Downloader.prototype.test = function() {
    return this.downloader.test();
}

Downloader.prototype.supports = function(proposition) {
    return this.downloader.supports(proposition);
}
