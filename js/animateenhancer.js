function getLineXYatPercent(startPt,endPt,percent) {
    var dx = endPt.x-startPt.x;
    var dy = endPt.y-startPt.y;
    var X = startPt.x + dx*percent;
    var Y = startPt.y + dy*percent;
    return( {x:X,y:Y} );
}

function getPolylineXYatPercenter_withIndex(liGeometryDot, liLinePerLength, currentPer){

	var newXY;
	var beginPointIndex = liLinePerLength.length - 2;

	for(var i = 0; i < liLinePerLength.length; i ++){
		if(+liLinePerLength[i] >= currentPer){
			if(i == 0)
				beginPointIndex = 0
			else
				beginPointIndex = i - 1;
			break;
		}
	}

	var endPointIndex = beginPointIndex + 1;
	
	var percent = (currentPer - (+liLinePerLength[beginPointIndex]))/(+liLinePerLength[endPointIndex] - (+liLinePerLength[beginPointIndex]));
	var startPt = {x: +(liGeometryDot.split(';')[beginPointIndex].split(',')[0]), 
				   y: +(liGeometryDot.split(';')[beginPointIndex].split(',')[1])};
	var endPt = {x: +(liGeometryDot.split(';')[endPointIndex].split(',')[0]), 
				 y: +(liGeometryDot.split(';')[endPointIndex].split(',')[1])};

	newXY = getLineXYatPercent(startPt, endPt, percent);

	return {
		'pos': newXY,
		'beginIndex': beginPointIndex
	}
}

function getPolylineXYatPercenter(liGeometryDot, liLinePerLength, currentPer){

	var newXY;
	var beginPointIndex = liLinePerLength.length - 2;

	for(var i = 0; i < liLinePerLength.length; i ++){
		if(+liLinePerLength[i] >= currentPer){
			if(i == 0)
				beginPointIndex = 0
			else
				beginPointIndex = i - 1;
			break;
		}
	}

	var endPointIndex = beginPointIndex + 1;
	
	var percent = (currentPer - (+liLinePerLength[beginPointIndex]))/(+liLinePerLength[endPointIndex] - (+liLinePerLength[beginPointIndex]));
	var startPt = {x: +(liGeometryDot.split(';')[beginPointIndex].split(',')[0]), 
				   y: +(liGeometryDot.split(';')[beginPointIndex].split(',')[1])};
	var endPt = {x: +(liGeometryDot.split(';')[endPointIndex].split(',')[0]), 
				 y: +(liGeometryDot.split(';')[endPointIndex].split(',')[1])};

	newXY = getLineXYatPercent(startPt, endPt, percent);

	return newXY;
}

function AnimateEnhancer(){
	var _this = this;
	this.activateDOM = function(geometryDom, aeInfo){
		switch(aeInfo.ae){
			case 'MA':
				return this.marchingAnt(geometryDom, aeInfo);
				break;
			default:
				break;
		}
	}
	this.marchingAnt = function(maGeoInfo, aeInfo){
			
		var geometryDom = maGeoInfo['path'];
		var boundaryDom = maGeoInfo['boundary'];
		var defineAntDom = maGeoInfo['ant'];
		var aniInterval = +aeInfo['antinterval']

		// console.log(" defined interval = ", aniInterval);

		var antDomInfo = {
			'cenPosDisplace': 0,
		};

		var boundaryPath = undefined;
		if(boundaryDom != undefined){	
			boundaryPath = new Path();					
			var liBoundaryDot = boundaryDom['geometry'];
			for(var i = 0; i < liBoundaryDot.length; i ++)
				boundaryPath.add(new Point(liBoundaryDot[i]))
			boundaryPath.closed = true;
			boundaryPath.visible = false;
		}

		var liGeometryDot = geometryDom['geometry'];
		var liLinePerLength = geometryDom['lengthperlist'];
		var liNormalAngle = [];
		var liUniNormalVector = [];
		var normalLeft = true;
		var liUniNormal_right = geometryDom['liUniNormal_right']
		var liUniNormal_left = geometryDom['liUniNormal_left']

		var perimeter = geometryDom['perimeter'];
		
		var antGap = +aeInfo['antgap'];
		// var stepper = (+aeInfo['stepper']);

		//define RECT ant dom
		var antType = aeInfo['antshape'];
		var antDom;
		var antWidth;
		
		// console.log('MAGeometryInfo here before ', antType, aeInfo);
		if(antType == 'self-defined'){

			if(defineAntDom != undefined && defineAntDom['paperdom'] != undefined){
				antDom = defineAntDom['paperdom'].clone();
			}else{
				antDom = new Path(defineAntDom.geometry);
			}

			var cenPosVector = [antDom.position._x - liGeometryDot[0][0], antDom.position._y - liGeometryDot[0][1]];
			//judget left or right
			var firstSegUniVector_left = liUniNormal_left[0];
			var left = true;
			if((cenPosVector[0] * firstSegUniVector_left[0]) + (cenPosVector[1] * firstSegUniVector_left[1]) < 0)
				left = false;
			if(left){
				liUniNormalVector = liUniNormal_left
				liNormalAngle = geometryDom['liClockAngle_left']
			}else{
				normalLeft = false;
				liUniNormalVector = liUniNormal_right;
				liNormalAngle = geometryDom['liClockAngle_right'];
			}

			var firstSegVector = [liGeometryDot[1][0] - liGeometryDot[0][0], liGeometryDot[1][1] - liGeometryDot[0][1]];
			var firstSegLength = Math.sqrt(firstSegVector[0] * firstSegVector[0] + firstSegVector[1] * firstSegVector[1]);
			
			var cenPosLength = Math.sqrt(cenPosVector[0] * cenPosVector[0] + cenPosVector[1] * cenPosVector[1]);
			var b1 = (firstSegVector[0] * cenPosVector[0] + firstSegVector[1] * cenPosVector[1]) / firstSegLength;
			var dis = Math.sqrt(cenPosLength * cenPosLength - b1 * b1);
			antDomInfo.cenPosDisplace = dis;

			// console.log(" here ? ", antDom.position, liGeometryDot[0]);

			var ps = [antDom.bounds.topLeft, antDom.bounds.topRight, antDom.bounds.bottomRight, antDom.bounds.bottomLeft];
			antWidth = 1000000;
			for(var i = 0; i < ps.length; i ++){
				var p_temp = ps[i];
				var pbegin = [p_temp.x - liGeometryDot[0][0], p_temp.y - liGeometryDot[0][1]];
				var antWidth_temp = (pbegin[0] * firstSegVector[0] + pbegin[1] * firstSegVector[1]) / (firstSegLength);
				if(antWidth > antWidth_temp)
					antWidth = antWidth_temp;
			}

			// ant					
			antDom.rotate(liNormalAngle[0]);
			
			antWidth = antWidth < 0 ? -antWidth: antWidth;

			antDom.fillColor = 'black';

		}else if(antType == 'rect'){
				antDom = new Path.Rectangle({
					    position: new Point(0, 0),
					    size: new Size(5, 50),
					    fillColor: 'black'
					}); 
				antWidth = antDom.bounds.width;
		}else if(antType == 'circle'){
				antDom = new Path.Circle(
								new Point(0, 0),
								20);
				antDom.fillColor = 'black';
				antWidth = antDom.bounds.width;
		}else{
			var tempDot = [[-9.463,25.068], [-8.729,-25.067], [25.166,0]];
			antDom = new Path(tempDot);
			antDom.closed = true;
			antDom.fillColor = 'black';
			antWidth = antDom.bounds.width;
		}
		
		var antCenPer = 0;

		var liAntOffset = [];

		//add ants
		while(1.){
			if(antCenPer > perimeter)
				break;
			liAntOffset.push(antCenPer);
			antCenPer += antGap;
		}

		// antDom.visible = false;
		antDom.fillColor = aeInfo['antcolor']
		antDom.opacity = 0.6
		// antDom.strokeColor = 'black'
		// antDom.strokeColor = null;
		antDom.visible = false
	

		return {
			'metainfo': {
				'antmodel': antDom,
				'antwidth': antWidth, 
				'antdots': defineAntDom.geometry,
				'antoffsets': liAntOffset,
				'cenPosDisplace': antDomInfo.cenPosDisplace,
				'dots': liGeometryDot,
				'lengthperlist': liLinePerLength,
				'normalanglelist': liNormalAngle,
				'normalLeft': normalLeft,
				'liuninormalvector': liUniNormalVector,
				'perimeter': perimeter,
				'antinterval': aniInterval,
				'antgap': antGap,
				'groupid': aeInfo['groupid'],
				'antcolor': aeInfo['antcolor'],
				'boundaryPath': boundaryPath,
			}
		}
	}
	return this;
}