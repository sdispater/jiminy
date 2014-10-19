Paths = new Meteor.Collection('paths');

if (Meteor.isServer) {
    var fs = Npm.require('fs');
    var path = Npm.require('path');

    Meteor.methods({
        searchPaths: function (query) {
            var basename;
            var dirs = [];
            var baseDir = path.dirname(query);
            if (fs.existsSync(baseDir)) {
                if (fs.existsSync(query) && fs.statSync(query).isDirectory()) {
                    baseDir = query;
                    basename = '';
                } else {
                    basename = path.basename(query);
                }
                files = fs.readdirSync(baseDir);

                for (var i in files) {
                    var file = files[i];
                    var filePath = path.join(baseDir, file);
                    if (file.indexOf('.') == 0) {
                        continue;
                    }

                    stat = fs.statSync(filePath)

                    if (stat.isDirectory()) {
                        if (basename.length) {
                            if (file.substring(0, basename.length) == basename) {
                                dirs.push(path.normalize(filePath));
                            }
                        } else {
                            dirs.push(path.normalize(filePath));
                        }
                    }
                }
            }

            return dirs;
        },
        addFolder: function(folder) {
            if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
                throw new Meteor.Error(500, 'Invalid folder');
            }

            if (Paths.findOne({path: folder})) {
                throw new Meteor.Error(500, 'Path has already been added');
            }

            return Paths.insert({path: folder});
        }
    });
}
