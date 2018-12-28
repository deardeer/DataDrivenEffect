function AnimateEditor(functionHub){
	var _this = this;
	this._functionHub = functionHub;
	// this._currentEditMAIndex = -1;
	this._currentEditGeometryType = undefined;

	$('#groupid').on('input', function(){
		var groupid = this.value;
		if(groupid == NaN)
			return;
		var groupspan = document.querySelector("#groupli-" + groupid + " span");
		if(groupspan == undefined)
			return;
		var exMaIndex = +(groupspan.innerText);

		console.log(' ma list ', exMaIndex);
		// var maIndex = +d3.select(this).attr('index');
		// var maGeometry = _this._functionHub._geometrySaver.getMAGeometrybyIndex(maIndex)// getMetaInfobyIndex(+d3.select(this).attr('index'));
		// var func = d3.select(this).attr('type');

		// _this._currentEditMAIndex = maIndex;
		console.log(" !!! ", _this._functionHub._animateDomManager._mapDomMetaInfo);
		var maInfo_previous = _this._functionHub._animateDomManager.getMetaInfobyIndex(exMaIndex);//_this._currentEditMAIndex);
		console.log("maInfo_previous ", maInfo_previous);
		document.getElementById('interval').value = +maInfo_previous['antinterval']
		document.getElementById('manual-antgap').value = +maInfo_previous['antgap']
		document.getElementById('antcolor').jscolor.fromString(maInfo_previous['antcolor']);
		document.getElementById('groupid').value = maInfo_previous['groupid']

	})

	this.addMADoms = function(metaInfoIndex, metaInfo){

		// console.log(" add MA Doms ", metaInfo);

		var index = metaInfoIndex;
		var maArea = document.getElementById('maarea');

		var magroupUL = document.getElementById('magroupul');
		var groupli = document.getElementById('groupli-' + metaInfo.groupid);
		if(groupli == null){
			//not exist
			var maInfoHTML = ' <button class="mabutton" groupid=' + metaInfo.groupid + ' type="mainfo" > mainfo </button>';
			var htmltemplate = "<li id=groupli-"  + metaInfo.groupid + "> group " + (metaInfo['groupid']) + maInfoHTML + "<span> " + (index) + '</span>' + '</li>';
			// magroupUL.innerHTML += htmltemplate;
		}else
			groupli.innerHTML += "<span> " + (index) + '</span>';

		// maArea.innerHTML += htmltemplate;
		var funcType = 'editGeometry';

		d3.selectAll('.mabutton')
		.on('click', function(){
			var groupId = d3.select(this).attr('groupid');
			var liMaIndex = [];
			document.querySelectorAll("#groupli-" + groupId + " span").forEach(function(d){
				liMaIndex.push(+d.innerText);
			})
			console.log(' ma list ', liMaIndex);
			// var maIndex = +d3.select(this).attr('index');
			// var maGeometry = _this._functionHub._geometrySaver.getMAGeometrybyIndex(maIndex)// getMetaInfobyIndex(+d3.select(this).attr('index'));
			// var func = d3.select(this).attr('type');

			// _this._currentEditMAIndex = maIndex;
			var maInfo = _this._functionHub._animateDomManager.getMetaInfobyIndex(liMaIndex[0]);//_this._currentEditMAIndex);
			_this.editAnimate(maInfo, liMaIndex);
		})
	}

	this.editGroupAnimate = function(maInfo_previous){

	}

	this.editAnimate = function(maInfo_previous, liMaIndex){
		var aeInfo = undefined;

		//fake
		// var liTestPathDot = [[100,200], [300,200]];
		// this._functionHub._geometrySaver.fakeGeometryNew('line', liTestPathDot, 'path')
		// var liTestBoundaryDot = [[100, 195], [300,195], [300,205], [100,205]]
		// this._functionHub._geometrySaver.fakeGeometryNew('area', liTestBoundaryDot, 'boundary');

		var MAGeometryInfo = undefined;
		if(liMaIndex == undefined || liMaIndex.length == 0){
			MAGeometryInfo = _this._functionHub._geometrySaver.getCurrentMAGeometry();
			if(MAGeometryInfo == undefined){
				alert('Marching Ant Definer Error ')
				return;
			}
		}
		// else
			// MAGeometryInfo = _this._functionHub._geometrySaver.getMAGeometrybyIndex(this._currentEditMAIndex)
		
		//_this._functionHub._geometrySaver.getGeometry(_this._functionHub._currentGeometryId)
		

		if(maInfo_previous != undefined){
			document.getElementById('interval').value = +maInfo_previous['antinterval']
			document.getElementById('manual-antgap').value = +maInfo_previous['antgap']
			document.getElementById('antcolor').jscolor.fromString(maInfo_previous['antcolor']);
			document.getElementById('groupid').value = maInfo_previous['groupid']
			// document.getElementById('styleInput').value = maInfo_previous['antcolor']
				
		}

		var modal = document.getElementById('aeModal');
		modal.style.display = "block";

		// Get the <span> element that closes the modal
		var span = document.getElementById("aecancel");
		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
		    modal.style.display = "none";
		    return aeInfo;
		}

		var okspan = document.getElementById('aeok');
		
		okspan.onclick = function(){

			// var ant_type = d3.select('.tablinks.active').text()
			// console.log(' ant _type ', ant_type);
			var aeInfo = {};

			// if(_this._currentEditMAIndex != undefined){
			// 	//todo: reset the para.
			// }

			aeInfo = {
				'ae': 'MA',
				'groupid': document.getElementById('groupid').value,
				// 'ant': 'circle',
				// 'stepper': 0.05,
				'antgap': (+document.getElementById('manual-antgap').value < 0.05) ? 0.05: (+document.getElementById('manual-antgap').value),
				'antshape': $('input[name="anttype"]:checked').val(),
				'antcolor': '#' + document.getElementById('antcolor').value,
				// 'stroke': document.getElementById('strokecolor'),
				// 'stroke-dasharray': dasharray,
				// 'stroke-width': +document.getElementById('strokewidth').value,
				'antinterval': (+document.getElementById('interval').value),	
				// 'loop': 1000000 - 1,		
			} 
			
			modal.style.display = 'none';

			var existBool = true;
			var MAGeometryInfo, MAGeometryIndex;

			if(liMaIndex == undefined || liMaIndex.length == 0){
				//new one
				MAGeometryInfo = _this._functionHub._geometrySaver.getCurrentMAGeometry();
				MAGeometryIndex = _this._functionHub._geometrySaver.addMAGeometry(MAGeometryInfo);
				var animateResult = _this._functionHub._animateEnhancer.activateDOM(
					MAGeometryInfo, aeInfo);
	    		var metainfo = animateResult['metainfo'];
				_this._functionHub._geometrySaver.clearCurrentMAGeometry();
				d3.selectAll('.define_geometry').style('visibility', 'hidden');
				_this._functionHub._animateDomManager.addMetaInfo(MAGeometryIndex, metainfo)
				_this.addMADoms(MAGeometryIndex, metainfo);
			}else{
				for(var temp = 0; temp < liMaIndex.length; temp ++){
					MAGeometryIndex = liMaIndex[temp];
					MAGeometryInfo = _this._functionHub._geometrySaver.getMAGeometrybyIndex(MAGeometryIndex);//getMetaInfobyIndex(_this._currentEditMAIndex);
					var animateResult = _this._functionHub._animateEnhancer.activateDOM(
						MAGeometryInfo, aeInfo);
			    	var metainfo = animateResult['metainfo'];
		    		_this._functionHub._animateDomManager.resetMetaInfo(MAGeometryIndex, metainfo);
				}
			}
			_this._functionHub._type = 'animate';
			_this._functionHub.initFunc();
		}
		return aeInfo;
	}
	return this;
}

// function animateeditor(){
// 	AnimateEditor(functionHub)
// }

// export default animateeditor;
module.exports = AnimateEditor