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

if (Meteor.isClient) {
    DownloadersImplementations._register(_SABnzbd, true);
} else {
    DownloadersImplementations._register(_SABnzbd, false);
}
