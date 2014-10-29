Episodes = new Meteor.Collection('episodes');

if (Meteor.isServer) {
    Meteor.methods({
        searchEpisode: function (episodeId) {
            Meteor.call('createJob', 'automaticSearchEpisode', {episodeId: episodeId}, function (err, res) {
            });
        },
        searchReleases: function (episodeId) {
            var episode = Episodes.findOne(episodeId);
            var download = Downloads.findOne(episode.downloadId);
            var show = Shows.findOne(episode.show_id);

            var indexers = Indexers.find();
            var profile = Profiles.findOne(show.profile_id);
            var cutoff = Quality.findById(profile.cutoff);
            var qualities = profile.qualities.map(function (q) {
                return Quality.findById(q)
            });
            var propositions = [];

            indexers.forEach(function (indexer) {
                var usenetIndexer = new Indexer(indexer.implementation, indexer.settings);
                try {
                    var res = usenetIndexer.searchEpisode(episode, show, 1000);
                } catch (err) {
                    return Meteor.call('log', 'Releases search', 'error',
                        'An error occurred while contacting ' + indexer.name + ' (' + err.message + ')');
                }
                res = res.map(function (r) {
                    r.indexer = indexer;
                    return r;
                })

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
                return [];
            }

            candidates = candidates.sort(function (a, b) {
                if (!b.quality) {
                    return 0
                }

                if (a.quality.id < b.quality.id) {
                    return 1;
                }

                if (a.quality.id > b.quality.id) {
                    return -1;
                }

                return 0;
            });

            // Statuses
            candidates.map(function (candidate) {
                var status = 'pending'
                var statusLabel = 'Available';

                if (download) {
                    var blacklist = download.blacklist;
                    if (download.proposition && download.proposition.id == candidate.proposition.id) {
                        status = download.status;
                        statusLabel = status;
                    } else if (blacklist && blacklist.filter(function (b) {
                            return b.id == candidate.proposition.id
                        }).length > 0) {
                        status = 'failed';
                        statusLabel = 'Blacklisted';
                    }
                }

                candidate.status = status;
                candidate.statusLabel = statusLabel;

                return candidate;
            });

            return candidates;
        },
        downloadRelease: function (episodeId, releaseId, indexerId) {
            return downloadRelease(episodeId, releaseId, indexerId);
        }
    })
}
