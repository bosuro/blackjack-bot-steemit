<?php
include_once("config.php");

$name = '';

$name = $_GET['username'];

$games = "";

$query = $db->prepare('SELECT * FROM games WHERE player = ?');
$query->bind_param('s', $name);

$query->execute();

$result = $query->get_result();
while ($row = $result->fetch_assoc()) {
	if($row['stats'] == 0)
	{
		$id = $row['id'];
		$games = '<h3 id="progress" >Game in progress. <a href="view_game.php?game='.$id.'">Show</a></h3>'.$games;
	}
	else if($row['stats'] == 1)
	{
		$id = $row['id'];
		$games = '<h3 id="win" >Game won. <a href="view_game.php?game='.$id.'">Show</a></h3>'.$games;
	}
	else if($row['stats'] == 2)
	{
		$id = $row['id'];
		$games = '<h3 id="lose" >Game lost. <a href="view_game.php?game='.$id.'">Show</a></h3>'.$games;
	}
	else if($row['stats'] == 3)
	{
		$id = $row['id'];
		$games = '<h3 id="draw" >Draw. <a href="view_game.php?game='.$id.'">Show</a></h3>'.$games;
	}
}
?>

<html>
	<head>
		<title><?php echo $sitename;?></title>
		<link rel="stylesheet" type="text/css" href="design.css">
	</head>
	<body>
		<div id="body">
			<center><h1>Games of <?php echo $name; ?><h1></center>
			<center><h2><a href="startnewgame.php?username=<?php echo $name; ?>">Start new game.</a><h2></center>
						<center><a href="index.php">Go back</a></center>
			<center><?php echo $games; ?></center>
			
		</div>
	</body>
</html>