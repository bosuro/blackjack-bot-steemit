<?php
include_once("config.php");
?>

<html>
	<head>
		<title><?php echo $sitename;?></title>
		<link rel="stylesheet" type="text/css" href="design.css">
	</head>
	<body>
		<div id="body">
			<center><h1>Steemit Blackjack Bot</h1></center>
			<center><div id="search">
				<form action="search.php" method="get">
					<p>Your Steemit Username</p>
					<input type="text" name="username"><br><br>
					<input type="submit" value="Submit">
				</form>
			</div></center>
		</div>
	</body>
</html>