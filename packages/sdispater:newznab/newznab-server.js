/**
 * A meteor library for communicating with newznab compliant APIs
 *
 * @author Sébastien Eustace <sebastien.eustace@gmail.com>
 */

var request = Npm.require('request');
var xml2js = Npm.require('xml2js');

var parseXMLSync = Meteor.wrapAsync(xml2js.parseString, xml2js);
var makeRequestSync = Meteor.wrapAsync(request.get, request);

var makeRequest = function(url, data) {
    var response = makeRequestSync({
        uri: url,
        qs: data
    });

    var body = parseXMLSync(response.body, {trim: true, normalize: true});
    if (body.error != undefined) {
        var err = new Error(body.error.$.description);
        err.code = body.error.$.code

        throw err;
    }

    return {
        statusCode: response.statusCode,
        body: body
    }
}


if (Meteor.isServer) {
    Newznab = function (url, apiKey) {
        this.init(url, apiKey);
    }

    Newznab.prototype.init = function (url, apiKey) {
        this.url = url;
        this.apiKey = apiKey;
    };

    Newznab.prototype.test = function () {
        var response = makeRequest(this.url + 'api', {t: 'search', q: 'something', apikey: this.apiKey});

        return response;
    };
}
