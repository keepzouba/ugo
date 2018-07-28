require(["config"],function () {
    require(["jquery","EasyLazyload","jquery.cookie"],function () {
        $(function () {
            $("footer").load("bottom.html",function () {
                console.log("底部加载完成");
            })
            //判断玩家是否登录了
            function checklogin() {
                if(sessionStorage.getItem("userinfo")!=null){
                    return true
                }else {
                    return false

                }
            }
            //更新购物车数量
            function getcartnum() {
                if (checklogin()){
                    //获取最新的购物车信息
                    $.ajax({
                        url:"http://10.41.151.21/work/usgoshop/server/getcart.php",
                        type:"GET",
                        data:{
                            utel:sessionStorage.getItem("userinfo")
                        },
                        dataType:"json"
                    }).then(function (res) {
                        if (res.status==1){
                            $("#cart_num_1").text(res.data.length);
                            $("#cart_num_2").text(res.data.length);
                        }
                    })
                }else {
                    var $check_cookieArr = $.cookie("cart")?JSON.parse($.cookie("cart")):[];
                    $("#cart_num_1").text($check_cookieArr.length);
                    $("#cart_num_2").text($check_cookieArr.length);
                }
            }
            if(checklogin()){
                $(".top_nav_main_tool").find("li").addClass("yg-card");
                $($(".top_nav_main_tool").find("span")[0]).text("欢迎您，"+sessionStorage.getItem("userinfo"))
                $($(".top_nav_main_tool").find("a")[0]).attr("id","quitlogin");
                $($(".top_nav_main_tool").find("a")[0]).text("退出");
                //判断是否有购物车cookie
                if ($.cookie("cart")==undefined){
                    //不存在就直接拉取后台的购物车数据
                    getcartnum()
                }else {
                    var $login_cookieArr = $.cookie("cart")?JSON.parse($.cookie("cart")):[];
                    //如果有,获取最新的数据库购物车信息，与cookie相加，关联数量后，将最新的数据库信息返回并修改
                    for (var i = 0;i<$login_cookieArr.length;i++){
                        $.ajax({
                            url:"http://10.41.151.21/work/usgoshop/server/insertcart.php",
                            type:"GET",
                            data:{
                                p_num:$login_cookieArr[i].p_num,
                                u_tel:sessionStorage.getItem("userinfo"),
                                p_id:$login_cookieArr[i].p_id,
                                p_price:$login_cookieArr[i].p_price,
                                p_img:$login_cookieArr[i].p_img,
                                p_title:$login_cookieArr[i].p_title,
                                p_style:$login_cookieArr[i].p_style
                            },
                            dataType:"json"
                        }).then(function (res) {
                            console.log(res);
                        })
                    }
                    $.cookie("cart","", {expires: -1})
                    getcartnum()
                }
            }else {
                getcartnum()
            }
            //点击退出登录
            $("#quitlogin").on("click",function () {
                sessionStorage.removeItem("userinfo");
                location.reload();
            });


            //TV直播点击左右切换的效果
            $tvnum=0;
            $(".t_prev").on("click",function () {
                $tvnum--;
                if($tvnum<=0){
                    $tvnum=0;
                }
                $($(".tv_live_list").find("ul")[0]).animate({
                    left:-($tvnum*$($(".tv_live_list").find("li")[0]).width())
                })
            })

            $(".t_next").click("",function () {
                $tvnum++;
                if($tvnum>=$(".tv_live_list").find("li").length){
                    $tvnum=$(".tv_live_list").find("li").length-1;
                }
                $($(".tv_live_list").find("ul")[0]).animate({
                    left:-($tvnum*$($(".tv_live_list").find("li")[0]).width())
                })
            })
            //tv倒计时
            function tv_time_random(){
               return parseInt(Math.random()*9000)+1000
            }
            function start_tv_djs(ele) {
                var num = tv_time_random();
                var timer = setInterval(function () {
                    num--;
                    if (num==0){
                        clearInterval(timer)
                    }
                    var h = parseInt(num/60/60%24);
                    var s = parseInt(num/60%60);
                    var m = parseInt(num%60);
                    if (h<10){
                        h = "0"+h;
                    }
                    if (s<10){
                        s = "0"+s;
                    }
                    if (m<10){
                        m = "0"+m;
                    }
                    $($(ele).find("span")[0]).text(h+":");
                    $($(ele).find("span")[1]).text(s+":");
                    $($(ele).find("span")[2]).text(m);
                },1000)
            }
            start_tv_djs(".livetime-back.djs1");
            start_tv_djs(".livetime-back.djs2");
            start_tv_djs(".livetime-back.djs3");
            start_tv_djs(".livetime-back.djs4");
            start_tv_djs(".livetime-back.djs5");
            start_tv_djs(".livetime-back.djs6");

            //今日限购倒计时

            function start_day_djs(ele) {
                var num = $(".livetime-day").attr("data-time");
                var timer = setInterval(function () {
                    num--;
                    if (num==0){
                        clearInterval(timer)
                    }
                    var h = parseInt(num/60/60%24);
                    var s = parseInt(num/60%60);
                    var m = parseInt(num%60);
                    if (h<10){
                        h = "0"+h;
                    }
                    if (s<10){
                        s = "0"+s;
                    }
                    if (m<10){
                        m = "0"+m;
                    }
                    $($(ele).find("span")[0]).text(h+":");
                    $($(ele).find("span")[1]).text(s+":");
                    $($(ele).find("span")[2]).text(m);
                },1000)
            }
            start_day_djs(".livetime-day")


            //今日限购点击切换的效果
            $dnum=0;
            $(".d_prev").on("click",function () {
                $dnum--;
                if($dnum<=0){
                    $dnum=0;
                }
                $($(".tv_day_one_list").find("ul")[0]).animate({
                    left:-($dnum*$($(".tv_day_one_list").find("li")[0]).width())
                })
            })

            $(".d_next").click("",function () {
                $dnum++;
                if($dnum>=$(".tv_day_one_list").find("li").length){
                    $dnum=$(".tv_day_one_list").find("li").length-1;
                }
                $($(".tv_day_one_list").find("ul")[0]).animate({
                    left:-($dnum*$($(".tv_day_one_list").find("li")[0]).width())
                })
            })


            //全球尖货移入效果
            $(".three_col ul").find("li").mouseenter(function () {
                $(this).css("border-color","red").siblings().css("border-color","#ddd")
            })
            //全球尖货懒加载效果
            lazyLoadInit({
                coverColor:"white",
                coverDiv:"",
                offsetBottom:0,
                offsetTopm:0,
                showTime:300,
                onLoadBackEnd:function(i,e){
                    console.log("onLoadBackEnd:"+i);
                }
                ,onLoadBackStart:function(i,e){
                    console.log("onLoadBackStart:"+i);
                }
            });

            //右侧导航栏回到顶部效果
            $("#_AD_right_top").on("click",function () {
                $("body").scrollTop(0)
            })

            //轮播图
            //自动轮播的效果
            $lbj_num =1 ;
            $lbj_span_num=0;
            $lbt_img_num = $("#lbt").find("li").length; //图片个数
            //图片宽度
            $lbt_img_width = $($("#lbt").find("li")[0]).width();
            //根据图片个数自动创建下面的小圆点
            for (var i = 0;i<$lbt_img_num;i++){
                $(".scroll_num").append("<span></span>")
            }
            $($(".scroll_num").find("span")[0]).addClass("current");
            //实现无缝轮播的效果，先克隆第一张图插到最后，克隆最后一张图插到最前面
            //根据图片个数设置ul的宽度
            $cli = $($("#lbt").find("li")[0]).clone(true);
            $lastli = $($("#lbt").find("li")[$lbt_img_num-1]).clone(true);
            $($cli).insertAfter($("#lbt").find("li")[$lbt_img_num-1]);
            $($lastli).insertBefore($("#lbt").find("li")[0]);
            $result_$lbt_img_num = $("#lbt").find("li").length;
            $("#lbt").css("width",$result_$lbt_img_num* $lbt_img_width);
            //点击切换效果，点击右边
            $(".arr_right").on("click",function () {
                $lbj_num++;
                $lbj_span_num++;
                //图片到达最后一张的判断条件
                if ($lbj_num>=$result_$lbt_img_num){
                    $lbj_num=2;
                    $("#lbt").css("left",-1920)
                }
                //圆点到达最后一张的判断条件
                if ($lbj_span_num>=$lbt_img_num){
                    $lbj_span_num=0;
                }
                //图片移动动画
                $("#lbt").animate({
                    "left":-$lbj_num*$($("#lbt").find("li")[0]).width()
                })
                //圆点切换
                $( $(".scroll_num").find("span")[$lbj_span_num]).addClass("current").siblings().removeClass("current");

            })

            //点击切换效果，点击左边
            $(".arr_left").on("click",function () {
                $lbj_num--;
                $lbj_span_num--;
                //图片到达最后一张的判断条件
                if ($lbj_num<=0){
                    $lbj_num=$result_$lbt_img_num-2;
                    $("#lbt").css("left",-($result_$lbt_img_num-1)*$lbt_img_width)
                }
                //圆点到达最后一张的判断条件
                if ($lbj_span_num<=-1){
                    $lbj_span_num=$lbt_img_num-1;
                }
                //图片移动动画
                $("#lbt").animate({
                    "left":-$lbj_num*$($("#lbt").find("li")[0]).width()
                })
                //圆点切换
                $( $(".scroll_num").find("span")[$lbj_span_num]).addClass("current").siblings().removeClass("current");
            })
            //自动播放效果
            $auto_lbj = setInterval(function () {
                $lbj_num++;
                $lbj_span_num++;
                //图片到达最后一张的判断条件
                if ($lbj_num>=$result_$lbt_img_num){
                    $lbj_num=2;
                    $("#lbt").css("left",-$lbt_img_width)
                }
                //圆点到达最后一张的判断条件
                if ($lbj_span_num>=$lbt_img_num){
                    $lbj_span_num=0;
                }
                //图片移动动画
                $("#lbt").animate({
                    "left":-$lbj_num*$lbt_img_width
                });
                //圆点切换
               $( $(".scroll_num").find("span")[$lbj_span_num]).addClass("current").siblings().removeClass("current");
            },2000)

            //鼠标移入时，自动播放停止
            $(".scroll").on("mouseenter",function () {
                clearInterval($auto_lbj);
                //切换按钮显示
                $("#lbt_left").show();
                $("#lbt_right").show();
            })
            //鼠标移出时，开始自动轮播
            $(".scroll").on("mouseleave",function () {
                $auto_lbj = setInterval(function () {
                    $lbj_num++;
                    $lbj_span_num++;
                    //图片到达最后一张的判断条件
                    if ($lbj_num>=$result_$lbt_img_num){
                        $lbj_num=2;
                        $("#lbt").css("left",-$lbt_img_width)
                    }
                    //圆点到达最后一张的判断条件
                    if ($lbj_span_num>=$lbt_img_num){
                        $lbj_span_num=0;
                    }
                    //图片移动动画
                    $("#lbt").animate({
                        "left":-$lbj_num*$lbt_img_width
                    });
                    //圆点切换
                    $( $(".scroll_num").find("span")[$lbj_span_num]).addClass("current").siblings().removeClass("current");
                },2000)
                //切换按钮隐藏
                $("#lbt_left").hide();
                $("#lbt_right").hide();
            })


            //顶部公告消息自动切换效果
            $top_nav_main_notic_num = 0;
            //li标签的高度
            $top_nav_main_notic_li_height = $($(".top_nav_main_notic ul").find("li")).height();
            //li标签的个数
            $top_nav_main_notic_li_num = $(".top_nav_main_notic ul").find("li").length;
            $auto_top_nav_main_notic = setInterval(function () {
                $top_nav_main_notic_num++;
                if ($top_nav_main_notic_num>=$top_nav_main_notic_li_num){
                    $top_nav_main_notic_num=1;
                    $(".top_nav_main_notic ul").css("top",0)
                }
                $(".top_nav_main_notic ul").animate({
                    top:-$top_nav_main_notic_num*$top_nav_main_notic_li_height
                })
            },2000)
            //鼠标移入自动切换停止
            $(".top_nav_main_notic").on("mouseenter",function () {
                clearInterval($auto_top_nav_main_notic);
                //切换按钮显示
            })
            //鼠标移出时，开始自动切换
            $(".top_nav_main_notic").on("mouseleave",function () {
                $auto_top_nav_main_notic = setInterval(function () {
                    $top_nav_main_notic_num++;
                    if ($top_nav_main_notic_num>=$top_nav_main_notic_li_num){
                        $top_nav_main_notic_num=1;
                        $(".top_nav_main_notic ul").css("top",0)
                    }
                    $(".top_nav_main_notic ul").animate({
                        top:-$top_nav_main_notic_num*$top_nav_main_notic_li_height
                    })
                },2000)
            })







            function getcart(){
                return $.ajax({
                    url:"http://10.41.151.21/work/usgoshop/server/getcart.php",
                    type:"GET",
                    data:{
                        utel:sessionStorage.getItem("userinfo")
                    },
                    dataType:"json"
                })
            }
            function getcookie(str){
                return $.cookie(str)?JSON.parse($.cookie(str)):[];
            }
            //小购物车显示
            $mb_li =  $($(".cartul").find("li")[0]);
            $($(".cartul").find("li")[0]).remove();
            $(".header_logo_mycart").on("mouseenter",function () {
                $("cart_info").show();
                $(".cartul").text("");
                if (checklogin()){
                    getcart().then(function (res) {
                        if (res.status==1){
                            show_havacart();
                            for (var i =0;i<res.data.length;i++) {
                                $mb_li.clone(true).show().appendTo($(".cartul"))
                            }
                            //配置商品数据
                            cartlistinfo(res.data.length,res.data);
                            getprice_sum();
                        }else {
                            show_nonecart();
                        }
                    })
                }else {
                    if ($.cookie("cart")==undefined || $.cookie("cart").length==0){
                        show_nonecart();
                    }else {
                        show_havacart();
                        for (var i =0;i<JSON.parse($.cookie("cart")).length;i++) {
                            $mb_li.clone(true).show().appendTo($(".cartul"))
                        }
                        cartlistinfo(JSON.parse($.cookie("cart")).length,JSON.parse($.cookie("cart")))
                        getprice_sum();
                    }
                }
            });
            console.log($($(".cartul").find("li")[1]));

            //配置cartlist
            function cartlistinfo(length,ele) {
                for (var j = 0; j <length; j++) {
                    $($(".cartul").find("li")[j]).find("img").attr("src",ele[j].p_img);
                    $($(".cartul").find("li")[j]).find("div.cartlink").text(ele[j].p_title);
                    $($($(".cartul").find("li")[j]).find("div.pricemx").find("span")[0]).text(ele[j].p_price);
                    $($($(".cartul").find("li")[j]).find("div.pricemx").find("span")[1]).text(ele[j].p_num);
                }
            }

            //计算总金额和总数量
            function getprice_sum(){
                var $cartlistlength = $(".cartul").find("li").length;
                var $sum_price=0;
                var $sum_count = 0;
                for (var n = 0;n<$cartlistlength;n++){
                    var price = $($($(".cartul").find("li")[n]).find("div.pricemx").find("span")[0]).text();
                    var sum = $($($(".cartul").find("li")[n]).find("div.pricemx").find("span")[1]).text();
                    $sum_price+=parseInt(price)*parseInt(sum);
                    $sum_count += parseInt(sum);
                }
                $(".cartotal").find("em").text($sum_price);
                $(".canum").text($sum_count)
            }
            function show_havacart() {
                $(".cartlist").hide();
                $(".cartul").show();
                $(".priczj").show()
            }
            function show_nonecart() {
                $(".cartlist").show();
                $(".cartul").hide();
                $(".priczj").hide()
            }

        })
    })
})