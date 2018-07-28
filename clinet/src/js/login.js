require(["config"],function () {
    require(["jquery","jquery.md5","jquery.cookie","jquery.validate","additional-methods","gVerify"],function () {
        $(function () {
            $("footer").load("bottom.html",function () {
                console.log("底部加载完成");
            })
            //验证码
            var verifyCode = new GVerify("yzmshow");
            $(".code_refresh").on("click",function () {
                verifyCode.refresh()
            });
            $.validator.addMethod("checkYzm",function (val) {
                if (verifyCode.options.code.toLowerCase()==val){
                    return true
                }else {
                    return false
                }
            });
            //关闭遮罩层
            $(".p_icon_close").on("click",function () {
                $(".masked").hide();
                $(".popups").hide()
            });
            //记住用户效果
            if (sessionStorage.getItem("jzuname")!=null){
                $("#utel").val(sessionStorage.getItem("jzuname"))
            }
            console.log($("#jzuname").prop("checked"));


            $("#myFrom").validate({
                submitHandler: function(form){
                    console.log($.md5($("#upwd").val()));
                    $.ajax({
                        type:"POST",
                        url:"http://10.41.151.21/work/usgoshop/server/login.php",
                        dataType:"json",
                        data:{
                            "utel":$("#utel").val(),
                            "upwd":$.md5($("#upwd").val())
                        }
                    }).then(function (res) {
                        if (res.status==1){
                            window.location.href ="http://10.41.151.21/work/usgoshop/clinet/src/index1.html";
                            sessionStorage.setItem("userinfo",res.data.utel);
                            if ($("#jzuname").prop("checked")){
                                sessionStorage.setItem("jzuname",res.data.utel);
                            }
                        }else {
                            $(".masked").show();
                            $(".popups").show()
                        }
                    });
                    return false
                },
                rules:{
                    utel:{
                        required:true
                    },
                    upwd:{
                        required:true
                    },
                    yzm:{
                        required:true,
                        checkYzm:true
                    }
                },
                messages:{
                    utel:{
                        required:"请输入您注册的手机号/邮箱/昵称"
                    },
                    upwd:{
                        required:"请输入密码"
                    },
                    yzm:{
                        required:"请输入验证码",
                        checkYzm:"验证码错误"
                    }
                },
                focusInvalid:false,
                errorElement:"span",
            })
        })
    })
})