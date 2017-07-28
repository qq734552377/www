<?php

	require_once('connect.php');

	$strSql="select product_modle from product_modle;";
     
    returnJsonFromDataBase( $strSql,"product_modle");

	 mysql_close($link);