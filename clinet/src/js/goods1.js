require(["config"],function () {
    require(["jquery","EasyLazyload","jquery.cookie"],function () {
        $(function () {
            //懒加载初始化
            lazyLoadInit({
                coverColor:"white",
                coverDiv:"",
                offsetBottom:0,
                offsetTopm:0,
                showTime:300,
                onLoadBackEnd:function(i,e){
                }
                ,onLoadBackStart:function(i,e){
                }
            });

            //右侧导航栏回到顶部效果
            $("#_AD_right_top").on("click",function () {
                $("body").scrollTop(0)
            })
            //加载底部
            $("footer").load("bottom.html",function () {
                console.log("底部加载完成");
            });


            //获取商品信息
            //1.商品id 2.商品数量 3.商品价格 4.商品图片 5.商品描述 6.商品样式
            function get_pinfo() {
                var p_info = {};
                p_info["p_id"] =$(".no").text().split("：")[1];
                p_info["p_num"] = $("#goodsNumberInput").val();
                p_info["p_price"] = $("#rel_price").text().split("￥")[1];
                p_info["p_img"] = $($(".items ul").find("img")[0]).attr("src");
                p_info["p_title"] = $($(".sh-goods-parameters").find("h1")[0]).text();
                p_info["p_style"] = $("#color0").attr("alt")||"";
                return p_info
            }
            var p_info = get_pinfo();


            //加入购物车

            //判断玩家是否登录了
            function checklogin() {
                if(sessionStorage.getItem("userinfo")!=null){
                    return true
                }else {
                    return false
                }
            };
            //更新购物车数量
            function getcartnum() {
                if (checklogin()){
                    //获取最新的购物车信息
                    getcart().then(function (res) {
                        if (res.status==1){
                            $("#cart_num_1").text(res.data.length);
                            $(".cart-num").text(res.data.length);
                        }else {
                            $("#cart_num_1").text(0);
                            $(".cart-num").text(0);
                        }
                    })
                }else {
                    var $check_cookieArr = getcookie("cart");
                    $("#cart_num_1").text($check_cookieArr.length);
                    $(".cart-num").text($check_cookieArr.length);
                }
            }
            //页面初始化
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
                    var $login_cookieArr = getcookie("cart");
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
                        $.cookie("cart","", {expires: -1})
                    }
                }
            }else {
                getcartnum()
            }
            //物品数量增加事件
            var $p_num = 1;
            $("#addBtn").on("click",function () {
                $p_num++;
                if ($p_num>=99){
                    $p_num=99;
                }
                $("#goodsNumberInput").val($p_num);
                p_info["p_num"] = $("#goodsNumberInput").val();
            });
            //物品数量减少事件
            $("#lessBtn").on("click",function () {
                $p_num--;
                if ($p_num<=1){
                    $p_num=1;
                }
                $("#goodsNumberInput").val($p_num);
                p_info["p_num"] = $("#goodsNumberInput").val();
            });

            //点击加入购物车
            $(".sh-shopping-cart").on("click",function () {
                p_info["p_num"] = parseInt($("#goodsNumberInput").val());
                if (checklogin()){
                    //将商品推给后台
                    $.ajax({
                        url:"http://10.41.151.21/work/usgoshop/server/insertcart.php",
                        type:"GET",
                        data:{
                            p_num:p_info.p_num,
                            u_tel:sessionStorage.getItem("userinfo"),
                            p_id:p_info.p_id,
                            p_price:p_info.p_price,
                            p_img:p_info.p_img,
                            p_title:p_info.p_title,
                            p_style:p_info.p_style
                        },
                        dataType:"json"
                    }).then(function (res) {
                        console.log(res);
                    })
                } else {
                    //获取最新的cookie事件
                    var $cookieArr = getcookie("cart");
                    //判断要加入购物车的物品是否在cookie中已存在
                    for (var i =0;i<$cookieArr.length;i++){
                        if($cookieArr[i].p_id==p_info.p_id){
                            $cookieArr[i].p_num = parseInt($cookieArr[i].p_num)+parseInt(p_info.p_num);
                            console.log(JSON.stringify($cookieArr));
                            $.cookie("cart",JSON.stringify($cookieArr),{ expires: 7 });
                            //关联购物车数量
                            getcartnum();
                            return
                        }
                    }
                    $cookieArr.push(p_info);
                    console.log(JSON.stringify($cookieArr));
                    $.cookie("cart",JSON.stringify($cookieArr),{ expires: 7 });
                }
                getcartnum();
            });


            //点击退出登录
            $("#quitlogin").on("click",function () {
                sessionStorage.removeItem("userinfo");
                location.reload();
            });
            //点击切换显示大图的效果
            $(".items ul").find("li").on("click",function () {
                $index = $(this).index();
                console.log($index);
                $(this).addClass("active").siblings().removeClass("active")
                if ($index==0){
                    $("#addCartImg").attr("src","http://img.ugoshop.com/images/201804/1524447050479096776.jpg");
                    $(".bigimg").attr("src","http://img.ugoshop.com/images/201804/1524447050469899933.jpg")
                }else if ($index==1){
                    $("#addCartImg").attr("src","http://img.ugoshop.com/images/201804/1524447055861886699.jpg");
                    $(".bigimg").attr("src","http://img.ugoshop.com/images/201804/1524447055442535482.jpg")
                }else {
                    $("#addCartImg").attr("src","http://img.ugoshop.com/images/201804/1524447055835919952.jpg");
                    $(".bigimg").attr("src","http://img.ugoshop.com/images/201804/1524447055144009490.jpg")
                }
            })
            //点击右边按钮
            var $items_num=0;
            $(".next").on("click",function () {
                $items_num++;
                if ($items_num>=2){
                    $items_num=2;
                }
                $($(".items ul").find("li")[$items_num]).addClass("active").siblings().removeClass("active");
                if ($items_num==0){
                    $("#addCartImg").attr("src","http://img.ugoshop.com/images/201711/1509581237153443334.jpg");
                    $(".bigimg").attr("src","http://img.ugoshop.com/images/201711/1509581237781592892.jpg")
                }else if ($items_num==1){
                    $("#addCartImg").attr("src","http://img.ugoshop.com/images/201711/1509581242418895013.jpg");
                    $(".bigimg").attr("src","http://img.ugoshop.com/images/201711/1509581241604244887.jpg")
                }else {
                    $("#addCartImg").attr("src","http://img.ugoshop.com/images/201711/1509581242037769350.jpg");
                    $(".bigimg").attr("src","http://img.ugoshop.com/images/201711/1509581242433155183.jpg")
                }
            })
            //点击左边按钮
            $(".prev").on("click",function () {
                $items_num--;
                if ($items_num<=0){
                    $items_num=0;
                }
                $($(".items ul").find("li")[$items_num]).addClass("active").siblings().removeClass("active");
                if ($items_num==0){
                    $("#addCartImg").attr("src","http://img.ugoshop.com/images/201711/1509581237153443334.jpg");
                    $(".bigimg").attr("src","http://img.ugoshop.com/images/201711/1509581237781592892.jpg")
                }else if ($items_num==1){
                    $("#addCartImg").attr("src","http://img.ugoshop.com/images/201711/1509581242418895013.jpg");
                    $(".bigimg").attr("src","http://img.ugoshop.com/images/201711/1509581241604244887.jpg")
                }else {
                    $("#addCartImg").attr("src","http://img.ugoshop.com/images/201711/1509581242037769350.jpg");
                    $(".bigimg").attr("src","http://img.ugoshop.com/images/201711/1509581242433155183.jpg")
                }
            })


            //页面下拉时固定在顶部的div
            var $tab_offset = $(".tab").offset();
            $(window).scroll(function () {
                if ($(window).scrollTop()>=$tab_offset.top){
                    console.log(11);
                    $(".tab").addClass("fixed-bar");
                    $(".ext").show()
                }else {
                    $(".tab").removeClass("fixed-bar");
                    $(".ext").hide()
                }
            })


            //锚点效果
            $(".tab-select").find("a").on("click",function () {
                var $tab_select_index = $(this).index();
                $(this).addClass("active").siblings().removeClass("active");
                if ($tab_select_index==0){
                    $(window).scrollTop($(".details").offset().top)
                }else if($tab_select_index==1){
                    $(window).scrollTop($(".comment").offset().top)
                }else {
                    $(window).scrollTop($(".service").offset().top)
                }

            })


            //图片放大镜效果
            //核心公式    小区域/大区域=小图/大图
            //  小区域= (小图/大图) *大区域;
            //求出比例   小图/小区域=大图/大区域
            var $smallarea = $(".sale-out");//小区域
            var $smallimg = $("#addCartImg");//小图
            var $bigarea = $(".zoomdiv");//大区域
            var $bigimg = $(".bigimg");//大图
            $smallarea_width = $smallimg.width()/$bigimg.width()*$bigarea.width();
            $smallarea_height = $smallimg.height()/$bigimg.height()*$bigarea.height();
            $smallarea.show();
            // $smallarea.width($smallarea_width);
            // $smallarea.height($smallarea_height);
            //鼠标进入时，可用移动小区域
            $(".preview").on("mouseenter",function (e) {
                $smallarea.show();
                $bigarea.show();
                var $dix = $(".preview").offset().left+$smallarea.width()/2;
                var $diy = $(".preview").offset().top+$smallarea.width()/2;
                $(window).on("mousemove",function (e) {
                    var $smallarea_left = e.pageX-$dix;
                    var $smallarea_top = e.pageY-$diy;
                    if ($smallarea_left<=0){
                        $smallarea_left=0
                    }
                    if ($smallarea_left>=$(".preview").width()-$smallarea.width()){
                        $smallarea_left = $(".preview").width()-$smallarea.width()
                    }
                    if ($smallarea_top<=0){
                        $smallarea_top=0
                    }
                    if ($smallarea_top>=$(".preview").height()-$smallarea.height()){
                        $smallarea_top = $(".preview").height()-$smallarea.height()
                    }
                    $smallarea.css({
                        left:$smallarea_left,
                        top:$smallarea_top
                    })
                    //大图跟随小图移动
                    var $move_scale = $bigimg.width()/$smallimg.width();
                    $bigimg.css({
                        position:"absolute",
                        left:-$smallarea_left*$move_scale,
                        top:-$smallarea_top*$move_scale
                    })
                })
            })
            $(".preview").on("mouseleave",function () {
                $(window).off("mousemove");
                $smallarea.hide();
                $bigarea.hide();
            })

            //购物车飞入效果
            $(".sh-shopping-cart").on("click",function () {
                console.log($(".sh-shopping-cart").offset().top - $(".bar-top").offset().top);
                $($(".items").find("img")[0]).clone(true).appendTo($("div.add-cart")).css({
                    position:"absolute",
                    height:58,
                    width:58
                }).animate({
                    width:0,
                    height:0,
                    left:$(".fly-cart").offset().left-$(".sh-shopping-cart").offset().left,
                    top:$(".fly-cart").offset().top-$(".sh-shopping-cart").offset().top
                },1000,function (o) {
                    this.remove();
                })
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

            //全选


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