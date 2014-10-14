Images = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images", {path: "~/Downloads"})]
});

Images.allow({
    insert: function () {
        return true
    },
    update: function () {
        return true
    },
    remove: function () {
        return false
    },
    download: function() {
        return true;
    }
});
