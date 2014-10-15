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
        qualities: [0, 1, 2]
    });
    Profiles.insert({
        name: 'HD-720p',
        qualities: [3, 6, 7]
    });
    Profiles.insert({
        name: 'HD-1080p',
        qualities: [4, 8, 9]
    });
    Profiles.insert({
        name: 'HD-All',
        qualities: [3, 4, 6, 7, 8, 9]
    });
}
