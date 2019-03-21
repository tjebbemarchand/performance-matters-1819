const gulp = require('gulp');
const concat = require('gulp-concat');
const purgecss = require('gulp-purgecss');
const cssnano = require('gulp-cssnano');
const baseDir = 'public/css/';

gulp.src([
    baseDir + 'bootstrap.css',
    baseDir +  'styles.css'
])

.pipe(concat('styles.min.css'))
.pipe(purgecss({
    content: ["views/**/*.ejs"]
}))
.pipe(cssnano())
.pipe(gulp.dest(baseDir));