'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var cp = require('child_process');
var Stream = require('stream');
var del = require('del');

var files = {
    configurationMicrorestjs: 'configuration.json',
    configurationMicrorestjsBackup: 'configuration.json.orig',
    launcherMicrorestjs: 'Launcher.js'
};

var paths = {
    rootMicrorestjs: '../../../',
    configurationMicrorestjs: '../../../' + files.configurationMicrorestjs,
    configurationMicrorestjsBackup: '../../../' + files.configurationMicrorestjsBackup
};

function server() {
    var stream = new Stream.PassThrough({
        objectMode: true
    });

    stream._transform = function (file, unused, cb) {
        if (file.isNull()) {
            stream.push(file);
            return cb();
        }

        cp.spawn('node', [files.launcherMicrorestjs], {
            cwd: paths.rootMicrorestjs,
            stdio: 'inherit'
        });

        setTimeout(cb, 6000);
    };

    return stream;
}

gulp.task('doConfigurationBackup', function () {
    return gulp.src(paths.configurationMicrorestjs)
        .pipe(rename(files.configurationMicrorestjsBackup))
        .pipe(gulp.dest(paths.rootMicrorestjs));
});

gulp.task('1', ['doConfigurationBackup'], function () {
    return gulp.src('./configuration_instance1.json')
        .pipe(rename(files.configurationMicrorestjs))
        .pipe(gulp.dest(paths.rootMicrorestjs))
        .pipe(server());
});

gulp.task('2', ['1'], function () {
    return gulp.src('./configuration_instance2.json')
        .pipe(rename(files.configurationMicrorestjs))
        .pipe(gulp.dest(paths.rootMicrorestjs))
        .pipe(server());
});

gulp.task('3', ['2'], function () {
    return gulp.src('./configuration_instance3.json')
        .pipe(rename(files.configurationMicrorestjs))
        .pipe(gulp.dest(paths.rootMicrorestjs))
        .pipe(server());
});

gulp.task('4', ['3'], function () {
    return gulp.src('./configuration_instance4.json')
        .pipe(rename(files.configurationMicrorestjs))
        .pipe(gulp.dest(paths.rootMicrorestjs))
        .pipe(server());
});

gulp.task('undoConfigurationBackup', ['4'], function () {
    return gulp.src(paths.configurationMicrorestjsBackup)
        .pipe(rename(files.configurationMicrorestjs))
        .pipe(gulp.dest(paths.rootMicrorestjs));
});

gulp.task('deleteConfigurationBackup', ['undoConfigurationBackup'], function() {
    return del([paths.configurationMicrorestjsBackup], {
        force: true
    });
});

gulp.task('deployAll', ['deleteConfigurationBackup']);

gulp.task('default', ['deployAll']);
