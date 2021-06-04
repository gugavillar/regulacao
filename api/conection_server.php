<?php
function getConnection()
{
	$dbuser = '';
	$dbpass = '';
	$dbh = new PDO('mysql:host=localhost;dbname=', $dbuser, $dbpass);
	$dbh->exec('set names utf8');
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}
?>