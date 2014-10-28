downloadCandidate = function(candidate) {
    console.log('downloadCandidate'.blue);

    Meteor.call(
        'log',
        'Episode Download',
        'info',
        'Processing candidate ' + candidate.proposition.title
    )

    var proposition = candidate.proposition;
    var episode = Episodes.findOne(proposition.episode._id);
    var downloaders = Downloaders.find({enabled: true}).fetch();

    if (downloaders.length == 0) {
        return Meteor.call(
            'log',
            'Episode Download',
            'warning',
            'No downloaders available. Check your configuration.'
        )
    }

    var download;

    for (var i in downloaders) {
        var _downloader = downloaders[i];
        var downloader = new Downloader(_downloader.implementation, _downloader.settings);
        if (!downloader.supports(proposition)) {
            continue;
        }

        var downloadData = downloader.add(proposition);
        if (downloadData) {
            if (episode.downloadId) {
                download = downloadData.updateDownload(Downloads.findOne(episode.downloadId), _downloader, proposition);
                break;
            } else {
                download = downloadData.createDownload(_downloader, proposition);
                break;
            }
        }
    }

    if (!download) {
        return Meteor.call(
            'log',
            'Episode Download',
            'error',
            'Unable to download proposition. Check if the downloaders are properly configured and supports\
             ' + proposition.implementation + ' propositions'
        )
    }

    Meteor.call(
        'log',
        'Episode Download',
        'info',
        'Candidate ' + candidate.proposition.title + ' sent to downloader ' + downloader.implementation.name
    )

    Episodes.update(proposition.episode._id, {$set: {downloadId: download._id}});
}

updateDownloads = function() {
    var downloads = Downloads.find({status: {$nin: ['done', 'failed', 'cancelled']}});

    console.log(downloads.count() + ' downloads to update');

    downloads.forEach(function(download) {
        var _downloader = Downloaders.findOne(download.downloaderId);
        var downloader = new Downloader(_downloader.implementation, _downloader.settings);
        try {
            var downloadData = downloader.get(download);
            if (downloadData) {
                downloadData.updateDownload(download, _downloader);
            } else {
                Downloads.remove(download._id);
                Episodes.update({downloadId: download._id}, {$set: {status: 'cancelled'}});
                return false;
            }
        } catch(err) {
            return Meteor.call('log', 'Episode Download', 'error', err.message);
        }

        // Download has failed, therefore we blacklist the proposition
        if (downloadData.status == 'failed') {
            var proposition = download.proposition;
            Downloads.update(download._id, {$set: {proposition: null}, $addToSet: {blacklist: proposition}});
            Meteor.call(
                'log',
                'Episode Download',
                'error',
                'Could not download ' + proposition.title + '. The episode will be reset to wanted to try another release.'
            )
            Meteor.call(
                'notify',
                'Could not download ' + proposition.title,
                'error',
                'The episode will be reset to wanted to try another release.'
            )
        }

        Episodes.update(download.episodeId, {$set: {status: downloadData.status}});
    });
}

retryFailedDownloads = function() {
    var failedEpisodes = Episodes.find({status: 'failed'});

    console.log(failedEpisodes.count() + ' episodes to retry');

    failedEpisodes.forEach(function(episode) {
        Episodes.update(episode._id, {$set: {status: 'wanted'}});
    });
}
