/*
 *   MAIN
 */
const gulp =          require('gulp')
const rigger =        require('gulp-rigger')
const sourcemaps =    require('gulp-sourcemaps')
const rename =        require('gulp-rename')

/*
 *   STYLE
 */
const sass =          require('gulp-sass')
const autoprefixer =  require('gulp-autoprefixer')
const csso =          require('gulp-csso')

/*
 *   SCRIPT
 */
const typescript =    require('gulp-typescript')
const terser =        require('gulp-terser')

/*
 *   LIVE-RELOAD DEVELOPMENT
 */
const browserSync =   require('browser-sync')
const reload =        browserSync.reload

/*
 *   MISC
 */
const watch =         require('gulp-watch')
const clean =         require('gulp-clean')


/*
 *   OPTIONS & CONFIGURATION
 */
const path = {

  source: {
    backend:   'source/backend/**/*.py',

    script:    'source/frontend/script/main.ts',
    packages:  'source/frontend/packages/**/*.js',
    style:     'source/frontend/style/main.sass',
    media:     'source/frontend/media/**/*',
    markup:    'source/frontend/index.html'
  },

  production: {
    backend:  'production/backend/',

    script:   'production/frontend/js/',
    packages: 'production/frontend/packages/',
    style:    'production/frontend/css/',
    media:    'production/frontend/media/',
    markup:   'production/frontend/'
  },

  watch: {
    backend:   'source/backend/**/*.py',

    script:    'source/frontend/script/**/*.ts',
    packages:  'source/frontend/packages/**/*.js',
    types:     'source/frontend/types/**/*.d.ts',
    style:     'source/frontend/style/**/*.sass',
    media:     'source/frontend/**/*',
    markup:    'source/frontend/**/*.html'
  }

}

const config = {

  typescript: {
    target: "es2020",
    allowJs: true,
    sourceMap: true,
    types: [
      './source/frontend/types/vue',
      './source/frontend/types/vue-router'
    ],
    // esModuleInterop: true,
    // noImplicitAny: true,
    // noImplicitThis: true,
    // alwaysStrict: true,
    // noUnusedLocals: true,
    // noUnusedParameters: true,
    allowSyntheticDefaultImports: true,
    experimentalDecorators: true,
    allowUmdGlobalAccess: true,
    moduleResolution: "node"
  },

  host: {
    server: {
      baseDir: './production/frontend'
    },
    tunnel: false,
    host: 'localhost',
    port: 8080
  }

}


/*
 *   PRODUCTION TASKS
 */
const backend = (done) => {
  return gulp
    .src(path.source.backend)

    .pipe(gulp.dest(path.production.backend))
    .pipe(reload({stream: true}))
    .on('end', () => { done() })
}

const frontend_script = (done) => {
  return gulp
    .src(path.source.script)

    .pipe(rigger())
    .pipe(sourcemaps.init())

    .pipe(typescript(
      config.typescript,
      typescript.reporter.defaultReporter()
    ))
    .on('error', function(){return false}) // HACK: Workaroud for: Error: gulp-typescript: A project cannot be used in two compilations at the same time. Create multiple projects with createProject instead.
    .pipe(terser())

    .pipe(sourcemaps.write('./', {
      sourceMappingURL: function(file) {
        return `${ file.relative }.min.map`
      }
    }))

    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.production.script))
    .pipe(reload({stream: true}))
    .on('end', () => { done() })
}

const frontend_packages = (done) => {
  return gulp
    .src(path.source.packages)

    .pipe(gulp.dest(path.production.packages))
    .pipe(reload({stream: true}))
    .on('end', () => { done() })
}

const frontend_style = (done) => {
  return gulp
    .src(path.source.style)

    .pipe(rigger())
    .pipe(sourcemaps.init())

    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 3 versions']
    }))
    .pipe(csso())

    .pipe(sourcemaps.write('./', {
      sourceMappingURL: function(file) {
        return `${ file.relative }.min.map`
      }
    }))

    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.production.style))
    .pipe(reload({stream: true}))
    .on('end', () => { done() })
}

const frontend_markup = (done) => {
  return gulp
    .src(path.source.markup)

    .pipe(gulp.dest(path.production.markup))
    .pipe(reload({stream: true}))
    .on('end', () => { done() })
}

const frontend_media = (done) => {
  return gulp
    .src(path.source.media)

    .pipe(gulp.dest(path.production.media))
    .pipe(reload({stream: true}))
    .on('end', () => { done() })
}

const prod = gulp.series(
  backend,
  frontend_script,
  frontend_packages,
  frontend_style,
  frontend_markup,
  frontend_media
)


/*
 *   DEVELOPMENT TASKS
 */
const prod_clean = (done) => {
  return gulp
    .src('production/*', {read: false})
    .pipe(clean())
    .on('end', () => { done() }) // HACK: If gulp.series() doesn't start new task after the end of current task then add this line.
}

const watch_start = async () => {
  gulp.watch([
    path.watch.script,
    path.watch.types
  ], frontend_script),
  gulp.watch(path.watch.backend, backend),
  gulp.watch(path.watch.packages, frontend_packages),
  gulp.watch(path.watch.style, frontend_style),
  gulp.watch(path.watch.markup, frontend_markup)
}

const host_start = async () => {
  return browserSync.init(config.host)
}


/*
 *   EXPORT TASKS
 */
exports.prod = prod

exports.dev = gulp.series(
  prod_clean,

  prod,

  watch_start,
  host_start
)
