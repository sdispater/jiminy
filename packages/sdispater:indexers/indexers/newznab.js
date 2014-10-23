Newznab = function(settings) {
    this.init(settings);
}

Newznab.prototype.init = function(settings) {
    this.requester = new NewznabRequester();
    this.implementation = new IndexersImplementations().implementations['newznab'];

    for (var setting in this.implementation.settings) {
        if (settings[setting] == undefined) {
            throw new Error('Missing setting ' + setting)
        }
    }

    this.url = settings.url + 'api';
    this.apiKey = settings.api_key;
};

Newznab.prototype.searchEpisode = function(episode, show, maxAge) {
    if (!show.name && !show.tvrage_id) {
        throw new Error('One of "q" or "tvRageId" must be specified"')
    }
    var query = {
        t: 'tvsearch',
        apikey: this.apiKey,
        ep: episode.number,
        season: episode.season_number
    }

    if (maxAge) {
        query['maxage'] = maxAge;
    }

    if (show.tvrage_id) {
        query['rid'] = show.tvrage_id;
    } else {
        query['q'] = show.name;
    }

    var response = this.requester.request(this.url, query);
    var items = []
    if (!response.body.rss.channel[0].item) {
        return [];
    }

    for (var i in response.body.rss.channel[0].item) {
        items.push(this.processItem(response.body.rss.channel[0].item[i]));
    }

    return items;
}

Newznab.prototype.test = function() {
    this.requester.request(this.url, {t: 'search', q: 'something', apikey: this.apiKey});

    return true;
};

Newznab.prototype.processItem = function(entry) {
    var title, date, link;

    title = entry.title[0];
    link = entry.link[0];
    date = entry.pubDate[0];

    return new Item(title, link, date);
};
