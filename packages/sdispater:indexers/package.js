Package.describe({
  summary: "A meteor library for communicating with newznab compliant APIs",
  version: "0.1.0"
});

Npm.depends({
  request: '2.45.0',
  xml2js: '0.4.4',
  moment: '2.8.3'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.3.1');

  api.addFiles('indexers/implementations.js', ['client', 'server']);
  api.addFiles('indexers/newznab.js', ['client', 'server']);
  api.addFiles('requesters/newznab.js', 'server');
  api.addFiles('resources/item.js', 'server');
  api.addFiles("indexer.js", 'server');
  api.export('Indexer', 'server');
  api.export('IndexersImplementations', ['server', 'client']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('newznab-server');
  api.addFiles('tests.js');
});
