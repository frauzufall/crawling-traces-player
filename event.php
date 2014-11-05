<div id="drawing">
		<canvas id="myCanvas" width="1000" height="600"></canvas>
</div>

<div class="left wrapper additional">

	<div class="left clear description">
		<span class="left">Group: </span>
		<select id="group-menu" onchange="goToPage(this.value)">
		
			<?php
			
				function getDirectory( $path = '.') {
					
					$ignore = array( '.', '..' );

					$dh = @opendir( $path );
					$dirArray;

					while( false !== ( $file = readdir( $dh ) ) ) {
						if( !in_array( $file, $ignore ) ) {

							if(is_dir( "$path/$file" ) ) {
								
								$dirArray[] = $file;
								
							}
						}
					}
					
					closedir( $dh );
					
					sort($dirArray);
					
					return $dirArray;
					
				}
			
				$groups = getDirectory("history");
				
				for($i = 0; $i < sizeof($groups); $i++) {
					$dir = $groups[$i];
					if($dir == $group)
						echo "<option selected value='".parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH)."?group=$dir'>$dir</option>";
					else
						echo "<option value='".parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH)."?group=$dir'>$dir</option>";
				}
				
			
			?>
		
		</select>
		<div class="clear"></div>
	</div>
	
	<div class="left clear description">
		<span class="clear left">Event: </span>
		<select id="event-menu" onchange="if (this.selectedIndex!==0) {goToPage(this.value)}">
					
			<option selected>No event selected</option>
		
			<?php
			
				$events = getDirectory("history/$group/");
					
				for($i = 0; $i < sizeof($events); $i++) {
					$evt = $events[$i];
					echo "<option value='".parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH)."?group=$group&event=$evt'>$evt</option>";
				} 
			
			?>
		
		</select>
		<div class="clear"></div>
	</div>
	
	<?php

		function getDrawings($container, $f_path = '.') {
			
			$f_ignore = array( '.', '..' );

			$f_dh = @opendir( $f_path );

			while( false !== ( $f_file = readdir( $f_dh ) ) ) {

				if( !in_array( $f_file, $f_ignore ) ) {

					if(!is_dir( "$f_path/$f_file" ) ) {
						
						$container[] =  $f_file;
					}
				}
			}
			
			closedir( $f_dh );
			
			return $container;
			
		} 
		
		$folder = 'history/'.$group."/".$event;
		$drawings = array();
		$drawings = getDrawings($drawings, $folder);
		
	?>
	
	<script type="text/javascript">
		var _event = "<?php echo $event?>";
		var _group = "<?php echo $group?>";
		var _files = new Array();
		<?php 
		
			for($i = 0; $i < sizeof($drawings); $i++) {
				echo("_files.push('".$drawings[$i]."');");
			}
			
		?>
	</script>
	

	<script type="text/javascript" src="Drawing.js"></script>
	<script type="text/javascript" src="magic.js"></script>


	<h1><?php echo $group;?></h1>
	<h2><?php echo $event;?></h2>

	<div id="progressbar" class="description">Loading...</div>


</div>

<div class="wrapper" id ="control"> 
	<div id="player-menu" class="panel additional">
		<div class="buttons">
			<div id="play" class="left button icon-play-1"></div>
			<div id="pause" class="left button icon-pause-1"></div>
			<div id="stop" class="left button icon-stop-1"></div>
			
			<select id="speed" class="right button">
				<option value="1">*1</option>
				<option value="2">*2</option>
				<option value="4">*4</option>
				<option value="8">*8</option>
				<option value="16">*16</option>
				<option value="32">*32</option>
			</select>
			<span class="right">Speed:</span>
			
			<select id="fps" class="right button">
				<option value="2">2</option>
				<option value="6">6</option>
				<option value="10">10</option>
				<option value="20">20</option>
			</select>
			<span class="right">FPS:</span>
			<div style="clear: both;"></div>
		</div>
		<div id="timeline">
			<div id="slider" class="button"></div>
		</div>
	</div>		
	<div id="timestamp" class="left"></div>
</div>
