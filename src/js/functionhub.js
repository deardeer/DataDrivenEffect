
var AnimateDomManager = require("./animatedommanager.js");
var AnimateEditor = require("./animateeditor.js");
var AnimateEnhancer =  require("./animateenhancer.js");
var GeometryDefiner = require("./geometrydefiner.js");
var GeometrySaver = require("./geometrysaver.js");

function FunctionHub(example){
	var _this = this;
	this._type = null;
	this._para = null
	this._currentMAGeometryId = null
	this._currentIntervalId = null;
	this._liHiddenMAIndex = [];

	this._liStoreMAIndex = [];

	this._init = function(example){
		console.log(' init funcHub')
		this._geometryDefiner = new GeometryDefiner();
		this._geometrySaver = new GeometrySaver(this);
		this._animateEditor = new AnimateEditor(this);
		this._animateEnhancer = new AnimateEnhancer();
		this._animateDomManager = new AnimateDomManager(this);

		//load from server
		var maConfigName = "22" // "boxplot2";
		this._initLocal(maConfigName);
	}
	this._initLocal = function(maConfigName){
		//todo: set URL 
		var self = this;
		var formData = new FormData();
		var url = 'http://localhost:20082/fetchMA';
		formData.append('name', maConfigName);
		// lSendUrl('POST', url, formData, this.successFetchFunc, self);
	}
	this.successSaveFunc = function(response, self){
		console.log('success save! ', response);
	}
	this.successFetchFunc = function(response, self){
		if(response['ma'] == undefined)
			return;
		console.log("responsema", response['ma'])
		document.getElementById('saveMAName').value = (response['ma']['name']);
		var mapGroupIdMaList = response['ma']['magroups'];
		var drawPath = response['ma']['drawpath'];
		console.log("mapGroupIdMaList", mapGroupIdMaList)
		console.log(" draw Path ", drawPath);
		var liGroupId = Object.keys(mapGroupIdMaList);
		console.log("liGroupId", liGroupId) ;
		for(var i = 0; i < liGroupId.length; i ++){
			var groupId = liGroupId[i];
			self.addMAbyGroupInfo(mapGroupIdMaList[groupId], drawPath)
		}

		self._type = 'animate';
		self.initFunc();
		// var malist = response['ma']['malist'];
		console.log(" success fetched ! ", response);
	}
	this.addMAbyGroupwithExampleAnt = function(groupMA, antModal, drawPath){
		// drawPath = 1
		// console.log(" addMAbyGroupwithExampleAnt ", groupMA.mainfo.groupid);
		var aeInfo = groupMA['mainfo']
		var malist = groupMA['malist']
		var liGeometryType = ['path','boundary'];
		if(malist != undefined){
			for(var j = 0; j < malist.length; j ++){
				var ma = malist[j];
				for(var p = 0; p < liGeometryType.length; p ++){
					var type = liGeometryType[p]
					if(ma[type]!=undefined){
						this._geometrySaver.saveGeometryNew({'type': type, 'geotype': ma[type]['geoType']}, ma[type]['dots'], );
						var tempPath = new Path(ma[type]['dots'])
						// console.log(' ma[type]path ', ma[type]['dots']);
						// tempPath.strokeColor = 'red';
						// tempPath.strokeWidth = 1
					}
				}				
				if(drawPath != undefined){
					//draw the path
					console.log(' darw Path ', ma['path']['dots']);
					var myPath = new Path({
						segments: ma['path']['dots']
					});
					myPath.strokeColor = '#dddddd';
					myPath.strokeWidth=0.2;
				}
				//fit ant modal
				var currentPathGeometry = this._geometrySaver.getCurrentMAGeometry()['path'];
				this._geometrySaver.fitAnt(antModal, currentPathGeometry, 'area', 0, false);
				// this.setFunc({type: 'addGeometry'});
				d3.selectAll('.define_geometry').style('visibility', 'hidden');
				
				//ma
				var MAGeometryInfo = this._geometrySaver.getCurrentMAGeometry();
				// console.log(" MAGeometryInfo ", MAGeometryInfo, aeInfo);
				var MAGeometryIndex = this._geometrySaver.addMAGeometry(MAGeometryInfo);
				this._liStoreMAIndex.push(MAGeometryIndex);
				var animateResult = this._animateEnhancer.activateDOM(MAGeometryInfo, aeInfo);
				var metainfo = animateResult['metainfo'];

				//clear current MAGeometry
				//not exist before
				this._geometrySaver.clearCurrentMAGeometry();
				this._animateDomManager.addMetaInfo(MAGeometryIndex, metainfo)
				this._animateEditor.addMADoms(MAGeometryIndex, metainfo);
			}
		}
	}
	this.addMAbyGroupInfo = function(groupMA, drawPath, canvasid){
		console.log("groupma", groupMA)
		// drawPath = true
		var malist = groupMA['malist'] //mapGroupIdMaList[groupId]['malist'];
		var aeInfo = groupMA['mainfo'] //mapGroupIdMaList[groupId]['mainfo']
		if(malist != undefined){
			var liGeometryType = ['path','ant','boundary'];
			//todo-clear original
			// for(var index in mapIndexMA){
			for(var j = 0; j < malist.length; j ++){
				var ma = malist[j];
				//geometry
				for(var p = 0; p < liGeometryType.length; p ++){
					var type = liGeometryType[p];
					if(ma[type] != undefined){
						console.log(' create geo ', ma[type]['dots']);
						this._geometrySaver.saveGeometryNew({'type': type, 'geotype': ma[type]['geoType']}, ma[type]['dots'], canvasid);
					}	
				}
				if(drawPath != undefined){
					//draw the path
					// console.log(' darw Path ', ma['path']['dots']);
					// var myPath = new Path({
					// 	segments: ma['path']['dots']
					// });
					// myPath.strokeColor = 'black';
					// myPath.strokeWidth=0.2;
				}
				//mainfo
				var MAGeometryInfo = this._geometrySaver.getCurrentMAGeometry();
				console.log(" MAGeometryInfo ", MAGeometryInfo, aeInfo);
				var MAGeometryIndex = this._geometrySaver.addMAGeometry(MAGeometryInfo);
				this._liStoreMAIndex.push(MAGeometryIndex);
				var animateResult = this._animateEnhancer.activateDOM(MAGeometryInfo, aeInfo);
				var metainfo = animateResult['metainfo'];

				//clear current MAGeometry
				//not exist before
				this._geometrySaver.clearCurrentMAGeometry();
				this._animateDomManager.addMetaInfo(MAGeometryIndex, metainfo)
				this._animateEditor.addMADoms(MAGeometryIndex, metainfo);	
			}
		}
	}	
	this.setFunc = function(func){
		this._type = func.type;
		if(func.para != undefined)
			this._para = func.para;
		console.log(' function hub ', this._type, this._para);
		this.initFunc();
	},
	this.setMAVisiblebyIndex = function(visible, index){
		if(visible){
			//set visible, remove from list
			this._liHiddenMAIndex.splice(this._liHiddenMAIndex.indexOf(index), 1);
		}else{
			if(this._liHiddenMAIndex.indexOf(index) == -1)
				this._liHiddenMAIndex.push(index);
		}
	}
	this.stopFunc = function(func){
		switch(func.type){
			case 'animate':
				// clearInterval(this._currentIntervalId);
				//clear ants of current select MA
				this.setMAVisiblebyIndex(false, func.para.maIndex)
				// this._liHiddenMAIndex.push(func.para.maIndex);
				// console.log(" stop animate ", func.para.maIndex, this._liHiddenMAIndex);
				// this._geometrySaver.
				break;
		}
	}
	this.initFunc = function(){

		switch(this._type){

			case 'new':
			case 'editGeometry':
				this._geometryDefiner.beginMode(this._para);
				break;

			case 'addGeometry': 
			    console.log(" add geo! ", this._para, this._geometryDefiner.getGeometry());
				this._geometrySaver.saveGeometryNew(this._para, this._geometryDefiner.getGeometry()); 
				this._geometryDefiner.clearMode()
				break;

			case 'newadd':
				// var liGeometryPos = this._geometryDefiner.getGeometry();
				// this._currentGeometryId = this._geometrySaver.saveGeometry(this._para, liGeometryPos);
				this._geometryDefiner.clearMode();
				this._type = 'editanimate';
				this.initFunc();
				break;

			case 'editanimate':
				console.log(" [2] begin ! edit animte ", this._currentMAGeometryId);
				
				var aeInfo = this._animateEditor.editAnimate();

				// if(this._currentMAGeometryId != null){
				// 	console.log(" [2] edit animte ", this._currentMAGeometryId);
					
				// 	// var liAnimateDom = this._animateEnhancer.activateDOM(this._geometrySaver.getGeometry(this._currentGeometryId), aeInfo);
				// }
				break;

			case 'stopani': 
				console.log(' stop animate ')
				clearInterval(_this._currentIntervalId);
				break;

			case 'animate':
			
				var timeIndex = 0;
				var interval = 10;
				var loopTimeIndex = 1000000;

				clearInterval(_this._currentIntervalId);

				_this._currentIntervalId = setInterval(function(){

					// console.log(' here ? ');
					// var liAnimateDoms = _this._animateDomManager.getAnimateDoms();					
					var mapMetaInfo = _this._animateDomManager.getMetaInfos();
					console.log("mapMetaInfo", mapMetaInfo)
					var liMAIndex = Object.keys(mapMetaInfo);
					console.log("liMAIndex", liMAIndex)
					for(var i = 0; i < liMAIndex.length; i ++){

						var maIndex = +(liMAIndex[i]);
						console.log("maIndex", maIndex)
						// console.log(' _this._liHiddenMAIndex.indexOf(maIndex)  ', maIndex, _this._liHiddenMAIndex, _this._liHiddenMAIndex.indexOf(maIndex))

						var metaInfo = _this._animateDomManager.getMetaInfobyIndex(maIndex);
						console.log("initfuncmetainfo", metaInfo)
						var aniinterval = metaInfo.antinterval;
						if(timeIndex%aniinterval > 0){
							continue;
						} 
						// console.log(' time index ', timeIndex, aniinterval, typeof(aniinterval));
						
						var liAntOffset = metaInfo.antoffsets;
						var antmodel = metaInfo.antmodel;
						var antWidth = metaInfo.antwidth;
						// console.log(' ant width ', antWidth);
						var cenPosDisplace = metaInfo.cenPosDisplace;
						// var boundaryPath = metaInfo.boundaryPath;
						var perimeter = metaInfo.perimeter;
						var antGap = metaInfo.antgap;
						// var liLinePerLength = metaInfo.lengthperlist;
						// var liNormalAngle = metaInfo.normalanglelist;

						var liNextAntOffset = [];

						// console.log(' ant model ', liAniDom);
						liAntOffset.sort(function(a, b){return a - b;});
						
						// console.log(' liAntOffset ', liAntOffset);

						for(var j = 0; j < liAntOffset.length; j ++){ //

							var offset = liAntOffset[j];
							var currentAnt = _this._animateDomManager.getAnt(maIndex, offset);
							
							currentAnt.visible = false;
						
							offset += 1
	
							//remove out of end boundary
							if(offset > (perimeter + antWidth/2.)){
								currentAnt.visible = false;
								// aniDom.remove();
								continue;
							}

							if(_this._liHiddenMAIndex.indexOf(maIndex) >= 0)
								continue;


							//add in begin boundary
							if(j == 0 && offset >= (antGap - antWidth/2.)){
								
								var newOffset = -antWidth/2.
								var ant = _this._animateDomManager.getAnt(maIndex, newOffset);
								ant.visible = true;
								liNextAntOffset.push(newOffset);
							}

							var newAnt = _this._animateDomManager.getAnt(maIndex, offset);
							newAnt.visible = true;
							// console.log(' offset visible ', antWidth, offset);
						
							liNextAntOffset.push(offset);
						}	

						metaInfo.antoffsets = liNextAntOffset;
						_this._animateDomManager.updateMetaInfo(maIndex, metaInfo);
						
					}

					// break;
					if(timeIndex > loopTimeIndex)
						timeIndex = 0
					else
						timeIndex += 1;

				}, interval);
				break;

			case 'upload': 
				var printStr = "[";
				var liGeometry = this._geometryDefiner.getGeometry();
				for(var i = 0; i < liGeometry.length; i ++){
					if(i == liGeometry.length - 1)
						printStr += ('[' + liGeometry[i][0] + ',' + liGeometry[i][1] + ']');
					else
						printStr += ('[' + liGeometry[i][0] + ',' + liGeometry[i][1] + '],');
				}
				printStr += ']';
				alert(printStr);
				break;

			case 'saveDB':

				var name=document.getElementById('saveMAName').value;

				var result = {};
				result['name'] = name;
				var mapIndexMAInfo = _this._animateDomManager.getMetaInfos();
				console.log(' save to db ', Object.keys(mapIndexMAInfo).length, _this._liStoreMAIndex);
				
				var mapGroupIdMaList = {};

				// var groupidlist = [[0,3],[4,11],[12,19],[20,32],[33,41],[42,47]];
				var currentGroupId = 0
				var tempid = 0
				// var liMA = [];
				for(var index in mapIndexMAInfo){
					var ma = {};
					// if(_this._liStoreMAIndex.indexOf(+index) >= 0)
					// 	continue;
					// _this._liStoreMAIndex.push(+index);

					// console.log(' add ', index);
					var geometry = _this._geometrySaver.getMAGeometrybyIndex(index);
					var mainfo = mapIndexMAInfo[index];
					//geometry
					if(geometry['path'] != undefined){
						ma['path'] = {
							'geotype': geometry['path']['geotype'],
							'dots': geometry['path']['geometry']
						}	
					}
					if(geometry['ant'] != undefined){
						ma['ant'] = {
							'geotype': geometry['ant']['geotype'],
							'dots': geometry['ant']['geometry']
						}
					}
					if(geometry['boundary'] != undefined){
						ma['boundary'] = {
							'geotype': geometry['boundary']['geotype'],
							'dots': geometry['boundary']['geometry']
						}
					}
					var groupid = mainfo['groupid'];
					// tempid += 1
					// while(1){						
					// 	if(index >= groupidlist[currentGroupId][0] && index <= groupidlist[currentGroupId][1]){
					// 		groupid = currentGroupId;
					// 		break
					// 	}
					// 	currentGroupId += 1
					// }
					// var groupid = mainfo['groupid']
					// groupid = 1
					if(mapGroupIdMaList[groupid] == undefined){
						//
						var mainfo_group = {
							'ae':'MA',
			                'groupid': groupid,
			                "antgap" : mainfo['antgap'],
			                'antcolor': mainfo['antcolor'],
			                "antshape" : "self-defined",
			                "antinterval" : mainfo['antinterval']
						};
						var lima = [ma];
						//not exist
						mapGroupIdMaList[groupid] = {
							'mainfo': mainfo_group,
							'malist': lima,
						}
					}else{
						//exit
						console.log(" add! ");
						mapGroupIdMaList[groupid]['malist'].push(ma);
					}
					//
					// liMA.push(ma);
				}
				result['magroups'] = mapGroupIdMaList;
				// console.log(' grouplist ', result);

				//send to server
				var self = this;
				var formData = new FormData();
				var url = 'http://localhost:20082/saveMA';
				formData.append('ma', JSON.stringify(result));
				lSendUrl('POST', url, formData, this.successSaveFunc, self);
				break;
		}
	}
	this._init(example);
	return this;
};

// export default FunctionHub;
module.exports = FunctionHub