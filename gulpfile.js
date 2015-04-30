var gulp = require('gulp'),
    server = require('gulp-server-livereload'),
    shellActions = require('./shell-actions'),
    siphon = require('./lib/siphon.js');


gulp.task('serve', function () {
    gulp.src('./dist')
        .pipe(server({
            /*livereload: true,*/
            directoryListing: false,
            open: true,
            port: 12000
        }));
});

gulp.task('javascript', function() {
    gulp.src('./src/js/**/*.js')
        .pipe(gulp.dest('./script'));
});

gulp.task('siphon', function () {
   gulp.src('C:\\TFS_Data\\ringtail-siphon-*.json')
       .pipe(siphon())
       .pipe(gulp.dest('./data'));
});

gulp.task('make-pages', function () {
    shellActions([
        ['git branch -D gh-pages', 'Removing branch "gh-pages"...'],
        ['git branch gh-pages', 'Adding branch "gh-pages"...'],
        ['git rebase master gh-pages', 'Merging changes into "gh-pages"...'],
        ['rm *.*', 'Removing unnecessary files and folders...'],
        ['cp -r dist/* .', 'Copying application files into place...'],
        ['rm -rf dist', 'Removing "dist" folder...'],
        ['git add --all .', 'Adding changes to repo...'],
        ['git commit -m "Pages Made"', 'Committing to repo...'],
        ['git checkout master', 'Returning to "master" branch...']
    ]);
});

gulp.task('save-pages', function() {
    shellActions([
        ['git checkout gh-pages', 'Checking out "gh-pages"...'],
        ['git fetch origin gh-pages', 'Fetching "gh-pages" from remote...'],
        ['git merge -s ours origin/gh-pages', 'Merging our changes...'],
        ['git push origin gh-pages', 'Saving "gh-pages" to remote...'],
        ['git checkout master', 'Returning to "master" branch...']
    ])
});


gulp.task('default', ['serve']);