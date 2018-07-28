<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/6
 * Time: 20:16
 */
include "config.php";
if ($_SERVER["REQUEST_METHOD"]=="GET") {
    $pnum = $_REQUEST["p_num"];
    $utel = $_REQUEST["u_tel"];
    $pid = $_REQUEST["p_id"];
    $pprice = $_REQUEST["p_price"];
    $pimg = $_REQUEST["p_img"];
    $ptitle = $_REQUEST["p_title"];
    $pstyle = $_REQUEST["p_style"];
    //准备sql语句
    $cart_sql = "SELECT *FROM cart WHERE u_tel=? AND p_id=?";
    //预处理
    $ycl = $cnct->prepare($cart_sql);
    $ycl->bind_param("ss",$utel,$pid);
    $ycl->execute();
    $result = $ycl->get_result();
    $infoArray = array();
    while($rows=$result->fetch_assoc()) {
        $infoArray["p_num"] = $rows["p_num"];
    }
    $pnum=$pnum+$infoArray["p_num"];
    if ($result->num_rows>=1){
        $insertSQL = "UPDATE cart SET p_num ='".$pnum."'  WHERE u_tel ='".$utel."' AND p_id ='".$pid."'";
        $result1 = $cnct->query($insertSQL);
        $resultArr = array("status"=>0,"msg"=>"修改失败");
        if ($result1>=1){
            $resultArr["status"]=1;
            $resultArr["msg"]="修改成功";
        }
        print_r(json_encode($resultArr));
    }else{
        $insertSQL = "INSERT INTO cart(u_tel,p_id,p_num,p_price,p_img,p_title,p_style) VALUE('".$utel."','".$pid."','".$pnum."','".$pprice."','".$pimg."','".$ptitle."','".$pstyle."')";
        $result2 = $cnct->query($insertSQL);
        $resultArr = array("status"=>0,"msg"=>"修改失败");
        if ($result2->num_rows>=1){
            $resultArr = array("status"=>0,"msg"=>"修改失败");
            $resultArr["status"]=1;
            $resultArr["msg"]="修改成功";
        }
        print_r(json_encode($resultArr));
    }

}else{
    $resultArr = array("status"=>0,"msg"=>"使用GET请求");
    print_r(json_encode($resultArr));
}