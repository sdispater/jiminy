Quality = function(id, name) {
    this.id = id;
    this.name = name;
}

Quality.UNKNOWN = new Quality(0, 'Unknown');
Quality.SDTV = new Quality(1, 'SDTV');
Quality.WEBDL480P = new Quality(2, 'WEBDL-480p');
Quality.DVD = new Quality(3, 'DVD');
Quality.HDTV720P = new Quality(4, 'HDTV-720p');
Quality.HDTV1080P = new Quality(5, 'HDTV-1080p');
Quality.RAWHD = new Quality(6, 'Raw-HD');
Quality.WEBDL720P = new Quality(7, 'WEBDL-720p');
Quality.BLURAY720P = new Quality(8, 'Bluray-720p');
Quality.WEBDL1080P = new Quality(9, 'WEBDL-1080p');
Quality.BLURAY1080P = new Quality(10, 'Bluray-1080p');

Quality.all = function() {
    return [
        Quality.SDTV,
        Quality.WEBDL480P,
        Quality.DVD,
        Quality.HDTV720P,
        Quality.HDTV1080P,
        Quality.RAWHD,
        Quality.WEBDL720P,
        Quality.BLURAY720P,
        Quality.WEBDL1080P,
        Quality.BLURAY1080P
    ]
}

Quality.findById = function(id) {
    for (var i in Quality.all()) {
        var candidate = Quality.all()[i];
        if (candidate.id === id) {
            return candidate;
        }
    }
}

Quality.prototype.eq = function(quality) {
    return this.id == quality.id;
}
