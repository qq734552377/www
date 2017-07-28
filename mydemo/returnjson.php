<?php



		// 声明字符编码
      header('Content-Type: application/json');
	  header('Content-Type: text/html;charset=utf-8');
      //设置允许跨域请求
      header("Access-Control-Allow-Origin: *");
      header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

     

     // $name=$_POST["name"];
     // $time=$_POST["time"];
     //2. 连接数据库
     $link=mysql_connect("localhost:3800","root","root");//连接数据库
     if(!$link) echo "系统异常，请稍后再试";//如果连接数据库失败
     mysql_select_db("my_db", $link); //选择数据库
     mysql_query("set names 'utf8'");  // 解决中文乱码
     
     //3. 查询数据库
     $strSql = "SELECT * FROM persons"; //SQL查询语句
    
     $result = mysql_query($strSql); //获取数据集
     
     //4. 循环读取数据并存入数组对象
     $users;$user;$i=0;
     while($row=mysql_fetch_array($result))
     {
         $user["firstname"]=$row["FirstName"];
         $user["lastname"]=$row["LastName"];
		 
         $user["age"]=$row["Age"];
         $user["province"]=$row["Province"];
         $users[$i++]=$user;
     }
     $method =$_SERVER['REQUEST_METHOD'];
     if ($method == 'POST'){
        $data = file_get_contents("php://input");
     
         if (!$data=='') {
             $user["name"]=$_POST['name'];
             $user["time"]=$_POST['time'];
             $users[$i]=$user;
         }
    }
     
     

     //5. 以json格式返回html页面
     echo urldecode(json_encode($users));
	 mysql_close($link);