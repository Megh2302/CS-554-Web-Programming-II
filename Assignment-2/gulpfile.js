const gulp = require("gulp");
const gulpSASS = require("gulp-sass");
const browserSync = require('browser-sync').create();

const sassFiles = [
    "./node_modules/bootstrap/scss/bootstrap.scss",
    "src/scss/*.scss"
];

const JsFiles = [
    "./node_modules/bootstrap/dist/js/bootstrap.min.js",
    "./node_modules/jquery/dist/jquery.min.js",
    "./node_modules/popper.js/dist/umd/popper.min.js"
];

gulp.task("sass", () => {
    gulp
        .src(sassFiles)
        .pipe(gulpSASS())
        .pipe(gulp.dest("./src/css/"))
        .pipe(browserSync.stream());
});
gulp.task("js", () => {
    gulp
        .src(JsFiles)
        .pipe(gulp.dest("./src/js/"))
        .pipe(browserSync.stream());
});
gulp.task("serve", ["sass"], () => {
    browserSync.init({
        server: "./src"
    });
    gulp.watch(sassFiles, ["sass"]);
    gulp.watch("src/*.html").on("change", browserSync.reload);
});
gulp.task("default", ["js", "serve"]);

