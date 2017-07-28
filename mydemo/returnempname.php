<?php

	require_once('connect.php');

	$strSql="select emp_name from emp;";

    returnJsonFromDataBase( $strSql,"emp_name");
	 mysql_close($link);