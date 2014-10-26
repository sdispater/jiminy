Package.describe({
  summary: "A meteor library for communicating with trakt.tv",
  version: "0.1.0"
});

Npm.depends({trakt: "https://github.com/sdispater/node-trakt/tarball/798df7ac0694ca33766f583a8daa5bc1937f9b24"});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.3.1');

  api.use(["check"], "server");

  api.addFiles('trakt.js');
  api.addFiles("trakt-server.js", 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('sdispater:trakt');
  api.addFiles('trakt-tests.js');
});
