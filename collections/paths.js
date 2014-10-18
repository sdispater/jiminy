Paths = new Meteor.Collection('paths');

if (Meteor.isServer) {
    var fs = Npm.require('fs');

    Meteor.methods({
        searchPaths: function (query) {
            var dirs = [];
            if (fs.existsSync(query) && fs.statSync(query).isDirectory()) {
                files = fs.readdirSync(query);

                for (var i in files) {
                    var file = files[i];
                    var filePath = query + '/' + file;
                    console.log(filePath);
                    stat = fs.statSync(filePath)

                    if (stat.isDirectory()) {
                        dirs.push(filePath.replace('//', '/'));
                    }
                }
            }

            console.log(dirs);
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
