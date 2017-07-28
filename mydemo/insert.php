<?php


	require_once('connect.php');

		$method =$_SERVER['REQUEST_METHOD'];
	$result =null;

  if ($method == 'POST'){




  	$customer_name=$_POST['customer_name'];
  	$product_modle=$_POST['product_modle'];
  	$work_order_type=$_POST['work_order_type'];
  	$product_id=$_POST['product_id'];
  	$troubles=$_POST['troubles'];
  	$handle_ways=$_POST['handle_ways'];
  	$login_id=$_POST['login_id'];
  	$create_date=$_POST['create_date'];
  	$handle_message=$_POST['handle_message'];
  	$alter_login_id=$_POST['alter_login_id'];
  	$gps=$_POST['gps'];

  	$sql="INSERT INTO workorder VALUES (
  		NULL,
  		'$customer_name',
  		'$product_modle',
  		'$work_order_type',
  		'$product_id',
  		'$troubles',
  		'$handle_ways',
  		'$login_id',
  		'$create_date',
  		'$handle_message',
  		'$alter_login_id',
  		NULL,
  		'$gps'
  	)";
  	

	if (!mysql_query($sql,$link)){
		$result['result']="error";
		$result['msg']="添加失败";
	 }else{
		$result['result']="true";
		$result['msg']="添加数据成功";
	}
	echo urldecode(json_encode($result));	

	mysql_close($link);


}