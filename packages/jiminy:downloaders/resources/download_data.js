DownloadData = function(externalId, size, downloaded, status) {
    this.externalId = externalId;
    this.size = size;
    this.downloaded = downloaded ? downloaded : 0;
    this.status = this.normalizeStatus(status);
}

DownloadData.prototype.createDownload = function(downloaderId) {
    var data = {
        downloaderId: downloaderId,
        externalId: this.externalId,
        size: this.size,
        downloaded: this.downloaded,
        percent: this.downloaded / this.size * 100,
        status: this.status
    }

    var downloadId = Downloads.insert(data);

    return Downloads.findOne(downloadId);
}

DownloadData.prototype.toObject = function() {
    return {
        externalId: this.externalId,
        size: this.size,
        downloaded: this.downloaded,
        percent: this.downloaded / this.size * 100,
        status: this.status
    }
}

DownloadData.prototype.normalizeStatus = function(status) {
    switch(status) {
        case 'Queued':
            return this.downloaded > 0 ? 'paused' : 'pending'
        case 'Completed':
            return 'done'
        case 'Checking':
            return 'checking'
        case 'Downloading':
            return 'downloading'
        case 'Extracting':
            return 'checking'
        case 'Failed':
            return 'failed'
        case 'Fetching':
            return 'pending'
        case 'Grabbing':
            return 'pending'
        case 'Moving':
            return 'checking'
        case 'Paused':
            return 'paused'
        case 'QuickCheck':
            return 'checking'
        case 'Repairing':
            return 'checking'
        case 'Running':
            return 'downloading'
        case 'Verifying':
            return 'checking'
    }
}
