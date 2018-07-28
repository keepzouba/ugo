require(["config"],function () {
    require(["jquery","jquery.validate","additional-methods","jquery.md5","jquery.cookie","gVerify"],function () {
        $(function () {
            $("footer").load("bottom.html",function () {
                console.log("底部加载完成");
            })
            //手机号码验证
            $.validator.addMethod("checktel",function (val) {
                return /^\d{11}$/.test(val)
            })
            //验证手机号码是否存在

            // $.validator.addMethod("checkIstel",function (val) {
            //    function checktelajax() {
            //        var $flag = null;
            //        $.ajax({
            //            url:"http://127.0.0.1/work/usgoshop/server/checkIstel.php",
            //            type:"POST",
            //            data:{
            //                "utel":$("#utel").val()
            //            }
            //        }).then(function (res) {
            //            console.log(res);
            //            if (res.status==1){
            //                $flag=true
            //            } else {
            //                $flag= false
            //            }})
            //        console.log($flag);
            //        return $flag;
            //    }
            //    var $result = checktelajax();
            //     console.log($result);
            // })

            //短信验证码验证
            //随机生成短信验证码
            function yzmrandom(){
                var str = "";
                for (var i =0;i<4;i++){
                    var num = parseInt(Math.random()*10)
                    str +=num+"";
                }
                return str
            }
            //获取短信验证码
            $("#getdxyzm").on("click",function () {
                $yzm = yzmrandom();
                alert("您的短信验证码为:"+$yzm);
                sessionStorage.setItem("dxyzm",$yzm);
            })
            //短信验证方法
            $.validator.addMethod("checkydxzm",function (val) {
                if ($("#dxyzm").val()==sessionStorage.getItem("dxyzm")) {
                    return true
                }else {
                    return false
                }
            });

            //验证码验证
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
            $("#myFrom").validate({
                onfocusout:function(element) {
                    // if ($(element).parent("li").find("input")[0].name=="upwd") {
                        $(element).valid();
                    // }
                },
                submitHandler: function(form){
                    $.ajax({
                        type:"POST",
                        url:"http://10.41.151.21/work/usgoshop/server/register.php",
                        dataType:"json",
                        data:{
                            "utel":$("#utel").val(),
                            "upwd":$.md5($("#upwd").val())
                        }
                    }).then(function (res) {
                        if (res.status==1){
                            if (confirm("是否立即跳转到登录界面")){
                                window.location.href ="login.html";
                            }
                        }else {
                            alert("注册失败")
                        }
                    });
                    return false
                },
                rules:{
                    utel:{
                        required:true,
                        rangelength:[6,20],
                        checktel:true,
                        remote:"http://10.41.151.21/work/usgoshop/server/checkIstel.php"
                    },
                    yzm:{
                        required:true,
                        checkYzm:true
                    },
                    upwd:{
                        required:true,
                        rangelength:[6,20],
                    },
                    qrupwd:{
                        equalTo:"#upwd"
                    },
                    chedxyzm:{
                        required:true,
                        checkydxzm:true
                    }
                },
                messages:{
                    utel:{
                        required:"请输入常用的手机号",
                        rangelength:"手机号码格式错误",
                        checktel:"手机号码格式错误",
                        remote:"手机号码已存在，请直接登录"
                    },
                    yzm:{
                        required:"请输入验证码",
                        checkYzm:"验证码错误"
                    },
                    upwd:{
                        required:"请输入密码",
                        rangelength:"6到20为字符，可用使用字母、数字或符号的组合",
                    },
                    qrupwd:{
                        equalTo:"两次输入的密码不一致"
                    },
                    chedxyzm:{
                        required:"请点击短信验证码获取",
                        checkydxzm:"验证码错误"
                    }
                },
                focusInvalid:false,
                errorElement:"span",
                errorPlacement: function(error, element) {
                    console.log(element);
                    error.appendTo( element.parent("div"));
                },
                success: function(span){
                    span.removeClass("error").addClass("dui")
                }
            })
        })
    })
})