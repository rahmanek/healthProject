var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var merge = require('merge-stream');
var browserify = require("browserify");
var babelify = require("babelify");
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var argv = require('yargs').argv;

var buildPath = "./builds/web/";
var prod = false;
var watch = false;

if (argv.buildPath) buildPath = argv.buildPath + "/";
if (argv.prod) prod = true;
if (argv.watch) watch = true;
var buildPath = "C:/Users/rahma/Source/Workspaces/Medumo/Medumo/Medumo.Web/";
// Arrange views, assets, styles
var copy = function (project) {
	console.log("Copying Files...")
	if (prod){
		var bootstrap = gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
		.pipe(rename("bootstrap.css"))
		.pipe(gulp.dest(buildPath + project + '/lib'));

		var jquery = gulp.src('node_modules/jquery/dist/jquery.min.js')
		.pipe(rename("jquery.js"))
		.pipe(gulp.dest(buildPath + project + '/lib'));

		var jqueryUi = gulp.src('node_modules/jquery-ui/themes/redmond/jquery-ui.min.css')
		.pipe(rename("jquery-ui.css"))
		.pipe(gulp.dest(buildPath + project + '/lib'));

		var jqueryUiImages = gulp.src('node_modules/jquery-ui/themes/redmond/images/**/*')
		.pipe(gulp.dest(buildPath + project + '/lib/images'));

		var lib = merge(bootstrap,jquery,jqueryUi, jqueryUiImages);
	} else{
		var preLib = gulp.src(['node_modules/bootstrap/dist/css/bootstrap.css',
			'node_modules/jquery/dist/jquery.js',
			'node_modules/jquery-ui/themes/redmond/jquery-ui.css'])
		.pipe(gulp.dest(buildPath + project + '/lib'));

		var jqueryUiImages = gulp.src('node_modules/jquery-ui/themes/redmond/images/*')
		.pipe(gulp.dest(buildPath + project + '/lib/images'));

		var lib = merge(preLib, jqueryUiImages);
	}
	if (project === "register"){
		var logo = gulp.src('assets/medumoLogo.png')
		.pipe(gulp.dest(buildPath + project));

		var logo = gulp.src('vendor/jquery.timepicker.css')
		.pipe(gulp.dest(buildPath + project + '/lib'));

	}
	else if (project === "welcome"){
		var logo = gulp.src('assets/CHALogo.png')
		.pipe(gulp.dest(buildPath + project));
	}
	else if (project === "caretour"){
		var logo = gulp.src('assets/today-star-icon-gray1.png')
		.pipe(gulp.dest(buildPath + project));
	}

	var logo = gulp.src('node_modules/font-awesome/**/*.*')
	.pipe(gulp.dest(buildPath + project + '/lib/font-awesome'));

	var ico = gulp.src('assets/favicon.ico')
	.pipe(gulp.dest(buildPath + project));

	var css = gulp.src('styles/' + project + '.css')
	.pipe(rename("style.css"))
	.pipe(gulp.dest(buildPath + project));

	var views = gulp.src('views/' + project + '.html')
	.pipe(rename("index.html"))
	.pipe(gulp.dest(buildPath + project));

	return merge(ico,views,css);
};

var styles = function(project){
	return gulp.src('./styles/' + project + '.scss')
   .pipe(sass().on('error', sass.logError))
	.pipe(rename("style.css"))
   .pipe(gulp.dest(buildPath + project));

}

var jsBundle = function (project){
	console.log("Bundling JS...");
	var cProject = project.charAt(0).toUpperCase() + project.slice(1);
	var Browserify, bundle;

	// Bundle modules
	createBundle = function(){
		Browserify = bundle.bundle()
		.on('error', function(err){console.log(1);gutil.log("Watchify: " + err)})
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(buildPath + project));
	};
	if (watch){
		bundle = watchify(browserify({entries: 'modules/' + cProject + '.js',debug: !prod}))
		.transform(babelify);
		bundle.on('update', createBundle);
		bundle.on('log', gutil.log);
	} else{
		bundle = browserify({entries: 'modules/' + cProject + '.js', debug: !prod})
			.transform(babelify);
		bundle.on('log', gutil.log);
	}

	if (prod) {
		Browserify = bundle.bundle()
			.pipe(source('bundle.js'))
			.on('error', function(err){console.log(1);gutil.log("Watchify: " + err)})
			.pipe(buffer())
			.pipe(uglify())
			.pipe(gulp.dest(buildPath + project));
	} else {
		createBundle();
	};
	return Browserify;
}

var buildProject = function (project) {
	var copyStreams, scss;
	if(watch){
		console.log("Watching...")
		gulp.watch(['styles/**/*.scss','views/**/*.html'], function(event) {
			copyStreams = copy(project);
			scss = styles(project);
		});
	}
	var copyStreams = copy(project);
	var jsStreams = jsBundle(project);
	var scss = styles(project);
	return merge(copyStreams,jsStreams,scss);
};

var connector = function() {
	var views = gulp.src('views/home.html')
	.pipe(rename("index.html"))
	.pipe(gulp.dest(buildPath));
}

gulp.task('set-dev-node-env', function() {
	return process.env.NODE_ENV = 'development';
});

gulp.task('set-prod-node-env', function() {
	return process.env.NODE_ENV = 'production';
});

gulp.task('register', function(){
	buildProject("register");
});
gulp.task('welcome', function(){
	buildProject("welcome")
});
gulp.task('caretour', function(){
	buildProject("caretour")
});


gulp.task('deploy',['set-prod-node-env'], function(){
	var register = buildProject("register");
	var welcome = buildProject("welcome");
	var caretour = buildProject("caretour");
	connector();
	return merge(register, welcome);
});

gulp.task('test',['set-dev-node-env'], function(){
	var register = buildProject("register");
	var welcome = buildProject("welcome");
	var caretour = buildProject("caretour");
	connector();
	return merge(register, welcome);
});

gulp.task('connector', connector);
