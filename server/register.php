<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/5
 * Time: 15:28
 */
include "config.php";
if($_SERVER["REQUEST_METHOD"]=="POST"){
    if (!empty($_REQUEST["utel"]) && !empty($_REQUEST["upwd"])){
        //准备sql语句
        $utelsearchSQL = "INSERT INTO userinfo(u_tel,u_pwd) VALUES(?,?)";
        //预处理
        $pretreatment = $cnct->prepare($utelsearchSQL);
        //绑定参数
        $pretreatment->bind_param("ss",$_REQUEST["utel"],$_REQUEST["upwd"]);
        //执行
        $pretreatment->execute();
        //获取结果
        $result = $pretreatment->get_result();

        $resultArr = array("status"=>"1","msg"=>"注册成功");
        print_r(json_encode($resultArr));
    }
}else{
    $resultArr = array("status"=>"-1","msg"=>"请使用POST请求");
    print_r(json_encode($resultArr));
}