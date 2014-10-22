Package.describe({
  summary: "A meteor library for communicating with newznab compliant APIs",
  version: "0.1.0"
});

Npm.depends({
  request: '2.45.0',
  xml2js: '0.4.4'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.3.1');

  api.use(["check"], "server");

  api.addFiles("newznab-server.js", 'server');
  api.export('Newznab', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('newznab-server');
  api.addFiles('newznab-tests.js');
});
