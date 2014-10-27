Episodes = new Meteor.Collection('episodes');

Meteor.methods({
    searchEpisode: function(episodeId) {
        Meteor.call('createJob', 'automaticSearchEpisode', {episodeId: episodeId}, function(err, res) {});
    },
    searchReleases: function(episodeId) {
        var episode = Episodes.findOne(episodeId);
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

        // Statuses
        candidates.map(function(candidate) {
            var status = 'pending'
            var statusLabel = 'Available';

            if (download) {
                var blacklist = download.blacklist;
                if (download.proposition.id == candidate.proposition.id) {
                    status = download.status;
                    statusLabel = status;
                } else if (blacklist && blacklist.filter(function(b) {return b.id == candidate.proposition.id}).length > 0) {
                    status = 'failed';
                    statusLabel = 'Blacklisted';
                }
            }

            candidate.status = status;
            candidate.statusLabel = statusLabel;

            return candidate;
        });

        return candidates;
    }
})
