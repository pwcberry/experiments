var gulp = require('gulp'),
    server = require('gulp-server-livereload'),
    shellActions = require('./shell-actions');


gulp.task('serve', function () {
    gulp.src('./dist')
        .pipe(server({
            /*livereload: true,*/
            directoryListing: false,
            open: true,
            port: 12000
        }));
});

gulp.task('make', function () {
    shellActions([
        ['git branch -D gh-pages', 'Removing branch "gh-pages"...'],
        ['git branch gh-pages', 'Adding branch "gh-pages"...'],
        ['git rebase master gh-pages', 'Merging changes into "gh-pages"...'],
        ['rm *.*', 'Removing unnecessary files and folders...'],
        ['cp -r dist/* .', 'Copying application files into place...'],
        ['rm -rf dist', 'Removing "dist" folder...'],
        ['git add --all .', 'Adding changes to repo...'],
        ['git commit -m "Pages Made"', 'Committing to repo...']
    ]);
});

gulp.task('default', ['serve']);