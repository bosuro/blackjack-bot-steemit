<?php


//Database Connect
$host = "localhost";
$user = "root";
$pass = "";
$database = "jackpotsteem";

$db = mysqli_connect($host, $user, $pass, $database);

if (mysqli_connect_errno())
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//Website Info
$sitename = "Blackjack for Steemit";
$websiteadress = "localhost";

$botaccount = "meme-bot";

?>