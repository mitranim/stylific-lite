'use strict'

/** **************************** Dependencies ********************************/

const $ = require('gulp-load-plugins')()
const bsync = require('browser-sync').create()
const del = require('del')
const gulp = require('gulp')
const marked = require('marked')
const pt = require('path')

/** ******************************* Globals **********************************/

const src = {
  libStyles: 'scss/**/*.scss',
  libStylesCore: 'scss/stylific-lite.scss',
  docStylesCore: 'docs/styles/docs.scss',
  docStyles: 'docs/styles/**/*.scss',
  docHtml: [
    'docs/html/**/*',
    'readme.md'
  ]
}

const dest = {
  dist: 'dist',
  docStyles: 'gh-pages/styles',
  docHtml: 'gh-pages',
  compiledStyle: 'dist/stylific-lite.css'
}

function reload (done) {
  bsync.reload()
  done()
}

/** ******************************** Tasks ***********************************/

/* ------------------------------ Lib Styles --------------------------------*/

gulp.task('lib:styles:clear', done => {
  del(dest.dist + '/*.css').then(() => void done())
})

gulp.task('lib:styles:compile', () => (
  gulp.src(src.libStylesCore)
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe(gulp.dest(dest.dist))
))

gulp.task('lib:styles:minify', () => (
  gulp.src(dest.compiledStyle)
    .pipe($.minifyCss({
      keepSpecialComments: 0,
      aggressiveMerging: false,
      advanced: false,
      compatibility: {properties: {colors: false}}
    }))
    .pipe($.rename('stylific-lite.min.css'))
    .pipe(gulp.dest(dest.dist))
))

gulp.task('lib:styles:build', gulp.series('lib:styles:clear', 'lib:styles:compile', 'lib:styles:minify'))

gulp.task('lib:styles:watch', () => {
  $.watch(src.libStyles, gulp.series('lib:styles:build'))
})

/* --------------------------------- HTML -----------------------------------*/

gulp.task('docs:html:clear', done => {
  del(dest.docHtml + '/**/*.html').then(() => void done())
})

gulp.task('docs:html:compile', () => (
  gulp.src(src.docHtml)
    .pipe($.plumber())
    .pipe($.statil({
      ignorePaths: ['readme.md'],
      pipeline: [
        (content, path) => {
          if (pt.extname(path) === '.md') return marked(content)
        }
      ]
    }))
    .pipe(gulp.dest(dest.docHtml))
))

gulp.task('docs:html:build', gulp.series('docs:html:clear', 'docs:html:compile'))

gulp.task('docs:html:watch', () => {
  $.watch(src.docHtml, gulp.series('docs:html:build', reload))
})

/* -------------------------------- Styles ----------------------------------*/

gulp.task('docs:styles:clear', done => {
  del(dest.docStyles).then(() => void done())
})

gulp.task('docs:styles:compile', () => (
  gulp.src(src.docStylesCore)
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe($.minifyCss({
      keepSpecialComments: 0,
      aggressiveMerging: false,
      advanced: false,
      compatibility: {properties: {colors: false}}
    }))
    .pipe(gulp.dest(dest.docStyles))
    .pipe(bsync.stream())
))

gulp.task('docs:styles:build', gulp.series('docs:styles:clear', 'docs:styles:compile'))

gulp.task('docs:styles:watch', () => {
  $.watch(src.docStyles, gulp.series('docs:styles:build'))
  $.watch(src.libStyles, gulp.series('docs:styles:build'))
})

/* -------------------------------- Server ----------------------------------*/

gulp.task('server', () => (
  bsync.init({
    startPath: '/stylific-lite/',
    server: {
      baseDir: dest.docHtml,
      middleware (req, res, next) {
        req.url = req.url.replace(/^\/stylific-lite/, '/')
        next()
      }
    },
    port: 13987,
    online: false,
    ui: false,
    files: false,
    ghostMode: false,
    notify: false
  })
))

/* -------------------------------- Default ---------------------------------*/

gulp.task('lib:build', gulp.parallel('lib:styles:build'))

gulp.task('build', gulp.parallel(
  gulp.series('lib:styles:build', 'docs:styles:build'), 'docs:html:build'
))

gulp.task('watch', gulp.parallel(
  'lib:styles:watch', 'docs:html:watch', 'docs:styles:watch'
))

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'server')))
