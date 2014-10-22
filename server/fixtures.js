if (Meteor.Trakt().collection.find().count() === 0) {
    Meteor.Trakt().collection.insert({
        name: 'configuration',
        options: {
            apikey: '3904338dc9a5dca533acc58d81cbffa5'
        }
    });
}

if (Profiles.find().count() == 0) {
    Profiles.insert({
        name: 'SD',
        qualities: [0, 1, 2],
        cutoff: 0
    });
    Profiles.insert({
        name: 'HD-720p',
        qualities: [3, 6, 7],
        cutoff: 3
    });
    Profiles.insert({
        name: 'HD-1080p',
        qualities: [4, 8, 9],
        cutoff: 4
    });
    Profiles.insert({
        name: 'HD-All',
        qualities: [3, 4, 6, 7, 8, 9],
        cutoff: 3
    });
}



if (IndexersPresets.find().count() == 0) {
    var newznab = IndexersPresets.insert({
        name: 'Newznab',
        rss: true,
        search: true,
        preset: 'newznab',
        fields: [{
            name: 'URL',
            field_name: 'url',
            type: 'text'
        }, {
            name: 'API Key',
            field_name: 'api_key',
            type: 'text'
        }]
    });
    var omgwtfnzbs = IndexersPresets.insert({
        name: 'Omgwtfnzbs',
        rss: true,
        search: true,
        preset: 'omgwtfnzbs',
        fields: [{
            name: 'Username',
            field_name: 'username',
            type: 'text'
        }, {
            name: 'API Key',
            field_name: 'api_key',
            type: 'text'
        }]
    });
}
