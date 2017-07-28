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
     $link=connect();
 

       

    function connect(){
       //2. 连接数据库
       $link=mysql_connect("localhost:3800","root","root");//连接数据库
       if(!$link) echo "系统异常，请稍后再试";//如果连接数据库失败
       mysql_select_db("repair", $link); //选择数据库
       mysql_query("set names 'utf8'");  // 解决中文乱码
       return $link;
    }





    function disconnect(){
      if ($link ==null) {
        return;
      }

      mysql_close($link);
    }

    function returnJsonFromDataBase($strSql,$key_name){
       $result = mysql_query($strSql); //获取数据集    

       $users=null;$u=null;$user;$i=0;
       while($row=mysql_fetch_array($result))
       {
           $user["header_msg"]=$row[$key_name];
            $u[$i++]=$user;
       }
        if(is_null($u)){
          $users['result']="error";
          $users['msg']="没有数据";
          $users['count']="0";
        }else{
          $users['result']="true";
          $users['msg']="查询成功";
          $users['count']=$i;
          $users['date']=$u;
        }
        echo urldecode(json_encode($users));
    }