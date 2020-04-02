const { series, parallel, src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sass = require('gulp-sass');

const SRC_PATH = 'src';
const DEST_PATH = 'dist';

function js(cb) {
    return src(SRC_PATH + '/js/*.js')
        .pipe(concat('glosa.min.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(dest(DEST_PATH + '/js/'));
}

function sassCompile(cb) {
    return src([SRC_PATH + '/sass/desktop.sass', SRC_PATH + '/sass/mobile.sass'])
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(dest(DEST_PATH + '/css/'));
}

//exports.build = build;
exports.default = parallel(js, sassCompile);
