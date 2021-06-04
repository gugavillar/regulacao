/*global require*/

var banner,
gulp = require('gulp'),
clean = require('gulp-clean'),
tinify = require('gulp-tinify'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
concatFiles = require('gulp-concat'),
ngAnnotate = require('gulp-ng-annotate'),
cleanCss = require('gulp-clean-css'),
htmlmin = require('gulp-htmlmin'),
header = require('gulp-header'),
stripComments = require('gulp-strip-css-comments'),
browser = require('browser-sync').create(),
pkg = require('./package.json');

// Set the banner content
banner = ['/*!\n',
' * Cantilever Group - <%= pkg.title %> v<%= pkg.version %>\n',
' * Descrição - <%= pkg.description %> \n',
' * Propriedade do Código - <%= pkg.author %> \n',
' * Copyright ' + (new Date()).getFullYear(),
' */\n',
''
].join('');

gulp.task('clean', function () {
	return gulp.src('dist/', {
		allowEmpty: true
	})
	.pipe(clean());
});

gulp.task('minify', function () {
	return gulp.src('partials/*.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('dist/partials'));
});

gulp.task('library', function () {
	return gulp.src(['js/libs/**/*.js', 'bower_components/angular-i18n/angular-locale_pt-br.js'])
	.pipe(concatFiles('bundlelibrary.js'))
	.pipe(uglify())
	.pipe(ngAnnotate())
	.pipe(header(banner, {pkg: pkg}))
	.pipe(rename({extname: '.min.js'}))
	.pipe(gulp.dest('dist/library/js/'));
});

gulp.task('scripts', function () {
	return gulp.src(['js/*.js'])
	.pipe(concatFiles('bundle.js'))
	.pipe(uglify())
	.pipe(ngAnnotate())
	.pipe(header(banner, {pkg: pkg}))
	.pipe(rename({extname: '.min.js'}))
	.pipe(gulp.dest('dist/js/'));
});

gulp.task('styles', function () {
	return gulp.src(['css/libs/**/*.css', 'css/*.css'])
	.pipe(concatFiles('bundle.css'))
	.pipe(cleanCss({compatibility: 'ie8'}))
	.pipe(stripComments({preserve: false}))
	.pipe(header(banner, {pkg: pkg}))
	.pipe(rename({extname: '.min.css'}))
	.pipe(gulp.dest('dist/css/'));
});

gulp.task('fontsglyphicons', function () {
	return gulp.src('bower_components/glyphicons-only-bootstrap/fonts/*')
	.pipe(rename({dirname: 'fonts'}))
	.pipe(gulp.dest('dist/'));
});

gulp.task('tinify', function () {
	return gulp.src('img/*')
	.pipe(tinify('mQsIOIeZHY6OeW-CMZe6uXs5zRfCF7gm'))
	.pipe(gulp.dest('dist/img/'));
});

gulp.task('svg', function () {
	return gulp.src('svg/*')
	.pipe(gulp.dest('dist/svg/'));
});

gulp.task('browser-sync', function () {
	browser.init({
		open: false,
		proxy: {
			target: 'localhost/' + pkg.name
		}
	});
	gulp.watch('js/*.js', gulp.parallel('scripts')).on('change', browser.reload);
	gulp.watch('css/*.css', gulp.series('styles')).on('change', browser.reload);
	gulp.watch('partials/*.html', gulp.series('minify')).on('change', browser.reload);
	gulp.watch('svg/*.svg', gulp.series('svg')).on('change', browser.reload);
	gulp.watch('img/*', gulp.series('tinify')).on('change', browser.reload);
	gulp.watch('dist/*/*').on('change', browser.reload);
	gulp.watch('index.html').on('change', browser.reload);
});

gulp.task('serve', gulp.series('clean', 'library',
	gulp.parallel('tinify', 'minify', 'scripts', 'styles', 'fontsglyphicons', 'svg'),'browser-sync'));

gulp.task('default', gulp.series('serve'));