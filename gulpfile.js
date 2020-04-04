const { series, parallel, src, dest, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');

const SRC_PATH = 'src';
const DEST_PATH = 'dist';

// Static server
function initBrowserSync(cb) {
    browserSync.init({
        server: {
            baseDir: "./" + DEST_PATH
        }
    });
    return cb;
}

function cleanOld(cb) {
    return src(DEST_PATH)
        .pipe(clean());
}

function html(cb) {
    return src(SRC_PATH + '/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(DEST_PATH))
        .pipe(browserSync.stream()) ;
}

function js(cb) {
    return src(SRC_PATH + '/js/*.js')
        .pipe(concat('glosa.min.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(dest(DEST_PATH + '/js/'))
        .pipe(browserSync.stream()) ;
}

function sassCompile(cb) {
    return src([SRC_PATH + '/sass/desktop.sass', SRC_PATH + '/sass/mobile.sass'])
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(dest(DEST_PATH + '/css/'))
        .pipe(browserSync.stream()) ;
}

// Tasks
const build = series(cleanOld, parallel(html, js, sassCompile));

exports.dev = function () {
    watch(SRC_PATH + '/*.html', html);
    watch(SRC_PATH + '/js/*.js', js);
    watch([SRC_PATH + '/sass/desktop.sass', SRC_PATH + '/sass/mobile.sass'], sassCompile);
    initBrowserSync();
}

exports.default = build;
