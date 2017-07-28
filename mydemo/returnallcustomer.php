<?php

	require_once('connect.php');

	 $strSql="select customer_name from customer";
     
    returnJsonFromDataBase($strSql,"customer_name");
	  mysql_close($link);