automaticSearchEpisode = function(episodeId) {
    var episode = Episodes.findOne(episodeId);
    var show = Shows.findOne(episode.show_id);

    Meteor.call(
        'log',
        'Episode Search',
        'info',
        'Searching for download for '
        + show.name
        + ' Season ' + episode.season_number
        + ' Episode ' + episode.number
    );

    var indexers = Indexers.find();
    var profile = Profiles.findOne(show.profile_id);
    var cutoff = Quality.findById(profile.cutoff);
    var qualities = profile.qualities.map(function(q) {return Quality.findById(q)});
    var propositions = []

    indexers.forEach(function(indexer) {
        var usenetIndexer = new Indexer(indexer.implementation, indexer.settings);
        var res = usenetIndexer.searchEpisode(episode, show, 1000);

        _.extend(propositions, res);
    });

    var candidates = [];
    for (var i in propositions) {
        var proposition = propositions[i];
        var guesser = new Guesser();
        // Checking validity
        var guess = guesser.guess(proposition);
        if (guess && guess.quality) {
            for (var j in qualities) {
                var quality = qualities[j];
                if (guess.quality.eq(quality)) {
                    candidates.push(guess);
                }
            }
        }
    }

    if (!candidates.length) {
        return Meteor.call(
            'log',
            'Episode Search',
            'warning',
            'Could not find valid candidates for '
            + show.name
            + ' Season ' + episode.season_number
            + ' Episode ' + episode.number
        );
    }

    candidates = candidates.sort(function(a, b) {
        if (!b.quality) {
            return 0
        }

        if (a.quality.id < b.quality.id) {
            return 1;
        }

        if (a.quality.id > b.quality.id) {
            return  -1;
        }

        return 0;
    });

    var candidate = candidates[0];
    if (candidate.quality.id < cutoff) {
        Meteor.call(
            'log',
            'Episode Search',
            'info',
            'Valid candidate (' + candidate.proposition.title + ') for '
            + show.name
            + ' Season ' + episode.season_number
            + ' Episode ' + episode.number
            + ' found but will still be searching for cutoff quality.'
        );
        Meteor.call(
            'notify',
            'Episode Found',
            'info',
            'Valid candidate (' + candidate.proposition.title + ') for '
            + show.name
            + ' Season ' + episode.season_number
            + ' Episode ' + episode.number
            + ' found but will still be searching for cutoff quality.'
        );
    } else {
        Meteor.call(
            'log',
            'Episode Search',
            'success',
            'Valid candidate (' + candidate.proposition.title + ') found for '
            + show.name
            + ' Season ' + episode.season_number
            + ' Episode ' + episode.number
        );
        Meteor.call(
            'notify',
            'Episode Found',
            'success',
            'Valid candidate (' + candidate.input + ') found for '
            + show.name
            + ' Season ' + episode.season_number
            + ' Episode ' + episode.number
        );
    }

    Meteor.call('createJob', 'downloadCandidate', {candidate: candidate.toObject()});
}


setEpisodesStatuses = function() {
    var searchableEpisodes = Episodes.find({status: {$in: [null, 'aired', 'unaired']}});
    searchableEpisodes.forEach(function(episode) {
        if (!episode.air_date_utc) {
            return false;
        }
        var hasAired = episode.air_date_utc < new Date().getTime() / 1000;
        if (hasAired) {
            if (episode.monitored) {
                Episodes.update(episode._id, {$set: {status: 'wanted'}});
            } else {
                Episodes.update(episode._id, {$set: {status: 'aired'}});
            }
        } else {
            Episodes.update(episode._id, {$set: {status: 'unaired'}});
        }
    });
}

searchWantedEpisodesDownloads = function(options) {
    options = _.extend({status: 'wanted'}, options);

    var wantedEpisodes = Episodes.find(options, {$sort: {number: 1}});
    console.log(wantedEpisodes.count());
    wantedEpisodes.forEach(function(episode) {
        try {
            Meteor.call('createJob', 'automaticSearchEpisode', {episodeId: episode._id});
        } catch (err) {
            Meteor.call('log', 'Episode Search', 'error', err.message);
        }
    });
}
