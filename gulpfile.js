var gulp = require('gulp'),
    server = require('gulp-server-livereload'),
    makePages = require('./make-pages');


gulp.task('serve', function () {
    gulp.src('./dist')
        .pipe(server({
            /*livereload: true,*/
            directoryListing: false,
            open: true,
            port: 12000
        }));
});

gulp.task('make', makePages);

gulp.task('default', ['serve']);