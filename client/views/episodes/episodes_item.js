Template.episodesItem.helpers({
    download: function() {
        return Downloads.findOne(this.downloadId);
    }
});
