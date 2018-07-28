<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/5
 * Time: 15:29
 */
include "config.php";
if($_SERVER["REQUEST_METHOD"]=="GET"){
    if (!empty($_REQUEST["utel"])){
        //准备sql语句
        $utelsearchSQL = "SELECT *FROM userinfo WHERE u_tel=? ";
        //预处理
        $pretreatment = $cnct->prepare($utelsearchSQL);
        //绑定参数
        $pretreatment->bind_param("s",$_REQUEST["utel"]);
        //执行
        $pretreatment->execute();
        //获取结果
        $result = $pretreatment->get_result();
        //判断是否存在
        if ($result->num_rows>=1){
            print_r(json_encode(false));
        }
        else{
            $resultArr["status"]=1;
            $resultArr["msg"]="号码可用";
            print_r(json_encode(true));
        }
    }
}