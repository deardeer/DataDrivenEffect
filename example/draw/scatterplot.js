var g_liClusterAvgDis = []
var g_liClusterOuterNum = [];
var g_StepNum = 5
function drawScatterPlot(){

	var svg = d3.select("#drawsvg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    liColor = d3.schemeCategory10;

    var scatterPlot = getScatterPlotData()
    var liId = Object.keys(scatterPlot['target_id'])
    var maxX, minX, maxY, minY;    
    minX = -32.4054354932; maxX = 33.4769980021
    minY = -29.6547858296; maxY = 36.6901175508

    var mapTargetIdIndexPoses = {}
    var liDisplayXY = [[1,1], [1.2, 1.2], [1.3, 1.3], [1.35, 1.35], [1.3, 1.3], [1.2, 1.2]]
	
	// var liAvgDis = []
	var mapIdCenDot = {}
	var mapIdAvgDis = {}
	var mapIdStepNum = {}
	var mapIdOutlierNum = {}
	var mapIdDisplayXYList = {}

    for(var i = 0; i < liId.length; i ++){

    	var id = +(liId[i])
    	var xlist = scatterPlot['xlist'][id]
    	var ylist = scatterPlot['ylist'][id]

    	var liDot = []

    	group = svg.append('g')
    	   .attr('class', 'node-' + id)
    	   .selectAll('.circle-' + id)
    	   .data(xlist)
    	   .enter()
    	   .append('circle')
    	   .attr('class', 'circle-' + id)
    	   .attr('fill', liColor[id])
    	   .attr('currentIndex', 0)
    	   .attr('cx', function(d, i){
    	   	// console.log(' x ', xlist[i])
    	   	liDot[i]= []
    	   	liDot[i][0] = (+(xlist[i] + 40)) * 7
    	   	return liDot[i][0]//(+(xlist[i] + 40)) * 7
    	   })
    	   .attr('cy', function(d, i){
    	   	// console.log(' y ', ylist[i])
    	   	liDot[i][1] = (+(ylist[i] + 40)) * 7
    	   	return liDot[i][1]
    	   })
    	   .attr('ocx', function(d, i){
    	   	// console.log(' x ', xlist[i])
    	   	liDot[i]= []
    	   	liDot[i][0] = (+(xlist[i] + 40)) * 7
    	   	return liDot[i][0]//(+(xlist[i] + 40)) * 7
    	   })
    	   .attr('ocy', function(d, i){
    	   	// console.log(' y ', ylist[i])
    	   	liDot[i][1] = (+(ylist[i] + 40)) * 7
    	   	return liDot[i][1]
    	   })
    	   .attr('r', 5)
    	   .style('stroke', 'black')

    	 //center dot
    	 cenDot = computeCentriod(liDot);
    	 avgDis = computeAvgDis(liDot, cenDot)
    	 outlierNum = computeOutlierNum(liDot, cenDot);
    	 g_liClusterAvgDis.push(avgDis);
    	 g_liClusterOuterNum.push(outlierNum)
    	 mapIdAvgDis[id] = avgDis;
    	 mapIdCenDot[id] = cenDot;
    	 mapIdOutlierNum[id] = outlierNum;

    	 d3.select('.node-' + id)
    	    .append('circle')
			.attr('class', 'cendot')
			.attr('cx', cenDot[0])
			.attr('cy', cenDot[1])
			.attr('r', 5)
			.style('stroke', 'black')
			.style('fill', 'black')

		//avg circle
    	 d3.select('.node-' + id)
    	    .append('circle')
			.attr('id', 'boundary-' + id)
			.attr('cx', cenDot[0])
			.attr('cy', cenDot[1])
			.attr('or', avgDis)
			.attr('r', avgDis)
			.style('stroke', liColor[id])
			.style('fill', 'none')
			.style('stroke-width', '4px')
			.style('stroke-dasharray', '2 2')

	}

	g_liClusterAvgDis.sort(function(a, b){return b - a});
	console.log(' liavg dis ', g_liClusterAvgDis);
	// var minAvgDis = liAvgDis[0], maxAvgDis = liAvgDis[liAvgDis.length - 1]
	// console.log(" AvgDis min ", minAvgDis, maxAvgDis)


	for(var i = 0; i < liId.length; i ++){

		//compute the poses
		var id = liId[i]
		var cenDot = mapIdCenDot[id]
		var avgDis = mapIdAvgDis[id]
		var outlierNum = mapIdOutlierNum[id]

		/*
		svg.append('text')			
			.attr('x', cenDot[0])
			.attr('y', cenDot[1])
			.text(g_liClusterAvgDis.indexOf(avgDis)) //mapIdOutlierNum[id]) //
		*/

		var circles = d3.selectAll('.circle-' + id);
		var liTempDisplayXY = getDisplayXYbySize2(g_StepNum, g_liClusterAvgDis.indexOf(avgDis)); //g_liClusterOuterNum.indexOf(outlierNum))//
		mapIdDisplayXYList[id] = liTempDisplayXY;
		// console.log(' index ', (g_liClusterAvgDis.length - g_liClusterAvgDis.indexOf(avgDis)), liTempDisplayXY);
		// mapIdStepNum[id] = liTempDisplayXY.length;
		// console.log('liTempDisplayXY ', liTempDisplayXY, avgDis, liAvgDis.indexOf(avgDis))
		for(var q = 0; q < liTempDisplayXY.length; q ++){
		    var displayXY = liTempDisplayXY[q]
		    var liNewXY = resizeVertexDots(cenDot, displayXY, circles);
		    // console.log(' linew xy ', liNewXY)
		     if(mapTargetIdIndexPoses[id] == undefined){
	            mapTargetIdIndexPoses[id] = [liNewXY]
	        }else{
	            mapTargetIdIndexPoses[id].push(liNewXY);
	        }
	    }

		// console.log('mapTargetIdIndexPoses ', mapTargetIdIndexPoses)
    }

    //animate
    console.log(' g_liClusterAvgDis ', mapIdStepNum, mapTargetIdIndexPoses);
     var index = 0

 	 	
     var tempInterval = setInterval(function(){

     	 for(var i = 0; i < liId.length; i ++){
     	 	// var avgDis = mapIdAvgDis[liId[i]];
     	 	// var timeInterval;
     	 	// var stepNum = mapIdStepNum[liId[i]];

     	 	// var clusterIndex = g_liClusterAvgDis.indexOf(avgDis);
     	 	// if(clusterIndex > 3)
     	 	// 	continue
     	 
 	 		var tempIndex = 0
 	 		var displayRatio = mapIdDisplayXYList[liId[i]][index][0]
 	 		// var currentIndex = d3.select('.circle-' + liId[i]).attr('currentIndex');
 	 		// currentIndex += 1
 	 		var liPos = mapTargetIdIndexPoses[liId[i]][index]

     	 	d3.selectAll('.circle-' + liId[i])
     	 	  .each(function(){
     	 	  	d3.select(this)
     	 	  	  .attr('cx', function(){ 	 	  	  	
     	 	  	  	return liPos[tempIndex][0]
     	 	  	  })
     	 	  	  .attr('cy', function(){
     	 	  	  	return liPos[tempIndex][1]
     	 	  	  })
     	 	  	  tempIndex += 1
     	 	  })

     	 	d3.select('#boundary-' + liId[i])
     	 	  .attr('r', function(){
     	 	  	var originr = +d3.select(this).attr('or')
     	 	  	// console.log(' origin ', originr, displayRatio)
     	 	  	return originr * displayRatio;
     	 	  	// return originr * 
     	 	  })
     	 } 

     	 index += 1
     	 if(index >= g_StepNum * 2)
     	 	index = 0;
     }, 200);
	


    console.log(' scatter plot ', scatterPlot);
}


function getDisplayXYbySize2(stepNum, sizeIndex){

	// var avgDis = [85.40102539816286, 
	// 53.643221068021816, 
	// 48.93043888310057, 
	// 43.36135378031659, 
	// 39.480684571616365, 
	// 38.722067998140545, 
	// 38.22647752298299, 37.10694073044255, 
	// 35.32371208789084, 32.219538636098775]

	var liIndex = [7, 5., 4.5, 4.0, 3.0, 2.5, 1.5, 1.0, 0.25, 0.05]

    // var lisize = [0.02, 0.04, 0.06, 0.08, 0.1]
    var expandUnit = 0.05 * liIndex[sizeIndex]//0.03 * Math.pow(1.1, liIndex[sizeIndex]);//(g_liClusterAvgDis.length - sizeIndex));
    var liDisplayXY = [];
    var liPosDisplayXY = [];
    var currentExpand = 1.;
    for(var i = 0; i < stepNum; i ++){
        liDisplayXY.push([currentExpand, currentExpand])
        liPosDisplayXY.push([currentExpand, currentExpand])
        var nextExpand = expandUnit * Math.pow(3., -i);
        currentExpand += nextExpand;
    }
    for(var i = stepNum - 1; i >= 0; i --){
        liDisplayXY.push(liPosDisplayXY[i]);
    }
    return liDisplayXY;

    //plan 2
    // var liDisplayXY = []
    // var maxExpand = 1.5;
    // liDisplayXY.push([1., 1.])
    // for(var i = 1;i <= stepNum; i ++){
    // 	liDisplayXY.push([1. + (maxExpand - 1.)/stepNum * i, 1. + (maxExpand - 1.)/stepNum * i]);
    // }
    // return liDisplayXY;
}


function computeAvgDis(liDot, cenDot){
	var disSum = 0
	for(var i = 0; i < liDot.length; i ++){
		var dot = liDot[i]
		var dis = Math.sqrt(Math.pow((dot[0] - cenDot[0]), 2) + Math.pow((dot[1] - cenDot[1]), 2))
		disSum += dis;
	}
	return disSum/liDot.length;
}

function computeOutlierNum(liDot, cenDot){
	var liDis = []
	for(var i = 0; i < liDot.length; i ++){
		var dot = liDot[i]
		var dis = Math.sqrt(Math.pow((dot[0] - cenDot[0]), 2) + Math.pow((dot[1] - cenDot[1]), 2))
		liDis.push(dis)
	}
	liDis.sort(function(a, b){return a - b});

	var IQR = liDis[Math.floor(liDis.length * 0.75)] - liDis[Math.floor(liDis.length * 0.25)]

	var minOutlier = liDis[Math.floor(liDis.length * 0.25)] - IQR, maxOuter = liDis[Math.floor(liDis.length * 0.75)] + IQR
	var outlierNum = 0
	for(var i = 0; i < liDis.length; i ++){
		var dis = liDis[i]
		if(dis < minOutlier)
			outlierNum += 1
		if(dis > maxOuter)
			outlierNum += 1
	}
	return outlierNum;
}

function getScatterPlotData(){
	return {"label":{"0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9},"target_id":{"0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9},"xlist":{"0":[21.9023098648,20.8118760895,27.9485584909,23.411271196,26.5505340478,18.5335056576,20.9326225356,33.4769980021,26.508643438,20.6995176103,21.6393413929,27.7257394029,27.3484899427,14.9409661598,27.8988723643,25.638418113,26.0425531126,24.4987052107,24.0715738303,25.8800907456,31.1833514806,25.8022264658,28.7575733517,26.0775873327,20.290266138,24.4930952177,20.0230628714,21.6432924977,20.327450325,19.8914385843,17.953311278,17.7195636505,19.6337073911,19.4025373776,22.0348087037,18.5382322458,20.6291033301,20.2549177558,19.8124754533,21.4915478483,24.2062214973,24.536604763,25.9044700371,24.9982160386,21.9512923334,23.5366664573,21.2421643383,26.9876573315,25.8832620162,22.8212082092,24.3593196973],"1":[6.0070650001,12.6542000664,7.466035359,8.4514841362,7.1912410493,6.1747352191,4.0673185145,6.4404187892,7.5530144704,7.8293411269,6.6340094282,5.1974785098,10.2922119211,10.5759041499,10.8020510069,11.403836459,5.8919758113,10.9083987737,7.2262813065,12.4219808065,8.6051973006,13.1776424545,12.0522422888,8.2438460051,13.0948206318,8.6484827331,4.5165158387,7.0183766431,5.5687962179,3.500458554,3.2303799375,12.8281883961,3.6808212566,5.9207940185,6.9196095641,2.9377949823,2.219894651,1.6614465512,4.1588506245,4.0992387646,5.6984831623,4.4103942837,10.9165154069,-0.293865239,15.667608291,6.2449950553,4.1808598535,5.829398619,7.3471638898,4.1357203742,2.8294106108,5.8025041478],"2":[8.3888610699,13.8105303717,15.254069521,9.3629234977,9.3973829537,7.7443569933,9.7519118764,11.0919493019,9.4464977914,20.9660677197,12.6112095098,9.4516131186,9.8588825213,17.5469175483,14.6987627067,10.8721102677,15.6823829392,13.2042780838,20.1352242253,16.9504407699,10.8722112674,15.1124440583,15.4681655465,20.7193921249,21.2687306412,12.616179781,17.326500238,18.5221472384,19.6864687407,20.3836894344,16.2673026697,17.1315504139,19.38094535,19.5072710854,18.7935689832,13.5803664045,17.9982894181,18.9456788617,18.7120068237,14.6506557085,13.1754034149,13.2503494247,12.4313268333,12.9838356957,11.8353597977,12.0406208742,13.3648474131,14.4382230876,16.3178875174,15.8565554028],"3":[-26.0761156278,-26.5314644112,-21.9064667243,-28.3149745711,-25.2880592028,-26.8034339721,-27.6745911788,-22.908103421,-24.7696996428,-27.7902877958,-22.3998413162,-23.8949175311,-17.740084357,-21.1032611895,-22.9788504362,-24.3957454685,-23.065584469,-25.5284456756,-26.092909123,-22.847112211,-29.3987357938,-23.9692965201,-22.8310437267,-25.0486961324,-23.6850369113,-21.5574561824,-26.6483064843,-24.4512445231,-26.5223744631,-23.1158056273,-26.4257757503,-23.8970616472,-24.4440887371,-30.9290439757,-24.3270698433,-22.2549910556,-26.8662040561,-27.5921702668,-26.6177658337,-25.5940114094,-21.1789028283,-22.7331429805,-18.7399974638,-20.8212534676,-21.4149301352,-26.4076508222,-21.6706549647,-24.9767491653,-24.5290319994,-25.3224268019,-28.1445304537,-24.9720377225,-23.3837560828],"4":[23.1033859583,24.3628119189,20.3313773796,23.3254700922,24.5200839735,23.215040977,23.0603287532,21.6089169716,22.916831235,27.7622084088,25.4777728399,23.4550893956,28.2955878541,20.4217824068,18.2995172409,18.364723659,16.3451518238,14.3758653668,15.4827461071,16.707554149,16.187054828,11.80878031,17.1205100124,14.2832415684,18.9854595988,25.2336965239,27.8371660278,30.0020732294,27.1989808505,29.1054341439,28.7190894832,26.3443669043,26.0536880522,28.5387626692,27.1837831529,30.2105619835,27.0611902962,23.6259353489,17.3720059302,18.8811007894,17.2147040361,20.6549415484,18.4973628106,16.6984356307,20.5320009537,18.7544904661,20.9703511481,19.119826372,18.5569702317],"5":[-21.2467031513,-2.0942623523,-1.3477703602,-7.8593240514,-4.8540388413,-2.5375390547,-3.1989547104,-6.5272832541,-5.3328962252,-6.2673393427,-5.4275068935,-0.7708216033,-5.4562964569,2.2353642333,-2.049993208,3.4557931671,-1.2521705383,3.5709735561,2.0758592418,-2.9389187188,-2.9271235135,1.9097174405,-0.1877472658,1.1347016096,1.0992083836,-0.5647550644,-8.9495043138,0.0481080262,-7.9886008488,-9.2655909539,-12.0420685642,-12.8218030931,-8.725503623,-7.7271919561,-8.8584491563,-10.0279999763,-5.6975381733,-10.0230775815,1.8719855968,-12.1722750772,-10.5611744847,-9.8522962652,-11.9002903082,-9.1210889728,-14.8105618391,-12.0663395834,-12.5881997211,-9.8141869851,-9.1834768687,-8.1922556374],"6":[-21.1244556035,-21.4580270344,-21.0965563692,-22.6687727173,-23.660793128,-24.2913012573,-22.0235916631,-28.5582670412,-22.0994849995,-23.1712960349,-19.0138629631,-18.7909445171,-19.2526807685,-26.441927301,-24.121328445,-20.0602652861,-28.5823043194,-25.1551219268,-21.5576834534,-24.5161396112,-26.3898452824,-26.7506087775,-21.6518772715,-25.4436224628,-27.4105039983,-30.0933714361,-28.994923829,-26.6402066092,-26.7225394079,-30.4357660133,-30.3323011942,-27.3257055333,-30.4623860504,-23.0709905157,-32.4054354932,-25.2134276914,-30.6950092675,-29.8372242517,-27.4159768484,-27.6007603038,-25.4967985078,-27.2276993543,-29.5750506485,-26.9473395657,-28.8135960409,-25.2322732152,-25.9786040462,-23.8849965645,-24.4008712287,-26.5972298173,-17.4858217662],"7":[-11.4320110309,-3.2002527265,-4.3275021271,-4.842366256,-11.0865742025,-8.9315412615,-5.5994580727,-7.7918257385,-2.0663796175,-5.6021980127,-2.5757144442,-7.1843107396,-9.2319662179,-4.9669501255,-6.2593125634,-9.8509497065,-8.2643718506,-6.6438937136,-5.8892681421,-8.3254285662,-10.9819991166,-6.9471971436,-9.0219146584,-8.6399814714,-7.6122808485,-10.5052938584,-8.0506111067,-11.3951325511,-11.4678347111,-6.3644101332,-8.2211849076,-12.2528986874,-3.518379981,-6.1762428774,-7.4398121741,-8.5629382522,-6.3790466887,-5.5487124341,2.4550482713,4.5819913473,5.006038181,5.5372361614,2.9555453413,3.3498310855,4.465672019,5.958432616,3.7834253691,0.831822864,4.3027476124,5.0521033676],"8":[-5.7804530985,2.3957750398,-3.0966567544,4.0215120483,-3.4597593049,-0.7775382553,1.0482450754,3.182660582,-1.1761288609,1.5102979972,-2.3239954991,3.9962935883,3.1399552672,-5.5674696535,-5.8050433852,-0.5113868842,-3.5971192064,1.1180334189,-4.0714013813,0.6948745749,-6.2030620721,-1.4764716417,-3.9399064771,-4.0062781988,-5.7445186448,-0.3295120183,-7.926826712,-0.7210873878,-1.2796912017,-5.3080043271,-4.5754450531,-9.5593278312,-7.332452369,-5.3123116093,-5.8494395628,-27.2551432668,-7.2402689609,-0.9108150255,-9.5656631206,-2.7728092257,-11.6797141286,-8.4304539203,-8.6152874394,-10.1669810581,-8.4915968863,-8.7380380892],"9":[-16.0001404405,-24.3367150205,-24.143730861,-23.8182149015,-26.7521322087,-15.5833620537,-3.3162837745,-22.0441298341,-16.4173994013,-23.1641938483,-25.1928272864,-11.5369590466,-17.8165700861,-21.3866984242,-20.1504998312,-20.9907238796,-20.5069706429,-19.0225080983,-22.0458277129,-18.5577754411,-17.7843919903,-16.5691380237,-20.735239367,-14.7394235926,-16.9959882501,-3.6688391865,-0.9170951924,-16.3382521996,-19.0900378391,-12.6209537088,-12.5443027718,-0.7921506924,-2.9695642931,-1.5056322812,-0.3774351439,0.3181977665,-1.0126745154,-1.6079356338,-18.6022845568,-17.769687015,-18.2448049119,-14.270224548,-14.385722118,-15.461641304,-15.9768041438,-14.3609959804,-14.7956771416,-13.5898425161]},"ylist":{"0":[-25.0128128726,-26.588854776,-20.6827862204,-25.9110031713,-24.8919714075,-21.853103019,-19.3365745685,-20.8871369138,-17.6471198909,-15.9872073991,-20.9091613454,-15.2535797209,-19.5496993851,-21.1353035601,-24.1820559082,-17.7447073127,-22.8841337121,-25.412510434,-19.2222982173,-21.7648951526,-20.9905075499,-20.3473366046,-21.7643072621,-15.6151800652,-17.6212477102,-18.9143292933,-27.9130930583,-22.4071929878,-28.9755649588,-29.6547858296,-27.6449298599,-23.059941942,-24.0509715632,-24.4477664542,-25.8901957546,-25.5702274484,-25.937416169,-21.8807777733,-20.1214552355,-18.0599470669,-21.3180057378,-21.8075580011,-22.0284268469,-25.381773582,-20.5678400575,-20.3892850365,-21.8395743414,-22.9290492256,-24.4422725901,-16.7627573577,-16.4879744858],"1":[18.4430208277,17.2703609638,27.2248236782,23.6083458257,23.5255278661,24.4885230416,22.566037316,30.2582776468,20.0950194764,23.7628605015,18.9330210263,9.2857556104,26.6953849887,30.3699068574,27.5793263092,29.0588786,30.084329956,29.5381916694,29.1218114698,22.9297124636,27.5257766997,25.2369132041,27.9576448439,29.6364125143,36.6901175508,30.7542275721,9.605878732,15.2000899283,14.0982364599,7.7941309557,13.2657662989,24.1093560641,9.4890973461,13.1236954252,14.068102599,10.9562926419,9.3017376328,10.9341763754,7.1225905155,29.558472352,25.1901495352,27.5100297928,26.0113243129,26.3595544298,-7.7103807755,26.8112249188,21.2946589,20.7893715642,23.1981954694,24.3208686689,24.4299231336,27.5899783828],"2":[10.8894109906,-5.9373701551,-2.9273770891,6.3393429811,9.7302827434,11.159306211,10.1637320659,9.8035302237,11.8969628445,-0.5223970209,4.3851530472,6.8386154204,6.078348956,-2.12489926,2.9162375008,1.7446483817,1.5441889436,4.0558156228,-2.6553226695,-1.9183353997,0.390850668,0.1497705933,-0.0468427813,-2.7915955525,-1.8663278897,-0.6642565991,-2.4337598891,0.5594566147,3.8903656257,0.5642045598,2.3562350691,1.6162035612,1.2208555156,1.7220493922,4.4836384902,2.512634479,-0.3850482599,4.040846186,1.688579026,-5.9875095667,-6.867156699,-5.3635692348,-7.7119793929,-3.1593962727,-5.4233153348,-6.2173028403,-7.8003420023,-2.43653501,-3.2026557341,-3.7826709232],"3":[-13.7801612923,-22.0927690809,-27.8409601859,-21.1641126372,-23.3223443768,-23.4438942298,-23.3171660775,-22.8449510656,-25.7136637321,-25.8214059168,-24.0194646423,-24.7203344172,-25.0036173209,-25.7303252421,-23.524063125,-27.9273575477,-23.0273200734,-24.7351158843,-25.5367054773,-28.1807469221,-24.281298311,-26.9938446328,-26.7684781258,-23.4130335696,-28.2134912253,-29.3680386161,-13.1126451833,-19.4768977234,-19.6861293202,-18.0132257392,-16.5193200277,-19.881039004,-16.2410705685,-15.7256983136,-17.5051541406,-19.2257524271,-15.8580797649,-15.88414471,-19.3872096059,-20.5188130503,-20.2793352972,-13.1115406294,-13.6564802638,-13.7969851136,-15.515054472,-11.5070553243,-13.3997220543,-12.3663326374,-9.6718660795,-12.0194879177,-13.3844594488,-12.8449134541,-11.4857858499],"4":[23.0816990261,19.0509791658,24.100597165,21.0123460319,21.611215851,15.7188574091,13.607161738,21.672210596,23.8417731446,16.5186454003,15.1974847725,14.1368435609,14.3712865966,14.5167130806,14.9430993767,21.2165532275,15.3295637447,19.0708708432,18.337474163,16.7095339642,15.803214652,17.7530000339,16.700827424,22.074781878,14.6615292477,14.6103531057,16.0759763647,15.9221362715,19.9891282673,17.8802296728,17.1234531074,15.014870892,20.441549859,14.53049633,22.2273005887,18.4745321869,17.395516236,17.9205000208,20.2356344833,17.7665975949,20.8109677066,22.1868185042,18.844810463,18.2564492861,22.6489621362,18.7856173014,20.3474233605,23.0687328889,22.1810687195],"5":[-3.9735868216,-22.1536347451,-27.1010197302,-18.999206792,-20.6423428591,-22.0325866126,-20.6310673485,-19.5334341409,-24.0597994189,-24.011181286,-25.3021654677,-23.4167738547,-22.5597680251,-26.2443273694,-23.7488045674,-27.3214552467,-22.5474862752,-24.5740756558,-22.8106822741,-25.2381205129,-29.1184072429,-27.1427023507,-28.7991592443,-25.9107478458,-26.2795997504,-26.4206861821,-17.3370576374,-20.1945167542,-17.6996836622,-17.5481873116,-13.8462806312,-13.6861593316,-19.8026722803,-25.8035112643,-19.1886479177,-14.0353810164,-19.9271141381,-13.3687785452,-20.1448747494,-19.2938338258,-22.3957726473,-20.1960713066,-17.9674258013,-23.5045612373,-17.0757356864,-20.2308078513,-17.2677707765,-23.9453104818,-18.1192926928,-24.2071546002],"6":[16.1162316261,12.7840991135,17.7925732074,11.3534056071,17.9467885147,16.643025447,19.6426626383,19.0475540718,16.3631288181,15.2915720811,15.6513278079,17.3361688768,14.3105402833,17.2669438493,12.1989926688,15.1387360423,20.7123587894,19.3083547437,9.2403308733,19.6407189952,23.3501962576,20.9476078206,13.7384290092,10.1204654245,16.2991995607,12.1487595263,15.706417368,22.006753465,15.6792163503,14.3632834718,16.9263213619,16.3313965508,16.3835004521,13.2813559846,15.4769812893,14.5914275524,17.4963236893,18.7866473606,9.6023122428,7.9637614449,7.0020417792,7.381711208,13.2276646285,9.8740929286,8.688550213,8.833952814,14.2921571045,10.8811302297,6.703819373,8.9669697475,17.4947197154],"7":[18.1692403793,20.0746500927,11.6668422634,12.4245975584,19.0489924664,16.1011366479,17.1339006008,18.1874196042,17.280015449,21.3023151356,18.110685276,18.5952087144,20.9873937877,20.8061594495,21.1253298382,25.0310692119,15.0167288604,16.024224923,23.2771269024,26.3490481598,25.8549067373,24.8615988592,16.4111037541,21.9778400924,25.9237052739,16.392251915,17.2891769163,13.8451876278,22.4969615474,14.7081205356,13.1938385533,13.9534286548,20.2661191594,19.5147567643,22.7720220843,24.7746947848,19.7821096501,15.8034605125,-11.2839607544,-9.1087380417,-12.4793516333,-8.9745434468,-8.3275546519,-10.338259049,-14.0434845244,-13.8200682012,-9.0666490213,-10.5640741506,-12.6409320639,-11.9932210632],"8":[2.8802315127,4.1264772979,2.8869770702,1.5640076535,5.2808924445,2.5820134167,1.1070925491,0.223298745,2.3436466563,4.6076726902,7.6192378547,2.5660867987,4.8720369985,2.7110529901,1.589816339,5.421163096,7.038112483,7.1120755262,5.4447424707,7.1979367409,6.464975053,6.2843068624,5.9533614549,6.0930127121,4.5879778038,2.3404020217,-3.4046445732,-0.418027514,-3.2944671749,-1.3226848561,-2.2781363804,-2.0776381657,-2.6676746166,-0.2048260045,-1.5269064714,-11.1688680943,-1.821736702,-1.1673758648,2.4519441466,-1.3231188735,-0.7398972949,0.7361520278,1.6729692232,-1.8526109431,3.0464572235,-5.1064352029],"9":[-1.0440702149,-5.9744309719,-5.6414262607,-6.133301054,-7.6878599007,-11.5854281181,-10.8287309915,-5.2834404689,-12.2115003569,-8.0307409152,-6.6132025929,-8.4826572456,-9.4761948862,-10.0844234298,-3.4517730675,-6.3334320995,-9.2941875733,-8.0127637149,-6.6884204134,-4.1992533443,-4.1055816458,-4.7066076143,-5.2340708612,-2.5578509519,-2.5145428284,-8.4824460757,-5.5962537746,-9.3946369834,-8.2183688467,-8.7333455692,-10.1820915545,-8.3505938992,-10.1718004807,-10.0397255578,-9.2185026504,-13.9313356128,-14.4164328594,-9.1845657572,-10.1024175557,-7.9799434017,-6.7873890275,-3.2194839524,-3.7175211678,-8.3146069953,-7.583724058,-3.8600445487,-6.81599049,-3.5464068452]}}
}