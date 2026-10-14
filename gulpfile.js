import { src, dest, lastRun, watch, series, parallel } from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack-stream';
import wpConfig from './webpack.config.js';
import wpCompiler from 'webpack';
import { deleteAsync } from 'del';
import rename from 'gulp-rename';

const sass = gulpSass(dartSass);
const postCssPlugins = [
    autoprefixer(),
    cssnano({
        preset: [
            'default',
            { discardComments: { removeAll: true } }
        ]
    })
];

export async function clean() {
    await deleteAsync(['dist/**']);
}

export function html() {
    return src('./src/**/*.html', { since: lastRun(html) })
        .pipe(dest('./dist/'));
}

export function fonts() {
    return src('./src/fonts/**', { since: lastRun(fonts), encoding: false })
        .pipe(dest('./dist/fonts/'));
}

export function images() {
    return src('./src/images/**', { since: lastRun(images), encoding: false })
        .pipe(dest('./dist/images/'));
}

export function stylesCss() {
    return src('./src/css/**/*.css', { since: lastRun(stylesCss) })
        .pipe(plumber())
        .pipe(rename(function (path) { path.basename += '.min' }))
        .pipe(postcss(postCssPlugins))
        .pipe(dest('./dist/css/'));
};

export function stylesSass() {
    return src('./src/scss/style.scss', { since: lastRun(stylesSass) })
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(rename(function (path) { path.basename += '.min' }))
        .pipe(postcss(postCssPlugins))
        .pipe(dest('./dist/css/'));
};

export function scripts() {
    return src(['./src/js/main.js'], { since: lastRun(scripts) })
        .pipe(plumber())
        .pipe(webpack(wpConfig, wpCompiler))
        .pipe(dest('./dist/js/'));
};

export function vendorCss() {
    return src(['./src/vendorCss/*.css'])
        .pipe(dest('./dist/css/'));
};

export function vendorJs() {
    return src(['./src/vendorJs/*.js'])
        .pipe(dest('./dist/js/'));
};

export function watcher() {
    watch(['./src/scss/*.scss'], stylesSass);
    watch(['./src/css/*.css'], stylesCss);
    watch(['./src/js/*.js'], scripts);
    watch(['./src/fonts/*'], fonts);
    watch(['./src/images/*'], images);
    watch(['./src/vendorCss/*'], vendorCss);
    watch(['./src/vendorJs/*'], vendorJs);
};

const baseTask = series(
    clean,
    parallel(html, stylesSass, stylesCss, scripts, fonts, images, vendorCss, vendorJs)
)

export const dev = series(baseTask, watcher);
export const build = baseTask;
