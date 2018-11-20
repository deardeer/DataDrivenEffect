function GeometryDefiner(){
	var _this = this;
	this._geometryType = null;
	this._newClick = true;
	this._currectSelectId = null;
	this._validNextId = 0;

	this._moveVertex = false;
	this._moveCenter = false;
	this._resizeCenter = false;
	this._rotateCenter = false;
	this._init = function(){
	}
	this.beginMode = function(para){
		this.clearMode();
		this._geometryType = para.geotype;
		var liGeometryPos = para.liGeometryPos;
		if(para.type != undefined){
			//set unchecked
			var liinput = document.querySelectorAll('#geometryFinish input');
			liinput.forEach(function(d){
				d.checked = false;
			})
			document.querySelector('#geometryFinish [value='+ para.type + ']').checked = true;
		}
		this.initPreviewPath(liGeometryPos);
		this.enableClick();
	}
	this.clearMode = function(){
		console.log(" clear mode ");
		d3.selectAll('.define_helper').remove();
		d3.select('#previewGeo').remove();
		this._geometryType = null;
		this._newClick = true;
		this._moveCenter = false;
		this._moveVertex = false;
		this._resizeCenter = false;
		this._rotateCenter = false;

		d3.select('#geometryFinish')
		.style('visibility', 'hidden');
	}
	this.getNextId = function(){
		return this._validNextId ++;
	}
	this.initPreviewPath = function(liInitPos){

		console.log(' edit li init pos ', liInitPos);
		if(liInitPos != undefined){
			for(var i = 0; i < liInitPos.length; i ++){
				this.addVertexDot(liInitPos[i]);
			}
			this.updatePreviewPath();
			return;
		}
		switch(this._geometryType){			
			case 'rect':
				//add a rect
				var liInitPos = [
					[200,200],
					[300,200],
					[300,300],
					[200,300]];
				for(var i = 0; i < liInitPos.length; i ++){
					this.addVertexDot(liInitPos[i]);
				}
				this.updatePreviewPath();	
				break;
			case 'circle': 
				//add a circle
				var radius = 50;
				var cenPos = [250,250];
				var angleStep = 10
				// var liInitPos = [];
				for(var i = 0; i < 360; i += angleStep){
					var x = cenPos[0] + radius * Math.sin(Math.PI * i / 180);
					var y = cenPos[1] + radius * Math.cos(Math.PI * i / 180);
					this.addVertexDot([x,y]);
				}
				this.updatePreviewPath();
				break;
		}
	}

	this.updatePreviewPath = function(){

		var liDot = this.getGeometry();

		if(this._geometryType != 'polyline'){
			liDot.push(liDot[0]);
		}

		console.log(' liDot length ', liDot.length);

		var line = d3.line();
		var previewGeo = d3.select('#previewGeo');
		if(previewGeo.empty() == true)
			previewGeo = d3.select('#coversvg')
	  		.append('path')
	  		.attr('id', 'previewGeo')
	  		.style('stroke', function(){
	  			return 'gray';
  			})
	  		.style('stroke-width', '2px')
	  		.style('stroke-dasharray', '5 5')
	  		.style('fill', 'none');

	  	previewGeo
	  		.attr('d', line(liDot));

		d3.selectAll('.define_circle')
		.each(function(){
			d3.select(this)
			.attr('originx', function(){ return +d3.select(this).attr("cx");} )
			.attr('originy', function(){ return +d3.select(this).attr("cy");} )
		})	  		

	  	this.updateCenterMoveDot();
	  	this.updateBoundBoxMoveDots();
	}
	
	this.enableClick = function(){

		console.log(' enable click ', d3.select('#coversvg'), _this._newClick);
		d3.select('#coversvg')
		  .on('mousedown', function(){		
		  		console.log(' log click ');
		  		var coords = d3.mouse(this);

		  		if(_this._newClick){
		  			_this.addVertexDot(coords);
		  		}
		  	})
		  .on('mousemove', function(){		  	
		  	// console.log(_this._moveVertex, _this._moveCenter, _this._currectSelectId, (_this._moveVertex || _this._moveCenter) && _this._currectSelectId != null);
		  	if(_this._moveVertex && _this._currectSelectId != null){
		  		//move vertex
		  		d3.select('#' + _this._currectSelectId)
			  		.attr('cx', d3.mouse(this)[0])
			  		.attr("cy", d3.mouse(this)[1]);
			  	_this.updatePreviewPath();
		  	}else if(_this._moveCenter && _this._currectSelectId != null){	
		  		var previousPos = [+d3.select('#' + _this._currectSelectId).attr('cx'), +d3.select('#' + _this._currectSelectId).attr('cy')];
		  		var displayXY = [d3.mouse(this)[0] - previousPos[0], d3.mouse(this)[1] - previousPos[1]];
		  		_this.moveVertexDots(displayXY);
		  	}else if(_this._resizeCenter && _this._currectSelectId != null){
		  		var originx = +d3.select('#' + _this._currectSelectId).attr("originx"), originy = +d3.select('#' + _this._currectSelectId).attr('originy');
		  		var boxwidth = +d3.select('#boundbox_rect').attr('width'), boxheight = +d3.select('#boundbox_rect').attr('height')
		  		var displayXY = [1. + (d3.mouse(this)[0] - originx)/boxwidth, 1 + (originy - d3.mouse(this)[1])/boxheight];
		  		console.log(' displayXY ', displayXY);
		  		_this.resizeVertexDots(displayXY);

		  		d3.select('#' + _this._currectSelectId)
			  		.attr('cx', d3.mouse(this)[0])
			  		.attr("cy", d3.mouse(this)[1]);
		  	}
		  })
		  .on('mouseup', function(){
			  	if(_this._resizeCenter){
			  		d3.select('#' + _this._currectSelectId)
			  		.attr('originx', function(){ return +d3.select(this).attr("cx");} )
			  		.attr('originy', function(){ return +d3.select(this).attr("cy");} )
			  		d3.selectAll('.define_circle')
			  		  .each(function(){
				  		d3.select(this)
				  		.attr('originx', function(){ return +d3.select(this).attr("cx");} )
				  		.attr('originy', function(){ return +d3.select(this).attr("cy");} )
			  		  })
			  	}
			  	if(_this._currectSelectId != null)
			  		_this._currectSelectId = null;			  	
			  	_this._newClick = true;
			  	_this._moveCenter = false;
			  	_this._resizeCenter = false;
			  	_this._rotateCenter = false;
			  	_this._moveVertex = false;
			  	_this.updatePreviewPath();	
		  });
	}

	this.updateCenterMoveDot = function(){
		var liDot = this.getGeometry();
		var cenPos = this.computeCentriod(liDot);

		var cenCircle = d3.select('#centermove_circle');
		if(cenCircle.empty() == true){		

			cenCircle = d3.select('#coversvg')
			  	.append('circle')
			  	.attr('id', 'centermove_circle')
			  	.attr('class', 'define_helper')	  	
			  	.attr('r', '2px')			 
			  	.style('fill', 'blue')	
			  	  .on('mousedown', function(){
			  	  	_this._moveCenter = true;
			  	  	_this._newClick = false;
			  	  	_this._resizeCenter = false;
			  	  	_this._rotateCenter = false;
			  	  	_this._moveVertex = false;
		  			_this._currectSelectId = d3.select(this).attr('id');
			  	  }) 
				  .on('mouseenter', function(){					  	
			  			d3.select(this)
					  	.style('fill', 'red');
				  })
				  .on('mouseleave', function(){
				  	d3.select(this)
				  	.style('fill', 'blue');
				  });

		}
		cenCircle.attr('cx', cenPos[0])
			  	.attr('cy', cenPos[1]) 	
	}

	this.updateBoundBoxMoveDots = function(){

		var liDot = this.getGeometry();
		console.log(' lidot ', liDot.length);
		if(liDot.length <= 2){
			return;
		}
		var BoxRect = this.computeBoundbox(liDot);
		var boundBox = d3.select('#boundbox_rect');
		var resizeCircle = d3.select('#resize_circle');
		// var rotateCircle = d3.select('#rotate_circle');
		if(boundBox.empty() == true){
			boundBox = d3.select('#coversvg')
					     .append('rect')
					     .attr("id", 'boundbox_rect')
					     .attr("class", 'define_helper')
					     .style('fill', 'none')
					     .style('stroke', 'red')
					     .style("stroke-width", '1px')
					     .style('opacity', '0.8');

		   resizeCircle = d3.select('#coversvg')
			  	.append('circle')
			  	.attr('id', 'resize_circle')
			  	.attr('class', 'define_helper')	  	
			  	.attr('r', '2px')			 
			  	.style('fill', 'orange')	
			  	  .on('mousedown', function(){
			  	  	_this._resizeCenter = true;
			  	  	_this._moveCenter = false;
			  	  	_this._newClick = false;
			  	  	_this._moveVertex = false;
			  	  	_this._rotateCenter = false;
		  			_this._currectSelectId = d3.select(this).attr('id');
			  	  }) 
				  .on('mouseenter', function(){					  	
			  			d3.select(this)
					  	.style('fill', 'red');
				  })
				  .on('mouseleave', function(){
				  	d3.select(this)
				  	.style('fill', 'orange');
				  });

		  //   rotateCircle = d3.select('#coversvg')
		  //    	.append("circle")
		  //    	.attr('id', 'rotate_circle')
		  //    	.attr('class', 'define_helper')
		  //    	.attr('r', '3px')
		  //    	.style('fill', 'blue')
		  //    	.on('mousedown', function(){
		  //    		_this._rotateCenter = true;
			 //  	  	_this._resizeCenter = false;
			 //  	  	_this._moveCenter = false;
			 //  	  	_this._newClick = false;
			 //  	  	_this._moveVertex = false;
		  // 			_this._currectSelectId = d3.select(this).attr('id');
		  //    	})
				// .on('mouseenter', function(){					  	
				// 	d3.select(this)
				// 	.style('fill', 'red');
				// })
				// .on('mouseleave', function(){
				// 	d3.select(this)
				// 	.style('fill', 'blue');
				// });
		}
		boundBox.attr('width', BoxRect.width)
				.attr('height', BoxRect.height)
				.attr('x', BoxRect.x)
				.attr('y', BoxRect.y)
		resizeCircle.attr('cx', BoxRect.x + BoxRect.width)
					.attr('cy', BoxRect.y)
					.attr("originx", BoxRect.x + BoxRect.width)
					.attr('originy', BoxRect.y);					
		// rotateCircle.attr('cx', BoxRect.x + BoxRect.width + 5)
		// 			.attr('cy', BoxRect.y - 5)
		// 			.attr("originx", BoxRect.x + BoxRect.width)
		// 			.attr('originy', BoxRect.y);
	}

	this.computeCentriod = function(liDot){
		var centroid = [0, 0]
		for(var i = 0; i < liDot.length; i ++){
			centroid[0] += liDot[i][0];
			centroid[1] += liDot[i][1]
		}
		if(liDot.length > 0){
			centroid[0] /= liDot.length;
			centroid[1] /= liDot.length;			
		}
		return centroid;
	}

	this.computeBoundbox = function(liDot){
		var rect = {
			'left': 100000,
			'right': 0,
			'top': 100000,
			'bottom': 0,
		}

		for(var i = 0; i < liDot.length; i ++){
			if(rect.left > liDot[i][0])
				rect.left = liDot[i][0]
			if(rect.right < liDot[i][0])
				rect.right = liDot[i][0]
			if(rect.top > liDot[i][1])
				rect.top = liDot[i][1]
			if(rect.bottom < liDot[i][1])
				rect.bottom = liDot[i][1]
		}
		return {
			'x': rect.left,
			'y': rect.top,
			'width': rect.right - rect.left,
			'height': rect.bottom - rect.top,
		}
	}

	this.moveVertexDots = function(displayXY){
		d3.selectAll('.define_circle')
		  .each(function(){
		  	var px = +d3.select(this).attr('cx'), py = +d3.select(this).attr('cy');
		  	d3.select(this)
		  	  .attr('cx',  px + displayXY[0])
		  	  .attr("cy",  py + displayXY[1])
		  });
		this.updatePreviewPath();
	}

	this.resizeVertexDots = function(displayXY){

		var cenPos = [+d3.select('#centermove_circle').attr('cx'), +d3.select('#centermove_circle').attr('cy')];
		
		d3.selectAll('.define_circle')
		  .each(function(){
		  	var px = +d3.select(this).attr('originx'), py = +d3.select(this).attr('originy');
		  	d3.select(this)
		  	  .attr('cx',  cenPos[0] + (px - cenPos[0]) * displayXY[0])
		  	  .attr("cy",  cenPos[1] + (py - cenPos[1]) * displayXY[1])
		  });
	}

	// this.rotateVertexDots = function(angleDegree){
	// 	d3.selectAll('.define_circle')
	// 	.each(function(){
	// 		var px = 
	// 	})

	// }

	this.addVertexDot = function(pos){		
		console.log(' new circle ');
		var id = 'dot-' + _this.getNextId(); 

		d3.select('#coversvg')
	  	.append('circle')
	  	.attr('class', 'define_circle define_helper')
	  	.attr('id', function(){
	  		return id;
	  	})
	  	.attr('r', '3px')
	  	.attr('cx', pos[0])
	  	.attr('cy', pos[1]) 
	  	.attr('originx', pos[0])
	  	.attr('originy', pos[1]) 	
	  	.style('fill', 'green')	  	
		  .on('mousedown', function(){
		  		_this._moveVertex = true;
		  		_this._newClick = false;
		  		_this._moveCenter = false;
		  		_this._resizeCenter = false;
		  		_this._rotateCenter = false;
		  		_this._currectSelectId = d3.select(this).attr('id');
		  })  
		  .on('mouseenter', function(){					  	
	  			d3.select(this)
			  	.style('fill', 'red');
		  })
		  .on('mouseleave', function(){
		  	console.log(' mouse leave !');
		  	d3.select(this)
		  	.style('fill', 'green');
		  });

	  	d3.select('#geometryFinish')
	  	.style('visibility', 'visible');
	}
	this.getGeometry = function(){
		var liGeometryPos = [];

		d3.selectAll('.define_circle')
		.each(function(){
			liGeometryPos.push([+d3.select(this).attr('cx'),+d3.select(this).attr('cy')]);
		})

		return liGeometryPos;
	}

	this._init();
	return this;
}