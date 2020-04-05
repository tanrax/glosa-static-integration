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
const DIST_JS = 'glosa.min.js';
const DIST_JS_VENDORS = `${DEST_PATH}/js/vendors/`;
const VENDOR_JS = [
    "node_modules/vue/dist/vue.min.js",
    "node_modules/axios/dist/axios.min.js",
    "node_modules/ramda/dist/ramda.min.js"
];


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

// IMGs
function img(cb) {
    return src(SRC_PATH + '/img/**/*')
        .pipe(dest(DEST_PATH + '/img/'))
        .pipe(browserSync.stream()) ;
}



// JS concat + sourcemaps + babel + min
function js(cb) {
    return src([SRC_PATH + '/js/*.js'])
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

// JS vendors
function jsVendors(cb) {
    const tasks = VENDOR_JS.map(vendor => {
        return (taskDone) => {
            return src('.')
                .pipe(exec(`mkdir -p ${DIST_JS_VENDORS}`))
                .pipe(exec(`cp ${vendor} ${DEST_PATH}/js/vendors/`));
            taskDone();

        };
    });

    return series(...tasks, (seriesDone) => {
        seriesDone();
        cb();
    })();
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

const build = series(cleanOld, parallel(html, img, js, jsVendors, sassCompile));

// gulp dev
exports.dev = function () {
    build();
    watch(SRC_PATH + '/*.html', html);
    watch(SRC_PATH + '/**/*', img);
    watch(SRC_PATH + '/js/*.js', js);
    watch([SRC_PATH + '/sass/*.sass', SRC_PATH + '/sass/**/*.sass'], sassCompile);
    initBrowserSync();
}

// gulp
exports.default = build;
