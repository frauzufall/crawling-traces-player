function Drawing(_svg, _xml) {
	
	this.svg = _svg;
	this.xml = _xml;
	
	this.timetable_content;
	
	this.line_data = [];
	this.limit = 0;

	this.lineGraph;
	this.timestamps = [];
	this.color;
	this.color_rgb;
	this.start = 0;
	this.end = 1;
	
	this.setLimit = function(t) {
		for(var i = 0; i < this.timestamps.length; i++) {
			if(t < this.timestamps[i]) {
				this.limit = i;
				return;
			}
		}
	}
	
	this.prepare = function() {
		
		var path_points = $(this.svg).find("path").attr("d").substring(1).split(",");
		this.color = $(this.svg).find("path").attr("stroke");
		this.color_rgb = hexToRgb(this.color);
		var _times = $(this.xml).find("timestamps");
		
		var _timestamps = [];
		
		var ts = $(_times).children("p");
		
		for (var ti = 0; ti < ts.length; ti++) {
			var tstr = $(ts[ti]).text();
			var tarr = tstr.split("-");
			var utc = Date.UTC(tarr[0],tarr[1]-1,tarr[2],tarr[3],tarr[4],tarr[5],tarr[6]);
			this.timestamps.push(utc);
		}		
		
		this.start = this.timestamps[0];
		this.end = this.timestamps[this.timestamps.length-1];
		
		if(path_points.length > 1) {
			
			var last_x = parseFloat(path_points[0]);
			var last_y = parseFloat(path_points[1]);
			
			this.line_data.push({
				"x": last_x, 
				"y": last_y
			});	
			
			for(var i = 1; i < path_points.length/2; i++) {				
				var _x = last_x + parseFloat(path_points[i*2]);
				var _y = last_y + parseFloat(path_points[i*2+1]);
				last_x = _x;
				last_y = _y;
				this.line_data.push({
					"x": _x, 
					"y": _y
				});
			}
			
			this.lines_shown = this.line_data.length;
			
		}
		
	}
	
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
