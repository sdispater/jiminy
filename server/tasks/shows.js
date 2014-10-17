var request = Npm.require('request');
var fs = Npm.require('fs');

var saveImageAsync = Meteor.wrapAsync(request.get, request);

var saveImage = function(image) {
    return saveImageAsync({url: image, encoding: null});
}

var getShowSummaryAsync = Meteor.wrapAsync(Meteor.Trakt().getSummary, Meteor.Trakt());

var getShowSummary = function(tvdbId) {
    return getShowSummaryAsync(tvdbId);
}

addShow = function(data) {
    var tvdbId = data.tvdb_id;
    var title = data.title;
    var seasonFolders = data.season_folders;
    var path = data.path;
    var startingSeason = data.starting_season;
    var profileId = data.profile;
    var showType = data.show_type;

    var newShowId = Shows.insert({
        name: title,
        tvdb_id: tvdbId,
        overview: 'This show is being processes. Please wait.',
        ready: false
    });

    try {
        show = getShowSummary(tvdbId);

        var slug = show.url.replace('http://trakt.tv/show/', '');

        var options = {
            tvdb_id: data.tvdb_id,
            tvrage_id: show.tvrage_id,
            imdb_id: show.imdb_id,
            name: show.title,
            slug: slug,
            status: show.status,
            overview: show.overview,
            air_time: show.air_time,
            network: show.network,
            images: {},
            runtime: show.runtime,
            monitored: true,
            season_folders: seasonFolders,
            last_info_sync: new Date().getTime(),
            first_aired: show.first_aired,
            next_airing: null,
            year: show.year,
            path: path,
            profile_id: profileId,
            type: showType
        }

        // Downloading images
        for (var imageType in show.images) {
            var image = saveImage(show.images[imageType]);
            var newImage = new FS.File();
            newImage.attachData(image.body, {type: 'image/jpg'}, function(err) {
                if (err) {
                    throw err;
                }

                newImage.name(imageType + '-' + tvdbId + '.jpg');

                Images.insert(newImage);
            });

            options['images'][imageType] = newImage._id;
        }

        Shows.update(newShowId, options);

        // Seasons
        for (var i in show.seasons) {
            var season = show.seasons[i]
            var seasonOptions = {
                number: season.season,
                show_id: newShowId,
                poster: null
            }

            if (season.poster) {
                var posterData = saveImage(season.poster);
                var seasonPoster = new FS.File();
                seasonPoster.attachData(posterData.body, {type: 'image/jpg'}, function(err) {
                    if (err) {
                        throw err;
                    }

                    seasonPoster.name('poster-' + tvdbId + '-season-' + season.season + '.jpg');

                    Images.insert(seasonPoster);
                });



                seasonOptions['poster'] = seasonPoster;
            }

            var seasonId = Seasons.insert(seasonOptions);

            // Episodes
            for (var j in season.episodes) {
                var episode = season.episodes[j];
                var monitored = startingSeason <= season.season

                var episodeOptions = {
                    season_id: seasonId,
                    show_id: newShowId,
                    tvdb_id: episode.tvdb_id,
                    number: episode.episode,
                    season_number: season.season,
                    name: episode.title,
                    overview: episode.overview,
                    file: null,
                    monitored: monitored,
                    air_date: episode.first_aired,
                    air_date_utc: episode.first_aired_utc,
                    screen: null
                }

                /*if (episode.screen) {
                 var screenData = saveImage(episode.screen);
                 var episodeScreen = new FS.File();
                 episodeScreen.attachData(screenData.body, {type: 'image/jpg'}, function(err) {
                 if (err) {
                 throw err;
                 }

                 episodeScreen.name('screen-' + tvdbId + '-episode-' + episode.tvdb_id + '.jpg');

                 Images.insert(episodeScreen);
                 });



                 episodeOptions['screen'] = episodeScreen;
                 }*/

                var episodeId = Episodes.insert(episodeOptions);
            }
        }

        var updateOptions = {
            ready: true
        }
        var nextEpisode = Episodes.findOne(
            {
                show_id: newShowId,
                air_date_utc: {$gte: new Date().getTime() / 1000}
            },
            {
                sort: {air_date_utc: 1}
            }
        );

        if (nextEpisode) {
            updateOptions['next_airing'] = nextEpisode.air_date
        }
        Shows.update(newShowId, {$set: updateOptions});

        job.done(function(err) {
            if (err) {
                throw err;
            }

            return Meteor.call('notify', 'Finished processing show ' + show.title, 'success');
        });
    } catch (err) {
        throw err;
    }
}

updateShow = function(show) {
    try {
        Shows.update(show._id, {$set: {ready: false}});
    } catch (err) {
        job.fail(err.message);

        return Meteor.call('notify', '[Show Update] An error occurred while updating show ' + show.name, 'error');
    }

    try {
        var showData = getShowSummary(show.tvdb_id);

        if (show.last_info_sync / 1000 >= showData.last_updated) {
            return Meteor.call('notify', '[Show Update] Nothing new for show ' + show.name, 'success');
        }

        var updateOptions = {
            name: showData.title,
            status: showData.status,
            overview: showData.overview,
            air_time: showData.air_time,
            network: showData.network,
            runtime: showData.runtime,
            last_info_sync: new Date().getTime(),
            ready: true
        }

        // Downloading images
        for (var imageType in showData.images) {
            var image = saveImage(showData.images[imageType]);
            var existingImage = Images.findOne(show.images[imageType]);

            if (existingImage) {
                existingImage.attachData(image.body, {type: 'image/jpg'}, function(err) {
                    if (err) {
                        throw err;
                    }
                });
            } else {
                var newImage = new FS.File();
                newImage.attachData(image.body, {type: 'image/jpg'}, function(err) {
                    if (err) {
                        throw err;
                    }

                    newImage.name(imageType + '-' + show.tvdb_id + '.jpg');

                    Images.insert(newImage);
                });

                updateOptions['images'][imageType] = newImage._id;
            }

        }

        // Seasons
        for (var i in showData.seasons) {
            var season = showData.seasons[i]
            var seasonOptions = {
                number: season.season,
                show_id: show._id
            }

            var existingSeason = Seasons.findOne(seasonOptions);

            if (!existingSeason) {
                var seasonId = Seasons.insert(seasonOptions);
            } else {
                var seasonId = existingSeason._id;
            }

            // Episodes
            for (var j in season.episodes) {
                var episode = season.episodes[j];
                var monitored = true

                var existingEpisode = Episodes.findOne({
                    season_id: seasonId,
                    number: episode.episode
                });

                if (!existingEpisode) {
                    var episodeOptions = {
                        season_id: seasonId,
                        show_id: show._id,
                        tvdb_id: episode.tvdb_id,
                        number: episode.episode,
                        season_number: season.season,
                        name: episode.title,
                        overview: episode.overview,
                        file: null,
                        monitored: monitored,
                        air_date: episode.first_aired,
                        air_date_utc: episode.first_aired_utc,
                        screen: null
                    }
                    var episodeId = Episodes.insert(episodeOptions);
                } else {
                    var episodeOptions = {
                        name: episode.title,
                        overview: episode.overview,
                        air_date: episode.first_aired,
                        air_date_utc: episode.first_aired_utc
                    }

                    Episodes.update(existingEpisode._id, {$set: episodeOptions});
                }

            }
        }

        var nextEpisode = Episodes.findOne(
            {
                show_id: show._id,
                air_date_utc: {$gte: new Date().getTime() / 1000}
            },
            {
                sort: {air_date_utc: 1}
            }
        );

        if (nextEpisode) {
            updateOptions['next_airing'] = nextEpisode.air_date
        }
        Shows.update(show._id, {$set: updateOptions});

        job.done(function(err) {
            if (err) {
                throw err;
            }

            return Meteor.call('notify', '[Show Update]Finished updating show ' + show.name, 'success');
        });
    } catch (err) {
        Shows.update(show._id, {$set: {ready: true}});

        throw err;
    } finally {
        Shows.update(show._id, {$set: {ready: true}});
    }
}


refreshShows = function() {
    var shows = Shows.find({ready: true});
    shows.forEach(function(show) {
       updateShow(show);
    });
}
