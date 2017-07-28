<!DOCTYPE html>
<html>
<body>




<?php

  
  header('Content-Type: text/html;charset=utf-8');


$con = mysql_connect("localhost:3800","root","root");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

mysql_select_db("exam", $con);
mysql_query("set names 'UTF-8'");
$result = mysql_query("SELECT * FROM stu");

echo "<table border='1' style='border-collapse: collapse;width: 98%;
								margin: 0 auto;
								border: 1px solid #666666;
								box-shadow: 0 0 10px 0 rgba(0,0,0,.5);
								'>
<tr>
<th>Sname</th>
<th>age</th>
<th>Gander</th>
<th>Province</th>
</tr>";

while($row = mysql_fetch_array($result))
  {
  echo "<tr>";
  echo "<td>" . $row['sname'] . "</td>";
  echo "<td>" . $row['age'] . "</td>";
  echo "<td>" . $row['gander'] . "</td>";
  echo "<td>" . $row['province'] . "</td>";
  echo "</tr>";
  }
echo "</table>";

mysql_close($con);
?>

</body>
</html>