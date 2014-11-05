var folder_history = "history";
var folder_group = "";
var folder_event = "";
var svg_width, svg_height;
var show_width = 1000;
var show_height = 600;

var first_login = 100000000000000000;
var last_logout = 0;
var timestep = 0;

var slider;

var _svgs;
var drawings = [];
var drawings_num = 0;
var drawings_loaded = 0;
var loading_done = false;
                  
var svg_not_canvas = true;

var interval;
var playing = false;
var play_btn;
var speed = 2;

var fps = 10;

var progressbar;

var fadeout = null;

var sketch_scale_x = 1;
var sketch_scale_y = 1;
var sketch_translate_x = 0;
var sketch_translate_y = 0;
var use_sketch = false;

$(function() {
	
	$("select#event-menu option").filter(function() {
		return $(this).text() == _event; 
	}).prop('selected', true);
	
	$("select#event-menu option").filter(function() {
		return $(this).text() != _event; 
	}).prop('selected', false);
	
	progressbar = $( "#progressbar" );
	
	slider = $("#slider");
	
	slider.slider({
		slide: setTimer,
		change: setTimer,
		min: 0,
		max: 100,
		range: "min"
	});
	
	folder_event = _event;
	folder_group = _group;
	
	if(use_sketch) {
		loadSketch();
	}
	else {
		loadDrawings();
	}
	
	play_btn = $("#play");
	play_btn.click( function() {
		if(!playing) {
			if(timestep >= last_logout) {
				timestep = first_login;
			}
			startInterval();
		}
	});
	$("#pause").click(function() {
		if(playing) {
			stopInterval();
		}
	});
	$("#stop").click(function() {
		if(playing) {
			stopInterval();
		}
		timestep = first_login;
		slider.slider("value", timestep);
		draw(true);
	});
	
	$("#speed option[value="+speed+"]").attr('selected', 'selected');
	$("#fps option[value="+fps+"]").attr('selected', 'selected');
	$("#speed").change(function () {
		speed = $("#speed option:selected").attr("value");
	}).change();
	$("#fps").change(function () {
		fps = $("#fps option:selected").attr("value");
		if(playing) {
			stopInterval();
			startInterval();
		}
	}).change();
	
	$("html").mousemove(function() {
	  $(".additional").each(function() {
		  $(this).removeClass("hidden");
	  });
	  if (fadeout != null) {
		clearTimeout(fadeout);
	  }
	  if(loading_done)
		fadeout = setTimeout(hideAdditional, 3000);
	});
		
});

function loadSketch() {
	
	var url_sketch = folder_history + "/" + folder_group + "/sketch.xml";
	var url_sketch_bg = folder_history + "/" + folder_group + "/sketch.png";
		
	$.get(url_sketch, function(sketch_content) {
		sketch_scale_x = $(sketch_content).find("sketch scale x").text();
		sketch_scale_y = $(sketch_content).find("sketch scale y").text();
		sketch_translate_x = $(sketch_content).find("sketch translate x").text();
		sketch_translate_y = $(sketch_content).find("sketch translate y").text();
		
		loadDrawings();

	});
	
	$("#drawing").css({"background-image": "url('" + url_sketch_bg + "')"});
}

function loadDrawings() {

	_svgs = [];
	
	for(var i = 0; i < _files.length; i++) {
		
		var type = _files[i].split('.').pop();
		
		if(type == "svg") {
			
			var name = _files[i].split('.').shift();
			
			if(name !== "mapping") {
				_svgs.push(name);
			}
			
		}
	}
	
	drawings_num = _svgs.length;
	
	addDrawing(_svgs[drawings_loaded]);

}

function startInterval() {
	playing = true;
	play_btn.addClass("playing");
	interval = setInterval( function(){ 
		timestep+=1000/fps*speed; 
		if(timestep >= last_logout) {
			stopInterval();
			draw(true);
		}
		else {
			slider.slider("value", timestep);
			draw(false);
		}
	}, 1000/fps);
}

function stopInterval() {
	clearInterval(interval);
	playing = false;
	play_btn.removeClass("playing");
}

function addDrawing(name) {
	
	var url = folder_history + "/" + folder_group + "/" + folder_event + "/" + name;
	
	updateProgressbar();
	
	var svg_url = url+".svg";
	var xml_url = url+".xml";
	
	$.get(svg_url, function(_svg_content) {
		
		$.get(xml_url, function(_xml_content) {
			
			var drawing = new Drawing(_svg_content, _xml_content);
			
			drawing.prepare();
			
			if(drawing.start < first_login) { 
				first_login = drawing.start;
				slider.slider("option", "min", first_login)
				timestep = first_login;
			}
			if(drawing.end > last_logout) {
				last_logout = drawing.end;
				slider.slider("option", "max", last_logout);
			}
			
			if(drawings.length == 0) {
				svg_width = $(drawing.svg).find("svg").attr("width");
				svg_height = $(drawing.svg).find("svg").attr("height");
				reloadSizes();
			}

			if(svg_not_canvas) {
				
				if(drawings.length == 0) {
					
					canvas = $('canvas');
					canvas.remove();
									
					svgContainer = d3.select("#drawing").append("svg")
						.attr("width", show_width)
						.attr("height", show_height)
						.attr("viewBox", "-" + svg_width/sketch_scale_x*sketch_translate_x + " -" + svg_height/sketch_scale_y*sketch_translate_y + " " + svg_width/sketch_scale_x + " " + svg_height/sketch_scale_y)
						.attr("preserveAspectRatio", "xMinYMin meet");
				}
				
				drawing.lineGraph = svgContainer.append("path");
				
			}
			else {
				var canvas = document.getElementById('myCanvas');
				$(canvas).attr("width", show_width);
				$(canvas).attr("height", show_height);
			}
			
			drawings.push(drawing);
			
			draw(true);
			
			drawings_loaded++;
			
			if(drawings_loaded < drawings_num) {
				addDrawing(_svgs[drawings_loaded]);
			}
			
			updateProgressbar();
			
		});
	});
}

function draw(preview) {
	
	if(drawings_loaded < drawings_num)
		updateProgressbar();
	
	var d = new Date(timestep);
	$("#timestamp").html(d.toGMTString());
	svg_not_canvas ? drawSvg(preview) : drawCanvas(preview);
	
}

function drawSvg(preview)  {
	
	reloadSizes();
	
	var lineFunction = d3.svg.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; })
		.interpolate("linear");
	
	for(var i = 0; i < drawings.length; i++) {
		
		if(preview) {
			drawings[i].lineGraph.attr("d", lineFunction(drawings[i].line_data))
				.attr("stroke", drawings[i].color)
				.attr("stroke-width", 1)
				.attr("fill", "none")
				.attr("stroke-opacity", 0.5);
		}
		else {
			if(timestep >= drawings[i].start && timestep <= drawings[i].end) {
				drawings[i].setLimit(timestep);
				var show_data = drawings[i].line_data.slice(0,drawings[i].limit);
				drawings[i].lineGraph.attr("d", lineFunction(show_data))
					.attr("stroke", drawings[i].color)
					.attr("stroke-width", 1)
					.attr("fill", "none")
					.attr("stroke-opacity", 1);
			}
			else {
				drawings[i].lineGraph.attr("d", "M0 0");
			}
		}
		
	}
	
}

function drawCanvas(preview) {
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	
	ctx.save();

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.scale(show_width/svg_width, show_height/svg_height);
	
	for(var i = 0; i < drawings.length; i++) {
		
		ctx.beginPath();
		
		ctx.strokeStyle="rgba(" + drawings[i].color_rgb["r"] + "," +drawings[i].color_rgb["g"] + "," + drawings[i].color_rgb["b"] + ",0.7)";
	
		if(preview) {
			
			if(drawings[i].line_data.length>0) {
				ctx.moveTo(drawings[i].line_data[0].x,drawings[i].line_data[0].y);
			}
			
			for(var j = 1; j < drawings[i].line_data.length; j++) {
				ctx.lineTo(drawings[i].line_data[j].x, drawings[i].line_data[j].y);
			}
			
		}
		else {
			
			if(timestep >= drawings[i].start && timestep <= drawings[i].end) {
				
				drawings[i].setLimit(timestep);
				var show_data = drawings[i].line_data.slice(0,drawings[i].limit);
				if(show_data.length>0) {
					ctx.moveTo(show_data[0].x, show_data[0].y);
				}
				for(var j = 1; j < show_data.length; j++) {
					ctx.lineTo(show_data[j].x, show_data[j].y);
				}
			}
			else {
			}
			
		}
		
		ctx.stroke();
		
	}
		   
	ctx.restore();
	
}

function updateProgressbar() {
	var progress = 100*drawings_loaded/drawings_num;
	if(progress < 100) {
		progressbar.html(Math.ceil(progress) + "% - loading..");
	}
	else {
		loading_done = true;
		progressbar.html("Done.");
		progressbar.animate({"opacity": 0}, 1000, function() {
			$("#control").animate({"opacity": 1}, 300, function() {
				progressbar.remove();
			});	
		});
	}
}

function setTimer() {
	timestep = slider.slider("value");
	draw(false);
}
function hideAdditional() {
  $(".additional").each(function() {
	  $(this).addClass("hidden");
  });
}

function reloadSizes() {
	//console.log("reload sizes");
	show_width = $("#drawing").width();
	show_height = show_width*svg_height/svg_width;
	
	if(show_height > $("#drawing").height()) {
		show_height = $("#drawing").height();
		show_width = show_height*svg_width/svg_height;	
	}
//	console.log("svg_width: " + svg_width);
//	console.log("sketch_scale_x: " + sketch_scale_x);
	$("svg").attr("viewBox", "0 0 " + svg_width/sketch_scale_x + " " + svg_height/sketch_scale_y);
}
