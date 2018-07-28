<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/5
 * Time: 16:43
 */
include "config.php";
if ($_SERVER["REQUEST_METHOD"]=="POST"){
    if (!empty($_REQUEST["utel"]) && !empty($_REQUEST["upwd"])){
        //准备sql语句
        $loginsearchSQL = "SELECT *FROM userinfo WHERE u_tel=? AND u_pwd=?";
        $ycl = $cnct->prepare($loginsearchSQL);
        //绑定参数
        $ycl->bind_param("ss",$_REQUEST["utel"],$_REQUEST["upwd"]);
        //执行
        $ycl->execute();
        $result = $ycl->get_result();
        $resultArr = array("status"=>1,"msg"=>"登录成功");
        if ($result->num_rows>=1){
            while ($rows = $result->fetch_array()){
                $infoArray = array();
                $infoArray["utel"] = $rows["u_tel"];
            }
            $resultArr["data"] = $infoArray;
            $_SESSION["userInfo"] = $infoArray;
            print_r(json_encode($resultArr));
        }else{
            $resultArr["status"]=0;
            $resultArr["msg"]="登录失败";
            print_r(json_encode($resultArr));
        }
    }
}