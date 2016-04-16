/**	gulpfile.js
 * requires:
-------------------*/
var browserSync = 	require('browser-sync');
var gulp = 					require('gulp');
var concat = 				require('gulp-concat');
var include = 			require('gulp-include');
var jshint = 				require('gulp-jshint');
var plumber = 			require('gulp-plumber');
var postcss = 			require('gulp-postcss');
var rename = 				require('gulp-rename');
var replace = 			require('gulp-replace');
var svgSprite = 		require('gulp-svg-sprite');
var uglify = 				require('gulp-uglify');
var jshintStylish = require('jshint-stylish');
// postcss processors
var pcss = {
	autoprefix: require('autoprefixer'),
	cssnano: 		require('cssnano'),
	sorted: 		require('css-declaration-sorter'),
	mqpacker: 	require('css-mqpacker'),
	alias: 			require('postcss-alias'),
	atAlias: 		require('postcss-alias-atrules'),
	hexAlpha: 	require('postcss-color-alpha'),
	mediaAlias: require('postcss-custom-media'),
	props: 			require('postcss-define-property'),
	extend: 		require('postcss-extend'),
	import: 		require('postcss-import'),
	nested: 		require('postcss-nested'),
	position: 	require('postcss-position-alt'),
	pxRem: 			require('postcss-pxtorem'),
	dataSelect: require('postcss-short-data')
};

/* plumber error handler
 * prevents watch/browsersync
 * from crashing on postcss error */
var plumberErrorHandler = {
	errorHandler: function(err) {
  	console.log(err.toString());
  	this.emit('end');
	}
};


/* process postcss
 * see readme for usage
------------------------*/
gulp.task('css', function() {
	var processors = [
		pcss.import,
		pcss.atAlias({
			rules: {
				colors: 'alias',
				type: 'alias',
				transition: 'alias'
			}
		}),
		pcss.props({
			syntax: {
  			parameter: '?',
		   	variable: '?'
			}
		}),
		pcss.alias,
		pcss.position,
		pcss.hexAlpha,
		pcss.mediaAlias,
		pcss.nested,
		pcss.extend,
		pcss.dataSelect,
		pcss.pxRem,
		pcss.mqpacker,
		pcss.sorted({
			order: 'smacss'
		}),
		pcss.autoprefix({browsers: ['last 2 versions']})
	];

	return gulp.src('./dev/pcss/config/source.pcss')
		.pipe(plumber(plumberErrorHandler))
		.pipe(postcss(processors))
		.pipe(rename('all.css'))
		.pipe(gulp.dest('./'));
});


/* process js
--------------*/
// concat and min all js files in /lib
gulp.task('js:lib', function() {
	return gulp.src('./lib/*.js')
		.pipe(concat('lib.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./'));
});

// lint project specific js
gulp.task('js:app', function() {
	return gulp.src('./dev/app.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(gulp.dest('./'));
});

gulp.task('js', ['js:lib', 'js:app']);


/* svg icon spritesheet
 * and html processing
-------------------------------*/
// build spritesheet
gulp.task('svg', function() {
	var config = {
		mode: {
			symbol: true
		}
	};

	return gulp.src('./dev/svg-icons/**/*.svg')
		.pipe(svgSprite(config))
		.pipe(rename('icons.svg'))
		.pipe(gulp.dest('./assets/'));
});

// inject spritesheet and replace <icon>
gulp.task('html', ['svg'], function() {
	return gulp.src('./dev/*.html')
		.pipe(include())
		.pipe(replace('<icon>', '<svg class="icon"><use xlink:href="'))
		.pipe(replace('</icon>', '"></use></svg>'))
		.pipe(gulp.dest('./'));
});


/* build all
-------------*/
gulp.task('build', ['html', 'css', 'js']);


/* browser sync
----------------*/
gulp.task('live', ['build'], function () {
	var project_path = __dirname.split('/');
	var project = 'localhost/' + project_path[project_path.length-1];
	var sync = function() {
		browserSync.reload();
	};

  browserSync.init({
  	proxy: project
  });

  gulp.watch('./dev/app.js', ['js:app'], sync);
  gulp.watch('./dev/pcss/**/*.pcss', ['css'], sync);
  gulp.watch('./dev/*.html', ['html'], sync);
});


/* dist process
----------------*/
// minify css
gulp.task('css:dist', ['css'], function() {
	var processors = [
		pcss.cssnano
	];

	return gulp.src('./all.css')
		.pipe(plumber(plumberErrorHandler))
		.pipe(postcss(processors))
		.pipe(gulp.dest('./dist/'));
});

// concat all js and minify
gulp.task('js:dist', ['js'], function() {
	return gulp.src(['./lib.js', './app.js'])
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/'));
});

// copy assets
gulp.task('assets:dist', function() {
	return gulp.src('./assets/**/*.*')
		.pipe(gulp.dest('./dist/assets/'));
});

// copy php lib
gulp.task('php:dist', function() {
	return gulp.src('./lib/*.php')
		.pipe(gulp.dest('./dist/lib/'));
});

// copy remaining resources
gulp.task('rsc:dist', function() {
	return gulp.src(['./*.html', './favicon.ico', './apple-touch-icon.png'])
		.pipe(gulp.dest('./dist/'));
});

// package tasks and remove lib.js src
gulp.task('dist', ['build', 'css:dist', 'js:dist', 'assets:dist', 'php:dist', 'rsc:dist'], function() {
	return gulp.src('./dist/*.html')
		.pipe(replace('<script type="text/javascript" src="lib.js"></script>', ''))
		.pipe(gulp.dest('./dist/'));
});
