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
        qualities: [1, 2, 3],
        cutoff: 1
    });
    Profiles.insert({
        name: 'HD-720p',
        qualities: [4, 7, 8],
        cutoff: 4
    });
    Profiles.insert({
        name: 'HD-1080p',
        qualities: [5, 9, 10],
        cutoff: 5
    });
    Profiles.insert({
        name: 'HD-All',
        qualities: [4, 5, 7, 8, 9, 10],
        cutoff: 4
    });
}
