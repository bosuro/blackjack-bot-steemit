<?php
include_once("config.php");

$game = 'not found';
$gameinfo = '';

$game = $_GET['game'];

$player = "steem";

$query = $db->prepare('SELECT * FROM games WHERE id = ?');
$query->bind_param('d', $game);

$query->execute();

$result = $query->get_result();
while ($row = $result->fetch_assoc()) {
	$player = $row['player'];
	$state = $row['stats'];
	$ptotal = $row['playerTotal'];
	$htotal = $row['houseTotal'];
	$playercards = array($row['player1'], $row['player2'], $row['player3'], $row['player4'], $row['player5'], 0);
	$housecards = array($row['house1'], $row['house2'], $row['house3'], $row['house4'], $row['house5'], 0);
	$bet = $row['bet'];
	$reward = $row['reward'];
	$timestamp = $row['timestamp'];
}

if(isset($state))
{
	if($state == 0)
	{
		$gamestate = "Game is in progress";
		if($playercards[2] == 0)
		{
			$gameinfo = '<h4>You drew '.$playercards[0].' and '.$playercards[1].'. Total: '.$ptotal.'.</h4><h4>House drew '.$housecards[0].'.</h4><h3>Do you want to <a href="hit.php?username='.$player.'&game='.$game.'">hit</a> or <a href="stand.php?username='.$player.'&game='.$game.'">stand</a>?</h3>';
		}
		else if($playercards[3] == 0) {
			$gameinfo = '<h4>You drew '.$playercards[0].', '.$playercards[1].' and '.$playercards[2].'. Total: '.$ptotal.'.</h4><h4>House drew '.$housecards[0].'.</h4><h3>Do you want to <a href="hit.php?username='.$player.'&game='.$game.'">hit</a> or <a href="stand.php?username='.$player.'&game='.$game.'">stand</a>?</h3>';
		}
		else if($playercards[4] == 0) {
			$gameinfo = '<h4>You drew '.$playercards[0].', '.$playercards[1].', '.$playercards[2].' and '.$playercards[3].'. Total: '.$ptotal.'.</h4><h4>House drew '.$housecards[0].'.</h4><h3>Do you want to <a href="hit.php?username='.$player.'&game='.$game.'">hit</a> or <a href="stand.php?username='.$player.'&game='.$game.'">stand</a>?</h3>';
		}
		else {
			$gameinfo = '<h4>You drew '.$playercards[0].', '.$playercards[1].', '.$playercards[2].', '.$playercards[3].' and '.$playercards[4].'. Total: '.$ptotal.'.</h4><h4>House drew '.$housecards[0].'.</h4><h3>Do you want to <a href="hit.php?username='.$player.'&game='.$game.'">hit</a> or <a href="stand.php?username='.$player.'&game='.$game.'">stand</a>?</h3>';
		}
	}
	else if($state == 1) {
		$gamestate = "Game won";
		$gameinfo = '<h4>You drew ';
		for($i=0;$i<=4;$i++)
		{
			if($playercards[$i] != 0 && $playercards[$i+1] != 0)
				$gameinfo .= $playercards[$i].", ";
			else if($playercards[$i] != 0) {
				$gameinfo = substr($gameinfo, 0, -2);
				$gameinfo .= " and ".$playercards[$i].".";
			}
		}
		$gameinfo .='</h4><h4>House drew ';
		for($i=0;$i<=4;$i++)
		{
			if($housecards[$i] != 0 && $housecards[$i+1] != 0)
				$gameinfo .= $housecards[$i].", ";
			else if($housecards[$i] != 0) {
				$gameinfo = substr($gameinfo, 0, -2);
				$gameinfo .= " and ".$housecards[$i].".";
			}
		}
	}
	else if($state == 2) {
		$gamestate = "Game lost";
		$gameinfo = '<h4>You drew ';
		for($i=0;$i<=4;$i++)
		{
			if($playercards[$i] != 0 && $playercards[$i+1] != 0)
				$gameinfo .= $playercards[$i].", ";
			else if($playercards[$i] != 0) {
				$gameinfo = substr($gameinfo, 0, -2);
				$gameinfo .= " and ".$playercards[$i].".";
			}
		}
		$gameinfo .='</h4><h4>House drew ';
		for($i=0;$i<=4;$i++)
		{
			if($housecards[$i] != 0 && $housecards[$i+1] != 0)
				$gameinfo .= $housecards[$i].", ";
			else if($housecards[$i] != 0) {
				$gameinfo = substr($gameinfo, 0, -2);
				$gameinfo .= " and ".$housecards[$i].".";
			}
		}
	}
	else
	{
		$gamestate = "Draw";
		$gameinfo = '<h4>You drew ';
		for($i=0;$i<=4;$i++)
		{
			if($playercards[$i] != 0 && $playercards[$i+1] != 0)
				$gameinfo .= $playercards[$i].", ";
			else if($playercards[$i] != 0) {
				$gameinfo = substr($gameinfo, 0, -2);
				$gameinfo .= " and ".$playercards[$i].".";
			}
		}
		$gameinfo .='</h4><h4>House drew ';
		for($i=0;$i<=4;$i++)
		{
			if($housecards[$i] != 0 && $housecards[$i+1] != 0)
				$gameinfo .= $housecards[$i].", ";
			else if($housecards[$i] != 0) {
				$gameinfo = substr($gameinfo, 0, -2);
				$gameinfo .= " and ".$housecards[$i].".";
			}
		}
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
			<center><h1>Game ID - <?php echo $game; ?></h1>
					<h3>Game started at: <?php echo date('Y-m-d H:i:s', $timestamp); ?></h3>
					<h3><?php echo $gamestate; ?></h3><br></center>
			<center>
				<?php echo $gameinfo; ?>
				<br><br>
				<a href="search.php?username=<?php echo $player;?>">Go back</a>
			</center>
		</div>
	</body>
</html>