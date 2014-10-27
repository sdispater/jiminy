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

    this.implementation = DownloadersImplementations.get(implementation);
    this.downloaderClass = this.implementation.class;
    this.downloader = new this.downloaderClass(downloaderSettings);
}

Downloader.prototype.status = function() {
    return this.downloader.status();
}

Downloader.prototype.add = function(proposition) {
    var data = this.downloader.add(proposition);
    return new DownloadData(data.id, data.size, data.downloaded, data.status, proposition, this.implementation.id);
}

Downloader.prototype.addUrl = function(url) {
    return this.downloader.addUrl(url);
}

Downloader.prototype.get = function(download) {
    var data = this.downloader.get(download);

    return new DownloadData(data.id, data.size, data.downloaded, data.status, download.proposition, this.implementation.id);
}

Downloader.prototype.test = function() {
    return this.downloader.test();
}

Downloader.prototype.supports = function(proposition) {
    return this.downloader.supports(proposition);
}
