var gulpUtil = require('gulp-util');
var through = require('through2');

module.exports = function () {
    function SiphonExpand(file, enc, cb) {
        var contents, that = this, checker = /browserlink|localhost/i, removeDc = /_dc=\d+_/;

        if (file.isNull()) return cb(null, file);
        if (file.isStream()) return cb(new gulpUtil.PluginError('siphon-expand', 'Streaming not supported'));

        try {
            contents = JSON.parse(file.contents.toString('UTF-8'));
            console.log(file.path);

            Object.keys(contents).filter(function (key) {
                return !checker.test(key);
            }).forEach(function (item) {
                var key = item.replace(removeDc, '');
                var path = key.split('-').join('/') + '.json';
                var outputFile = new gutil.File({
                    path: path,
                    contents: new Buffer(JSON.stringify(contents[key], null, 4))
                });
                that.push(outputFile);
            });

            cb();

        } catch (err) {
            return cb(new gulpUtil.PluginError('siphon-expand', err, {fileName: file.path}));
        }
    }

    return through.obj(SiphonExpand);
};
