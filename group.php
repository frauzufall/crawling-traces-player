<div style="width: 100%;height: 100%;background: url('history/<?php echo $group; ?>/scene.jpg') no-repeat center center; background-size: 100% auto;">

	<div class="left wrapper additional">
	
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
		
		
				
		<?php


			echo("<h1>$group</h1>");
			
			include("history/$group/description.php");
			
		?>
		
		<div class="description" style="margin-top:20px;">
			<span class="left">Select event: </span>
			<select id="event-menu" class="right" onchange="if (this.selectedIndex!==0) {goToPage(this.value)}">
				
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
	
	</div> <!-- .wrapper -->


</div>
