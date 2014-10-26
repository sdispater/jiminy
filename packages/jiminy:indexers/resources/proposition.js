var moment = Npm.require('moment');

Proposition = function(episode, title, link, date, type) {
    this.id = this.generateId();
    this.episode = episode;
    this.title = title;
    this.link = link;
    this.date = date ? moment(date) : null;
    this.type = type;
}

Proposition.prototype.toObject = function() {
    return {
        id: this.id,
        episode: this.episode,
        title: this.title,
        link: this.link,
        date: this.date,
        type: this.type
    }
}

Proposition.prototype.generateId = function() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
