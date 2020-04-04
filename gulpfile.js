//===
// IMPORTS
//===
const { series, parallel, src, dest, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const exec = require('gulp-exec');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');

//===
// VARIABLES
//===
const SRC_PATH = 'src';
const DEST_PATH = 'dist';
const REQUIRE_JS = [
 'node_modules/vue/dist/vue.min.js'
];
const DIST_JS = 'glosa.min.js';

//===
// TASKS
//===

// Static server with reload
function initBrowserSync(cb) {
    browserSync.init({
        server: {
            baseDir: "./" + DEST_PATH
        }
    });
    return cb;
}

// Delete dist folder
function cleanOld(cb) {
    return src('.')
        .pipe(exec('rm -rf dist'))
        .pipe(exec('mkdir dist'));
}

// HTML min
function html(cb) {
    return src(SRC_PATH + '/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(DEST_PATH))
        .pipe(browserSync.stream()) ;
}

// JS concat + sourcemaps + babel + min
function js(cb) {
    return src(REQUIRE_JS.concat([SRC_PATH + '/js/*.js']))
        .pipe(sourcemaps.init())
        .pipe(concat(DIST_JS))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(DEST_PATH + '/js/'))
        .pipe(browserSync.stream()) ;
}

// Compile SASS + sourcemaps
function sassCompile(cb) {
    return src([SRC_PATH + '/sass/desktop.sass', SRC_PATH + '/sass/mobile.sass'])
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(DEST_PATH + '/css/'))
        .pipe(browserSync.stream()) ;
}

//===
// Commands
//===

const build = series(cleanOld, parallel(html, js, sassCompile));

// gulp dev
exports.dev = function () {
    watch(SRC_PATH + '/*.html', html);
    watch(SRC_PATH + '/js/*.js', js);
    watch([SRC_PATH + '/sass/desktop.sass', SRC_PATH + '/sass/mobile.sass'], sassCompile);
    initBrowserSync();
}

// gulp
exports.default = build;
