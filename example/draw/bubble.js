function drawCircleChart(svg, changed){

  var animate = !false;
 
  var width = +svg.attr("width"),
    height = +svg.attr("height");

  var format = d3.format(",d");

  // var colorlist = ["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d", 
  // "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", 
  // "#9e9ac8", "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"]  
  var colorlist = ["#3182bd", "#6baed6", "#9ecae1", 
  "#e6550d",  "#fd8d3c", "#fdae6b", 
  "#31a354", "#74c476", "#a1d99b", 
  "#756bb1", "#9e9ac8", "#bcbddc", 
  "#636363", "#969696", "#bdbdbd"]
  var color = d3.scaleOrdinal(colorlist);
  console.log(" color ", d3.schemeCategory20c);

  var pack = d3.pack()
      .size([width, height])
      .padding(1.5);

  var classes = getBubbleData();

  var root = d3.hierarchy({children: classes})
      .sum(function(d) { return d.value; })
      .each(function(d) {
        if (id = d.data.id) {
          var id, i = id.lastIndexOf(".");
          d.id = id;
          d.package = id.slice(0, i);
          d.class = id.slice(i + 1);
        }
      });

  var node = svg.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  var liGroup = [];
  node.append("circle")
      .attr("id", function(d) { return d.id; })
      .attr('group', function(d){ 
        if(liGroup.indexOf(d.package) == -1){
          liGroup.push(d.package)
        }
        console.log(' package ', d.package);
        return d.package;})
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { 
        return color(d.package); });

  var index = 0
  var increase = true

  console.log(' group num ', liGroup);

  if(animate){

    setInterval(function(){
      // #
      // console.log(' increase ', index, liGroup.length);

      d3.selectAll('circle')
        .each(function(){
          var group = d3.select(this).attr("group")
          if(liGroup.indexOf(group) > index){
            d3.select(this)
              .style('visibility', 'hidden')
          }else{
            d3.select(this)
              .style('visibility', 'visible')
          }
        })

       if(index >= liGroup.length + 5){
        // increase = false
        index = -1
       }
       // if(index == 0)
       //  increase = true;

      index += (increase? 1 : -1)

    }, 800)
  }
}

function autoCircleChartMA(){

  var antmodal = {};
  var maGroupMap = {};
  var antDots = [
    [0, 3], [3, 3], [3.,0]
  ]
  
  antmodal = createPath(antDots, true); 
  antmodal.visible = false; 
  antmodal.fillColor = '#550000'

  var mapGroupInterval = {};

  d3.selectAll('.node')
    .each(function(d, i){
      
      var circle = d3.select(this).select('circle');
      var radius = +(circle.attr('r'));
      var interval = 5;

      var liGroup = circle.attr('group').split('.');      
      var groupid = liGroup.splice(0, liGroup.length - 1);

      if(mapGroupInterval[groupid] == undefined){
        interval = Object.keys(mapGroupInterval).length
        mapGroupInterval[groupid] = interval
      }else{
        interval = mapGroupInterval[groupid] 
      }

      // var cxy = d3.select(this).attr("transform").split(',');
      var cx = getTranslateXValue(d3.select(this).attr("transform")), cy = getTranslateYValue(d3.select(this).attr("transform"));
      // console.log(" cx, cy ", cx, cy, radius)
      var liPathDots = getCircleDots(cx, cy, radius);

      var mainfo = {   
        "ae" : "MA",
        "antcolor" : "#8C8C8C",
        "antshape" : "self-defined",
        "antgap" : 10,
        "antinterval" : (1 + interval) * 2,
        'groupid': groupid,
      };

      var ma = {};
      ma['path'] = {
        dots: liPathDots
      };
      if(maGroupMap[groupid] == undefined){
        //not exist
        maGroupMap[groupid] = {
          'mainfo': mainfo,
          'malist': [ma]
        }
      }else{
        //exist
        maGroupMap[groupid]['malist'].push(ma);
      }
    })

  console.log(' mapGroupInterval ', mapGroupInterval);
  return {'antmodal': antmodal, 'groups': maGroupMap};
}

function getTranslateXValue(translateString){

  var n = translateString.indexOf("(");
  var n1 = translateString.indexOf(",");

  var res = parseInt(translateString.slice(n+1,n1-2));

return res;

}

function getTranslateYValue(translateString){

 var n = translateString.indexOf(",");
  var n1 = translateString.indexOf(")");

  var res = parseInt(translateString.slice(n+1,n1-1));
return res;

}

function getCircleDots(cx, cy, radius){
  var liDots = [];
  for(var i = 0; i < 360; i ++){    
    var x = cx + radius * Math.sin(Math.PI * i / 180);
    var y = cy + radius * Math.cos(Math.PI * i / 180);
    liDots.push([x, y]);
  }
  return liDots;
}

function getBubbleData(){

  return [{'id': 'flare.analytics.cluster.AgglomerativeCluster', 'value': 3938.0},
{'id': 'flare.analytics.cluster.CommunityStructure', 'value': 3812.0},
{'id': 'flare.analytics.cluster.HierarchicalCluster', 'value': 6714.0},
{'id': 'flare.analytics.cluster.MergeEdge', 'value': 743.0},
{'id': 'flare.analytics.graph.BetweennessCentrality', 'value': 3534.0},
{'id': 'flare.analytics.graph.LinkDistance', 'value': 5731.0},
{'id': 'flare.analytics.graph.MaxFlowMinCut', 'value': 7840.0},
{'id': 'flare.analytics.graph.ShortestPaths', 'value': 5914.0},
{'id': 'flare.analytics.graph.SpanningTree', 'value': 3416.0},
{'id': 'flare.analytics.optimization.AspectRatioBanker', 'value': 7074.0},
{'id': 'flare.animate.Easing', 'value': 17010.0},
{'id': 'flare.animate.FunctionSequence', 'value': 5842.0},
{'id': 'flare.animate.interpolate.ArrayInterpolator', 'value': 1983.0},
{'id': 'flare.animate.interpolate.ColorInterpolator', 'value': 2047.0},
{'id': 'flare.animate.interpolate.DateInterpolator', 'value': 1375.0},
{'id': 'flare.animate.interpolate.Interpolator', 'value': 8746.0},
{'id': 'flare.animate.interpolate.MatrixInterpolator', 'value': 2202.0},
{'id': 'flare.animate.interpolate.NumberInterpolator', 'value': 1382.0},
{'id': 'flare.animate.interpolate.ObjectInterpolator', 'value': 1629.0},
{'id': 'flare.animate.interpolate.PointInterpolator', 'value': 1675.0},
{'id': 'flare.animate.interpolate.RectangleInterpolator', 'value': 2042.0},
{'id': 'flare.animate.ISchedulable', 'value': 1041.0},
{'id': 'flare.animate.Parallel', 'value': 5176.0},
{'id': 'flare.animate.Pause', 'value': 449.0},
{'id': 'flare.animate.Scheduler', 'value': 5593.0},
{'id': 'flare.animate.Sequence', 'value': 5534.0},
{'id': 'flare.animate.Transition', 'value': 9201.0},
{'id': 'flare.animate.Transitioner', 'value': 19975.0},
{'id': 'flare.animate.TransitionEvent', 'value': 1116.0},
{'id': 'flare.animate.Tween', 'value': 6006.0},
{'id': 'flare.data.converters.Converters', 'value': 721.0},
{'id': 'flare.data.converters.DelimitedTextConverter', 'value': 4294.0},
{'id': 'flare.data.converters.GraphMLConverter', 'value': 9800.0},
{'id': 'flare.data.converters.IDataConverter', 'value': 1314.0},
{'id': 'flare.data.converters.JSONConverter', 'value': 2220.0},
{'id': 'flare.data.DataField', 'value': 1759.0},
{'id': 'flare.data.DataSchema', 'value': 2165.0},
{'id': 'flare.data.DataSet', 'value': 586.0},
{'id': 'flare.data.DataSource', 'value': 3331.0},
{'id': 'flare.data.DataTable', 'value': 772.0},
{'id': 'flare.data.DataUtil', 'value': 3322.0},
{'id': 'flare.display.DirtySprite', 'value': 8833.0},
{'id': 'flare.display.LineSprite', 'value': 1732.0},
{'id': 'flare.display.RectSprite', 'value': 3623.0},
{'id': 'flare.display.TextSprite', 'value': 10066.0},
{'id': 'flare.flex.FlareVis', 'value': 4116.0},
{'id': 'flare.physics.DragForce', 'value': 1082.0},
{'id': 'flare.physics.GravityForce', 'value': 1336.0},
{'id': 'flare.physics.IForce', 'value': 319.0},
{'id': 'flare.physics.NBodyForce', 'value': 10498.0},
{'id': 'flare.physics.Particle', 'value': 2822.0},
{'id': 'flare.physics.Simulation', 'value': 9983.0},
{'id': 'flare.physics.Spring', 'value': 2213.0},
{'id': 'flare.physics.SpringForce', 'value': 1681.0},
{'id': 'flare.query.AggregateExpression', 'value': 1616.0},
{'id': 'flare.query.And', 'value': 1027.0},
{'id': 'flare.query.Arithmetic', 'value': 3891.0},
{'id': 'flare.query.Average', 'value': 891.0},
{'id': 'flare.query.BinaryExpression', 'value': 2893.0},
{'id': 'flare.query.Comparison', 'value': 5103.0},
{'id': 'flare.query.CompositeExpression', 'value': 3677.0},
{'id': 'flare.query.Count', 'value': 781.0},
{'id': 'flare.query.DateUtil', 'value': 4141.0},
{'id': 'flare.query.Distinct', 'value': 933.0},
{'id': 'flare.query.Expression', 'value': 5130.0},
{'id': 'flare.query.ExpressionIterator', 'value': 3617.0},
{'id': 'flare.query.Fn', 'value': 3240.0},
{'id': 'flare.query.If', 'value': 2732.0},
{'id': 'flare.query.IsA', 'value': 2039.0},
{'id': 'flare.query.Literal', 'value': 1214.0},
{'id': 'flare.query.Match', 'value': 3748.0},
{'id': 'flare.query.Maximum', 'value': 843.0},
{'id': 'flare.query.methods.add', 'value': 593.0},
{'id': 'flare.query.methods.and', 'value': 330.0},
{'id': 'flare.query.methods.average', 'value': 287.0},
{'id': 'flare.query.methods.count', 'value': 277.0},
{'id': 'flare.query.methods.distinct', 'value': 292.0},
{'id': 'flare.query.methods.div', 'value': 595.0},
{'id': 'flare.query.methods.eq', 'value': 594.0},
{'id': 'flare.query.methods.fn', 'value': 460.0},
{'id': 'flare.query.methods.gt', 'value': 603.0},
{'id': 'flare.query.methods.gte', 'value': 625.0},
{'id': 'flare.query.methods.iff', 'value': 748.0},
{'id': 'flare.query.methods.isa', 'value': 461.0},
{'id': 'flare.query.methods.lt', 'value': 597.0},
{'id': 'flare.query.methods.lte', 'value': 619.0},
{'id': 'flare.query.methods.max', 'value': 283.0},
{'id': 'flare.query.methods.min', 'value': 283.0},
{'id': 'flare.query.methods.mod', 'value': 591.0},
{'id': 'flare.query.methods.mul', 'value': 603.0},
{'id': 'flare.query.methods.neq', 'value': 599.0},
{'id': 'flare.query.methods.not', 'value': 386.0},
{'id': 'flare.query.methods.or', 'value': 323.0},
{'id': 'flare.query.methods.orderby', 'value': 307.0},
{'id': 'flare.query.methods.range', 'value': 772.0},
{'id': 'flare.query.methods.select', 'value': 296.0},
{'id': 'flare.query.methods.stddev', 'value': 363.0},
{'id': 'flare.query.methods.sub', 'value': 600.0},
{'id': 'flare.query.methods.sum', 'value': 280.0},
{'id': 'flare.query.methods.update', 'value': 307.0},
{'id': 'flare.query.methods.variance', 'value': 335.0},
{'id': 'flare.query.methods.where', 'value': 299.0},
{'id': 'flare.query.methods.xor', 'value': 354.0},
{'id': 'flare.query.methods._', 'value': 264.0},
{'id': 'flare.query.Minimum', 'value': 843.0},
{'id': 'flare.query.Not', 'value': 1554.0},
{'id': 'flare.query.Or', 'value': 970.0},
{'id': 'flare.query.Query', 'value': 13896.0},
{'id': 'flare.query.Range', 'value': 1594.0},
{'id': 'flare.query.StringUtil', 'value': 4130.0},
{'id': 'flare.query.Sum', 'value': 791.0},
{'id': 'flare.query.Variable', 'value': 1124.0},
{'id': 'flare.query.Variance', 'value': 1876.0},
{'id': 'flare.query.Xor', 'value': 1101.0},
// {'id': 'flare.scale.IScaleMap', 'value': 2105.0},
// {'id': 'flare.scale.LinearScale', 'value': 1316.0},
// {'id': 'flare.scale.LogScale', 'value': 3151.0},
// {'id': 'flare.scale.OrdinalScale', 'value': 3770.0},
// {'id': 'flare.scale.QuantileScale', 'value': 2435.0},
// {'id': 'flare.scale.QuantitativeScale', 'value': 4839.0},
// {'id': 'flare.scale.RootScale', 'value': 1756.0},
// {'id': 'flare.scale.Scale', 'value': 4268.0},
// {'id': 'flare.scale.ScaleType', 'value': 1821.0},
// {'id': 'flare.scale.TimeScale', 'value': 5833.0},
// {'id': 'flare.util.Arrays', 'value': 8258.0},
// {'id': 'flare.util.Colors', 'value': 10001.0},
// {'id': 'flare.util.Dates', 'value': 8217.0},
// {'id': 'flare.util.Displays', 'value': 12555.0},
// {'id': 'flare.util.Filter', 'value': 2324.0},
// {'id': 'flare.util.Geometry', 'value': 10993.0},
// {'id': 'flare.util.heap.FibonacciHeap', 'value': 9354.0},
// {'id': 'flare.util.heap.HeapNode', 'value': 1233.0},
// {'id': 'flare.util.IEvaluable', 'value': 335.0},
// {'id': 'flare.util.IPredicate', 'value': 383.0},
// {'id': 'flare.util.IValueProxy', 'value': 874.0},
// {'id': 'flare.util.math.DenseMatrix', 'value': 3165.0},
// {'id': 'flare.util.math.IMatrix', 'value': 2815.0},
// {'id': 'flare.util.math.SparseMatrix', 'value': 3366.0},
// {'id': 'flare.util.Maths', 'value': 17705.0},
// {'id': 'flare.util.Orientation', 'value': 1486.0},
// {'id': 'flare.util.palette.ColorPalette', 'value': 6367.0},
// {'id': 'flare.util.palette.Palette', 'value': 1229.0},
// {'id': 'flare.util.palette.ShapePalette', 'value': 2059.0},
// {'id': 'flare.util.palette.SizePalette', 'value': 2291.0},
// {'id': 'flare.util.Property', 'value': 5559.0},
// {'id': 'flare.util.Shapes', 'value': 19118.0},
// {'id': 'flare.util.Sort', 'value': 6887.0},
// {'id': 'flare.util.Stats', 'value': 6557.0},
// {'id': 'flare.util.Strings', 'value': 22026.0},
// {'id': 'flare.vis.axis.Axes', 'value': 1302.0},
// {'id': 'flare.vis.axis.Axis', 'value': 24593.0},
// {'id': 'flare.vis.axis.AxisGridLine', 'value': 652.0},
// {'id': 'flare.vis.axis.AxisLabel', 'value': 636.0},
// {'id': 'flare.vis.axis.CartesianAxes', 'value': 6703.0},
// {'id': 'flare.vis.controls.AnchorControl', 'value': 2138.0},
// {'id': 'flare.vis.controls.ClickControl', 'value': 3824.0},
// {'id': 'flare.vis.controls.Control', 'value': 1353.0},
// {'id': 'flare.vis.controls.ControlList', 'value': 4665.0},
// {'id': 'flare.vis.controls.DragControl', 'value': 2649.0},
// {'id': 'flare.vis.controls.ExpandControl', 'value': 2832.0},
// {'id': 'flare.vis.controls.HoverControl', 'value': 4896.0},
// {'id': 'flare.vis.controls.IControl', 'value': 763.0},
// {'id': 'flare.vis.controls.PanZoomControl', 'value': 5222.0},
// {'id': 'flare.vis.controls.SelectionControl', 'value': 7862.0},
// {'id': 'flare.vis.controls.TooltipControl', 'value': 8435.0},
// {'id': 'flare.vis.data.Data', 'value': 20544.0},
// {'id': 'flare.vis.data.DataList', 'value': 19788.0},
// {'id': 'flare.vis.data.DataSprite', 'value': 10349.0},
// {'id': 'flare.vis.data.EdgeSprite', 'value': 3301.0},
// {'id': 'flare.vis.data.NodeSprite', 'value': 19382.0},
// {'id': 'flare.vis.data.ScaleBinding', 'value': 11275.0},
// {'id': 'flare.vis.data.Tree', 'value': 7147.0},
// {'id': 'flare.vis.data.TreeBuilder', 'value': 9930.0},
// {'id': 'flare.vis.data.render.ArrowType', 'value': 698.0},
// {'id': 'flare.vis.data.render.EdgeRenderer', 'value': 5569.0},
// {'id': 'flare.vis.data.render.IRenderer', 'value': 353.0},
// {'id': 'flare.vis.data.render.ShapeRenderer', 'value': 2247.0},
// {'id': 'flare.vis.events.DataEvent', 'value': 2313.0},
// {'id': 'flare.vis.events.SelectionEvent', 'value': 1880.0},
// {'id': 'flare.vis.events.TooltipEvent', 'value': 1701.0},
// {'id': 'flare.vis.events.VisualizationEvent', 'value': 1117.0},
// {'id': 'flare.vis.legend.Legend', 'value': 20859.0},
// {'id': 'flare.vis.legend.LegendItem', 'value': 4614.0},
// {'id': 'flare.vis.legend.LegendRange', 'value': 10530.0},
// {'id': 'flare.vis.operator.distortion.BifocalDistortion', 'value': 4461.0},
// {'id': 'flare.vis.operator.distortion.Distortion', 'value': 6314.0},
// {'id': 'flare.vis.operator.distortion.FisheyeDistortion', 'value': 3444.0},
// {'id': 'flare.vis.operator.encoder.ColorEncoder', 'value': 3179.0},
// {'id': 'flare.vis.operator.encoder.Encoder', 'value': 4060.0},
// {'id': 'flare.vis.operator.encoder.PropertyEncoder', 'value': 4138.0},
// {'id': 'flare.vis.operator.encoder.ShapeEncoder', 'value': 1690.0},
// {'id': 'flare.vis.operator.encoder.SizeEncoder', 'value': 1830.0},
// {'id': 'flare.vis.operator.filter.FisheyeTreeFilter', 'value': 5219.0},
// {'id': 'flare.vis.operator.filter.GraphDistanceFilter', 'value': 3165.0},
// {'id': 'flare.vis.operator.filter.VisibilityFilter', 'value': 3509.0},
// {'id': 'flare.vis.operator.IOperator', 'value': 1286.0},
// {'id': 'flare.vis.operator.label.Labeler', 'value': 9956.0},
// {'id': 'flare.vis.operator.label.RadialLabeler', 'value': 3899.0},
// {'id': 'flare.vis.operator.label.StackedAreaLabeler', 'value': 3202.0},
// {'id': 'flare.vis.operator.layout.AxisLayout', 'value': 6725.0},
// {'id': 'flare.vis.operator.layout.BundledEdgeRouter', 'value': 3727.0},
// {'id': 'flare.vis.operator.layout.CircleLayout', 'value': 9317.0},
// {'id': 'flare.vis.operator.layout.CirclePackingLayout', 'value': 12003.0},
// {'id': 'flare.vis.operator.layout.DendrogramLayout', 'value': 4853.0},
// {'id': 'flare.vis.operator.layout.ForceDirectedLayout', 'value': 8411.0},
// {'id': 'flare.vis.operator.layout.IcicleTreeLayout', 'value': 4864.0},
// {'id': 'flare.vis.operator.layout.IndentedTreeLayout', 'value': 3174.0},
// {'id': 'flare.vis.operator.layout.Layout', 'value': 7881.0},
// {'id': 'flare.vis.operator.layout.NodeLinkTreeLayout', 'value': 12870.0},
// {'id': 'flare.vis.operator.layout.PieLayout', 'value': 2728.0},
// {'id': 'flare.vis.operator.layout.RadialTreeLayout', 'value': 12348.0},
// {'id': 'flare.vis.operator.layout.RandomLayout', 'value': 870.0},
// {'id': 'flare.vis.operator.layout.StackedAreaLayout', 'value': 9121.0},
// {'id': 'flare.vis.operator.layout.TreeMapLayout', 'value': 9191.0},
// {'id': 'flare.vis.operator.Operator', 'value': 2490.0},
// {'id': 'flare.vis.operator.OperatorList', 'value': 5248.0},
// {'id': 'flare.vis.operator.OperatorSequence', 'value': 4190.0},
// {'id': 'flare.vis.operator.OperatorSwitch', 'value': 2581.0},
// {'id': 'flare.vis.operator.SortOperator', 'value': 2023.0},
// {'id': 'flare.vis.Visualization', 'value': 16540.0}
  ]
}