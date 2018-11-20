function AnimateDomManager(functionHub){
	var _this = this;
	this._functionHub = functionHub;
	// this._liDoms = []
	this._mapDomMetaInfo = {}
	this._mapDomOffsetAntMap = {}
	this._liIntervals = [];
	this._liIntervalInfo = [];
	this.clearAnimateDomsbyIndex = function(index){
		// this._liDoms[index] = [];
		this._mapDomMetaInfo[index] = {}
		this._mapDomOffsetAntMap = {}
	}
	this.update = function(index, liDom, metaInfo){
		// this._liDoms[index]  = liDom;
		this._mapDomMetaInfo[index] = metaInfo;
		//reset the ants
		this._mapDomOffsetAntMap[index] = {};
	}
	this.addMetaInfo = function(maIndex, metaInfo){
		// this._liDoms.push(liDom);
		if(metaInfo == undefined)
			return
		this._mapDomMetaInfo[maIndex] = metaInfo;
	}	
	this.updateMetaInfo = function(index, metaInfo){
		this._mapDomMetaInfo[index] = metaInfo;
	}
	this.resetMetaInfo = function(index, metaInfo){
		//update the color
		var mapOffsetAnt = this._mapDomOffsetAntMap[index];
		Object.values(mapOffsetAnt).forEach(function(d){
			// d.fillColor = metaInfo['antcolor'];
			d.remove()
		})
		this._mapDomOffsetAntMap[index] = {};
		this._mapDomMetaInfo[index] = metaInfo;
		// this.removeAntsbyIndex(index);
	}
	this.removeAntsbyIndex = function(index){
		var mapoffsetAnts = this._mapDomOffsetAntMap[index];
		var liOffset = Object.keys(mapoffsetAnts);
		for(var i = 0; i < liOffset.length; i ++){
			var offset = liOffset[i];
			var ant = mapoffsetAnts[offset];
			if(ant != undefined)
				ant.remove();
		}
	}
	this.getMetaInfos = function(){
		return this._mapDomMetaInfo;
	}
	this.getMetaInfobyIndex = function(index){
		return this._mapDomMetaInfo[index];
	}
	this.getAnt = function(index, offset){
		var ant = undefined;
		var mapOffsetAnt = this._mapDomOffsetAntMap[index];
		if(mapOffsetAnt == undefined){
			ant = this.createAnt(index, offset);
			this.addAnt(index, offset, ant);
		}else{
			ant = mapOffsetAnt[offset];
			if(ant == undefined){
				ant = this.createAnt(index, offset);
				this.addAnt(index, offset, ant);
			}
		}
		return ant;
	}
	this.createAnt = function(index, offset){

		var metaInfo = this.getMetaInfobyIndex(index);
		var antmodel = metaInfo.antmodel;
		var boundaryPath = metaInfo.boundaryPath;
		var perimeter = metaInfo.perimeter;
		var cenPosDisplace = metaInfo.cenPosDisplace;
		var liGeometryDot = metaInfo.dots.join(';');
		var liLinePerLength = metaInfo.lengthperlist;
		var liNormalAngle = metaInfo.normalanglelist;
		var liUniNormalVector = metaInfo.liuninormalvector;

		// console.log(" liUniNormalVector ", liUniNormalVector);
		
		var newWholeAnt = antmodel.clone();
		var infoatPer = getPolylineXYatPercenter_withIndex(liGeometryDot, liLinePerLength, offset/perimeter);
		var originXY  = infoatPer.pos;
		var beginIndex = infoatPer.beginIndex;

		//display pos
		originXY.x += cenPosDisplace * liUniNormalVector[beginIndex][0];
		originXY.y += cenPosDisplace * liUniNormalVector[beginIndex][1];

		newWholeAnt.position = new Point(originXY.x, originXY.y)

		newWholeAnt.rotate(-liNormalAngle[beginIndex]);
		var newAnt;
		if(boundaryPath != undefined)
			newAnt = newWholeAnt['intersect'](boundaryPath);
		else
			newAnt = newWholeAnt.clone();

		newAnt.visible = true;

		newWholeAnt.remove();

		return newAnt;
	}

	this.addAnt = function(index, offset, ant){
		
		if(this._mapDomOffsetAntMap[index] == undefined){
			this._mapDomOffsetAntMap[index] = {
				offset: ant
			}
		}else{
			this._mapDomOffsetAntMap[index][offset] = ant;
		}
	}

	this.clearAnimateIntervals = function(){
		console.log(' clear ', this._liIntervalInfo);
		for(var i = 0; i < this._liIntervals.length; i ++)
			clearInterval(this._liIntervals[i]);
		this._liIntervals = [];
	}
	this.addAnimateIntervals = function(intervalId){
		this._liIntervals.push(intervalId);
	}
	this.newAnimateIntervalInfo = function(index){
		this._liIntervalInfo[index] = {}
		return this._liIntervalInfo[index];
	}
	return this;
}