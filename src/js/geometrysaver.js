function GeometrySaver(funcitonHub){
	var _this = this;
	this._functionHub = funcitonHub;
	// this._liGeometry = [];
	// this._mapTypeGeometry = {};
	this._currentMA = {};
	this._liMAGeometry = [];

	this._init = function(){}	

	this.addMAGeometry = function(maGeometry){
		// console.log(' add geometry ', maGeometry);
		this._liMAGeometry.push(maGeometry);
		this.addAntDom(this._liMAGeometry.length - 1);
		return this._liMAGeometry.length - 1;
	}
	this.addAntDom = function(index){
		var antArea = document.getElementById('antarea');
		var antInfoHTML = '<button class="antbutton" index=' + index + ' type="mainfo" > antinfo </button>';
		var htmltemplate = "<span> ant " + index + '</span>' + antInfoHTML;
		'</span><br>';	
		// antArea.innerHTML += htmltemplate;

		d3.selectAll('.antbutton')
		.on('click', function(){
			var maIndex = +d3.select(this).attr('index');
			// console.log(' select ant ', maIndex);
			var currentPathGeometry = _this._currentMA['path'];

			if(currentPathGeometry != undefined){
				var metaInfo = _this._functionHub._animateDomManager.getMetaInfobyIndex(maIndex);
				var antGeometry = _this.getMAGeometrybyIndex(maIndex)['ant']
				var antModel = metaInfo.antmodel
				_this.fitAnt(antModel, currentPathGeometry, antGeometry['geotype'], metaInfo.cenPosDisplace, metaInfo.normalLeft)
			}
		})
	}
	this.fitAnt = function(antModel, currentPathGeometry, antGeometryType, cenPosDisplace, normalLeft){
		// var cenPosDisplace = metaInfo.cenPosDisplace;
		//fitant
		var liGeometryDot = currentPathGeometry['geometry']
		var liLinePerLength = currentPathGeometry.lengthperlist;
		var liNormalAngle = normalLeft == true? currentPathGeometry.liClockAngle_left: currentPathGeometry.liClockAngle_right;
		var liUniNormalVector = normalLeft == true ? currentPathGeometry.liUniNormal_left: currentPathGeometry.liUniNormal_right;
		var newWholeAnt = antModel.clone();
		// antModel.fillColor = 'red'

		var beginIndex = 0
		var originXY = {x: liGeometryDot[0][0], y: liGeometryDot[0][1]};
		originXY.x += cenPosDisplace * liUniNormalVector[beginIndex][0];
		originXY.y += cenPosDisplace * liUniNormalVector[beginIndex][1];

		// console.log(" fit Ant ", originXY);
		// newWholeAnt.position = new Point(845, 500)
		newWholeAnt.position = new Point(originXY.x, originXY.y)
		newWholeAnt.rotate(-liNormalAngle[beginIndex]);

		// newWholeAnt.visible = true
		// console.log(' fit ant ', cenPosDisplace);
		// newWholeAnt.visible = true

		var liAntPos = [];
		// console.log(' new whole ant ', newWholeAnt.segments);
		newWholeAnt.segments.forEach(function(d){
			liAntPos.push([d.point._x, d.point._y])
		})				
		// console.log(' here?? ', newWholeAnt.position, liAntPos);
		// liAntPos.splice(liAntPos.length - 1, 1)
		// console.log(' liAnt Pos ', liAntPos);
		// var path = new paper.path();

		this.saveGeometryNew({'type': 'ant', 'geotype': 'area'}, liAntPos, newWholeAnt)

		// this._functionHub.setFunc({
		// 	'type': 'new',
		// 	'para': {
		// 		'geotype': antGeometryType,
		// 		'liGeometryPos': liAntPos,
		// 		'type': 'ant',
		// 	}
		// })
	}
	this.getMAGeometrybyIndex = function(index){
		if(index < this._liMAGeometry.length)
			return this._liMAGeometry[index]
		return undefined;
	}

	this.updateGeometrybyEdit = function(maGeometry, geotype, liGeometryPos){
		var geometry = maGeometry[geotype];
		// console.log(' dome ', geometry.dom);

		//update the dom drawing
		this.updateDom(geometry.dom, liGeometryPos);

		var liLengthAngle = this.computeLineSegInfoList(liGeometryPos);

		var liUniNormal_left = liLengthAngle.liUniNormal_left
		var liUniNormal_right = liLengthAngle.liUniNormal_right;

		var lengthperlist = liLengthAngle.lengthPer; //this.computeLengthPerList(liGeometryPos);
		var normalList = liLengthAngle.normalAngle; //this.computeNormalList(liGeometryPos);
		var liUniNormal = liLengthAngle.liUniNormal;
	
		var perimeter = this.computePerimeter(liGeometryPos);
		var geometry = {
			// 'type': _para,
			'dom': geometry.dom,
			'geometry': liGeometryPos,
			'lengthperlist': lengthperlist,
			'normalanglelist': normalList,
			'liUniNormal': liUniNormal,
			'liUniNormal_right': liUniNormal_right,
			'liUniNormal_left': liUniNormal_left,
			'liClockAngle_left': liLengthAngle.liClockAngle_left,
			'liClockAngle_right': liLengthAngle.liClockAngle_right,
			'perimeter': perimeter,
		}
		maGeometry[geotype] = geometry;
	}

	this.saveGeometryNew = function(_para, liGeometryPos, canvasid, paperdom){

		console.log(" SAVE ",  _para['type'], liGeometryPos)
		var printstr = "["
		for(var i = 0; i < liGeometryPos.length; i ++){
			printstr += ('[' + liGeometryPos[i][0] + ',' + liGeometryPos[i][1] + '],')
		}
		printstr += ']'
		console.log(' liGeometry ', _para['type'], printstr);

		// process the geometry points
		console.log("canvasid", canvasid)
		var canvasBox = document.getElementById(canvasid).getBoundingClientRect();
		var liNewGeometryPos = [];
		for(var i = 0; i < liGeometryPos.length; i ++){
			var pos = liGeometryPos[i]
		var newpos = [pos[0] - canvasBox.left, pos[1] ]; //pos[1] - canvasBox.top]
			var newpos = [pos[0], pos[1] ]
			liNewGeometryPos.push(newpos);
		}
		liGeometryPos = liNewGeometryPos;

		var geometryType = $('input[name="geometrytype"]:checked').val();
		if(_para['type'] != undefined)
			geometryType = _para['type']

		var dom = this.createDom(_para.geotype, liGeometryPos, geometryType);
		// var lengthperlist = this.computeLengthPerList(liGeometryPos);
		var liLengthAngle = this.computeLineSegInfoList(liGeometryPos);

		var liUniNormal_left = liLengthAngle.liUniNormal_left
		var liUniNormal_right = liLengthAngle.liUniNormal_right;

		var lengthperlist = liLengthAngle.lengthPer; //this.computeLengthPerList(liGeometryPos);
		var normalList = liLengthAngle.normalAngle; //this.computeNormalList(liGeometryPos);
		var liUniNormal = liLengthAngle.liUniNormal;
	
		var perimeter = this.computePerimeter(liGeometryPos);
		var geo = {
			'geotype': _para.geotype,
			'dom': dom,
			'geometry': liGeometryPos,
			'paperdom': paperdom,
			'lengthperlist': lengthperlist,
			'normalanglelist': normalList,
			'liUniNormal': liUniNormal,
			'liUniNormal_right': liUniNormal_right,
			'liUniNormal_left': liUniNormal_left,
			'liClockAngle_left': liLengthAngle.liClockAngle_left,
			'liClockAngle_right': liLengthAngle.liClockAngle_right,
			'perimeter': perimeter,
		}
		this._currentMA[geometryType] = geo;
		console.log(" current ma ", this._currentMA);
	}

	this.fakeGeometryNew = function(_para, liGeometryPos, geoType){
		var geometryType = geoType;
		// console.log(" create !! ");

		var dom = this.createDom(_para, liGeometryPos, geometryType);
		var lengthperlist = this.computeLengthPerList(liGeometryPos);
		var perimeter = this.computePerimeter(liGeometryPos);
		var geo = {
			'type': _para,
			'dom': dom,
			'geometry': liGeometryPos,
			'lengthperlist': lengthperlist,
			'perimeter': perimeter,
		}
		this._currentMA[geometryType] = geo;
		// console.log(" current ma ", this._currentMA);
	}

	this.getCurrentMAGeometry = function(){
		if(this._currentMA['path'] == undefined)
			return undefined;
		return this._currentMA;
	}
	this.clearCurrentMAGeometry = function(){
		this._currentMA = {};
	}
	this.setCurrentMAGeometry = function(maGeometry){		
		//remove current maGeometry
		var liKey = Object.keys(this._currentMA);
		for(var i = 0; i < liKey.length; i ++){
			var key = liKey[i];
			this._currentMA[key].dom.remove()
		}
		this._currentMA = maGeometry;
	}

	this.setVisibleofGeometries = function(visible){
		d3.selectAll('.define_geometry')
		  .style('visibility', function(visible){
		  	return visible == true ? 'visible': 'hidden';
		  })
	}


	this.updateDom = function(dom, liGeometryPos){
		if(dom.empty() == false){
			var line = d3.line();
			dom.attr('d', line(liGeometryPos));
		}
		return dom;
	}

	this.createDom = function(_para, liGeometryPos, geometryType){
		var dom = null;
		// console.log(" create Dom ", _para);
		//todo
		switch(_para){
			case 'polyline':
				// console.log(' create polyline ');
				var line = d3.line();
				return d3.select('#coversvg')
				  		.append('path')
				  		.attr('d', line(liGeometryPos))
				  		.attr('class', geometryType + ' define_geometry')
				  		.style('stroke', function(){
				  			if(geometryType == 'path')
				  				return '#03A9F4'
				  			else if(geometryType == 'boundary')
				  				return 'gray';
				  			else if(geometryType == 'ant'){
				  				return 'black'
				  			}
				  		})
				  		.style('stroke-width', '2px')
				  		.style('fill', 'none');
				break;
			case 'area': 
			case 'rect':
			case 'circle': 
				console.log(' create area ');
				var line = d3.line();
				liGeometryPos.push(liGeometryPos[0])
				return d3.select('#coversvg')
				  		.append('path')
				  		.attr('class', geometryType + ' define_geometry')
				  		.attr('d', line(liGeometryPos))
				  		.style('fill', function(){
				  			return 'none';
				  			// if(geometryType == 'boundary')
				  			// 	return 'none'
				  			// else
				  			// 	return 'none'
				  		})
				  		.style('stroke', function(){				  		
				  			if(geometryType == 'path')
				  				return '#03A9F4'
				  			else if(geometryType == 'boundary')
				  				return 'orange';
				  			else if(geometryType == 'ant'){
				  				return 'black'
				  			}
				  		});
				break;
		}
		return dom;
	}
	this.computePerimeter = function(liPos){
		var lengthSum = 0.;
		for(var i = 0; i < liPos.length - 1; i ++){
			var beginPoint = liPos[i], endPoint = liPos[i + 1]
			var length = Math.sqrt((beginPoint[0] - endPoint[0]) * (beginPoint[0] - endPoint[0]) + 
				(beginPoint[1] - endPoint[1]) * (beginPoint[1] - endPoint[1]));
			lengthSum += length;
		}
		return lengthSum;
	}
	this.computeLineSegInfoList = function(liPos){		
		var liLength = []
		var liLengthPer = [0.];
		var liNormalAngle = [];
		var liUniNormal = [];
		var liUniNormal_left = [];
		var liUniNormal_right = [];
		var liClockAngle_left = [];
		var liClockAngle_right = [];
		var lengthSum = 0.;

		for(var i = 0; i < liPos.length - 1; i ++){

			var beginPoint = liPos[i], endPoint = liPos[i + 1]
			var length = Math.sqrt((beginPoint[0] - endPoint[0]) * (beginPoint[0] - endPoint[0]) + 
				(beginPoint[1] - endPoint[1]) * (beginPoint[1] - endPoint[1]));
			lengthSum += length;
			liLength.push(length);

			//normal vector
			var normalVector_right = {
				'x': beginPoint[1] - endPoint[1],
				'y': endPoint[0] - beginPoint[0],
			}
			var normalVector_left = {
				'x': -normalVector_right.x,
				'y': -normalVector_right.y,
			}
			var normalVector = normalVector_right;

			var normalLength = Math.sqrt(normalVector.x * normalVector.x + normalVector.y * normalVector.y)
			
			//uni normal
			var uniNorvector_left = [
				normalVector_left.x/normalLength,
				normalVector_left.y/normalLength,
			]

			var angle_left = Math.acos(uniNorvector_left[0]) * 180 / Math.PI;
			if(uniNorvector_left[1] > 0)
				angle_left = 360 - angle_left;
			liClockAngle_left.push(angle_left);

			var uniNorvector_right = [
				-uniNorvector_left[0], -uniNorvector_left[1]
			]

			var angle_right = Math.acos(uniNorvector_right[0]) * 180 / Math.PI;
			if(uniNorvector_right[1] > 0)
				angle_right = 360 - angle_right;

			liClockAngle_right.push(angle_right);
			liUniNormal.push(uniNorvector_left);
			liUniNormal_left.push(uniNorvector_left)
			liUniNormal_right.push(uniNorvector_right);

			if(normalVector.y < 0){
				normalVector = {
					'x': -normalVector.x,
					'y': -normalVector.y,
				}
			}			
			//normal angle			
			var normalAngle = Math.acos(normalVector.x/normalLength) * 180 / Math.PI;

			// console.log(' before normalVector ', uniNorvector, normalAngle);

			// if(uniNorvector[0] < 0){
			// 	if(uniNorvector[1] < 0){
			// 		console.log('[1]')
			// 		normalAngle = 180 - normalAngle
			// 	}else{
			// 		console.log('[2]')
			// 		normalAngle = 180 + normalAngle;
			// 	}
			// }else if(uniNorvector[1] > 0){
			// 	console.log('[3]')
			// 	normalAngle = 360 - normalAngle;
			// }

			liNormalAngle.push(normalAngle-90);

		}
		var length = 0.
		for(var i = 0; i < liLength.length; i ++){
			length += liLength[i];
			liLengthPer.push(length/lengthSum);
		}
		// console.log(" liUniNormal ", liUniNormal);
		return {
			'lengthPer': liLengthPer,
			'normalAngle': liNormalAngle,
			'liUniNormal': liUniNormal,
			'liUniNormal_left': liUniNormal_left,
			'liUniNormal_right': liUniNormal_right,
			'liClockAngle_left': liClockAngle_left,
			'liClockAngle_right': liClockAngle_right,
		}
	}	
	this.computeLengthPerList = function(liPos){
		var liLength = []
		var liLengthPer = [0.];
		var lengthSum = 0.;
		for(var i = 0; i < liPos.length - 1; i ++){
			var beginPoint = liPos[i], endPoint = liPos[i + 1]
			var length = Math.sqrt((beginPoint[0] - endPoint[0]) * (beginPoint[0] - endPoint[0]) + 
				(beginPoint[1] - endPoint[1]) * (beginPoint[1] - endPoint[1]));
			lengthSum += length;
			liLength.push(length);
		}
		var length = 0.
		for(var i = 0; i < liLength.length; i ++){
			length += liLength[i];
			liLengthPer.push(length/lengthSum);
		}
		return liLengthPer;
	}
	this.setMAGeometryVisible = function(maGeometry, visible){
		var visible_str = (visible == true)? 'visible':'hidden';
		var liKey = Object.keys(maGeometry);
		for(var i = 0; i < liKey.length; i ++){
			var key = liKey[i];
			maGeometry[key].dom.style('visibility', visible_str);
		}

	}
	this._init();
	return this;
}

// function geosaver(){
// 	GeometrySaver(funcitonHub)
// }

// export default geosaver;
module.exports = GeometrySaver