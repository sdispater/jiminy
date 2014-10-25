var XRegExp = Npm.require('xregexp');

var TitleRegexes = [
    // Standard
    new XRegExp('\n\
        ^((?<title>.+?)[. _-]+)?                       # Show_Name and separator \n\
        s(?<season>\\d+)[. _-]*                        # S01 and optional separator \n\
        e(?<episode>\\d+)                              # E02 and separator \n\
        (([. _-]*e|-)                                  # linking e/- char \n\
        (?<episode_extra>(?!(1080|720|480)[pi])\\d+))* # additional E03/etc \n\
        [. _-]*((?P<extra_info>.+?)                    # Source_Quality_Etc- \n\
        (([. _-])?(WEB)?                               # Make sure this is really the release group \n\
        -(?<release_group>[^- ]+))?)?$                 # Group', 'ix')
]

Guesser = function() {
    this.init();
}

Guesser.prototype.init = function () {

}

Guesser.prototype.guess = function(filename) {
    for (var i in TitleRegexes) {
        var regex = TitleRegexes[i];
        var match = XRegExp.exec(filename, regex);
        if (match) {
            return new Guess(match);
        }
    }
}


var sourceRegex = new XRegExp('\\b(?: \n\
    (?<bluray>BluRay|Blu-Ray)| \n\
    (?<webdl>WEB[-_. ]DL|WEBDL|WebRip)| \n\
    (?<hdtv>HDTV)| \n\
    (?<bdrip>BDRiP)| \n\
    (?<brrip>BRRip)| \n\
    (?<dvd>DVD|DVDRip|NTSC|PAL|xvidvd)| \n\
    (?<dsr>WS[-_. ]DSR|DSR)| \n\
    (?<pdtv>PDTV)| \n\
    (?<sdtv>SDTV) \n\
)\\b', 'ix');

var rawHDRegex = new XRegExp('\\b(?<rawhd>TrollHD|RawHD|1080i[-_. ]HDTV)\\b', 'ix');
var properRegex = new XRegExp('\\b(?<proper>proper|repack)\\b', 'ix');
var versionRegex = new XRegExp('\\dv(?<version>\\d)\\b|\[v(?<version_extra>\\d)\]', 'ix');
var realRegex = new XRegExp('\\b(?<real>)real\b', 'ix');
var resolutionRegex = new XRegExp('\\b(?:(?<_480p>480p|640x480|848x480)|(?<_576p>576p)|(?<_720p>720p|1280x720)|(?<_1080p>1080p|1920x1080))\\b', 'ix');
var codecRegex = new XRegExp('\\b(?:(?<x264>x264)|(?<h264>h264)|(?<xvidhd>XvidHD)|(?<xvid>Xvid)|(?<divx>divx))\\b', 'ix');
var otherSourceRegex = new XRegExp('(?<hdtv>HD[-_. ]TV)|(?<sdtv>SD[-_. ]TV)', 'ix');
//var animeBlurayRegex = new XRegExp('bd(?:720|1080)|(?<=[-_. (\[])bd(?=[-_. )\]])', 'ix');
var highDefPdtvRegex = new XRegExp('hr[-_. ]ws', 'ix');

Guess = function(match) {
    _.extend(this, match);

    this.clean();
    this.guessQuality();
}

Guess.prototype.clean = function() {
    this.title = this.title ? this.title.replace(/[_.]/g, ' '): '';
    this.season = this.season ? parseInt(this.season) : 0;
    this.episode = this.episode ? parseInt(this.episode) : 0;
    this.normalizedInput = this.input.replace('_', ' ').trim().toLowerCase()
}

Guess.prototype.guessQuality = function() {
    var sourceMatch = XRegExp.exec(this.normalizedInput, sourceRegex);
    var resolution = this.parseResolution();
    var codecMatch = XRegExp.exec(this.normalizedInput, codecRegex);

    if (sourceMatch) {
        if (sourceMatch.bluray) {
            if (codecMatch.xvid || codecMatch.divx) {
                this.quality = Quality.DVD;
                return this;
            }

            if (resolution == '1080p') {
                this.quality = Quality.BLURAY1080P;
                return this;
            }

            if (resolution == '480p' || resolution == '576p') {
                this.quality = Quality.DVD;
                return this;
            }

            this.quality = Quality.BLURAY720P;
            return this;
        }

        if (sourceMatch.webdl) {
            if (resolution == '1080p') {
                this.quality = Quality.WEBDL1080P;
                return this;
            }

            if (resolution == '720p') {
                this.quality = Quality.WEBDL720P;
                return this;
            }

            if (this.normalizedInput.indexOf('[WEBDL]') >= 0) {
                this.quality = Quality.WEBDL720P;
                return this;
            }

            this.quality = Quality.WEBDL480P;
            return this;
        }

        if (sourceMatch.hdtv) {
            if (resolution == '1080p') {
                this.quality = Quality.HDTV1080P;
                return this;
            }

            if (resolution == '720p') {
                this.quality = Quality.HDTV720P;
                return this;
            }

            if (this.normalizedInput.indexOf('[HDTV]') >= 0) {
                this.quality = Quality.HDTV720P;
                return this;
            }

            this.quality = Quality.SDTV;
            return this;
        }

        if (sourceMatch.bdrip || sourceMatch.brrip) {
            if (resolution == '720p') {
                this.quality = Quality.BLURAY720P;
                return this;
            } else if (resolution == '1080p') {
                this.quality = Quality.BLURAY1080P;
                return this;
            } else {
                this.quality = Quality.DVD;
                return this;
            }
        }

        if (sourceMatch.dvd) {
            this.quality = Quality.DVD;
            return this;
        }

        if (sourceMatch.pdtv || sourceMatch.sdtv || sourceMatch.dsr) {
            if (XRegExp.exec(self.normalizedInput, highDefPdtvRegex)) {
                this.quality = Quality.HDTV720P;
                return this;
            }

            this.quality = Quality.SDTV;
            return this;
        }
    }

    // TODO: Anime Bluray matching

    if (resolution == '1080p') {
        this.quality = Quality.HDTV1080P;
        return this;
    }

    if (resolution == '720p') {
        this.quality = Quality.HDTV720P;
        return this;
    }

    if (resolution == '480p') {
        this.quality = Quality.SDTV;
        return this;
    }

    if (codecMatch && codecMatch.x264) {
        this.quality = Quality.SDTV;
        return this;
    }

    if (this.normalizedInput.indexOf('848x480') >= 0) {
        if (this.normalizedInput.indexOf('dvd') >= 0) {
            this.quality = Quality.DVD;
            return this;
        }

        this.quality = Quality.SDTV;
        return this;
    }

    if (this.normalizedInput.indexOf('1280x720') >= 0) {
        if (this.normalizedInput.indexOf('bluray') >= 0) {
            this.quality = Quality.BLURAY720P;
            return this;
        }

        this.quality = Quality.HDTV720P;
        return this;
    }

    if (this.normalizedInput.indexOf('1920x1080') >= 0) {
        if (this.normalizedInput.indexOf('bluray') >= 0) {
            this.quality = Quality.BLURAY1080P;
            return this;
        }

        this.quality = Quality.HDTV1080P;
        return this;
    }

    if (this.normalizedInput.indexOf('bluray1080p') >= 0) {
        this.quality = Quality.BLURAY1080P;
        return this;
    }

    if (this.normalizedInput.indexOf('bluray720p') >= 0) {
        this.quality = Quality.BLURAY720P;
        return this;
    }

    // TODO: Based on extensions

    this.quality = Quality.UNKNOWN;
    return this;
}

Guess.prototype.parseResolution = function() {
    var match = XRegExp.exec(this.normalizedInput, resolutionRegex);

    if (!match) {
        return 'unknown';
    }
    if (match._480p) {
        return '480p';
    }
    if (match._576p) {
        return '576p';
    }
    if (match._720p) {
        return '720p';
    }
    if (match._1080p) {
        return '1080p';
    }

    return 'unknown';
}
