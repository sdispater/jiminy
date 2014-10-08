/**
 * A meteor library for communicating with trakt.tv
 *
 * @author Sébastien Eustace <sebastien.eustace@gmail.com>
 */

(function() {
    var Future = Npm.require('fibers/future');
    var NonEmptyString = Match.Where(function(x) {
        check(x, String);
        return x.length > 0;
    });
    var PositiveInt = Match.Where(function(x) {
        check(x, Number);
        return parseInt(x) > 0;
    });

    // Announcing the different methods available to the client
    Meteor.methods({
        "traktFindTvShow": function(name, seasons) {
            check(name, NonEmptyString);

            var e;
            if ((e = Meteor.Trakt().checkFilterFunction()) != true) {
                return e;
            }

            var future = new Future();
            var options = {query: name, seasons: 'seasons', limit: 30};
            Meteor.Trakt().trakt.request('search', 'shows', options, function(err, tvShows) {
                if (err) {
                    future.return(new Meteor.Error(4104, err));
                } else {
                    console.log(tvShows);
                    future.return(tvShows);
                }
            });

            try {
                return future.wait();
            } catch (err) {
                console.log(err);

                return [];
            }
        }
    });
})();
