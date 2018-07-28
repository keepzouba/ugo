<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/6
 * Time: 19:54
 */
include "config.php";
if ($_SERVER["REQUEST_METHOD"]=="GET"){
    if (!empty($_REQUEST["utel"])){
//        $p_id = $_REQUEST["p_id"];
//        $p_num= $_REQUEST["p_num"];
//        $p_price = $_REQUEST["p_price"];
//        $p_img = $_REQUEST["p_img"];
//        $p_title = $_REQUEST["p_title"];
//        $p_style = $_REQUEST["p_style"];
        //登录状态根据用户tel返回购物车信息
        $u_tel = $_REQUEST["utel"];
        //准备sql语句
        $cart_sql = "SELECT *FROM cart WHERE u_tel=?";
        //预处理
        $ycl = $cnct->prepare($cart_sql);
        $ycl->bind_param("s",$u_tel);
        $ycl->execute();
        $result = $ycl->get_result();
        $fh_result = array("status"=>"0","msg"=>"请求失败");
        if ($result->num_rows>=1){
            $resultArray = array();
            while($rows=$result->fetch_assoc()) {
                $infoArray = array();
                $infoArray["p_id"] = $rows["p_id"];
                $infoArray["p_num"] = $rows["p_num"];
                $infoArray["p_price"] = $rows["p_price"];
                $infoArray["p_img"] = $rows["p_img"];
                $infoArray["p_title"] = $rows["p_title"];
                $infoArray["p_style"] = $rows["p_style"];
                array_push($resultArray,$infoArray);
            }
            $fh_result["data"] = $resultArray;
            $fh_result["msg"] = "请求成功";
            $fh_result["status"]=1;
        }
        print_r(json_encode($fh_result));
    }else{
        $fh_result = array("status"=>"-1","msg"=>"不存在该用户");
        print_r(json_encode($fh_result));
    }
}

