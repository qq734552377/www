<?php

require_once('connect.php');


$method =$_SERVER['REQUEST_METHOD'];
$result;

  if ($method == 'POST'){
        $data = file_get_contents("php://input");
     
         if (!$data=='') {
             $strSql="select * from emp where login_id='$_POST[login_id]';";
			 $r=mysql_query($strSql);
			 $row=mysql_fetch_array($r);
			 // print_r($row);
			 if ($row) {
			 	$password=$row['password'];
			 	// echo "$password";

			 	if ($password== $_POST['password']) {
			 		$result['result']="true";
			 		$result['msg']="验证通过";

					
					$user['login_id']=$row['login_id'];
					$user['password']=$row['password'];
			 		$user['emp_name']=$row['emp_name'];
			 		$user['company_name']=$row['company_name'];
			 		$user['group_id']=$row['group_id'];
			 		$user['role']=$row['role'];
			 		$user['emp_phonenumber']=$row['emp_phonenumber'];
			 		$user['emp_emial']=$row['emp_emial'];
			 		$user['create_date']=$row['create_date'];

			 		$result['serviceman']=$user;

			 	}else{
					$result['result']="error";
					$result['msg']="用户密码错误";
			 	}
			 }else{
				$result['result']="error";
				$result['msg']="没有该用户";
			 }

			 
			 
			 
			 
         }else{
			 $result['result']="error";
			 $result['msg']="post请求没有数据";
		 }
    }else{
		$result['result']="error";
		$result['msg']="不能处理非POSt请求";
	}

echo urldecode(json_encode($result));
mysql_close($link);