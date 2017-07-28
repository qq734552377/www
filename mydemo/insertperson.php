<?php


		// 声明字符编码
      header('Content-Type: application/json');
	  header('Content-Type: text/html;charset=utf-8');

	  // $firstName=$_POST["firstName"];
   //    $lastName=$_POST["lastName"];
   //    $age=$_POST["age"];
   //    $province=$_POST["province"];

       //2. 连接数据库
     $link=mysql_connect("localhost:3800","root","root");//连接数据库
     if(!$link) echo "系统异常，请稍后再试";//如果连接数据库失败
     mysql_select_db("my_db", $link); //选择数据库
     mysql_query("set names 'utf8'");  // 解决中文乱码

     $sql="SELECT * FROM PERSONS WHERE firstname='$_POST[firstname]' AND lastname='$_POST[lastname]'";

     $result=mysql_query($sql);
     if (mysql_fetch_array($result)) {
     	die("Error: 数据已存在于数据库中,不能重复插入");
     }

	$sql="INSERT INTO Persons
		  VALUES
	      ('$_POST[firstname]','$_POST[lastname]','$_POST[age]','$_POST[province]')";

	if (!mysql_query($sql,$link)){
	  die('Error: ' . mysql_error());
	 }
	echo "数据添加成功";

	mysql_close($link);