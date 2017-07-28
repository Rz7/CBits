var gulp = require('gulp'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync').create();

gulp.task('watch', function() {

    browserSync.init({
        notify: false,
        server: {
            baseDir: "docs"
        }
    });

    watch('docs/index.html', function() {
        browserSync.reload();
    });

    watch('docs/styles/**/*.css', function () {
        gulp.start('cssInject');
    });

    watch('docs/scripts/**/*.js', function () {
        gulp.start('scriptsRefresh');
    });
});

gulp.task('cssInject', function() {
    return gulp.src('docs/styles/styles.css').pipe(browserSync.stream());
});

gulp.task('scriptsRefresh', function() {
    browserSync.reload();
});