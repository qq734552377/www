<?php


	require_once('connect.php');

	$method =$_SERVER['REQUEST_METHOD'];
	$result =null;

  if ($method == 'POST'){
  	$customer_name=$_POST['customer_name'];
  	$product_modle=$_POST['product_modle'];
  	$troubles=$_POST['troubles'];
  	$start_date=$_POST['start_date'];
  	$end_date=$_POST['end_date'];
  	$emp_name=$_POST['emp_name'];
  	$product_id=$_POST['product_id'];
  	$login_id=$_POST['login_id'];


  	if ($product_id) {
  		$sql="select * from workorder where product_id='$product_id' ;";
  		querryWorkOrderTable($sql);
 		exit;
  	}


  	if ($customer_name) {
  		$customer_name="= '$customer_name' ";
  	}else{
  		$customer_name="<> '' ";
  	}


	if ($product_modle) {
  		$product_modle="= '$product_modle' ";
  	}else{
  		$product_modle="<> '' ";
  	}

	if ($troubles) {
  		$troubles="= '$troubles' ";
  	}else{
  		$troubles="<> '' ";
  	}

	
  	$create_date="DATE_FORMAT(create_date, '%Y-%m-%d') BETWEEN '$start_date' AND '$end_date' ";
  

  	if ($emp_name) {
  		$sql="select login_id from emp where emp_name='$emp_name';";
  		$r=mysql_query($sql);
        $emp_name_row=mysql_fetch_array($r);
        $emp_name=$emp_name_row['login_id'];
  		$emp_name="= '$emp_name' ";
  	}else{
  		$emp_name="= '$login_id' ";
  	}


  	$sql="select * from workorder where customer_name $customer_name AND product_modle $product_modle AND troubles $troubles AND login_id $emp_name AND $create_date;";

  	// echo $sql;
	querryWorkOrderTable($sql);

  }else{
  	//不是Post
  }



  mysql_close($link);


  function querryWorkOrderTable($sql){
		$r=mysql_query($sql);
	  	$workorders=null;$workorder;$i=0;
	  	while($row=mysql_fetch_array($r)){
	  		// print_r($row);
			 $workorder["work_order_number"]=$row["work_order_number"];
			 $workorder["customer_name"]=$row["customer_name"];
	         $workorder["product_modle"]=$row["product_modle"];
	         $workorder["work_order_type"]=$row["work_order_type"];
	         $workorder["product_id"]=$row["product_id"];
	         $workorder["troubles"]=$row["troubles"];
	         $workorder["handle_ways"]=$row["handle_ways"];

	         $login_id=$row['login_id'];

	         $sql="select emp_name from emp where login_id='$login_id';";
	         $emp_name_row=mysql_fetch_array(mysql_query($sql));

	         $workorder["emp_name"]=$emp_name_row["emp_name"];

	         $workorder["create_date"]=$row["create_date"];
	         $workorder["handle_message"]=$row["handle_message"];
	         $workorder["handle_message"]=$row["handle_message"];


	         $alter_login_id=$row['alter_login_id'];
			 $sql="select emp_name from emp where login_id='$alter_login_id';";
	         $emp_name_row=mysql_fetch_array(mysql_query($sql));
	         $workorder["alter_emp_name"]=$emp_name_row["emp_name"];

	         $workorder["alter_date"]=$row["alter_date"];
	         $workorder["gps"]=$row["gps"];


	         $workorders[$i++]=$workorder;


	  	}

	  	if(is_null($workorders)){
	  		$result['result']="error";
	  		$result['msg']="没有数据";
	  		$result['count']="0";
	  	}else{
			$result['result']="true";
			$result['msg']="查询成功";
			$result['count']="$i";
			$result['date']=$workorders;
		}
	  	echo urldecode(json_encode($result));
  }  