const gulp = require('gulp');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const baseDir = 'public/css/';

gulp.src([
    baseDir + 'bootstrap.css',
    baseDir +  'styles.css'
])

.pipe(concat('styles.min.css'))
.pipe(cssnano())
.pipe(gulp.dest(baseDir));