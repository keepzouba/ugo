var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('testAutoFx', function(){
    gulp.src('src/css/**/*.css')
        .pipe(autoprefixer({
            browsers : ['last 2 versions', 'Android >= 4.0'],
            cascade : true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove : true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(gulp.dest('dist/css'));
});
var cssmin = require('gulp-minify-css');

gulp.task('testCssmin', function(){
    gulp.src(['src/css/*.{css,eot,svg,ttf,woff}','src/css/**/*.{css,eot,svg,ttf,woff}'])
        .pipe(cssmin({
            advanced : false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility : 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks : true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments : '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest('dist/css'));
});

var htmlmin = require('gulp-htmlmin');

gulp.task('testHtmlmin', function(){
    var options = {
        removeComments : true,//清除HTML注释
        collapseWhitespace : true,//压缩HTML
        collapseBooleanAttributes : true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes : true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes : true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes : true,//删除<style>和<link>的type="text/css"
        minifyJS : true,//压缩页面JS
        minifyCSS : true//压缩页面CSS
    };

        gulp.src(['src/*.html','src/*.htm']).pipe(htmlmin(options)).pipe(gulp.dest('dist'))

}

);

var babel = require('gulp-babel');
gulp.task('es6', function(){
    return gulp.src(['src/js/*.js', 'src/js/**/*.js'])
    //匹配js文件夹下所有ES6文件（包括子文件夹）
        .pipe(babel({
            presets : ['es2015']
        })).pipe(gulp.dest('dist/js/'))
});

var uglify = require('gulp-uglify');
gulp.task('jsmin', function(){
    gulp.src(['src/js/*.js'])
        .pipe(babel({
            presets : ['es2015']
        }))
        .pipe(uglify({
            //  mangle : true,//类型：Boolean 默认：true 是否修改变量名
            //  compress : true,//类型：Boolean 默认：true 是否完全压缩
            // preserveComments : 'all', //保留所有注释
            //mangle : {except : ['require','requirejs', 'exports', 'module', '$']}//排除混淆关键字
        })).pipe(gulp.dest('dist/js'));
});

//图片压缩

imagemin = require('gulp-imagemin'),
    //确保本地已安装imagemin-pngquant [cnpm install imagemin-pngquant --save-dev]
    pngquant = require('imagemin-pngquant');

gulp.task('testImagemin', function () {
    gulp.src(['src/images/*.{png,jpg,gif,ico,jpge,bmp}','src/images/**/*.{png,jpg,gif,ico,jpge,bmp}'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task("line",function(){
    console.log("----------------------------------"+new Date().toLocaleString()+"------------------------------------")
})

//自动刷新服务
var browserSync = require('browser-sync').create();

// 静态服务器
gulp.task('browser-sync', function() {
    browserSync.init({
        files:['**'],
        server:{
            baseDir:'./dist',  // 设置服务器的根目录
            index:'login.html' // 指定默认打开的文件
        },
        port:8050  // 指定访问服务器的端口号
    });
});

gulp.task('default', ['testHtmlmin', 'testCssmin', "testAutoFx", 'jsmin','testImagemin','browser-sync']);

//监听所有文件的变化
gulp.watch('src/*',['testHtmlmin','testCssmin','testAutoFx','jsmin','line']);
