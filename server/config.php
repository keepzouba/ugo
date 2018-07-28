<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/30
 * Time: 9:50
 */
//1.设置编码
// 客户端---> 服务器发送的 使用  text/JSON, text/html/  JavaScript/json
// 服务器--->客服端              application/json
// controller
// root  rem

header("Content-Type:application/json;charset=utf-8");
header("Access-Control-Allow-Origin:*");
session_start();
//链接数据的配置
$dbServerIp="127.0.0.1";
$dbUserName="root";
$dbUserPwd="";
$dbDataBase="ugoshop";
//2.创建链接 mysqli 面向对象连接数据的方式
// 3306 mysql的连接端口
$cnct=new mysqli($dbServerIp,$dbUserName,$dbUserPwd,$dbDataBase,3306);
//3.设置链接的字符集
mysqli_query($cnct,"set names utf8");