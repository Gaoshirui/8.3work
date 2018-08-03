var gulp = require('gulp');

var server = require('gulp-webserver');

var url = require('url');

var path = require('path');

var fs = require('fs')

var scss = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer')

var mincss = require('gulp-clean-css');

var htmlmin = require('gulp-htmlmin')

var uglify = require('gulp-uglify')

//启服务
gulp.task('server', function() {
    gulp.src('src')
        .pipe(server({
            port: 8068,
            open: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return false
                }
                if (pathname === '/api/list') {
                    res.end(JSON.stringify(data))
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
})

//压缩html
var options = {
    collapseWhitespace: true,
}
gulp.task('minhtml', function() {
    gulp.src('./src/**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./build'))
})


//css
gulp.task('scss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(scss())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        //压缩css
        // .pipe(mincss())
        .pipe(gulp.dest('./src/css'))
})

//打包压缩js
gulp.task('uglify', function() {
    gulp.src(['./src/js/**/*.js', '!./src/js/*.min.js'])
        //压缩js
        .pipe(uglify())
        //输出到build
        .pipe(gulp.dest('build/js'))

})

gulp.task('watch', function() {
    gulp.watch('./src/scss/*.scss', ['scss'])
})

gulp.task('default', ['scss', 'watch', 'server', 'minhtml', 'uglify'])