<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/7
 * Time: 10:36
 */
include "config.php";
if ($_SERVER["REQUEST_METHOD"]=="GET") {
    $pnum = $_REQUEST["p_num"];
    $utel = $_REQUEST["u_tel"];
    $pid = $_REQUEST["p_id"];

    $insertSQL = "UPDATE cart SET p_num ='".$pnum."'  WHERE u_tel ='".$utel."' AND p_id ='".$pid."'";
    $result1 = $cnct->query($insertSQL);
    $resultArr = array("status"=>0,"msg"=>"修改失败");
    if ($result1>=1){
        $resultArr["status"]=1;
        $resultArr["msg"]="修改成功";
    }
    print_r(json_encode($resultArr));
}else{
    $resultArr = array("status"=>0,"msg"=>"使用GET请求");
    print_r(json_encode($resultArr));
}