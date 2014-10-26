var _SABnzbd = function(settings) {
    this.init(settings);
}

_SABnzbd.definition = {
    name: 'SABnzbd',
    id: 'sabnzbd',
    settings: {
        url: {
            name: 'URL',
            field_name: 'url',
            type: 'text'
        },
        api_key: {
            name: 'API Key',
            field_name: 'api_key',
            type: 'text'
        }
    }
}

_SABnzbd.prototype.init = function(settings) {
    var SAB = Npm.require('sabnzbd');

    for (var setting in _SABnzbd.definition.settings) {
        if (settings[setting] == undefined) {
            throw new Error('Missing setting ' + setting)
        }
    }

    this.url = settings.url;
    this.apiKey = settings.api_key;

    this.sabnzbd = new SAB(this.url, this.apiKey);
};

_SABnzbd.prototype._wrap = function(promise) {
    var Future = Npm.require("fibers/future");
    var future = new Future();

    promise
        .then(function (result) {
            future.return(result);
        })
        .catch(function(err) {
            future.throw(err)
        });

    return future.wait();
}

_SABnzbd.prototype.test = function() {
    return this._wrap(
        this.sabnzbd.status()
            .then(function(res) {
                return new Test(true);
            })
            .catch(function(err) {
                return new Test(false, err.message);
            })
    );
}

_SABnzbd.prototype.supports = function(proposition) {
    return proposition.type == 'usenet';
}

_SABnzbd.prototype.add = function(proposition) {
    if (!this.supports(proposition)) {
        throw new Error('Unsupported proposition');
    }

    return this.addUrl(proposition.link, proposition.title);
}

_SABnzbd.prototype.addUrl = function(url, name) {
    var self = this;
    var Q = Npm.require('q');

    return this._wrap(
        this.sabnzbd.queue.addurl(url)
            .then(function(r) {
                if (r.status == false) {
                    throw new Error('Something went wrong adding the url ' + url);
                } else {
                    return Q.delay(10000);
                }
            })
            .then(function() {
                return self.sabnzbd.entries();
            })
            .then(function(entries) {
                for (var i in entries) {
                    var entry = entries[i];
                    var entryName = entry.name;
                    if (entryName == name || entryName == url) {
                        return new DownloadData(entry.nzbid, entry.size, entry.downloaded, entry.status);
                    }
                }
            })
            .catch(function(err) {
                throw err;
            })
    );
}

_SABnzbd.prototype.get = function(download) {
    return this._wrap(
        this.sabnzbd.entries()
            .then(function(entries) {
                for (var i in entries) {
                    var entry = entries[i];
                    if (entry.nzbid == download.externalId) {
                        return new DownloadData(entry.nzbid, entry.size, entry.size - entry.size_left, entry.status);
                    }
                }
            })
            .catch(function(err) {
                throw err;
            })
    );
}

if (Meteor.isClient) {
    DownloadersImplementations._register(_SABnzbd, true);
} else {
    DownloadersImplementations._register(_SABnzbd, false);
}
