var gulp = require('gulp'),
    server = require('gulp-server-livereload');


gulp.task('serve', function () {
    gulp.src('./dist')
        .pipe(server({
            /*livereload: true,*/
            directoryListing: false,
            open: true,
            port: 12000
        }));
});

gulp.task('default', ['serve']);