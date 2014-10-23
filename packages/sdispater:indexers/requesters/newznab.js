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

NewznabRequester = function() {}

NewznabRequester.prototype.request = function(url, data) {
    return makeRequest(url, data);
}
