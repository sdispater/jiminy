Package.describe({
  summary: "A meteor library for guessing information based on a filename",
  version: "0.1.0"
});

Npm.depends({
    'xregexp': 'https://github.com/slevithan/xregexp/tarball/2650989f9a0e9ccea088e0ad6a48c088075ff0ae'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.3.1');
  api.use('underscore');

  api.addFiles("guesser.js", 'server');
  api.addFiles("qualities.js", ['client', 'server']);
  api.export('Guesser', 'server');
  api.export('Quality', ['server', 'client']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.addFiles('tests.js', 'server');
  api.export('Guesser', 'server');
});
