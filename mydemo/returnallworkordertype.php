<?php

	require_once('connect.php');

	$strSql="select work_order_type from work_order_type;";

     returnJsonFromDataBase( $strSql,"work_order_type");
	 mysql_close($link);