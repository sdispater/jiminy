var moment = Npm.require('moment');

Item = function(title, link, date) {
    this.title = title;
    this.link = link;
    this.date = date ? moment(date) : null;
}
