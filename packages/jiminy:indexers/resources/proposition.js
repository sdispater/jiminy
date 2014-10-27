var moment = Npm.require('moment');

Proposition = function(id, implementation, episode, title, link, date) {
    this.id = id;
    this.episode = episode;
    this.title = title;
    this.link = link;
    this.date = date ? moment(date) : null;
    this.implementation = implementation;
}

Proposition.prototype.toObject = function() {
    return {
        id: this.id,
        episode: this.episode,
        title: this.title,
        link: this.link,
        date: this.date,
        implementation: this.implementation
    }
}
