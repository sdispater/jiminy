Package.describe({
  summary: "A meteor library to use Downloaders APIs.",
  version: "0.1.0"
});

Npm.depends({
    'sabnzbd': '0.2.1',
    'q': '1.0.1'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.3.1');

  // Templating
  api.use('templating', 'client');
  api.addFiles([
    'templates/settings_downloaders.html',
    'templates/settings_downloaders.js',
    'templates/settings_downloaders_item.html',
    'templates/settings_downloaders_item.js'
  ], 'client');

  // Collections
  api.addFiles('collections.js');
  api.export('Downloaders');
  api.export('Downloads');

  // Resources
  api.addFiles('resources/test.js');
  api.addFiles('resources/download_data.js');
  api.export('DownloadData', 'server');

  // Implementations
  api.addFiles('downloaders/implementations.js');
  api.addFiles('downloaders/sabnzbd.js');
  api.export('DownloadersImplementations', ['server', 'client']);

  // Downloader
  api.addFiles("downloader.js", 'server');
  api.export('Downloader', 'server');

  // Server
  api.addFiles('server.js', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.addFiles('tests.js', 'server');
});
