function createPath(liDot, closed){
  var path = new Path();
  // path.strokeColor = 'black';
  for(var i = 0; i < liDot.length; i ++)
    path.add(new Point(liDot[i]))
  path.closed = closed;
  return path;
}

var margin = {left: 200, top: 30}

var dataset1 = [
  {
      'minY': 4,
      'maxY': 33,
      'q1': 11,
      'median': 21,
      'q3': 27,
  },
  {
      'minY': 0,
      'maxY': 23,
      'q1': 7,
      'median': 11,
      'q3': 18,    
  }, 
  {
      'minY': 5,
      'maxY': 34,
      'q1': 10,
      'median': 22,
      'q3': 29,    
  },
  {
      'minY': 8,
      'maxY': 35,
      'q1': 13,
      'median': 19,
      'q3': 28,    
  }, 
  {
      'minY': 2,
      'maxY': 30,
      'q1': 4,
      'median': 12,
      'q3': 15,    
  },
  {
      'minY': 4,
      'maxY': 33,
      'q1': 11,
      'median': 21,
      'q3': 27,
  },
  {
      'minY': 0,
      'maxY': 23,
      'q1': 7,
      'median': 12,
      'q3': 22,    
  }, 
  {
      'minY': 5,
      'maxY': 34,
      'q1': 10,
      'median': 20,
      'q3': 29,    
  },
  {
      'minY': 8,
      'maxY': 30,
      'q1': 14,
      'median': 21,
      'q3': 28,    
  }, 
  {
      'minY': 2,
      'maxY': 28,
      'q1': 4,
      'median': 10,
      'q3': 15,    
  },
]

function getGlobalMaxMinY(liData){
  var gMin, gMax;
  for(var i = 0; i < liData.length; i ++){
    var data = liData[i]
    var min = data.minY, max = data.maxY;
    if(i == 0){
      gMin = min;
      gMax = max;      
    }else{
      if(gMin > min)
        gMin = min;
      if(gMax < max)
        gMax = max;
    }
  }
  return {'globalMax': gMax, 'globalMin': gMin};
}

function drawBoxplot(){

  console.log(' draw boxplot ');

  var data = [];
  var boxWidth = 20, boxGap = 40;
  var globalMax, globalMin; 
  var liData = dataset1;

  //random
  // for(var i = 0; i < 5; i ++){    
  //   var minY = Math.floor((Math.random() * 10)%10);
  //   var maxY = Math.floor(minY + 20 + (Math.random() * 10)%10);
  //   var yQ1 = minY + 5;
  //   var yQ3 = maxY - 5;
  //   var ymedian = Math.floor((yQ1 + yQ3) * 0.5);
  //   data.push(minY)
  //   data.push(maxY);
  //   liData.push({
  //     'minY': minY,
  //     'maxY': maxY,
  //     'q1': yQ1,
  //     'median': ymedian,
  //     'q3': yQ3,
  //   })
  // }

  var globalMaxMin = getGlobalMaxMinY(liData)
  globalMax = globalMaxMin['globalMax']
  globalMin = globalMaxMin['globalMin']
  globalMax = 70;//45;

  console.log(" data ", liData, globalMax, globalMin);
  var boxplotsvg = d3.select('#drawsvg')
                     .append('g')
                     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
   
  // var maxY, minY;
  // for(var i = 0; i < liData.length; i ++){
  //   if(i == 0){
  //     liData[i]['q3'] - liData[i]
  //   }
  // }

  for(var i = 0; i < liData.length; i ++){
    var data = liData[i];
    var g = boxplotsvg
        .append('g')
        .attr('class', 'boxplot')
        .attr('data', JSON.stringify(data))
        .attr('groupid', i)
        .attr('transform', 'translate(' + i * (boxWidth + boxGap) + ',0)')
    drawaBox(i, g, data, globalMin, globalMax, data.minY, data.q1, data.median, data.q3, data.maxY);
  }
}

function drawaBox(i, g, d, globalMin, globalMax, ymin, yQ1, yMV, yQ3, ymax){
 
  console.log(' box i = ', i);

  var yScale = d3.scaleLinear()
                .domain([globalMin, globalMax])
                .range([500, 0])

   var boxWidth = 20

   var colorFunc_bottom = d3.scaleLinear()
                .domain([0, 50])
              .range(["#0570b0", "#a6bddb"]);
              // .interpolate(d3.interpolateHcl);
   
   var colorFunc_up = d3.scaleLinear()
                .domain([0, 50])
              .range(["#d7301f", "#fdbb84"]);
              // .interpolate(d3.interpolateHcl);
  colorFunc = ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6"]
  colorFunc = ['#66c2a5', '#fc9d62', '#8da0cb', '#e78ac3', '#a6d854']

  //rect
  g.append('rect')
   .attr('class', 'box')
   .attr('width', boxWidth)
   .attr('height', function(){
    return yScale(yQ1) - yScale(yQ3);
   })
   .attr('x', function(){
    return 0
   })
   .attr('y', function(){
    return yScale(yQ3);
   })
   .style('fill', function(){
    return colorFunc[Math.floor(i/2)]
    // return colorFunc(yScale(yQ1) - yScale(yQ3))
    // return 'red'
    // return 'none';
  })
   .style('stroke', 'black');

   var step = 7
   var shinkRatio = 0.4
    
  
   //median line
   g.append('line')
    .attr('class', 'mline')
    .attr('x1', 0)
    .attr('y1', yScale(yMV))
    .attr('x2', boxWidth)
    .attr('y2', yScale(yMV))
    .style('stroke', 'black')
    .style('stroke-width', '3px');

    //whisker line
  g.append('line')
   .attr('class', 'whisker')   
   .attr('x1', boxWidth/2.)
   .attr('x2', boxWidth/2.)
   .attr('y1', yScale(yQ3))
   .attr('y2', yScale(ymax))
   .style('stroke', 'black')
   .style('stroke-dasharray', '5 5');
    //whisker line
  g.append('line')
   .attr('class', 'whisker')
   .attr('x1', boxWidth/2.)
   .attr('x2', boxWidth/2.)
   .attr('y1', yScale(yQ1))
   .attr('y2', yScale(ymin))
   .style('stroke', 'black')
   .style('stroke-dasharray', '5 5');
  g.append('line')
   .attr('class', 'whisker')
   .attr('x1', 0)
   .attr('x2', boxWidth)
   .attr('y1', yScale(ymin))
   .attr('y2', yScale(ymin))
   .style('stroke', 'black');
  g.append('line')
   .attr('class', 'whisker')
   .attr('x1', 0)
   .attr('x2', boxWidth)
   .attr('y1', yScale(ymax))
   .attr('y2', yScale(ymax))
   .style('stroke', 'black');
  
  g.append('text')
   .text(ymax)
   .style('font', '12px sans-serif')
   .attr("dy", ".3em")
   .attr('x', boxWidth)
   .attr('y', yScale(ymax))
   .style('visibility', 'hidden')

  g.append('text')
   .text(ymin)
   .style('font', '12px sans-serif')
   .attr("dy", ".3em")
   .attr("dx", ".3em")
   .attr('x', boxWidth)
   .attr('y', yScale(ymin))
   .style('visibility', 'hidden')

  g.append('text')
   .text(yQ1)
   .style('font', '12px sans-serif')
   .attr("dy", ".3em")
   .attr("dx", ".3em")
   .attr('x', boxWidth)
   .attr('y', yScale(yQ1))
   .style('visibility', 'hidden')

  g.append('text')
   .text(yQ3)
   .style('font', '12px sans-serif')
   .attr("dy", ".3em")
   .attr("dx", ".3em")
   .attr('x', boxWidth)
   .attr('y', yScale(yQ3))
   .style('visibility', 'hidden')

  g.append('text')
   .text(yMV)
   .style('font', '12px sans-serif')
   .attr("dy", ".3em")
   .attr("dx", ".3em")
   .attr('x', boxWidth)
   .attr('y', yScale(yMV))
   .style('visibility', 'hidden')
   
}

function autoBoxplotMA(){
  var exampleGroup = {};
  var maGroupMap = {};
  var antDots = [
     [ 
          110, 
          387
      ], 
      [ 
          129, 
          399
      ], 
      [ 
          129, 
          405
      ], 
      [ 
          110, 
          393
      ], 
      [ 
          92, 
          404
      ], 
      [ 
          91, 
          400
      ], 
      [ 
          110, 
          387
      ]
  ]
  var antModal = createPath(antDots, true);  
  antModal.visible = false   

  var mapMaInfo = {};
  var mapMaList = {};

  d3.selectAll('.boxplot')
  .each(function(d, i){
    
    var box = d3.select(this).select('.box')
    var data = JSON.parse(d3.select(this).attr('data'))
    console.log(" data ", data);
    var width = +box.attr('width'), height = +box.attr('height')
    var mline = d3.select(this).select('.mline');
    var top = (margin.top + (+box.attr('y')));
    var middlepos = [ d3.select(this).node().getBoundingClientRect().left + (+mline.attr('x1') + width * 0.5),  (margin.top + (+mline.attr('y1')))];

    console.log(' boxplot ', d3.select(this).attr('groupid'));
    
    //upper 
    var upperma = {};
    var upppermainfo = {};

    upppermainfo = {
      "ae" : "MA",
      "antcolor" : "#ffffff63",
      "antshape" : "self-defined",
      "antgap" : 10,
      "antinterval" : 2 + Math.pow((data.q3 - data.median - 3), 2),
    }

    upperma['path'] = {
      dots: [middlepos, [middlepos[0], top]]
    }

    upperma['boundary'] = {
      dots: [[middlepos[0] - width/2., top], [middlepos[0] + width/2., top],
             [middlepos[0] + width/2., middlepos[1]], [middlepos[0] - width/2., middlepos[1]], [middlepos[0] - width/2., top]]
    }

    upppermainfo['groupid'] = d3.select(this).attr('groupid') + '-up'
    mapMaInfo[upppermainfo['groupid']] = (upppermainfo);
    mapMaList[upppermainfo['groupid']] = [upperma]

    var bottomma = {};
    var bottommainfo = {};

    bottommainfo = {
      "ae" : "MA",
      "antcolor" : "#ffffff63",
      "antshape" : "self-defined",
      "antgap" : 10,
      "antinterval" : 2 + Math.pow((data.median - data.q1 - 3), 2)
    }

    bottomma['path'] = {
      dots: [middlepos, [middlepos[0], top + height]]
    }

    bottomma['boundary'] = {
      dots: [[middlepos[0] - width/2., middlepos[1]], [middlepos[0] + width/2., middlepos[1]],
             [middlepos[0] + width/2., top + height], [middlepos[0] - width/2., top + height]]
    }

    bottommainfo['groupid'] = d3.select(this).attr('groupid') + '-bo'    
    mapMaInfo[bottommainfo['groupid']] = (bottommainfo);
    mapMaList[bottommainfo['groupid']] = [bottomma]
  })

  console.log(' liMaInfo ', mapMaInfo);
  console.log(' mapMaList ', mapMaList);
  var liGroupId = Object.keys(mapMaInfo);
  for(var i = 0; i < liGroupId.length; i ++){
    var groupid = liGroupId[i];
    maGroupMap[groupid]  = {
      'mainfo': mapMaInfo[groupid],
      'malist': mapMaList[groupid],
    }
  }

  return {'antmodal': antModal, 'groups': maGroupMap};
}
