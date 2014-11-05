<div style="width: 100%;height: 100%;background: url('intro.jpg') no-repeat center center; background-size: 100% auto;">
<div class="left wrapper">
	<h1>Crawling Traces History Viewer</h1>
	<div class="description left clear">Please pick a group:</div>
	<div class="description left clear">
	<select id=group-menu" onchange="if (this.selectedIndex!==0) {goToPage(this.value)}">
		
		<option selected>No group selected</option>
	
		<?php
		
			getDirectory('history/');

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
				
				for($i = 0; $i < sizeof($dirArray); $i++) {
					$dir = $dirArray[$i];
					echo "<option value='".parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH)."?group=$dir'>$dir</option>";
				}
			} 
		
		?>
	
	</select>
	<div class="clear"></div>
	</div>
	
</div>
</div>
