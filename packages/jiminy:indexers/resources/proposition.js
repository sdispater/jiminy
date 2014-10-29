var moment = Npm.require('moment');

Proposition = function(id, implementation, episode, options) {
    this.id = id;
    this.episode = episode;
    this.title = options.title;
    this.link = options.link;
    this.date = options.date ? moment(options.date).toDate() : null;
    this.size = options.size;
    this.url = options.url;
    this.implementation = implementation;
}

Proposition.prototype.toObject = function() {
    return {
        id: this.id,
        episode: this.episode,
        title: this.title,
        link: this.link,
        date: this.date,
        size: this.size,
        url: this.url,
        implementation: this.implementation
    }
}
