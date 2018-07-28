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
            };
            function getcookie(str){
                return $.cookie(str)?JSON.parse($.cookie(str)):[];
            }

            $mb_li = $($(".cart_form").find("li")[0]);
            //删除配置模板
            $($(".cart_form").find("li")[0]).remove();
            if (checklogin()){
                $(".top_nav_main_tool").find("li").addClass("yg-card");
                $($(".top_nav_main_tool").find("span")[0]).text("欢迎您，"+sessionStorage.getItem("userinfo"))
                $($(".top_nav_main_tool").find("a")[0]).attr("id","quitlogin");
                $($(".top_nav_main_tool").find("a")[0]).text("退出");
                //点击退出登录
                $("#quitlogin").on("click",function () {
                    sessionStorage.removeItem("userinfo");
                    location.reload();
                });
                //获取最新的购物车信息
                $.ajax({
                    url:"http://10.41.151.21/work/usgoshop/server/getcart.php",
                    type:"GET",
                    data:{
                        utel:sessionStorage.getItem("userinfo")
                    },
                    dataType:"json"
                }).then(function (res) {
                    console.log(res);
                    if (res.status==1){
                        for (var i =0;i<res.data.length;i++){
                            $mb_li.clone(true).appendTo($(".cart_form")).show().attr("pid",res.data[i].p_id);
                        }
                        //给每个商品配置信息
                        var $cartlist_length = $(".cart_form").find("li").length;
                        cartlistinfo($cartlist_length,res.data);
                        //初始化时计算一次总金额
                        getprice_sum();
                    }else {
                        var $checklogin_current_cartlist_num = $(".cart_form").find("li").length;
                        if ($checklogin_current_cartlist_num<=1 ){
                            $("#emptycart").show();
                            $("#cartlist").hide();
                        }
                    }
                })
            }else {
                //判断是否有购物车cookie
                if ($.cookie("cart")==undefined){
                    $("#emptycart").show();
                    $("#cartlist").hide();
                }else {
                    var $cartlist_cookie = JSON.parse($.cookie("cart"));
                    var $cartlist_cookie_length = $cartlist_cookie.length;
                    for (var i =0;i<$cartlist_cookie_length;i++){
                        $mb_li.clone(true).appendTo($(".cart_form")).show().attr("pid",$cartlist_cookie[i].p_id);
                    }
                    cartlistinfo($cartlist_cookie_length,$cartlist_cookie);
                }
            }

            //计算总金额和总数量
            function getprice_sum(){
                var $cartlistlength = $(".cart_form").find("li").length;
                var $sum_count = 0;
                var $sum_price=0;
                for (var n = 0;n<$cartlistlength;n++){
                    var $current_price = $($(".cart_form").find("li")[n]).find("div.c_sum").find("p").text();
                    var $current_sum = $($(".cart_form").find("li")[n]).find("div.c_quantity").find("input").val();
                    if ($($(".cart_form").find("li")[n]).find("div.c_check").find("input").prop("checked")==true){
                        $sum_price+=parseInt($current_price);
                        $sum_count+=parseInt($current_sum)
                    }
                }
                $(".c_paid").text($sum_price-10);
                $(".c_piece").find("i").text(parseInt($sum_count));
                $("#count_price").text($sum_price);

            }

            //全选效果
            $(".tit_check").find("input").on("click",function () {
                var $cartlistlength = $(".cart_form").find("li").length;
                var $thisflag = $(this).prop("checked");
                console.log($thisflag);
                for (var n = 0;n<$cartlistlength;n++){
                   $($(".cart_form").find("li")[n]).find("div.c_check").find("input").prop("checked",$thisflag)
                }
                getprice_sum();
            })
            //配置cartlist
            function cartlistinfo(length,ele) {
                for (var j =0;j<length;j++){
                    $($(".cart_form").find("li")[j]).find("img").attr("src",ele[j].p_img)
                    $($(".cart_form").find("li")[j]).find("p.m_tit").find("a").text(ele[j].p_title);
                    $($(".cart_form").find("li")[j]).find("p.c_price_num").find("i").text(ele[j].p_price);
                    $($(".cart_form").find("li")[j]).find("input.p_num").val(ele[j].p_num);
                    $($(".cart_form").find("li")[j]).find("div.c_sum").find("p").text(ele[j].p_num*ele[j].p_price);
                    //单选事件
                    $($(".cart_form").find("li")[j]).find("div.c_check").find("input").on("click",function () {
                        getprice_sum();
                    })
                    //给每个商品绑定点击事件   减少物品事件
                    $($($(".cart_form").find("li")[j]).find("div.c_amount").find("a")[0]).on("click",function () {
                        var this_num = parseInt($(this).parents("li").find("input.p_num").val());
                        this_num--;
                        if (this_num<=1){
                            this_num=1;
                            $(this).addClass("disabled")
                        }else {
                            $(this).removeClass("disabled")
                        }
                        $(this).parents("li").find("input.p_num").val(this_num);
                        //根据数量计算当前商品总金额
                        $(this).parents("li").find("div.c_sum").find("p").text($(this).parents("li").find("input.p_num").val()*$(this).parents("li").find("p.c_price_num").find("i").text())
                        //总金额重新计算
                        getprice_sum();
                        if (checklogin()){
                            //数据库同步商品数量
                            $.ajax({
                                url:"http://10.41.151.21/work/usgoshop/server/updatacart.php",
                                data:{
                                    p_num:parseInt($(this).parents("li").find("input.p_num").val()),
                                    u_tel:sessionStorage.getItem("userinfo"),
                                    p_id:$(this).parents("li").attr("pid")
                                },
                                type:"GET"
                            }).then(function (res) {
                                console.log(res);
                            })
                        } else {
                            //获取最新cookie
                            var $remove_cartlist_cookie = getcookie("cart");
                            for (var i =0;i<$remove_cartlist_cookie.length;i++){
                                if (sessionStorage.getItem("userinfo")==$remove_cartlist_cookie[i].u_tel && $(this).parents("li").attr("pid")==$remove_cartlist_cookie[i].p_id){
                                    $remove_cartlist_cookie[i].p_num = this_num;
                                    $.cookie("cart",JSON.stringify($remove_cartlist_cookie));
                                }
                            }
                        }
                    })
                    //给每个商品绑定点击事件   增加物品事件
                    $($($(".cart_form").find("li")[j]).find("div.c_amount").find("a")[1]).on("click",function () {
                        var this_num = parseInt($(this).parents("li").find("input.p_num").val());
                        this_num++;
                        if (this_num>=99){
                            this_num=99;
                            $(this).addClass("disabled")
                        }else {
                            $(this).removeClass("disabled")
                        }
                        $(this).parents("li").find("input.p_num").val(this_num);
                        //根据数量计算当前商品总金额
                        $(this).parents("li").find("div.c_sum").find("p").text($(this).parents("li").find("input.p_num").val()*$(this).parents("li").find("p.c_price_num").find("i").text())
                        //总金额重新计算
                        getprice_sum();
                        if (checklogin()){
                            //数据库同步商品数量
                            $.ajax({
                                url:"http://10.41.151.21/work/usgoshop/server/updatacart.php",
                                data:{
                                    p_num:parseInt($(this).parents("li").find("input.p_num").val()),
                                    u_tel:sessionStorage.getItem("userinfo"),
                                    p_id:$(this).parents("li").attr("pid")
                                },
                                type:"GET"
                            }).then(function (res) {
                                console.log(res);
                            })
                        } else {
                            //获取最新cookie
                            var $add_cartlist_cookie = getcookie("cart");
                            for (var i =0;i<$add_cartlist_cookie.length;i++){
                                if (sessionStorage.getItem("userinfo")==$add_cartlist_cookie[i].u_tel && $(this).parents("li").attr("pid")==$add_cartlist_cookie[i].p_id){
                                    $add_cartlist_cookie[i].p_num = this_num;
                                    $.cookie("cart",JSON.stringify($add_cartlist_cookie));
                                }
                            }
                        }
                    })
                    //给每行的删除按钮添加点击事件
                    $($(".cart_form").find("li")[j]).find("i.i_del").on("click",function () {
                        //删除当前行
                        $(this).parents("li").remove();
                        if (checklogin()){
                            $.ajax({
                                url:"http://10.41.151.21/work/usgoshop/server/removecart.php",
                                data:{
                                    u_tel:sessionStorage.getItem("userinfo"),
                                    p_id:$(this).parents("li").attr("pid")
                                },
                                type:"GET"
                            }).then(function (res) {
                                console.log(res);
                            })
                        }else {
                            //获取最新的cookie
                            var $del_cartlist_cookie = JSON.parse($.cookie("cart"));
                            for (var i =0;i<$del_cartlist_cookie.length;i++){
                                if (sessionStorage.getItem("userinfo")==$del_cartlist_cookie[i].u_tel && $(this).parents("li").attr("pid")==$del_cartlist_cookie[i].p_id){
                                    $del_cartlist_cookie.splice(i,1);
                                    if ($del_cartlist_cookie.length<=0){
                                        $.cookie("cart",null,{expires:-100});
                                        $("#emptycart").show();
                                        $("#cartlist").hide();
                                        return
                                    }else {
                                        //重新推回cookie
                                        $.cookie("cart",JSON.stringify($del_cartlist_cookie));
                                        return
                                    }
                                }
                            }
                        }
                        //获取最新的购物车列表数量
                        var $current_cartlist_num = $(".cart_form").find("li").length;
                        if ($current_cartlist_num<=0){
                            $("#emptycart").show();
                            $("#cartlist").hide();
                        }
                    })
                }
            }
        })
    })
})