<!DOCTYPE html>
<html>
<head>
    <title>Crawling Traces History</title>
    <title>Crawling Traces History</title>
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
    <link rel="stylesheet" type="text/css" href="lib/jquery-ui.css"/>
    <link rel="stylesheet" href="css/fontello.css">
    <link rel="stylesheet" href="css/animation.css"><!--[if IE 7]>
    <link rel="stylesheet" href="css/fontello-ie7.css"><![endif]-->
    <link rel="stylesheet" type="text/css" href="style.css"/>
    <script type="text/javascript" src="lib/d3.v3.min.js"></script>
    <script type="text/javascript" src="lib/jquery.js"></script>
    <script type="text/javascript" src="lib/jquery-ui.js"></script>
    
    <script>
		function goToPage(url) {
			window.location.href = url;
		}
	</script>
    
</head>

<body>

<?php

	$abs_path = $_SERVER['SCRIPT_NAME'];
	$abs_path = substr($abs_path, 0, strrpos($abs_path, '/'));
			
	$root_path = $abs_path.'/';

	$event = $_GET['event'];
	$group = $_GET['group'];
	
	if(!file_exists("history/$group")) {
		$group = "";
	}
	
	if(empty($group) || !file_exists("history/$group/$event")) {
		$event = "";
	}
?>

<?php 

	if(!empty($group) && empty($event)) {
		include("group.php");
	}
	
	if(empty($event) && empty($group)) {
		include("intro.php");
	}
	
	if(!empty($event)) {
		include("event.php");
	}

?>

<div id="frauzufall"><a href="http://frauzufall.de" target="_blank">frauzufall</a></div>

</body>

</html>
