var g_liClique = []
var g_liCliqueSize = []
var g_animationType = 'bumping'//"edging" //'bumping' //
var g_color;

function fakeGraph_temp(g_matrixgraph){

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

    var mapGroupClique = {
        8: maxClique,
        3: maxClique2,
        4: maxClique3,
        2: maxClique4,
        0: maxClique5,
        1: maxClique6,
        5: maxClique7
    }

    var liCliqueGroup = Object.keys(mapGroupClique)//[2,3,4,8,0,1,5]
   
    var liOldNode = g_matrixgraph.nodes;
    var liOldLink = g_matrixgraph.links;

    var liOldNode2 = g_matrixgraph.nodes;
    // var liOldLink = g_matrixgraph.links;

     //fake the nodes       
    var liFakeNode = [], liFakeLink = []
    // var mapCliqueSize = {8: 15, 3: 16, 4: 11, 2: 10, 0: 17, 1: 14, 5: 9}
    var mapCliqueSize = {8: 15, 1: 14, 3: 13, 4: 11, 2: 10, 0: 6, 5: 3, }
    var nextId = 0

    function getNodebyId2(liNode, id){
        for(var i = 0; i < liNode.length; i ++){
            var node = liNode[i]
            if(node['id'] == id){
                return node;
                // liTempNode.push(node)
            }
        }
        return {};
    }

    for(var i = 0; i < liCliqueGroup.length; i ++){

        var groupId = liCliqueGroup[i]
        var originSize = mapGroupClique[groupId].length;
        var liOriginNode = mapGroupClique[groupId];

        var newAdd = mapCliqueSize[groupId] - originSize 
        console.log(' originSize ',originSize, newAdd);

        var liTempNewNode = []

        for(var j = 0; j < newAdd; j ++){
            var newNode = { 
                "id": 'newnode-' + nextId, 
                "group": groupId }

            liTempNewNode.push(newNode)

            mapGroupClique[groupId].push(newNode['id'])

            nextId += 1
        }

        var liAllNewLink = []

        var sttr = ""
        for(var p = 0; p < liOriginNode.length; p ++){
            sttr += '"' + liOriginNode[p] + '",'
        }
        // for(var p = 0; p < liTempNewNode.length; p ++){
        //     sttr += '"' + liTempNewNode[p]['id'] + '",'
        // }
        console.log(' originSize STTR ', sttr, liOriginNode.length, liTempNewNode.length, sttr);

        for(var j = 0; j < liTempNewNode.length; j ++){

            var liNewLink = []

            for(var p = 0; p < liOriginNode.length; p ++){
                var newLink = {"source": "Napoleon", "target": "Myriel", "value": 1}
                newLink.source = liTempNewNode[j]['id']
                newLink.target = liOriginNode[p]
                console.log(' new link ', newLink.source, newLink.target);
                liNewLink.push(newLink)
            }

            //random selected
            var randomEdgeNum = Math.ceil(Math.random() * 10)
            while(randomEdgeNum){
                var newLink = {"source": "Napoleon", "target": "Myriel", "value": 1}
                newLink.source = liTempNewNode[j]['id']
                var randomPick = Math.floor(Math.random() * liOldNode2.length)
                var randomNodeId = liOldNode2[randomPick]['id']
                // newLink.source = liTempNewNode[j]['id']
                newLink.target = randomNodeId
                // console.log(' new link ', newLink.source, newLink.target);
                liNewLink.push(newLink)
                randomEdgeNum --;
            }
            liAllNewLink = liAllNewLink.concat(liNewLink)
        }

        console.log(' liNewNode/Link ', liAllNewLink);
        liOldLink = liOldLink.concat(liAllNewLink)
        liOldNode = liOldNode.concat(liTempNewNode)
        // liFakeNode = liFakeNode.concat(liTempNewNode)
    }
    return {
        'nodes': liOldNode,
        'links': liOldLink,
    }
}

function drawGraph(){

	var svg = d3.select("#coversvg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

	var color = d3.scaleOrdinal(d3.schemeCategory20);

	var simulation = d3.forceSimulation()
	    .force("link", d3.forceLink().id(function(d) { return d.id; }))
	    .force("charge", d3.forceManyBody())
	    .force("center", d3.forceCenter(width / 2, height / 2));

	var graph = getGraph();

    var newgraph = fakeGraph_temp(graph);

    var liAllGraphNode = newgraph.nodes, liAllGraphLink = newgraph.links;
    
    // console.log(' graph ', graph.links, graph.nodes);

    //send to end server
    if(g_animationType == 'bumping'){        
        var formData = new FormData();
        formData.append('graph', JSON.stringify(graph));
        var url = 'http://localhost:20082/findClique';
        lSendUrl('POST', url, formData, successFindCliques);
    }else if(g_animationType == 'edging'){        
        var formData = new FormData();
        formData.append('graph', JSON.stringify(graph));
        var url = 'http://localhost:20082/findEdge';
        lSendUrl('POST', url, formData, successFindEdge);
    }
	
	var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(liAllGraphLink)
    // .data(graph.links)
    .enter().append("line")
    .attr('id', function(d){
        // console.log('link d ', d);
        return 'link-' + d.source + '-' + d.target;
    })
    .attr('class', function(d){
     return 'source-' + d.source + ' target-' + d.target;
    })
    .attr('source', function(d){
        return d.source
    })
    .attr('target', function(d){
        return d.target
    })
    .style('stroke', '#999')
    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(liAllGraphNode)
    // .data(graph.nodes)
    .enter().append("circle")
    // .style('stroke', 'black')
    .attr('id', function(d){
        return 'circle-' + d.id;
    })
    .attr("r", 5)
    .style('stroke', '#fff')
    .attr("fill", function(d) { return color(d.group); })
    .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      // .nodes(graph.nodes)
      .nodes(liAllGraphNode)
      .on("tick", ticked);

  simulation.force("link")
            .links(liAllGraphLink)
      // .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("ocx", function(d) { return d.x; })
        .attr("ocy", function(d) { return d.y; });
  }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

function graphAnimate(){
    switch(g_animationType){
        case 'bumping':
            graphAnimate_bumping();
            break;
        case 'edging':
            graphAnimate_edge();
            break;
    }
}

function graphAnimate_edge(){
    //ant marching
    var result = autoGraphEdgeMA();
    var antModal = result['antmodal']
    var allGroupMap = result['groups']
    console.log(' all group map ', allGroupMap);

    var liGroupId = Object.keys(allGroupMap);
    for(var i = 0; i < liGroupId.length; i ++){
         var groupId = liGroupId[i];
         var tempGroup = allGroupMap[groupId];
         functionHub.addMAbyGroupwithExampleAnt(tempGroup, antModal);
    }

    functionHub.setFunc({type: 'animate'})
}


var g_MaxWeight = 0, g_MinWeight = 10

function autoGraphEdgeMA(){

    var antDots = [[1, 3], [3, 3], [3, 10], [1, 10]];
    
    var antModal = createPath(antDots, true);  
    antModal.visible = false  

    var mapMaInfo = {};
    var mapMaList = {};
    var liWeight = [];
    d3.selectAll('.shortpath')
      .each(function(d){
        var weight = +d3.select(this).attr('weight')
        liWeight.push(weight)
        if(g_MaxWeight < weight)
            g_MaxWeight = weight
        if(g_MinWeight > weight)
            g_MinWeight = weight
      })
    
    console.log(' Max-Min Weight ', g_MaxWeight, g_MinWeight, new Set(liWeight));

    var weightInveralMap = {
       '2': 50,
       '3': 5,
       '4': 2
    }

    d3.selectAll('.shortpath')
      .each(function(d){

       var groupid = d3.select(this).attr('id')
       var ma = {}

       var x1 = +d3.select(this).attr('x1')
       var x2 = +d3.select(this).attr('x2')
       var y1 = +d3.select(this).attr('y1')
       var y2 = +d3.select(this).attr('y2')
       var direct = +d3.select(this).attr('direct')
       var weight = +d3.select(this).attr('weight')       

       // console.log(' weight ', direct, weight)
       var vector = [];
       if(direct == 1){ 
            vector = [[x1, y1], [x2, y2]]
       }else{
            vector = [[x2, y2], [x1, y1]]
       }
       //normal vector
       vectorLength = Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
       normalvector = [(vector[1][0] - vector[0][0])/vectorLength, (vector[1][1] - vector[0][1])/vectorLength]
       console.log(' normalvector ', normalvector);
       var dis = 5
       ma['path'] = {
            dots: [[vector[0][0] + (normalvector[0] * dis), vector[0][1] + (normalvector[1] * dis)],
                   [vector[1][0] - (normalvector[0] * dis), vector[1][1] - (normalvector[1] * dis)]]
       }
       var mainfo_this = {
            "ae" : "MA",
            // "antcolor" : "black",
            'antcolor': g_color(weight),
            "antshape" : "self-defined",
            "antgap" : 15,
            "antinterval" : weightInveralMap[weight],//(g_MaxWeight - weight + 1) * 2,
            'groupid': groupid
        }

       mapMaInfo[groupid] = mainfo_this;
       mapMaList[groupid] = [ma];
    })

    var maGroupMap = {};
    var liGroupId = Object.keys(mapMaInfo);
    // console.log('liGroupId ', liGroupId, );
    for(var i = 0; i < liGroupId.length; i ++){
        var groupid = liGroupId[i];
        maGroupMap[groupid]  = {
          'mainfo': mapMaInfo[groupid],
          'malist': mapMaList[groupid],
        }
    }
    console.log(' map Group Map ', maGroupMap);
    return {'antmodal': antModal, 'groups': maGroupMap}
}

function graphAnimate_bumping(){

    console.log(' graph animated ! ', g_liClique);
    //highlight    
    var mapCliqueIndexPoses = {};

    var stepNum = 7;

    for(var p = 0; p < g_liClique.length; p ++){
        var maxClique = g_liClique[p];
        var liDots = [];
        for(var i = 0; i < maxClique.length; i ++){
            var node = maxClique[i]
          
            d3.selectAll('.source-' + node)
            // .style('stroke', 'red')
            .attr('class', 'cliquelink')

            d3.selectAll('.target-' + node)
            // .style('stroke', 'red')
            .attr('class', 'cliquelink')

            var circle = d3.select('#circle-' + node)

            circle.attr('class', 'cliquenode clique-' + p)
            .style('stroke', 'black')
            .style('stroke-width', function(){
                return 2
                // return 2 + maxClique.length/5
                // return Math.sqrt(maxClique.length)
                // return 2
                // if(p >= 2)
                //     return 2
                // else
                //     return 5 - p;
            });
            console.log(' node ', node)
            // console.log(' circle ', circle.node(), +(circle.attr('ocx')) );
            liDots.push([+(circle.attr('cx')), +(circle.attr('cy'))]);
        }
       var cenPos = computeCentriod(liDots);
        // d3.select('#drawsvg')
        //     .append('circle')
        //     .attr('class', 'define_helper')     
        //     .attr('r', '5px')            
        //     .style('fill', 'blue')  
        //     .attr('cx', cenPos[0])
        //     .attr('cy', cenPos[1]) 
        //     .style('visible', 'hidden')

       var circles = d3.selectAll('.clique-' + p)

       var liDisplayXY = getDisplayXYbySize(stepNum, g_liCliqueSize.indexOf(maxClique.length), maxClique.length); 
       console.log(' liDisplayXY ', p, liDisplayXY)

       for(var q = 0; q < liDisplayXY.length; q ++){
        var displayXY = liDisplayXY[q]
        var liNewXY = resizeVertexDots(cenPos, displayXY, circles);
        if(mapCliqueIndexPoses[p] == undefined){
            mapCliqueIndexPoses[p] = [liNewXY]
        }else{
            mapCliqueIndexPoses[p].push(liNewXY);
        }
       }
    }

    console.log(' map clique index ', mapCliqueIndexPoses);
        
    //move them
    var index = 0
    var liCliqueIndex = Object.keys(mapCliqueIndexPoses);

    var times = 10;
        
        
    var tempInterval = setInterval(function(){

            for(var i = 0; i < liCliqueIndex.length; i ++){
                var liPos = mapCliqueIndexPoses[liCliqueIndex[i]][index]
                var tempIndex = 0

                // console.log(" here ? ");

                d3.selectAll('.clique-' + liCliqueIndex[i])
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
            }       
            
             d3.selectAll('.cliquelink')
              .each(function(){  
                {

                    var source = d3.select(this).attr('source')
                    var target = d3.select(this).attr('target')

                    // console.log(' source ', source, target);

                    var c_source = d3.select('#circle-' + source);
                    var c_target = d3.select('#circle-' + target);

                    if(c_source.empty()){
                        console.log(" ERROR ", '#circle-' + source)
                    }
                    if(c_target.empty()){                        
                        console.log(" ERROR ", '#circle-' + target)
                    }
                
                    var nx1 = +(c_source.attr('cx')), nx2 = +(c_target.attr('cx')), 
                    ny1 = +(c_source.attr('cy')), ny2 = +(c_target.attr('cy'));
                    
                    d3.select(this)                  
                    .attr("x1", function(d) { return nx1 })
                    .attr("y1", function(d) { return ny1 })
                    .attr("x2", function(d) { return nx2 })
                    .attr("y2", function(d) { return ny2 });
                }
                // catch(err){
                //     var source = d3.select(this).attr('source')
                //     var target = d3.select(this).attr('target')

                //     console.log(' source ', source, target);
                // }
              }) 
            
            index += 1
            if(index >= stepNum * 2){
                index = 0
                // times += 1
                // if(times > 15)
                //     foo();
            }
    }, 50)
    

    var foo = function(){
        console.log(' kill interval ');
        clearInterval(tempInterval);
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getDisplayXYbySize(stepNum, sizeIndex, groupSize){
    // var lisize = [0.02, 0.04, 0.06, 0.08, 0.1]
    console.log(" groupSize ", sizeIndex, groupSize)
    var mapGroupSizeExpandUnit = {
        '0': 0.35,
        '1': 0.22,
        '2': 0.1,
        '3': 0.04,
        '4': 0.01,
        '5': 0.01,
        '6': 0.005,
    }
    //mapGroupSizeExpandUnit[sizeIndex] //
    var expandUnit = mapGroupSizeExpandUnit[sizeIndex]//0.01 * Math.pow(2.5, (g_liCliqueSize.length - sizeIndex));
    var liDisplayXY = [];
    var liPosDisplayXY = [];
    var currentExpand = 1.;
    for(var i = 0; i < stepNum; i ++){
        liDisplayXY.push([currentExpand, currentExpand])
        liPosDisplayXY.push([currentExpand, currentExpand])
        var nextExpand = expandUnit * Math.pow(2., -i);
        currentExpand += nextExpand;
    }
    for(var i = stepNum - 1; i >= 0; i --){
        liDisplayXY.push(liPosDisplayXY[i]);
    }
    return liDisplayXY;
}

function successFindCliques(response){

    var liClique = response['result'];
    console.log(" success find cliques ", liClique);

    //find the largest one
    // var liMaxClique = []
    var liSize = []
    var mapNodeClique = {};
    for(var i = 0; i < liClique.length; i ++){
        var clique = liClique[i];
        var size = clique.length;
        for(var j = 0; j < clique.length; j ++){
            var tempClique = mapNodeClique[clique[j]];
            if(tempClique == undefined || (tempClique != undefined && tempClique.length < size)){
                mapNodeClique[clique[j]] = {
                    'clique': clique,
                    'size': clique.length
                }
                if(liSize.indexOf(clique.length) < 0)
                    liSize.push(clique.length);
            }
        }
    }

    var topNum = 3   
    liSize.sort(function(a, b){return b - a;})

    var liTopSize = liSize.splice(0, topNum);
    // console.log(' lisize ', liSize, ' top size ', liTopSize);

    var liTopClique = []
    var liTopClique_str = [];
    var liNode = Object.keys(mapNodeClique);
    for(var i = 0; i < liNode.length; i ++){
        var clique = mapNodeClique[liNode[i]]['clique'];
        // console.log(' clique length ', clique.length)
        if(liTopSize.indexOf(clique.length) >= 0){
            var clique_str = clique.join(',');
            if(liTopClique_str.indexOf(clique_str) >= 0)
                continue;
            else{
                liTopClique_str.push(clique_str)
                liTopClique.push(clique)
            }
        }
    }
    console.log(' top cliques ', liTopClique);

    var maxClique = ["Fauchelevent","MotherInnocent","newnode-0","newnode-1","newnode-2","newnode-3",]//["Fauchelevent","MotherInnocent","newnode-0","newnode-1","newnode-2","newnode-3","newnode-0","newnode-1","newnode-2","newnode-3",]//["Valjean","Chenildieu","Champmathieu","Judge","Cochepaille","Brevet","Bamatabois","newnode-0","newnode-1","newnode-2","newnode-0","newnode-1","newnode-2"]//["Courfeyrac", "Joly", "Enjolras", "Bahorel", "Gavroche", "Bossuet", "Combeferre", "Feuilly", "Grantaire", "Prouvaire"]
    
    var maxClique2 = ["Myriel","Napoleon","newnode-4","newnode-5","newnode-6","newnode-7","newnode-8","newnode-9","newnode-10","newnode-11","newnode-12","newnode-13","newnode-14","newnode-15"]//["Myriel","Napoleon","newnode-4","newnode-5","newnode-6","newnode-7","newnode-8","newnode-9","newnode-10","newnode-11","newnode-12","newnode-13","newnode-14","newnode-15","newnode-4","newnode-5","newnode-6","newnode-7","newnode-8","newnode-9","newnode-10","newnode-11","newnode-12","newnode-13","newnode-14","newnode-15",]//["Dahlia","Blacheville","Favourite","Tholomyes","Fantine","Zephine","Fameuil","Listolier","newnode-3","newnode-4","newnode-5","newnode-6","newnode-7","newnode-8","newnode-9","newnode-10","newnode-3","newnode-4","newnode-5","newnode-6","newnode-7","newnode-8","newnode-9","newnode-10"]//["Dahlia", "Blacheville", "Favourite", "Tholomyes", "Fantine", "Zephine", "Fameuil", "Listolier"]
   
    var maxClique3 = ["Valjean","Chenildieu","Champmathieu","Judge","Cochepaille","Brevet","Bamatabois","newnode-16","newnode-17","newnode-18"]//["Valjean","Chenildieu","Champmathieu","Judge","Cochepaille","Brevet","Bamatabois","newnode-16","newnode-17","newnode-18","newnode-16","newnode-17","newnode-18",] //["Brujon","Montparnasse","Gueulemer","Thenardier","Babet","Eponine","Claquesous","newnode-11","newnode-12","newnode-13","newnode-14","newnode-11","newnode-12","newnode-13","newnode-14"]//["Brujon", "Montparnasse", "Gueulemer", "Thenardier", "Babet", "Eponine", "Claquesous"]
    
    var maxClique4 = ["Dahlia","Blacheville","Favourite","Tholomyes","Fantine","Zephine","Fameuil","Listolier","newnode-19","newnode-20","newnode-21","newnode-22","newnode-23"]//["Dahlia","Blacheville","Favourite","Tholomyes","Fantine","Zephine","Fameuil","Listolier","newnode-19","newnode-20","newnode-21","newnode-22","newnode-23","newnode-19","newnode-20","newnode-21","newnode-22","newnode-23",]//["Courfeyrac","Joly","Enjolras","Bahorel","Gavroche","Bossuet","Combeferre","Feuilly","Grantaire","Prouvaire","newnode-15","newnode-16","newnode-17","newnode-18","newnode-19","newnode-15","newnode-16","newnode-17","newnode-18","newnode-19"]//["Valjean", "Chenildieu", "Champmathieu", "Judge", "Cochepaille", "Brevet", "Bamatabois"]
    
    var maxClique5 = ["Brujon","Montparnasse","Gueulemer","Thenardier","Babet","Eponine","Claquesous","newnode-24","newnode-25","newnode-26","newnode-27"]//["Brujon","Montparnasse","Gueulemer","Thenardier","Babet","Eponine","Claquesous","newnode-24","newnode-25","newnode-26","newnode-27","newnode-24","newnode-25","newnode-26","newnode-27",]//["Brujon","Montparnasse","Gueulemer","Thenardier","Babet","Eponine","Claquesous","newnode-24","newnode-25","newnode-26","newnode-27","newnode-24","newnode-25","newnode-26","newnode-27",]//["Fauchelevent","MotherInnocent","newnode-20","newnode-21","newnode-22","newnode-23","newnode-24","newnode-25","newnode-26","newnode-27","newnode-28","newnode-29","newnode-30","newnode-31","newnode-32","newnode-33","newnode-34","newnode-20","newnode-21","newnode-22","newnode-23","newnode-24","newnode-25","newnode-26","newnode-27","newnode-28","newnode-29","newnode-30","newnode-31","newnode-32","newnode-33","newnode-34",]
   
    var maxClique6 = ["MlleGillenormand","newnode-28","newnode-29"]//["MlleGillenormand","newnode-28","newnode-29","newnode-28","newnode-29",]//["MlleGillenormand","newnode-28","newnode-29","newnode-28","newnode-29",]//["Myriel","Napoleon","newnode-35","newnode-36","newnode-37","newnode-38","newnode-39","newnode-40","newnode-41","newnode-42","newnode-43","newnode-44","newnode-45","newnode-46","newnode-35","newnode-36","newnode-37","newnode-38","newnode-39","newnode-40","newnode-41","newnode-42","newnode-43","newnode-44","newnode-45","newnode-46"]
    
    var maxClique7 = ["Courfeyrac","Joly","Enjolras","Bahorel","Gavroche","Bossuet","Combeferre","Feuilly","Grantaire","Prouvaire","newnode-30","newnode-31","newnode-32","newnode-33","newnode-34"]//["Courfeyrac","Joly","Enjolras","Bahorel","Gavroche","Bossuet","Combeferre","Feuilly","Grantaire","Prouvaire","newnode-30","newnode-31","newnode-32","newnode-33","newnode-34","newnode-30","newnode-31","newnode-32","newnode-33","newnode-34",]//["MlleGillenormand","newnode-47","newnode-48","newnode-49","newnode-50","newnode-51","newnode-52","newnode-53","newnode-54","newnode-47","newnode-48","newnode-49","newnode-50","newnode-51","newnode-52","newnode-53","newnode-54",]
   
    g_liClique.push(maxClique)
    g_liClique.push(maxClique2)
    g_liClique.push(maxClique3)
    g_liClique.push(maxClique4) 
    g_liClique.push(maxClique5) 
    g_liClique.push(maxClique6) 
    g_liClique.push(maxClique7) 
    
    g_liCliqueSize = []
    for(var i = 0; i < g_liClique.length; i ++){
        g_liCliqueSize.push(g_liClique[i].length)
    }
    g_liCliqueSize.sort(function(a,b){return b - a})
    // g_liCliqueSize = liTopSize;   
}

function successFindEdge(response){

    var result = response['result'];
    var source = response['centralnode']

    // d3.select('#circle-' + source)
    // .style('fill', 'black');
    
    var liConnectedNode = Object.keys(result);
    var edgeNum = 0

    var mapEdgeInfo = {}
    var maxWeight = 0;

    for(var i = 0; i < liConnectedNode.length; i ++){
        var target = liConnectedNode[i]
        var liEdge = result[target];
        // console.log(' edge ', liEdge)
        for(var j = 0; j < liEdge.length - 1; j ++){
            // console.log(' edge ', liEdge[j], liEdge[j + 1])
            edgeNum += 1
            var id1 = 'link-' + liEdge[j] + '-' + liEdge[j + 1]
            var edge1 = d3.select('#'+id1);
            if(edge1.empty() == false){
                edge1
                .attr('class', 'shortpath')
                // .style('stroke', 'red');
                if(mapEdgeInfo[id1] == undefined){                    
                    mapEdgeInfo[id1] = {
                        'direct': 1,
                        'weight': liEdge.length
                    }
                }else{
                    if(mapEdgeInfo[id1]['weight'] < liEdge.length)
                        mapEdgeInfo[id1]['weight'] = liEdge.length
                    // if(maxWeight < mapEdgeInfo[id1]['weight'])
                    //     maxWeight = mapEdgeInfo[id1]['weight']
                }
            }else{
                id2 = 'link-' + liEdge[j + 1] + '-' + liEdge[j]
                var edge2 = d3.select('#'+id2);
                edge2
                .attr('class', 'shortpath')
                // .style('stroke', 'red');
                if(mapEdgeInfo[id2] == undefined){                    
                    mapEdgeInfo[id2] = {
                        'direct': -1,
                        'weight': liEdge.length
                    }
                }else{
                    if(mapEdgeInfo[id2]['weight'] < liEdge.length)
                        mapEdgeInfo[id2]['weight'] = liEdge.length
                    // if(maxWeight < mapEdgeInfo[id2]['weight'])
                    //     maxWeight = mapEdgeInfo[id2]['weight']
                }
            }             
        }
    }

    var liWeight = [];
    for(var key in mapEdgeInfo){
        var edgeinfo = mapEdgeInfo[key];
        if(liWeight.indexOf(edgeinfo['weight']) == -1)
            liWeight.push(edgeinfo['weight'])
    }

    liWeight.sort(function(a,b){return a - b})

    console.log(' map edge info ', new Set(liWeight), liWeight[0], liWeight[liWeight.length - 1]);
    g_color = d3.scaleLinear()
                .domain([liWeight[0], liWeight[liWeight.length - 1]])
                .range(["#fee0d2", "#67000d"]);

    d3.selectAll('.shortpath')
        .each(function(d){
            var id = d3.select(this).attr('id')
            var weight = mapEdgeInfo[id]['weight'];
            var reverse = mapEdgeInfo[id]['direct']
            // console.log(' weight ', id, g_color(weight));
            d3.select(this)
            .attr('direct', reverse)
            .attr('weight', weight)
            // .style('stroke', g_color(weight));
        })
}

function resizeVertexDots(cenPos, displayXY, circles){
    // var cenPos = [+d3.select('#centermove_circle').attr('cx'), +d3.select('#centermove_circle').attr('cy')];
    
    // d3.selectAll('.define_circle')
    var liNewPos = [];
    circles
      .each(function(){
        var px = +d3.select(this).attr('ocx'), py = +d3.select(this).attr('ocy');
        liNewPos.push([cenPos[0] + (px - cenPos[0]) * displayXY[0], cenPos[1] + (py - cenPos[1]) * displayXY[1]])
        // d3.select(this)
        //   .attr('cx',  cenPos[0] + (px - cenPos[0]) * displayXY[0])
        //   .attr("cy",  cenPos[1] + (py - cenPos[1]) * displayXY[1])
      });
    return liNewPos;
}

function computeCentriod(liDot){
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


function getGraph(){
    return {
      "nodes": [
        {"id": "Myriel", "group": 1},
        {"id": "Napoleon", "group": 1},
        {"id": "MlleBaptistine", "group": 1},
        {"id": "MmeMagloire", "group": 1},
        {"id": "CountessdeLo", "group": 1},
        {"id": "Geborand", "group": 1},
        {"id": "Champtercier", "group": 1},
        {"id": "Cravatte", "group": 1},
        {"id": "Count", "group": 1},
        {"id": "OldMan", "group": 1},
        {"id": "Labarre", "group": 2},
        {"id": "Valjean", "group": 2},
        {"id": "Marguerite", "group": 3},
        {"id": "MmedeR", "group": 2},
        {"id": "Isabeau", "group": 2},
        {"id": "Gervais", "group": 2},
        {"id": "Tholomyes", "group": 3},
        {"id": "Listolier", "group": 3},
        {"id": "Fameuil", "group": 3},
        {"id": "Blacheville", "group": 3},
        {"id": "Favourite", "group": 3},
        {"id": "Dahlia", "group": 3},
        {"id": "Zephine", "group": 3},
        {"id": "Fantine", "group": 3},
        {"id": "MmeThenardier", "group": 4},
        {"id": "Thenardier", "group": 4},
        {"id": "Cosette", "group": 5},
        {"id": "Javert", "group": 4},
        {"id": "Fauchelevent", "group": 0},
        {"id": "Bamatabois", "group": 2},
        {"id": "Perpetue", "group": 3},
        {"id": "Simplice", "group": 2},
        {"id": "Scaufflaire", "group": 2},
        {"id": "Woman1", "group": 2},
        {"id": "Judge", "group": 2},
        {"id": "Champmathieu", "group": 2},
        {"id": "Brevet", "group": 2},
        {"id": "Chenildieu", "group": 2},
        {"id": "Cochepaille", "group": 2},
        {"id": "Pontmercy", "group": 4},
        {"id": "Boulatruelle", "group": 6},
        {"id": "Eponine", "group": 4},
        {"id": "Anzelma", "group": 4},
        {"id": "Woman2", "group": 5},
        {"id": "MotherInnocent", "group": 0},
        {"id": "Gribier", "group": 0},
        {"id": "Jondrette", "group": 7},
        {"id": "MmeBurgon", "group": 7},
        {"id": "Gavroche", "group": 8},
        {"id": "Gillenormand", "group": 5},
        {"id": "Magnon", "group": 5},
        {"id": "MlleGillenormand", "group": 5},
        {"id": "MmePontmercy", "group": 5},
        {"id": "Mlle_Vaubois", "group": 5},
        {"id": "LtGillenormand", "group": 5},
        {"id": "Marius", "group": 8},
        {"id": "BaronessT", "group": 5},
        {"id": "Mabeuf", "group": 8},
        {"id": "Enjolras", "group": 8},
        {"id": "Combeferre", "group": 8},
        {"id": "Prouvaire", "group": 8},
        {"id": "Feuilly", "group": 8},
        {"id": "Courfeyrac", "group": 8},
        {"id": "Bahorel", "group": 8},
        {"id": "Bossuet", "group": 8},
        {"id": "Joly", "group": 8},
        {"id": "Grantaire", "group": 8},
        {"id": "MotherPlutarch", "group": 9},
        {"id": "Gueulemer", "group": 4},
        {"id": "Babet", "group": 4},
        {"id": "Claquesous", "group": 4},
        {"id": "Montparnasse", "group": 4},
        {"id": "Toussaint", "group": 5},
        {"id": "Child1", "group": 10},
        {"id": "Child2", "group": 10},
        {"id": "Brujon", "group": 4},
        {"id": "MmeHucheloup", "group": 8}
      ],
      "links": [
        {"source": "Napoleon", "target": "Myriel", "value": 8},
        {"source": "MlleBaptistine", "target": "Myriel", "value": 8},
        {"source": "MmeMagloire", "target": "Myriel", "value": 10},
        {"source": "MmeMagloire", "target": "MlleBaptistine", "value": 6},
        {"source": "CountessdeLo", "target": "Myriel", "value": 1},
        {"source": "Geborand", "target": "Myriel", "value": 1},
        {"source": "Champtercier", "target": "Myriel", "value": 1},
        {"source": "Cravatte", "target": "Myriel", "value": 1},
        {"source": "Count", "target": "Myriel", "value": 2},
        {"source": "OldMan", "target": "Myriel", "value": 1},
        {"source": "Valjean", "target": "Labarre", "value": 1},
        {"source": "Valjean", "target": "MmeMagloire", "value": 3},
        {"source": "Valjean", "target": "MlleBaptistine", "value": 3},
        {"source": "Valjean", "target": "Myriel", "value": 5},
        {"source": "Marguerite", "target": "Valjean", "value": 1},
        {"source": "MmedeR", "target": "Valjean", "value": 1},
        {"source": "Isabeau", "target": "Valjean", "value": 1},
        {"source": "Gervais", "target": "Valjean", "value": 1},
        {"source": "Listolier", "target": "Tholomyes", "value": 4},
        {"source": "Fameuil", "target": "Tholomyes", "value": 4},
        {"source": "Fameuil", "target": "Listolier", "value": 4},
        {"source": "Blacheville", "target": "Tholomyes", "value": 4},
        {"source": "Blacheville", "target": "Listolier", "value": 4},
        {"source": "Blacheville", "target": "Fameuil", "value": 4},
        {"source": "Favourite", "target": "Tholomyes", "value": 3},
        {"source": "Favourite", "target": "Listolier", "value": 3},
        {"source": "Favourite", "target": "Fameuil", "value": 3},
        {"source": "Favourite", "target": "Blacheville", "value": 4},
        {"source": "Dahlia", "target": "Tholomyes", "value": 3},
        {"source": "Dahlia", "target": "Listolier", "value": 3},
        {"source": "Dahlia", "target": "Fameuil", "value": 3},
        {"source": "Dahlia", "target": "Blacheville", "value": 3},
        {"source": "Dahlia", "target": "Favourite", "value": 5},
        {"source": "Zephine", "target": "Tholomyes", "value": 3},
        {"source": "Zephine", "target": "Listolier", "value": 3},
        {"source": "Zephine", "target": "Fameuil", "value": 3},
        {"source": "Zephine", "target": "Blacheville", "value": 3},
        {"source": "Zephine", "target": "Favourite", "value": 4},
        {"source": "Zephine", "target": "Dahlia", "value": 4},
        {"source": "Fantine", "target": "Tholomyes", "value": 3},
        {"source": "Fantine", "target": "Listolier", "value": 3},
        {"source": "Fantine", "target": "Fameuil", "value": 3},
        {"source": "Fantine", "target": "Blacheville", "value": 3},
        {"source": "Fantine", "target": "Favourite", "value": 4},
        {"source": "Fantine", "target": "Dahlia", "value": 4},
        {"source": "Fantine", "target": "Zephine", "value": 4},
        {"source": "Fantine", "target": "Marguerite", "value": 2},
        {"source": "Fantine", "target": "Valjean", "value": 9},
        {"source": "MmeThenardier", "target": "Fantine", "value": 2},
        {"source": "MmeThenardier", "target": "Valjean", "value": 7},
        {"source": "Thenardier", "target": "MmeThenardier", "value": 13},
        {"source": "Thenardier", "target": "Fantine", "value": 1},
        {"source": "Thenardier", "target": "Valjean", "value": 12},
        {"source": "Cosette", "target": "MmeThenardier", "value": 4},
        {"source": "Cosette", "target": "Valjean", "value": 31},
        {"source": "Cosette", "target": "Tholomyes", "value": 1},
        {"source": "Cosette", "target": "Thenardier", "value": 1},
        {"source": "Javert", "target": "Valjean", "value": 17},
        {"source": "Javert", "target": "Fantine", "value": 5},
        {"source": "Javert", "target": "Thenardier", "value": 5},
        {"source": "Javert", "target": "MmeThenardier", "value": 1},
        {"source": "Javert", "target": "Cosette", "value": 1},
        {"source": "Fauchelevent", "target": "Valjean", "value": 8},
        {"source": "Fauchelevent", "target": "Javert", "value": 1},
        {"source": "Bamatabois", "target": "Fantine", "value": 1},
        {"source": "Bamatabois", "target": "Javert", "value": 1},
        {"source": "Bamatabois", "target": "Valjean", "value": 2},
        {"source": "Perpetue", "target": "Fantine", "value": 1},
        {"source": "Simplice", "target": "Perpetue", "value": 2},
        {"source": "Simplice", "target": "Valjean", "value": 3},
        {"source": "Simplice", "target": "Fantine", "value": 2},
        {"source": "Simplice", "target": "Javert", "value": 1},
        {"source": "Scaufflaire", "target": "Valjean", "value": 1},
        {"source": "Woman1", "target": "Valjean", "value": 2},
        {"source": "Woman1", "target": "Javert", "value": 1},
        {"source": "Judge", "target": "Valjean", "value": 3},
        {"source": "Judge", "target": "Bamatabois", "value": 2},
        {"source": "Champmathieu", "target": "Valjean", "value": 3},
        {"source": "Champmathieu", "target": "Judge", "value": 3},
        {"source": "Champmathieu", "target": "Bamatabois", "value": 2},
        {"source": "Brevet", "target": "Judge", "value": 2},
        {"source": "Brevet", "target": "Champmathieu", "value": 2},
        {"source": "Brevet", "target": "Valjean", "value": 2},
        {"source": "Brevet", "target": "Bamatabois", "value": 1},
        {"source": "Chenildieu", "target": "Judge", "value": 2},
        {"source": "Chenildieu", "target": "Champmathieu", "value": 2},
        {"source": "Chenildieu", "target": "Brevet", "value": 2},
        {"source": "Chenildieu", "target": "Valjean", "value": 2},
        {"source": "Chenildieu", "target": "Bamatabois", "value": 1},
        {"source": "Cochepaille", "target": "Judge", "value": 2},
        {"source": "Cochepaille", "target": "Champmathieu", "value": 2},
        {"source": "Cochepaille", "target": "Brevet", "value": 2},
        {"source": "Cochepaille", "target": "Chenildieu", "value": 2},
        {"source": "Cochepaille", "target": "Valjean", "value": 2},
        {"source": "Cochepaille", "target": "Bamatabois", "value": 1},
        {"source": "Pontmercy", "target": "Thenardier", "value": 1},
        {"source": "Boulatruelle", "target": "Thenardier", "value": 1},
        {"source": "Eponine", "target": "MmeThenardier", "value": 2},
        {"source": "Eponine", "target": "Thenardier", "value": 3},
        {"source": "Anzelma", "target": "Eponine", "value": 2},
        {"source": "Anzelma", "target": "Thenardier", "value": 2},
        {"source": "Anzelma", "target": "MmeThenardier", "value": 1},
        {"source": "Woman2", "target": "Valjean", "value": 3},
        {"source": "Woman2", "target": "Cosette", "value": 1},
        {"source": "Woman2", "target": "Javert", "value": 1},
        {"source": "MotherInnocent", "target": "Fauchelevent", "value": 3},
        {"source": "MotherInnocent", "target": "Valjean", "value": 1},
        {"source": "Gribier", "target": "Fauchelevent", "value": 2},
        {"source": "MmeBurgon", "target": "Jondrette", "value": 1},
        {"source": "Gavroche", "target": "MmeBurgon", "value": 2},
        {"source": "Gavroche", "target": "Thenardier", "value": 1},
        {"source": "Gavroche", "target": "Javert", "value": 1},
        {"source": "Gavroche", "target": "Valjean", "value": 1},
        {"source": "Gillenormand", "target": "Cosette", "value": 3},
        {"source": "Gillenormand", "target": "Valjean", "value": 2},
        {"source": "Magnon", "target": "Gillenormand", "value": 1},
        {"source": "Magnon", "target": "MmeThenardier", "value": 1},
        {"source": "MlleGillenormand", "target": "Gillenormand", "value": 9},
        {"source": "MlleGillenormand", "target": "Cosette", "value": 2},
        {"source": "MlleGillenormand", "target": "Valjean", "value": 2},
        {"source": "MmePontmercy", "target": "MlleGillenormand", "value": 1},
        {"source": "MmePontmercy", "target": "Pontmercy", "value": 1},
        {"source": "Mlle_Vaubois", "target": "MlleGillenormand", "value": 1},
        {"source": "LtGillenormand", "target": "MlleGillenormand", "value": 2},
        {"source": "LtGillenormand", "target": "Gillenormand", "value": 1},
        {"source": "LtGillenormand", "target": "Cosette", "value": 1},
        {"source": "Marius", "target": "MlleGillenormand", "value": 6},
        {"source": "Marius", "target": "Gillenormand", "value": 12},
        {"source": "Marius", "target": "Pontmercy", "value": 1},
        {"source": "Marius", "target": "LtGillenormand", "value": 1},
        {"source": "Marius", "target": "Cosette", "value": 21},
        {"source": "Marius", "target": "Valjean", "value": 19},
        {"source": "Marius", "target": "Tholomyes", "value": 1},
        {"source": "Marius", "target": "Thenardier", "value": 2},
        {"source": "Marius", "target": "Eponine", "value": 5},
        {"source": "Marius", "target": "Gavroche", "value": 4},
        {"source": "BaronessT", "target": "Gillenormand", "value": 1},
        {"source": "BaronessT", "target": "Marius", "value": 1},
        {"source": "Mabeuf", "target": "Marius", "value": 1},
        {"source": "Mabeuf", "target": "Eponine", "value": 1},
        {"source": "Mabeuf", "target": "Gavroche", "value": 1},
        {"source": "Enjolras", "target": "Marius", "value": 7},
        {"source": "Enjolras", "target": "Gavroche", "value": 7},
        {"source": "Enjolras", "target": "Javert", "value": 6},
        {"source": "Enjolras", "target": "Mabeuf", "value": 1},
        {"source": "Enjolras", "target": "Valjean", "value": 4},
        {"source": "Combeferre", "target": "Enjolras", "value": 15},
        {"source": "Combeferre", "target": "Marius", "value": 5},
        {"source": "Combeferre", "target": "Gavroche", "value": 6},
        {"source": "Combeferre", "target": "Mabeuf", "value": 2},
        {"source": "Prouvaire", "target": "Gavroche", "value": 1},
        {"source": "Prouvaire", "target": "Enjolras", "value": 4},
        {"source": "Prouvaire", "target": "Combeferre", "value": 2},
        {"source": "Feuilly", "target": "Gavroche", "value": 2},
        {"source": "Feuilly", "target": "Enjolras", "value": 6},
        {"source": "Feuilly", "target": "Prouvaire", "value": 2},
        {"source": "Feuilly", "target": "Combeferre", "value": 5},
        {"source": "Feuilly", "target": "Mabeuf", "value": 1},
        {"source": "Feuilly", "target": "Marius", "value": 1},
        {"source": "Courfeyrac", "target": "Marius", "value": 9},
        {"source": "Courfeyrac", "target": "Enjolras", "value": 17},
        {"source": "Courfeyrac", "target": "Combeferre", "value": 13},
        {"source": "Courfeyrac", "target": "Gavroche", "value": 7},
        {"source": "Courfeyrac", "target": "Mabeuf", "value": 2},
        {"source": "Courfeyrac", "target": "Eponine", "value": 1},
        {"source": "Courfeyrac", "target": "Feuilly", "value": 6},
        {"source": "Courfeyrac", "target": "Prouvaire", "value": 3},
        {"source": "Bahorel", "target": "Combeferre", "value": 5},
        {"source": "Bahorel", "target": "Gavroche", "value": 5},
        {"source": "Bahorel", "target": "Courfeyrac", "value": 6},
        {"source": "Bahorel", "target": "Mabeuf", "value": 2},
        {"source": "Bahorel", "target": "Enjolras", "value": 4},
        {"source": "Bahorel", "target": "Feuilly", "value": 3},
        {"source": "Bahorel", "target": "Prouvaire", "value": 2},
        {"source": "Bahorel", "target": "Marius", "value": 1},
        {"source": "Bossuet", "target": "Marius", "value": 5},
        {"source": "Bossuet", "target": "Courfeyrac", "value": 12},
        {"source": "Bossuet", "target": "Gavroche", "value": 5},
        {"source": "Bossuet", "target": "Bahorel", "value": 4},
        {"source": "Bossuet", "target": "Enjolras", "value": 10},
        {"source": "Bossuet", "target": "Feuilly", "value": 6},
        {"source": "Bossuet", "target": "Prouvaire", "value": 2},
        {"source": "Bossuet", "target": "Combeferre", "value": 9},
        {"source": "Bossuet", "target": "Mabeuf", "value": 1},
        {"source": "Bossuet", "target": "Valjean", "value": 1},
        {"source": "Joly", "target": "Bahorel", "value": 5},
        {"source": "Joly", "target": "Bossuet", "value": 7},
        {"source": "Joly", "target": "Gavroche", "value": 3},
        {"source": "Joly", "target": "Courfeyrac", "value": 5},
        {"source": "Joly", "target": "Enjolras", "value": 5},
        {"source": "Joly", "target": "Feuilly", "value": 5},
        {"source": "Joly", "target": "Prouvaire", "value": 2},
        {"source": "Joly", "target": "Combeferre", "value": 5},
        {"source": "Joly", "target": "Mabeuf", "value": 1},
        {"source": "Joly", "target": "Marius", "value": 2},
        {"source": "Grantaire", "target": "Bossuet", "value": 3},
        {"source": "Grantaire", "target": "Enjolras", "value": 3},
        {"source": "Grantaire", "target": "Combeferre", "value": 1},
        {"source": "Grantaire", "target": "Courfeyrac", "value": 2},
        {"source": "Grantaire", "target": "Joly", "value": 2},
        {"source": "Grantaire", "target": "Gavroche", "value": 1},
        {"source": "Grantaire", "target": "Bahorel", "value": 1},
        {"source": "Grantaire", "target": "Feuilly", "value": 1},
        {"source": "Grantaire", "target": "Prouvaire", "value": 1},
        {"source": "MotherPlutarch", "target": "Mabeuf", "value": 3},
        {"source": "Gueulemer", "target": "Thenardier", "value": 5},
        {"source": "Gueulemer", "target": "Valjean", "value": 1},
        {"source": "Gueulemer", "target": "MmeThenardier", "value": 1},
        {"source": "Gueulemer", "target": "Javert", "value": 1},
        {"source": "Gueulemer", "target": "Gavroche", "value": 1},
        {"source": "Gueulemer", "target": "Eponine", "value": 1},
        {"source": "Babet", "target": "Thenardier", "value": 6},
        {"source": "Babet", "target": "Gueulemer", "value": 6},
        {"source": "Babet", "target": "Valjean", "value": 1},
        {"source": "Babet", "target": "MmeThenardier", "value": 1},
        {"source": "Babet", "target": "Javert", "value": 2},
        {"source": "Babet", "target": "Gavroche", "value": 1},
        {"source": "Babet", "target": "Eponine", "value": 1},
        {"source": "Claquesous", "target": "Thenardier", "value": 4},
        {"source": "Claquesous", "target": "Babet", "value": 4},
        {"source": "Claquesous", "target": "Gueulemer", "value": 4},
        {"source": "Claquesous", "target": "Valjean", "value": 1},
        {"source": "Claquesous", "target": "MmeThenardier", "value": 1},
        {"source": "Claquesous", "target": "Javert", "value": 1},
        {"source": "Claquesous", "target": "Eponine", "value": 1},
        {"source": "Claquesous", "target": "Enjolras", "value": 1},
        {"source": "Montparnasse", "target": "Javert", "value": 1},
        {"source": "Montparnasse", "target": "Babet", "value": 2},
        {"source": "Montparnasse", "target": "Gueulemer", "value": 2},
        {"source": "Montparnasse", "target": "Claquesous", "value": 2},
        {"source": "Montparnasse", "target": "Valjean", "value": 1},
        {"source": "Montparnasse", "target": "Gavroche", "value": 1},
        {"source": "Montparnasse", "target": "Eponine", "value": 1},
        {"source": "Montparnasse", "target": "Thenardier", "value": 1},
        {"source": "Toussaint", "target": "Cosette", "value": 2},
        {"source": "Toussaint", "target": "Javert", "value": 1},
        {"source": "Toussaint", "target": "Valjean", "value": 1},
        {"source": "Child1", "target": "Gavroche", "value": 2},
        {"source": "Child2", "target": "Gavroche", "value": 2},
        {"source": "Child2", "target": "Child1", "value": 3},
        {"source": "Brujon", "target": "Babet", "value": 3},
        {"source": "Brujon", "target": "Gueulemer", "value": 3},
        {"source": "Brujon", "target": "Thenardier", "value": 3},
        {"source": "Brujon", "target": "Gavroche", "value": 1},
        {"source": "Brujon", "target": "Eponine", "value": 1},
        {"source": "Brujon", "target": "Claquesous", "value": 1},
        {"source": "Brujon", "target": "Montparnasse", "value": 1},
        {"source": "MmeHucheloup", "target": "Bossuet", "value": 1},
        {"source": "MmeHucheloup", "target": "Joly", "value": 1},
        {"source": "MmeHucheloup", "target": "Grantaire", "value": 1},
        {"source": "MmeHucheloup", "target": "Bahorel", "value": 1},
        {"source": "MmeHucheloup", "target": "Courfeyrac", "value": 1},
        {"source": "MmeHucheloup", "target": "Gavroche", "value": 1},
        {"source": "MmeHucheloup", "target": "Enjolras", "value": 1}
      ]
    }
}
