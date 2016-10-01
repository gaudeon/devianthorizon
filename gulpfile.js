var GULP       = require('gulp'),
    CLEAN      = require('gulp-clean'),
    GZIP       = require('gulp-gzip'),
    NODEMON    = require('gulp-nodemon'),
    SASS       = require('gulp-sass'),
    SOURCEMAPS = require('gulp-sourcemaps'),
    TAR        = require('gulp-tar'),
    TS         = require('gulp-typescript'),
    TSLINT     = require('gulp-tslint');

var TS_PROJECT = TS.createProject('./server/tsconfig.json');

// *** clean the build directory
GULP.task('clean-files', function() {
    return GULP.src('build/')
        .pipe(CLEAN());
});

// *** typescript linter
GULP.task('tslint', function () {
    return GULP.src(['server/**/*.ts','!server/**/*.d.ts'])
        .pipe(TSLINT({
            formatter: "verbose",
            configuration: "server/tslint.json"
        }))
        .pipe(TSLINT.report());
});

// *** copy files to build
GULP.task('copy-bin-files', ['clean-files'], function() {
    return GULP.src('bin/**/*')
        .pipe(GULP.dest('build/bin/'));
});

GULP.task('copy-client-public-files', ['clean-files'], function() {
    return GULP.src('client/public/**/*')
        .pipe(GULP.dest('build/client/public/'));
});

GULP.task('copy-bower-jquery', ['clean-files'], function() {
    return GULP.src('bower_components/jquery/dist/jquery.min.js')
        .pipe(GULP.dest('build/client/public/bower_components/js'));
});

GULP.task('copy-bower-lodash', ['clean-files'], function() {
    return GULP.src('bower_components/lodash/dist/lodash.min.js')
        .pipe(GULP.dest('build/client/public/bower_components/js'));
});

GULP.task('copy-bower-socketio', ['clean-files'], function() {
    return GULP.src('bower_components/socket.io-client/socket.io.js')
        .pipe(GULP.dest('build/client/public/bower_components/js'));
});

GULP.task('copy-bower-bootstrap', ['clean-files'], function() {
    return GULP.src('bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js')
        .pipe(GULP.dest('build/client/public/bower_components/js'));
});

GULP.task('copy-bower-webcomponentsjs', ['clean-files'], function() {
    return GULP.src('bower_components/webcomponentsjs/webcomponents.min.js')
        .pipe(GULP.dest('build/client/public/bower_components/js'));
});

GULP.task('copy-bower-polymer', ['clean-files'], function() {
    return GULP.src('bower_components/polymer/*.html')
        .pipe(GULP.dest('build/client/public/bower_components/polymer'));
});

GULP.task('copy-bower-iron-pages', ['clean-files'], function() {
    return GULP.src('bower_components/iron-pages/*.html')
        .pipe(GULP.dest('build/client/public/bower_components/iron-pages'));
});

GULP.task('copy-bower-paper-toast', ['clean-files'], function() {
    return GULP.src('bower_components/paper-toast/*.html')
        .pipe(GULP.dest('build/client/public/bower_components/paper-toast'));
});

GULP.task('copy-bower-iron-ajax', ['clean-files'], function() {
    return GULP.src('bower_components/iron-ajax/*.html')
        .pipe(GULP.dest('build/client/public/bower_components/iron-ajax'));
});

GULP.task('copy-bower-iron-resizable-behavior', ['clean-files'], function() {
    return GULP.src('bower_components/iron-resizable-behavior/*.html')
        .pipe(GULP.dest('build/client/public/bower_components/iron-resizable-behavior'));
});

GULP.task('copy-bower-iron-selector', ['clean-files'], function() {
    return GULP.src('bower_components/iron-selector/*.html')
        .pipe(GULP.dest('build/client/public/bower_components/iron-selector'));
});

GULP.task('copy-bower-iron-a11y-announcer', ['clean-files'], function() {
    return GULP.src('bower_components/iron-a11y-announcer/*.html')
        .pipe(GULP.dest('build/client/public/bower_components/iron-a11y-announcer'));
});

GULP.task('copy-bower-iron-overlay-behavior', ['clean-files'], function() {
    return GULP.src('bower_components/iron-overlay-behavior/*.html')
        .pipe(GULP.dest('build/client/public/bower_components/iron-overlay-behavior'));
});

GULP.task('copy-bower-promise-polyfill', ['clean-files'], function() {
    return GULP.src(['bower_components/promise-polyfill/*.html','bower_components/promise-polyfill/*.js'])
        .pipe(GULP.dest('build/client/public/bower_components/promise-polyfill'));
});

GULP.task('copy-bower-iron-fit-behavior', ['clean-files'], function() {
    return GULP.src('bower_components/iron-fit-behavior/*.html')
        .pipe(GULP.dest('build/client/public/bower_components/iron-fit-behavior'));
});

GULP.task('copy-bower-iron-a11y-keys-behavior', ['clean-files'], function() {
    return GULP.src('bower_components/iron-a11y-keys-behavior/*.html')
        .pipe(GULP.dest('build/client/public/bower_components/iron-a11y-keys-behavior'));
});

GULP.task('copy-bower-components', [
    'copy-bower-jquery',
    'copy-bower-lodash',
    'copy-bower-socketio',
    'copy-bower-bootstrap',
    'copy-bower-webcomponentsjs',
    'copy-bower-polymer',
    'copy-bower-iron-pages',
    'copy-bower-paper-toast',
    'copy-bower-iron-ajax',
    'copy-bower-iron-resizable-behavior',
    'copy-bower-iron-selector',
    'copy-bower-iron-a11y-announcer',
    'copy-bower-iron-overlay-behavior',
    'copy-bower-promise-polyfill',
    'copy-bower-iron-fit-behavior',
    'copy-bower-iron-a11y-keys-behavior'
], function() {});

// *** transpile typescript
GULP.task('transpile-server-files', ['clean-files', 'tslint'], function() {
    var tsResult = TS_PROJECT.src()
        .pipe(TS(TS_PROJECT));

    return tsResult.js.pipe(GULP.dest('build/server'));

});

// *** compile sass
GULP.task('client-sass', ['clean-files'], function () {
 return GULP.src('client/sass/**/*.scss')
  .pipe(SOURCEMAPS.init())
  .pipe(SASS({ outputStyle: 'compressed' }).on('error', SASS.logError))
  .pipe(SOURCEMAPS.write())
  .pipe(GULP.dest('build/client/public/css'));
});

// *** build the app
GULP.task('build', [
        'copy-bin-files',
        'copy-client-public-files',
        'copy-bower-components',
        'transpile-server-files', 
        'client-sass'
    ], function() {}
);

// *** nodemon
GULP.task('serve', [ 'build' ], 
    function() {
        return NODEMON({
            script: 'build/bin/server.js',
            ext: 'js html',
            env: { 'NODE_ENV': 'development' }
        });
    }
);

// *** watcher
GULP.task('watch', ['serve'], function() {
    GULP.watch('server/**/*.ts', ['transpile-server-files']);
    GULP.watch('client/sass/**/*.scss', ['client-sass']);
});

GULP.task('default', ['watch'], function() {});

// *** dist tasks
GULP.task('clean-dist-files', function() {
    return GULP.src('dist/')
        .pipe(CLEAN());
});

GULP.task('copy-package-files', ['clean-files', 'clean-dist-files'], function() {
    return GULP.src(['README.md', 'package.json'])
        .pipe(GULP.dest('build/'));
});

GULP.task('dist', ['build', 'copy-package-files'], function () {
    return GULP.src('build/**/*')
        .pipe(TAR('devianthorizon.tar'))
        .pipe(GZIP())
        .pipe(GULP.dest('dist'));
});
