<?php
include_once("config.php");

$name = '';
$bet = 0;

$name = $_GET['username'];
$bet = $_GET['bet'];

$url = " https://steemconnect.com/sign/transfer?from=".$name."&to=".$botaccount."&amount=".$bet."%20SBD&memo=play%20blackjack&redirect_uri=".$websiteadress."/search.php?username=".$name;

header("Location: ".$url);
die();
?>