define("config",function () {
    require.config({
        //添加版本号，解决缓存问题
        baseUrl:"./js",
        paths:{
            "jquery":["lib/jquery/dist/jquery","https://cdn.bootcss.com/jquery/3.3.1/jquery"],
            "jquery.validate":["lib/jq validate/dist/jquery.validate"],
            "additional-methods":["lib/jq validate/dist/additional-methods"],
            "jquery.md5":["lib/jquery.md5"],
            "jquery.cookie":["lib/jquery-cookie/jquery.cookie"],
            "gVerify":["lib/jQueryYzm/js/gVerify"],
            "EasyLazyload":["lib/EasyLazyload/dist/EasyLazyload"]
        },
        shim:{
          "jquery.md5":{
              deps:["jquery"]
          },
          "gVerify":{
              deps:["jquery"]
          },
            "EasyLazyload":{
              deps:["jquery"]
          }
        }
    })
})