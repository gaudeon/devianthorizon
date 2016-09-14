var GULP       = require('gulp'),
    CLEAN      = require('gulp-clean'),
    NODEMON    = require('gulp-nodemon'),
    SASS       = require('gulp-sass'),
    SOURCEMAPS = require('gulp-sourcemaps'),
    TS         = require('gulp-typescript'),
    TSLINT     = require('gulp-tslint');

var TS_PROJECT = TS.createProject('./server/tsconfig.json');

GULP.task('clean-server-files', function() {
    return GULP.src('server/**/*.js')
        .pipe(CLEAN());
});

GULP.task('tslint', function () {
    return GULP.src(['server/**/*.ts','!server/**/*.d.ts'])
        .pipe(TSLINT({
            formatter: "verbose",
            configuration: "server/tslint.json"
        }))
        .pipe(TSLINT.report());
});

GULP.task('transpile-server-files', ['clean-server-files','tslint'], function() {
    var tsResult = TS_PROJECT.src()
        .pipe(TS(TS_PROJECT));

    return tsResult.js.pipe(GULP.dest('server'));

});

GULP.task('client-sass', function () {
 return GULP.src('client/sass/**/*.scss')
  .pipe(SOURCEMAPS.init())
  .pipe(SASS({ outputStyle: 'compressed' }).on('error', SASS.logError))
  .pipe(SOURCEMAPS.write())
  .pipe(GULP.dest('client/public/css'));
});

GULP.task('watch', function() {
    GULP.watch('server/**/*.ts', ['transpile-server-files']);
    GULP.watch('client/sass/**/*.scss', ['client-sass']);
});

GULP.task('default', ['transpile-server-files', 'client-sass', 'watch'], function() {
    return NODEMON({
        script: 'bin/server.js',
        ext: 'js html',
        env: { 'NODE_ENV': 'development' }
    });
});
