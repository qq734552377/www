<?php

	require_once('connect.php');

	$strSql="select handle_ways from handle;";

    returnJsonFromDataBase( $strSql,"handle_ways");
	 mysql_close($link);