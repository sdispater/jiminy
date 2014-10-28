automaticSearchEpisode = function(episodeId) {
    console.log('automaticSearchEpisode'.blue);
    var episode = Episodes.findOne(episodeId);
    var oldStatus = episode.status;
    Episodes.update(episode._id, {$set: {status: 'pending'}});
    var download = Downloads.findOne(episode.downloadId);
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
    var propositions = [];

    indexers.forEach(function(indexer) {
        var usenetIndexer = new Indexer(indexer.implementation, indexer.settings);
        var res = usenetIndexer.searchEpisode(episode, show, 1000, download ? download.blacklist : null);

        _.extend(propositions, res);
    });

    var candidates = [];
    for (var i in propositions) {
        var proposition = propositions[i];
        var guesser = new Guesser();
        // Checking validity
        var guess = guesser.guess(proposition);
        if (guess && guess.quality && guess.season == episode.season_number && guess.episode == episode.number) {
            for (var j in qualities) {
                var quality = qualities[j];
                if (guess.quality.eq(quality)) {
                    candidates.push(guess);
                }
            }
        }
    }

    if (!candidates.length) {
        Episodes.update(episode._id, {$set: {status: oldStatus}});

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
            'Found ' + candidate.proposition.title,
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
            'Found ' + candidate.proposition.title,
            'success',
            'Valid candidate (' + candidate.input + ') found for '
            + show.name
            + ' Season ' + episode.season_number
            + ' Episode ' + episode.number
        );
    }

    Meteor.call('createJob', 'downloadCandidate', {candidate: candidate.toObject(), episodeId: episode._id});
}


downloadRelease = function(episodeId, releaseId, indexerId) {
    console.log('downloadRelease'.blue);
    var episode = Episodes.findOne(episodeId);
    Episodes.update(episode._id, {$set: {status: 'pending'}});
    var download = Downloads.findOne(episode.downloadId);
    var indexer = Indexers.findOne(indexerId);
    var show = Shows.findOne(episode.show_id);

    Meteor.call(
        'log',
        'Episode Search',
        'info',
        'Searching for release ' + releaseId + ' for '
        + show.name
        + ' Season ' + episode.season_number
        + ' Episode ' + episode.number
    );

    var usenetIndexer = new Indexer(indexer.implementation, indexer.settings);
    var proposition = usenetIndexer.searchRelease(releaseId, episode, show, 1000, download ? download.blacklist : null);

    if (!proposition) {
        var message = 'No release could be found for id ' + releaseId;

        Meteor.call('notify', message, 'error');
        Meteor.call('log', 'Episode Search', 'error', message);

        return false;
    }

    var guess = new Guesser().guess(proposition);
    var validGuess = guess && guess.season == episode.season_number && guess.episode == episode.number;

    if (!validGuess) {
        var message = 'The release ' + releaseId + ' does not match the episode.';

        Meteor.call('notify', message, 'error');
        Meteor.call('log', 'Episode Search', 'error', message);

        return false;
    }

    Meteor.call('createJob', 'downloadCandidate', {candidate: guess.toObject(), episodeId: episode._id});
}


setEpisodesStatuses = function() {
    console.log('setEpisodesStatuses'.blue);
    var searchableEpisodes = Episodes.find({monitored: true, status: {$in: [null, 'aired', 'unaired']}});
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
    console.log('searchWantedEpisodesDownloads'.blue);
    options = _.extend({status: 'wanted'}, options);

    var wantedEpisodes = Episodes.find(options, {$sort: {number: 1}});
    wantedEpisodes.forEach(function(episode) {
        try {
            Meteor.call('createJob', 'automaticSearchEpisode', {episodeId: episode._id});
        } catch (err) {
            Meteor.call('log', 'Episode Search', 'error', err.message);
        }
    });
}
