var GULP    = require('gulp'),
    TS      = require('gulp-typescript'),
    TSLINT  = require('gulp-tslint'),
    CLEAN   = require('gulp-clean'),
    NODEMON = require('gulp-nodemon');

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

GULP.task('default', ['transpile-server-files'], function() {
    return NODEMON({
        script: 'bin/server.js',
        ext: 'js html',
        env: { 'NODE_ENV': 'development' }
    });
});
