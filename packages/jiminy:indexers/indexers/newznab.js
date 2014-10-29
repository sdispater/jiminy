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

Newznab.prototype.searchEpisode = function(episode, show, maxAge, blacklist) {
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
        items.push(this.processItem(response.body.rss.channel[0].item[i], episode));
    }

    if (blacklist && blacklist.length) {
        return this.applyBlacklist(items, blacklist);
    }
    return items;
}

Newznab.prototype.searchRelease = function(releaseId, episode, show, maxAge, blacklist) {
    var propositions = this.searchEpisode(episode, show, maxAge, blacklist);

    for (var i in propositions) {
        var proposition = propositions[i];
        if (proposition.id == releaseId) {
            return proposition
        }
    }

    return null;
}

Newznab.prototype.test = function() {
    this.requester.request(this.url, {t: 'search', q: 'something', apikey: this.apiKey});

    return true;
};

Newznab.prototype.processItem = function(entry, episode) {
    var title, date, link, externalId, options;

    title = entry.title[0];
    link = entry.link[0];
    date = entry.pubDate[0];
    externalId = entry.guid[0]._.replace(/.*\/details\/(.*)/, '$1');

    options = {
        title: title,
        link: link,
        date: date,
        url: entry.guid[0]._
    }

    for (var i in entry['newznab:attr']) {
        var attr = entry['newznab:attr'][i].$;
        if (attr.name == 'size') {
            options['size'] = parseInt(attr.value);
        }
    }

    return new Proposition(externalId, 'newznab', episode, options);
};

Newznab.prototype.applyBlacklist = function(propositions, blacklist) {
    return propositions.filter(function(proposition) {
        for (var i in blacklist) {
            var blacklisted = blacklist[i];
            if (proposition.implementation == blacklisted.implementation && proposition.id == blacklisted.id) {
                return false;
            }
        }

        return true;
    });
};
