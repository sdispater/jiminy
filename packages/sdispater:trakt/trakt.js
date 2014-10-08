/**
 * A meteor library for communicating with trakt.tv
 *
 * @author Sébastien Eustace <sebastien.eustace@gmail.com>
 */

(function() {
    /**
     * @param {Object} [options]
     * @constructor
     */
    function Trakt(options) {
        this.init(options);
    }

    /**
     * Constructor init function
     * @param {Object} [options]
     */
    Trakt.prototype.init = function(options) {
        var self = this;

        // Execution filter
        this.filter = null;

        // Handle settings
        this.collectionName = options && options.collectionName || 'trakt';

        // Create collection
        this.collection = new Meteor.Collection(this.collectionName, {_preventAutopublish: true});

        if (Meteor.isServer) {
            this.createTraktObject();

            Meteor.publish(this.collectionName, function() {
                return self.collection.find({name: 'configuration'}, {fields: {'options.apikey': 0}});
            });
        }

        if (Meteor.isClient) {
            this.workers = 0;
            this.workersDep = new Deps.Dependency;

            Meteor.subscribe(this.collectionName);
        }
    };

    Trakt.prototype.setExecutionFilter = function(filter) {
        if (typeof filter == 'function') {
            this.filter = filter;
        } else {
            throw new Meteor.Error(4116, 'Must be a function');
        }
    };

    /**
     * Set trakt module configuration settings
     * @param {Object} configuration
     * @throws Meteor.Error
     */
    Trakt.prototype.setConfiguration = function(configuration) {
        if (Meteor.isServer) {
            this.collection.insert({name: 'configuration', options: configuration});
            this.createTraktObject();
        } else {
            throw new Meteor.Error(4110, 'Not callable from client');
        }
    };

    /**
     * Check filter function
     * @returns {Boolean}
     */
    Trakt.prototype.checkFilterFunction = function() {
        if (this.filter && !this.filter()) {
            return new Meteor.Error(4117, 'Not matching filter');
        }

        return true;
    };

    /**
     * trakt.tv API Search Shows
     * @see https://trakt.tv/api-docs/search-shows
     * @param {String} name Show to find
     * @param {Boolean} seasons With optional seasons information
     * @param {APIdone} done Function called when we have a server result
     * @throws Meteor.Error
     */
    Trakt.prototype.findTvShow = function(name, seasons, done) {
        if (typeof done !== 'function') {
            throw new Meteor.Error(4111, 'Missing return function');
        }

        if (typeof name !== 'string' || name.length < 1) {
            throw new Meteor.Error(4112, 'Invalid parameter "name"');
        }

        var self = this; self.incWorkers();
        return Meteor.call("traktFindTvShow", name, seasons, function(error, result) {
            done(error, result);
            self.decWorkers();
        });
    };

    /**
     * trakt API call for getting tv show information
     * @param {Number} tvShowId Unique show id
     * @param {APIdone} done Function called when we have a server result
     * @throws Meteor.Error
     */
    Trakt.prototype.getSummary = function(tvShowId, done) {
        if (typeof done !== 'function') {
            throw new Meteor.Error(4111, 'Missing return function');
        }

        tvShowId = parseInt(tvShowId);
        if (tvShowId <= 0) {
            throw new Meteor.Error(4113, 'Invalid parameter "tvShowId"');
        }

        var self = this; self.incWorkers();
        return Meteor.call("traktGetSummary", tvShowId, function(error, result) {
            done(error, result);
            self.decWorkers();
        });
    };

    /*
     * Client side functions
     */

    /**
     * Helper function to increase the number of workers
     * @private
     */
    Trakt.prototype.incWorkers = function() {
        this.setWorkers(this.getWorkers()+1);
    };

    /**
     * Helper function to decrease the number of workers
     * @private
     */
    Trakt.prototype.decWorkers = function() {
        this.setWorkers(this.getWorkers()-1);
    };

    /**
     * Reactive function for getting the current number of workers
     * @return {Integer}
     */
    Trakt.prototype.getWorkers = function() {
        if (this.workersDep) {
            this.workersDep.depend();
        }
        return this.workers;
    };

    /**
     * Reactive function for setting the current number of workers
     * @private
     * @param workers
     */
    Trakt.prototype.setWorkers = function(workers) {
        if (workers == this.workers) {
            return;
        }

        this.workers = workers;

        if (this.workersDep) {
            this.workersDep.changed();
        }
    };

    /*
     * Server side function from here
     */

    /**
     * Create the tvdb node module object.
     * @todo Needs to be cleaned up
     */
    Trakt.prototype.createTraktObject = function() {
        var configuration = this.collection.findOne({name: 'configuration'});
        if (configuration && configuration.options && configuration.options.apikey) {
            var trakt = Npm.require('trakt');

            this.trakt = new trakt();
            this.trakt.config = {api_key: configuration.options.apikey};
        }
    };

    var instance = null;

    /**
     * Singleton
     * @see Trakt.prototype.init
     * @param {Object} [options]
     * @return {Trakt}
     * @constructor
     */
    Meteor.Trakt = function(options) {
        if (!instance) {
            instance = new Trakt(options);
        }
        return instance;
    };
})();
