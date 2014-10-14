if (Meteor.Trakt().collection.find().count() === 0) {
    Meteor.Trakt().collection.insert({
        name: 'configuration',
        options: {
            apikey: '3904338dc9a5dca533acc58d81cbffa5'
        }
    });
}
