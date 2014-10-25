Package.describe({
  summary: "A meteor library to use SABnzbd API.",
  version: "0.1.0"
});

Npm.depends({
    'sabnzbd': '0.2.1'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.3.1');

  api.addFiles("sabnzbd.js", 'server');
  api.export('SABnzbd', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.addFiles('tests.js', 'server');
});
