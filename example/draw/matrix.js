var g_matrixgraph;

var leftTop_matrix = {
	'left': 30,
	'top': 30
}

var cellSize_matrix = {
	'width': 5.3,
	'height': 5.3
}

var matrix_animated = false;
var padding = 1;

//------- matrix one ---------//

function drawMatrix(){
	g_matrixgraph = getGraph();

    // var formData = new FormData();
    // formData.append('graph', JSON.stringify(g_matrixgraph));
    // var url = 'http://localhost:20082/findClique';
    // lSendUrl('POST', url, formData, successFindCliques_matrix);
    successFindCliques_matrix();
}

function getNodeIndex(liNode, id){
    for(var i = 0; i < liNode.length; i ++){
    	if(liNode[i]['id'] == id){       
        return i;        
      }      
    }	
    return -1;
}

function drawMatrixbyNodes(svg, liNode, links){


    var lineFunction = d3.line()
    					.x(function(d){return d.x})
    					.y(function(d){return d.y})

	  //get the weight of links
    var minValue, maxValue;
    for(var i = 0; i < links.length; i ++){
    	var value = links[i].value
    	if(i == 0){
    		minValue = value
    		maxValue = value
    	}else{
    		if(minValue > value)
    			minValue = value
    		if(maxValue < value)
    			maxValue = value;
    	}
    }

    var opacity = 0.2;

	var color = d3.scaleLinear()
	        .domain([minValue,maxValue])                
	        .range(["#969696", "#252525"]);

	var nodeColor = d3.scaleOrdinal(d3.schemeCategory20);

    var liLinks = links

    //columns
    var columngroup = svg.selectAll('.columngroup')
       .data(liNode)
       .enter()
       .append('g')
       .attr('class', 'columngroup')

    columngroup
       .append('rect')
       .attr('class', 'rowCell')
       .attr('width', cellSize_matrix['width'] - padding * 2)
       .attr('height', cellSize_matrix['height'] - padding * 2)
	   .attr('x', function(d, i){
	   		return  leftTop_matrix.left + i * cellSize_matrix.width + padding + 'px';
		   })
		   .attr('y', function(d, i){
		   		return leftTop_matrix.top - cellSize_matrix.height - padding;
		   })
		   .attr('fill', function(d){
		   		return nodeColor(d.group)
		   })

    columngroup
         .append('path')
         .attr('columnIndex', function(d, i){
         	return i
         })
         .attr('lineData', function(d, i){
         	var lineData = [];
         	var x = leftTop_matrix.left + i * cellSize_matrix.width
         	for(var i = 0; i <= liNode.length; i ++){
         		var y = leftTop_matrix.top + cellSize_matrix.height * i;
         		lineData.push({
         			'x': x, 'y': y
         		})
         	}    
         	return JSON.stringify(lineData)
         })
         .attr('d', function(){
         	var lineData = JSON.parse(d3.select(this).attr('lineData'))
         	return lineFunction(lineData)
         })
         .style('fill', 'none')
 		 .style('stroke', 'gray')
 		 .style('opacity', opacity)

	   //rows
	 var rowgroup = svg.selectAll('.rowgroup')
       .data(liNode)
       .enter()
       .append('g')
       .attr('class', 'rowgroup')

     rowgroup
       .append('rect')
       .attr('class', 'columnCell')
       .attr('width', cellSize_matrix['width'] - padding * 2)
       .attr('height', cellSize_matrix['height'] - padding * 2)
	   .attr('x', function(d, i){
	   		return  leftTop_matrix.left - cellSize_matrix.width - padding + 'px';
	   })
	   .attr('y', function(d, i){
	   		return leftTop_matrix.top + i * cellSize_matrix.height + padding + 'px';
	   })
	   .attr('fill', function(d){
      // return 'gray'
	   		return nodeColor(d.group)
	   })
	   // .style('stroke', 'black')

	 rowgroup  
		       .append('path')
		       .attr('rowIndex', function(d, i){
		       	return i;
		       })
		        .attr('lineData', function(d, i){
		         	var lineData = [];
		         	var y = leftTop_matrix.top + i * cellSize_matrix.height
		         	for(var i = 0; i <= liNode.length; i ++){
		         		var x = leftTop_matrix.left + cellSize_matrix.width * i;
		         		lineData.push({
		         			'x': x, 'y': y
		         		})
		         	}    
		         	return JSON.stringify(lineData)
		         })
	           .attr('d', function(){
		         	var lineData = JSON.parse(d3.select(this).attr('lineData'))
		         	return lineFunction(lineData)
		        })
	             .style('fill', 'none')
		 		 .style('stroke', 'gray')
		 		 .style('opacity', opacity)



    function getNodebyId(liNode, id){
    for(var i = 0; i < liNode.length; i ++){
        var node = liNode[i]
        if(node['id'] == id){
          return node;
          // liTempNode.push(node)
        }
      }
      return {};
    }

	//grid lines
    var groups = svg.selectAll('.matrixCell')
       .data(liLinks)
       .enter()
       .append("g")
       .attr('class', 'matrixCell');

    //with cells
    
    groups
       .append('path')
       .attr('class', 'm_cell')       
       .attr('rowIndex', function(d){
       		var sourceIndex = getNodeIndex(liNode, d.source)
	       	var targetIndex = getNodeIndex(liNode, d.target)
	       	if(sourceIndex < targetIndex)
	       		return sourceIndex
	       	return targetIndex
       })
       .attr('columnIndex', function(d){
       		var sourceIndex = getNodeIndex(liNode, d.source)
	       	var targetIndex = getNodeIndex(liNode, d.target)
	       	if(sourceIndex < targetIndex)
	       		return targetIndex
	       	return sourceIndex
       })
       .attr('id', function(d){
       		var rowIndex = +d3.select(this).attr('rowIndex')
       		var columnIndex = +d3.select(this).attr('columnIndex')
       		return 'm_cell_' + rowIndex + '_' + columnIndex
	       	// var sourceIndex = getNodeIndex(liNode, d.source)
	       	// var targetIndex = getNodeIndex(liNode, d.target)
	       	// if(sourceIndex < targetIndex)
	       	// 	return 'm_cell_' + targetIndex + '_' + sourceIndex;
	       	// else
       		// 	return 'm_cell_' + sourceIndex + "_" + targetIndex;
       	})
       .attr('lineData', function(d){

       		var rowIndex = +(d3.select(this).attr('rowIndex'))
       		var columnIndex = +(d3.select(this).attr('columnIndex'))
	       	// var source = d.source
	       	// var target = d.target;
	       	// var sourceIndex = getNodeIndex(liNode, source)
	       	// var targetIndex = getNodeIndex(target)
	       	// var target = d.target;
	       	// var targetIndex = getNodeIndex(liNode, target)
	    	var width = cellSize_matrix['width'] - padding * 2
	    	var height = cellSize_matrix['height'] - padding * 2
	       	var lineData = [
		       	{'x': leftTop_matrix.left + columnIndex * cellSize_matrix.width + padding, 
		         'y': leftTop_matrix.top + rowIndex * cellSize_matrix.height + padding,
		     	},
		     	{'x': leftTop_matrix.left + columnIndex * cellSize_matrix.width + padding + width, 
		         'y': leftTop_matrix.top + rowIndex * cellSize_matrix.height + padding,
		     	},
		     	{'x': leftTop_matrix.left + columnIndex * cellSize_matrix.width + padding + width, 
		         'y': leftTop_matrix.top + rowIndex * cellSize_matrix.height + padding + height,
		     	},
		     	{'x': leftTop_matrix.left + columnIndex * cellSize_matrix.width + padding, 
		         'y': leftTop_matrix.top + rowIndex * cellSize_matrix.height + padding + height,
		     	}
	       	]
	       	// console.log(' liData ', lineData.join(','))
	       	return JSON.stringify(lineData);
       })
       .attr('d', function(d){
       	var lineData = JSON.parse(d3.select(this).attr('lineData'))
       	// console.log(" line data " , lineData);
       	return lineFunction(lineData);
       })     
       .attr('fill', function(d){      
       	var target = d.target;
       	var source = d.source
        var beginNode = getNodebyId(liNode, target)   
        var endNode = getNodebyId(liNode, source);
        var targetIndex = getNodeIndex(liNode, target)
       	var sourceIndex = getNodeIndex(liNode, source)
	     	if(targetIndex == sourceIndex)
	     		return 'none'
        if(beginNode.group == endNode.group)
          return nodeColor(beginNode.group);
        // else          
        //   // return 'green'
	       // 	return color(d.value)
       })
       .style('stroke', function(d){
        return 'none'
        if(matrix_animated)
          return 'none'
        if(liNodeinClique.indexOf(d.target) != -1 && liNodeinClique.indexOf(d.source) != -1){          
          // console.log(' d.target 1', )
          if(getNodebyId(liNode, d.target)['group'] == getNodebyId(liNode, d.source)['group'])
            return 'black'
        }
          // console.log(' d.target ', d.target, d.source)
          return 'none'        
      });
       
       
    groups
       .append('path')
       .attr('class', 'm_cell')
        .attr('rowIndex', function(d){
       		var sourceIndex = getNodeIndex(liNode, d.source)
	       	var targetIndex = getNodeIndex(liNode, d.target)
	       	if(sourceIndex > targetIndex)
	       		return sourceIndex
	       	return targetIndex
       })
       .attr('columnIndex', function(d){
       		var sourceIndex = getNodeIndex(liNode, d.source)
	       	var targetIndex = getNodeIndex(liNode, d.target)
	       	if(sourceIndex > targetIndex)
	       		return targetIndex
	       	return sourceIndex
       })
       .attr('id', function(d){
       		var rowIndex = +d3.select(this).attr('rowIndex')
       		var columnIndex = +d3.select(this).attr('columnIndex')
       		return 'm_cell_' + rowIndex + '_' + columnIndex
	       	// var sourceIndex = getNodeIndex(liNode, d.source)
	       	// var targetIndex = getNodeIndex(liNode, d.target)
	       	// if(sourceIndex < targetIndex)
	       	// 	return 'm_cell_' + targetIndex + '_' + sourceIndex;
	       	// else
       		// 	return 'm_cell_' + sourceIndex + "_" + targetIndex;
       	})
       .attr('lineData', function(d){

       		var rowIndex = +(d3.select(this).attr('rowIndex'))
       		var columnIndex = +(d3.select(this).attr('columnIndex'))
	       	// var source = d.source
	       	// var target = d.target;
	       	// var sourceIndex = getNodeIndex(liNode, source)
	       	// var targetIndex = getNodeIndex(target)
	       	// var target = d.target;
	       	// var targetIndex = getNodeIndex(liNode, target)
	    	var width = cellSize_matrix['width'] - padding * 2
	    	var height = cellSize_matrix['height'] - padding * 2
	       	var lineData = [
		       	{'x': leftTop_matrix.left + columnIndex * cellSize_matrix.width + padding, 
		         'y': leftTop_matrix.top + rowIndex * cellSize_matrix.height + padding,
		     	},
		     	{'x': leftTop_matrix.left + columnIndex * cellSize_matrix.width + padding + width, 
		         'y': leftTop_matrix.top + rowIndex * cellSize_matrix.height + padding,
		     	},
		     	{'x': leftTop_matrix.left + columnIndex * cellSize_matrix.width + padding + width, 
		         'y': leftTop_matrix.top + rowIndex * cellSize_matrix.height + padding + height,
		     	},
		     	{'x': leftTop_matrix.left + columnIndex * cellSize_matrix.width + padding, 
		         'y': leftTop_matrix.top + rowIndex * cellSize_matrix.height + padding + height,
		     	}
	       	]
	       	// console.log(' liData ', lineData.join(','))
	       	return JSON.stringify(lineData);
       })       
       .attr('d', function(d){
       	var lineData = JSON.parse(d3.select(this).attr('lineData'))
       	// console.log(" line data " , lineData);
       	return lineFunction(lineData);
       }) 
       // .attr('columnIndex', function(d){       	
	      //  	var source = d.target
	      //  	// var target = d.target;
	      //  	var sourceIndex = getNodeIndex(liNode, source)
	      //  	return sourceIndex
       // })
       // .attr('rowIndex', function(d){ 	
	      //  	var target = d.source
	      //  	// var target = d.target;
	      //  	var targetIndex = getNodeIndex(liNode, target)
	      //  	return targetIndex
       // })
        .attr('fill', function(d){      
          var target = d.target;
          var source = d.source
          var beginNode = getNodebyId(liNode, target)   
          var endNode = getNodebyId(liNode, source);
          var targetIndex = getNodeIndex(liNode, target)
          var sourceIndex = getNodeIndex(liNode, source)
          if(targetIndex == sourceIndex)
            return 'none'
          if(beginNode.group == endNode.group)
            return nodeColor(beginNode.group);
          // else          
          //   // return 'green'
           //   return color(d.value)
       })
       .style('stroke', function(d){
        return 'none'
        if(matrix_animated)
          return 'none'
        if(liNodeinClique.indexOf(d.target) != -1 && liNodeinClique.indexOf(d.source) != -1){          
          // console.log(' d.target 1', )
          if(getNodebyId(liNode, d.target)['group'] == getNodebyId(liNode, d.source)['group'])
            return 'black'
        }
          return 'none'        
      });

}

var liNodeinClique = [];

function successFindCliques_matrix(){

	 // console.log(' top cliques ', liTopClique);
    var maxClique = ["Courfeyrac", "Joly", "Enjolras", "Bahorel", "Gavroche", "Bossuet", "Combeferre", "Feuilly", "Grantaire", "Prouvaire"]
  	var group1 = 8;
    var maxClique2 = ["Dahlia", "Blacheville", "Favourite", "Tholomyes", "Fantine", "Zephine", "Fameuil", "Listolier"]
    var group2 = 3
    var maxClique3 = ["Brujon", "Montparnasse", "Gueulemer", "Thenardier", "Babet", "Eponine", "Claquesous"]
    var group3 = 4
    var maxClique4 = ["Valjean", "Chenildieu", "Champmathieu", "Judge", "Cochepaille", "Brevet", "Bamatabois"]
    var gropu4 = 2
    var maxClique5 = ['Fauchelevent', 'MotherInnocent']
    var group5 = 0
    var maxClique6 = ['Myriel', 'Napoleon']
    var group6 = 1
    var maxClique7 = ['MlleGillenormand']
    var group7 = 5

    // var maxClique5 = ['Gribier', 'new1', 'new2', 'new3']
    // var group5 = 0
    var liCliqueGroup = [2,3,4,8,0,1,5]

    var mapGroupClique = {
    	8: maxClique,
    	3: maxClique2,
    	4: maxClique3,
    	2: maxClique4,
    	0: maxClique5,
    	1: maxClique6,
    	5: maxClique7
    }

    var colorFunc_bottom = d3.scaleLinear()
                .domain([10, 20])
              .range(["#bdbdbd", "#252525"]);
    

	var liOldNode = g_matrixgraph.nodes;
	var liOldLink = g_matrixgraph.links;

	 //fake the nodes    	
    var liFakeNode = [], liFakeLink = []
    // var mapCliqueSize = {8: 15, 3: 16, 4: 11, 2: 10, 0: 17, 1: 14, 5: 9}
    var mapCliqueSize = {8: 12, 3: 17, 4: 11, 2: 6, 0: 14, 1: 8, 5: 4}
    var nextId = 0

    for(var i = 0; i < liCliqueGroup.length; i ++){

    	var groupId = liCliqueGroup[i]
    	var originSize = mapGroupClique[groupId].length;
    	var liOriginNode = mapGroupClique[groupId];
      for(var j = 0; j < liOriginNode.length; j ++)
        liNodeinClique.push(liOriginNode[j])

    	var newAdd = mapCliqueSize[groupId] - originSize 
    	var liTempNewNode = []

    	for(var j = 0; j < newAdd; j ++){
    		var newNode = { 
    			"id": 'newnode-' + nextId, 
    			"group": groupId }

    		liTempNewNode.push(newNode)
    		mapGroupClique[groupId].push(newNode['id'])
        liNodeinClique.push(newNode['id'])

    		nextId += 1
    	}

    	var liAllNewLink = []

    	//new links
    	// console.log(' liOriginNode ', liOriginNode, ' new added ', liTempNewNode);

    	for(var j = 0; j < liTempNewNode.length; j ++){

    		var liNewLink = []

    		// console.log(' liOriginNode before ', liOriginNode)

    		for(var p = 0; p < liOriginNode.length; p ++){
    			var newLink = {"source": "Napoleon", "target": "Myriel", "value": 1}
    			newLink.source = liTempNewNode[j]['id']
    			newLink.target = liOriginNode[p]
    			liNewLink.push(newLink)
    		}
    		liAllNewLink = liAllNewLink.concat(liNewLink)
    	}

      //none clique links


    	// console.log(' liNewNode/Link ', liAllNewLink);
    	liOldLink = liOldLink.concat(liAllNewLink)
    	liOldNode = liOldNode.concat(liTempNewNode)
    	// liFakeNode = liFakeNode.concat(liTempNewNode)
    }
  
    console.log(' liNodeinClique ', liNodeinClique);

    function getNodebyGroupId(liNode, groupid){
    	var liTempNode = []    	
	  	for(var i = 0; i < liNode.length; i ++){
	  		var node = liNode[i]
	  		if(node['group'] == groupid){
	  			liTempNode.push(node)
	  		}
	  	}
	  	return liTempNode;
    }

    function getNodebyId(liNode, id){
		for(var i = 0; i < liNode.length; i ++){
	  		var node = liNode[i]
	  		if(node['id'] == id){
	  			return node;
	  			// liTempNode.push(node)
	  		}
	  	}
	  	return {};
    }

	var liNewNode = [];

    for(var i = 0; i <= 9; i ++){
    	var liTempNode = getNodebyGroupId(liOldNode, i)
    	// console.log(' liTempNode ', i, liTempNode);
    	if(liCliqueGroup.indexOf(i) == -1){
      // if(1){
    		liNewNode = liNewNode.concat(liTempNode)
    	}else{
        // liNewNode = liTempNode;
        liNewNode = liNewNode.concat(liTempNode)
    		// var liTempClique = mapGroupClique[i]
      //   for(var j = 0; j < liTempNode.length; j ++){
      //     if(liTempClique.indexOf(liTempNode[j]['id']) == -1)
      //       liNewNode.push(liTempNode[j])
      //   }
    		// for(var j = 0; j < liTempClique.length; j ++){
    		// 	var tempNode = getNodebyId(liOldNode, liTempClique[j])
    		// 	liNewNode.push(tempNode)
    		// }
    	}
    } 	
   
    var svg = d3.select("#coversvg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    console.log(' liNode ', liNewNode.length, liOldNode.length);

    var liNode = liNewNode;
    drawMatrixbyNodes(svg, liNode, liOldLink);

    var liCliqueRect = []

    var lineFunction = d3.line()
    					.x(function(d){return d.x})
    					.y(function(d){return d.y})

    var nodeColor = d3.scaleOrdinal(d3.schemeCategory20);

    for(var key in mapGroupClique){

      var liTempNode = getNodebyGroupId(liOldNode, key)

      var beginNode = liTempNode[0]
      var endNode = liTempNode[liTempNode.length - 1]
      var beginIndex = getNodeIndex(liNode, beginNode['id'])
      var endIndex = getNodeIndex(liNode, endNode['id']);

      var liCliqueNode = mapGroupClique[key]
    	// var beginNode = liTempNode[0]
    	// var endNode = liTempNode[liTempNode.length - 1]
    	// var beginIndex = getNodeIndex(liNode, beginNode)
    	// var endIndex = getNodeIndex(liNode, endNode);

    	// var targetIndex = getNodeIndex(liNode, beginNode)
    	// var targetIndex_end = getNodeIndex(liNode, endNode);

    	svg.selectAll('path')
    	   .filter(function(d){
    	   	if((+(d3.select(this).attr('columnIndex')) >= beginIndex && +(d3.select(this).attr('columnIndex')) <= endIndex) 
    	   		|| ( +(d3.select(this).attr('rowIndex')) >= beginIndex && +(d3.select(this).attr('rowIndex')) <= endIndex)){
    	   		var newclass = d3.select(this).attr('class') + ' path-' + key;
    	   		// console.log(' class ', newclass)
    	   		d3.select(this).attr('class', newclass)
    	   		return true;
    	   	}
    	   		return false
    	   });

    	var mapStrokeWidth = {
    		9: 1,
    		10: 2,
    		11: 3,
    		15: 4,
    		16: 5
    	}
      //clique boundary
    	svg.append('path')
           .attr('class', 'cliqueboundary clique-' + liCliqueRect.length + ' path-' + key)
    	   .attr('fill', 'none')
    	   // .attr('stroke', function(){
        //   return nodeColor(key)
        //   //todo
        //   // return 'none'
    	   // 	// return 'gray'
    	   // 	// return colorFunc_bottom(liTempNode.length)
    	   // })
         .attr('opacity', 0.8)
    	   .attr('stroke-width', function(){
    	   	return 1
    	   	console.log(" liTemp Node ", liTempNode.length)
    	   	// return  mapStrokeWidth[liCliqueNode.length];
    	   })
    	   .attr('lineData', function(){
    	   	var left = leftTop_matrix.left + beginIndex * cellSize_matrix.width + padding
    	   	var top = leftTop_matrix.top + beginIndex * cellSize_matrix.height + padding
    	   	var width = liTempNode.length * cellSize_matrix.width
    	   	var height = liTempNode.length * cellSize_matrix.height
    	   	var liPoint = [
    	   		{
    	   			'x': left, 'y': top
    	   		},
    	   		{
    	   			'x': left + width/4., 'y': top
    	   		},
    	   		{
    	   			'x': left + width/2., 'y': top
    	   		},
    	   		{
    	   			'x': left + width*3./4., 'y': top
    	   		},
    	   		{
    	   			'x': left + width, 'y': top
    	   		},
    	   		{
    	   			'x': left + width, 'y': top + height/4.
    	   		},
    	   		{
    	   			'x': left + width, 'y': top + height/2.
    	   		},
    	   		{
    	   			'x': left + width, 'y': top + height*3./4.
    	   		},
    	   		{
    	   			'x': left + width, 'y': top + height
    	   		},
    	   		{
    	   			'x': left + width * 3./4., 'y': top + height
    	   		},
    	   		{
    	   			'x': left + width / 2., 'y': top + height
    	   		},    	   		
    	   		{
    	   			'x': left + width / 4., 'y': top + height
    	   		},
    	   		{
    	   			'x': left, 'y': top + height
    	   		},  
    	   		{
    	   			'x': left, 'y': top + height * 3./4.
    	   		}, 
    	   		{
    	   			'x': left, 'y': top + height / 2.
    	   		},    	
    	   		{
    	   			'x': left, 'y': top + height * 1./4.
    	   		},    	         	   		
    	   		{
    	   			'x': left, 'y': top
    	   		},
    	   	]
    	   	return JSON.stringify(liPoint)
    	   })
    	   .style('opacity', 0.8)
    	   // .attr('stroke-width', '1px')
    	   .attr('d', function(){
    	   	var liPoint = JSON.parse(d3.select(this).attr('lineData'))
    	   	return lineFunction(liPoint)
    	   })

	     liCliqueRect.push({
	     	'size': liCliqueNode.length,
	     	'groupid': key,
	     	'x': leftTop_matrix.left + beginIndex * cellSize_matrix.width + padding,
	     	'y': leftTop_matrix.top + beginIndex * cellSize_matrix.height + padding,
        'wholewidth': liTempNode.length * cellSize_matrix.width,
        'wholeheight': liTempNode.length * cellSize_matrix.height,
	     	'width': liCliqueNode.length * cellSize_matrix.width,
	     	'height': liCliqueNode.length * cellSize_matrix.height,
	     })
    }

    // var testRect = liCliqueRect[0]

    var liFishEye = []
    console.log(' liCliqueRect ', liCliqueRect.length);
    for(var xx = 0; xx < liCliqueRect.length; xx ++){
    	var testRect = liCliqueRect[xx]
		  var fisheye = d3.fisheye()
    					.radius(testRect['width']);
      if(1){
        fisheye.center([(testRect['x'] + testRect['wholewidth'] * 0.5), (testRect['y'] + testRect['wholeheight'] * 0.5)]);
        // console.log(' center ', [(testRect['x'] + testRect['width'] * 0.5), (testRect['y'] + testRect['height'] * 0.5)])
      }
        // fisheye.center([300, 100]);
      // else
  		liFishEye.push({
  			'fisheye': fisheye,
  			'rect': testRect,
  			'groupid': testRect['groupid'],
  			'size': testRect['size']
  		})
    }

    console.log(" liFishEye ", liFishEye);

	  var lineFunction = d3.line()
    					.x(function(d){return d.x})
    					.y(function(d){return d.y})
    

    var steplist = [0,1,2,3,4,3,2,1]
    var mapGroupSize = {
    	5: 0.05, // 9
    	2: 0.05, // 10
    	4: 0.08, // 11
    	1: 0.08, //14
    	8: 0.12, // 15
    	3: 0.15, //16
    	0: 0.17 //17
    }

    // {8: 15, 3: 16, 4: 11, 2: 10, 0: 17, 1: 14, 5: 9}
    
    var index = 0;
        
    if(matrix_animated){

      var interval = setInterval(function(){

        // killTimer()

        console.log(' fisheye ', liFishEye.length);

      	for(var i = 0; i < liFishEye.length; i ++){
      		var fisheye = liFishEye[i]['fisheye']
      		var testRect = liFishEye[i]['rect']
      		var groupid = liFishEye[i]['groupid']
      		var size = liFishEye[i]['size']
      		fisheye.radius(testRect['width'] * (0.5 + mapGroupSize[groupid] * steplist[index]));

      		var  paths = svg.selectAll(".path-" + groupid);
      		//boundary
  	    	paths.each(function(d){
  	    		// d3.select(this).style('stroke', 'red')	    		
  				var liPoint = JSON.parse(d3.select(this).attr('lineData'));
  				// console.log(' liPoint ', liPoint)
  				var liNewPoint = [];
  				for(var index in liPoint){
  					var point = liPoint[index]
  					var newpoint = fisheye([point['x'], point['y']]);
  					// console.log('point ', point, newpoint)
  					liNewPoint.push({
  						'x': newpoint[0],
  						'y': newpoint[1]
  					})
  				}
  				d3.select(this).attr('d', lineFunction(liNewPoint))
  			})
  	    }
     

  		index += 1
  		if(index >= steplist.length){
  			index = 0
  		}
      }, 200)
    
    }
    
	
	
    function killTimer(){
    	clearInterval(interval)
    }
    //fish eye
    

	
   	// var line = d3.line();

    

  
					



    // path.attr("d", function(d) { 

    // 	// console.log('d ', d);
    // 	// return lineFunction(d.map(fisheye)); 

    // });
    

	// svg.on("mousemove", function() {
	// 	 fisheye.focus(d3.mouse(this));

	// 	 d3.selectAll('.m_cell')
	// 	   .each(function(d){
	// 	   	console.log(' rect ', d3.select(this).node());
	// 	   	var x = d3.select(this).node().getBoundingClientRect()['x']
	// 	   	var y = d3.select(this).node().getBoundingClientRect()['y']
	// 	   	var newxy = fisheye({'x': x, 'y': y})
	// 	   	// console.log(" xy ", x, y);

	// 	   	// var newx = x;//fisheye.fisheye(x)
		   	
	// 	   	// console.log('fish eye focus ',  , newx)
	// 	   	d3.select(this)
	// 	   	.attr('x', newxy.x)
	// 	   	.attr('y', newxy.y)
	// 	   	// .attr()
	// 	   })
	// 	   // .attr('y', d=> d.fisheye.y)
	// 	   // .attr('width', d=> d.fisheye.z * 4.5)
	// 	   // .attr('height', d=> d.fisheye.z * 4.5)
		

	//   // fisheye.center(d3.mouse(this));
	//   // path.attr("d", function(d) { return line(d.map(fisheye)); });
	// });


    //choose the top clique
    // for(var i = 0; i < liTopClique.length; i ++){

    // }

    // for(var i = 0; i < liClique.length; i ++){
    //     var clique = liClique[i];
    //     var size = clique.length;
    //     for(var j = 0; j < clique.length; j ++){
            
    //         var index_temp = getNodeIndex(liOldNode, clique[j])
    //         var groupId = liOldNode[index_temp]['group']

    //         if(mapGroupIdNodes[groupId] == undefined){
    //         	mapGroupIdNodes[groupId] = [clique[j]]
    //         }else{
    //         	mapGroupIdNodes[groupId].push(clique[j])
    //         }

    //         var tempClique = mapNodeClique[clique[j]];

    //         if(tempClique == undefined || (tempClique != undefined && tempClique.length < size)){
    //             mapNodeClique[clique[j]] = {
    //                 'clique': clique,
    //                 'size': clique.length
    //             }
    //             if(liSize.indexOf(clique.length) < 0)
    //                 liSize.push(clique.length);
    //         }
    //     }
    // }

    // console.log(' map group id ', mapGroupIdNodes);
}