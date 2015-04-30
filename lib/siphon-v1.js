var gulpUtil = require('gulp-util');
var through = require('through2');
var Readable = require('stream').Readable;

module.exports = function () {
    var jsonStream = new Readable({objectMode: true});
    jsonStream._read = function jsonRead() {
        // Do nothing, let the `finish` handler take care of this
    };

    var inputs = [];

    function onData(file, enc, cb) {
        if (file.isNull()) return cb(null, file);
        if (file.isStream()) return cb(new gulpUtil.PluginError('siphon-expand', 'Streaming not supported'));

        if (file.path) {
            console.log(file.path);
            try {
                inputs.push({
                    path: file.path,
                    contents: JSON.parse(file.contents.toString('UTF-8'))
                });
            } catch (err) {
                //return cb(new gulpUtil.PluginError('siphon-expand', err, {fileName: file.path}));
                console.error(err);
            }
        }
        cb();
    }

    function genFiles(gulpStream, contents) {
        var checker = /browserlink|localhost/i, removeDc = /_dc=\d+_/;

        Object.keys(contents).filter(function (key) {
            return !checker.test(key);
        }).forEach(function (item) {
            var key = item.replace(removeDc, '');
            var path = key.split('-').join('/') + '.json';
            var outputFile = new gutil.File({
                path: path,
                contents: new Buffer(JSON.stringify(contents[key]))
            });

            gulpStream.push(outputFile);
            jsonStream.push(outputFile);
            jsonStream.push(null);
        });
    }

    function onEnd(cb) {
        var that = this;

        if (inputs.length === 0) {
            jsonStream.push(null);
            return cb();
        }

        inputs.forEach(function (file) {
            genFiles(that, file.contents);
        });

        cb();
    }

    var siphonExpand = through.obj(onData, onEnd);
    siphonExpand.jsonStream = jsonStream;
    return siphonExpand;
};


//var sourceFolder = 'C:\\TFS_Data';
//var destinationFolder = 'C:\\TFS_Data\\UITESTING\\Web8\\Tests\\Ringtail.Web.UI.Automation\\data';
/*
 function SiphonExpand(file, enc, cb) {
 var contents, that = this, checker = /browserlink|localhost/i, removeDc = '/_dc=\d+_/';

 if (file.isNull()) return cb(null, file);
 if (file.isStream()) return cb(new gulpUtil.PluginError('siphon-expand', 'Streaming not supported'));

 try {
 contents = JSON.parse(file.contents.toString('UTF-8'));
 console.log(typeof this.push);
 console.log(file.path);

 Object.keys(contents).filter(function (key) {
 return !checker.test(key);
 }).forEach(function (item) {
 var key = item.replace(removeDc, '')
 console.log(key);
 var path = '/' + key.split('_').join('/');
 var outputFile = new gutil.File({
 path: path,
 contents: new Buffer(JSON.stringify(contents[key]))
 });
 that.push(outputFile);
 });

 cb();

 } catch (err) {
 return cb(new gulpUtil.PluginError('siphon-expand', err, {fileName: file.path}));
 }
 }
 */


// https://github.com/gulpjs/gulp.git