<?php
include_once("config.php");

$name = '';

$name = $_GET['username'];

?>
<html>
	<head>
	</head>
	<body>
		<form action="placebet.php" method="get">
			<h3>Enter amount to bet in SBD:</h3>
			<input type="number" name="bet" step=".001"></input>
			<input type="hidden" name="username" value="<?php echo $name; ?>"></input>
			<input type="submit" value="Submit"></input>
		</form>
	</body>
</html>