<?php
include_once("config.php");

$name = '';
$game = 0;

$name = $_GET['username'];
$game = $_GET['game'];

$url = " https://steemconnect.com/sign/transfer?from=".$name."&to=".$botaccount."&amount=0.001%20SBD&memo=stand%20".$game."&redirect_uri=".$websiteadress."/view_game.php?game=".$game;

header("Location: ".$url);
die();
?>