downloadCandidate = function(candidate) {
    var proposition = candidate.proposition;
    var downloaders = Downloaders.find({enabled: true});

    if (downloaders.count() == 0) {
        return Meteor.call(
            'log',
            'Episode Download',
            'warning',
            'No downloaders available. Check your configuration.'
        )
    }

    var download;

    downloaders.forEach(function(_downloader) {
        var downloader = new Downloader(_downloader.implementation, _downloader.settings);
        if (!downloader.supports(proposition) || download) {
            return false;
        }

        var downloadData = downloader.add(proposition);
        if (downloadData) {
            download = downloadData.createDownload(_downloader._id);
        } else {
            return false
        }
    });

    if (!download) {
        return Meteor.call(
            'log',
            'Episode Download',
            'error',
            'Unable to download proposition. Check if the downloaders are properly configured and supports\
             ' + proposition.type + ' propositions'
        )
    }

    Episodes.update(proposition.episode._id, {$set: {downloadId: download._id}});
}

updateDownloads = function() {
    var downloads = Downloads.find({status: {$nin: ['done', 'failed']}});

    console.log(downloads.count() + ' downloads to update');

    downloads.forEach(function(download) {
        var _downloader = Downloaders.findOne(download.downloaderId);
        var downloader = new Downloader(_downloader.implementation, _downloader.settings);
        try {
            console.log(download.externalId);
            var downloadData = downloader.get(download);
            if (downloadData) {
                Downloads.update(download._id, {$set: downloadData.toObject()});
            } else {
                Downloads.remove(download._id);
                Episodes.update({downloadId: download._id}, {$set: {status: 'canceled'}});
                return false;
            }
        } catch(err) {
            return Meteor.call('log', 'Episode Download', 'error', err.message);
        }

        Episodes.update({downloadId: download._id}, {$set: {status: downloadData.status}});
    });
}
