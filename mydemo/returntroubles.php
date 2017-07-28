<?php

	require_once('connect.php');

	$strSql="select troubles from trouble;";

    returnJsonFromDataBase( $strSql,"troubles");
	 mysql_close($link);