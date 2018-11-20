function drawTreeMapLight(){
	console.log(' draw tree map light ');
	var color = d3.scale
	var liRect = [
		{
			level: 1,
			name: "C:",
			rect: [[10,10],[707,10],[706,559],[10,559]]
		},
		{
			level: 2,
			name: 'Temp',
			rect: [[20,30],[448,30],[448,328],[20,328]]
		},
		{
			level: 2,
			name: 'Windows',
			rect: [[455,30],[595,30],[595,348],[455,348]]
		},
		{
			level: 2,
			name: 'oradexe',
			rect: [[600,30],[698,30],[698,348],[600,348]]
		},
		{
			level: 2,
			name: 'Programme',
			rect: [[18,333],[450,333],[450,549],[18,546]]
		},
		{
			level: 2,
			name: 'Document',
			rect: [[455,354],[630,354],[630,480],[455,480],]
		},
		{
			level: 2,
			name: 'S...',
			rect: [[637,354],[669,354],[670,534],[637,536],]
		},
		{
			level: 2,
			name: 'R...',
			rect:  [[455,485],[630,486],[630,548],[455,546],]

		},
		{
			level: 2,
			name: 'Da.',
			rect: [[674,355],[696,355],[696,534],[676,534],]
		},
		{
			level: 3,
			name: 'Freigable',
			rect: [[25,54],[376,52],[374,322],[25,322],]
		},
		{
			level: 3,
			name: 'Installer',
			rect: [[379,53],[412,53],[410,237],[378,237],]
		},
		{
			level: 3,
			name: 'oradata',
			rect: [[415,53],[444,53],[443,238],[414,237],]
		},
		{
			level: 3,
			name: 'Microsoft VS 8',
			rect: [[462,52],[591,51],[588,151],[461,151],]
		},
		{
			level: 3,
			name: 'Microsoft VS 9',
			rect: [[462,155],[543,155],[541,238],[462,239],]
		},
		{
			level: 3,
			name: 'Borland',
			rect: [[546,155],[588,155],[590,238],[546,238],]
		},
		{
			level: 3,
			name: 'Micro...',
			rect: [[462,243],[505,243],[505,293],[462,293],]
		},
		{
			level: 3,
			name: 'JAM So...',
			rect: [[509,243],[561,243],[561,281],[508,282],]
		},
		{	
			level: 3,
			name: 'Code...',
			rect:  [[462,297],[505,297],[505,344],[461,344],]
		},
		{
			level: 3,
			name: 'Mircos...',
			rect: [[608,53],[690,53],[691,315],[608,314],]
		},
		{
			level: 3,
			name: 'Visua...',
			rect: [[607,319],[691,319],[690,343],[607,343],]
		},
		{
			level: 3,
			name: 'Adobe',
			rect: [[25,354],[147,354],[145,464],[25,464],]
		},
		{
			level: 3,
			name: 'Jave',
			rect: [[151,354],[217,355],[218,451],[150,451],]
		},
		{
			level: 3,
			name: 'VM...',
			rect:  [[222,354],[277,354],[277,451],[222,450],]
		},
		{
			level: 3,
			name: 'All users...',
			rect: [[281,355],[338,355],[337,422],[281,423],]
		},
		{
			level: 3,
			name: 'mard...',
			rect: [[341,356],[396,356],[393,422],[340,422],]
		},
		{
			level: 3,
			name: '.sys',
			rect: [[398,355],[444,355],[443,423],[397,422],]
		},
		{
			level: 3,
			name: 'RAD..',
			rect: [[24,468],[146,469],[146,541],[24,541],]
		},
		{
			level: 3,
			name: 'JAM So...',
			rect: [[150,455],[218,455],[217,540],[150,540],]
		},
		{
			level: 3,
			name: 'Spac...',
			rect: [[222,455],[279,455],[278,540],[221,540],]
		},
		{
			level: 3,
			name: 'S...',
			rect: [[281,427],[327,426],[327,465],[282,466],]
		},
		{
			level: 3,
			name: 'V...',
			rect: [[282,470],[328,469],[330,506],[281,507],]
		},
		{
			level: 3,
			name: '2..',
			rect: [[282,509],[329,509],[328,542],[281,541],]
		},
		{
			level: 3,
			name: '3..',
			rect: [[331,426],[372,426],[373,453],[331,451],]
		},
		{
			level: 3,
			name: 'G.',
			rect: [[462,375],[528,375],[528,473],[461,472],]
		},
		{
			level: 3,
			name: 'Dx',
			rect: [[532,375],[580,375],[579,473],[530,471],]
		},
		{
			level: 3,
			name: 'E..',
			rect: [[583,375],[627,375],[626,472],[583,472],]
		},
		{
			level: 3,
			name: 'SA.',
			rect: [[461,505],[625,505],[625,542],[462,542],]
		},
		{
			level: 3,
			name: 'k.',
			rect: [[643,374],[665,375],[664,529],[642,529],],
		},
		{
			level: 3,
			name: 'l.',
			rect: [[681,375],[691,375],[691,529],[681,529],]
		},
		{
			level: 4,
			name: 'Sp.',
			rect: [[384,72],[406,73],[404,229],[384,230],]
		},
		{
			level: 4,
			name: 'op.',
			rect: [[420,73],[439,73],[438,215],[419,215],]
		},
		{
			level: 4,
			name: 'qa.',
			rect: [[467,72],[547,73],[546,143],[467,144],]
		},
		{
			level: 4,
			name: 'is.',
			rect: [[550,73],[585,73],[585,144],[550,144],]
		},
		{
			level: 4,
			name: 'tt.',
			rect: [[467,173],[499,174],[499,235],[467,235],]
		},
		{
			level: 4,
			name: 'we.',
			rect: [[614,73],[684,72],[684,307],[615,307],]
		},
		{
			level: 4,
			name: 'is.',
			rect: [[32,374],[84,374],[83,456],[32,455],]
		},
		{
			level: 4,
			name: 'op',
			rect: [[87,375],[119,375],[119,419],[86,419],]
		},
		{
			level: 4,
			name: 'o9.',
			rect: [[32,487],[102,485],[102,535],[32,537],]
		},
		{
			level: 4,
			name: 'o.',
			rect: [[155,375],[211,375],[212,421],[156,420],]
		},
		{
			level: 4,
			name: 'u.',
			rect: [[156,424],[210,424],[209,445],[157,446],]
		},
		{
			level: 4,
			name: 'w1.',
			rect: [[155,474],[212,474],[213,534],[156,533],]
		},
		{
			level: 4,
			name: 'cx.',
			rect: [[227,375],[273,374],[272,401],[227,401],]
		},
		{
			level: 4,
			name: 'i0.',
			rect: [[227,474],[272,473],[272,523],[226,524],]
		},
		{
			level: 4,
			name: 'it.',
			rect: [[287,374],[332,374],[330,415],[287,415],]
		},
		{
			level: 4,
			name: 'qw.',
			rect: [[346,375],[389,374],[389,416],[345,415],]
		},
		{
			level: 4,
			name: 'p1.',
			rect: [[403,375],[437,375],[437,410],[404,411],]
		},
		{
			level: 5,
			name: 'ir.',
			rect: [[618,92],[680,92],[679,302],[618,303],]
		},
		{
			level: 4,
			name: 'p1.',
			rect: [[467,394],[523,394],[522,456],[467,457],]
		},
		{
			level: 4,
			name: 'r.',
			rect: [[536,395],[573,394],[573,435],[535,435],]
		},
		{
			level: 4,
			name: 'q1.',
			rect: [[588,395],[620,395],[620,437],[588,438],]
		},
		{
			level: 4,
			name: 'oo.',
			rect: [[30,73],[368,72],[368,317],[29,316],]
		},
		{
			level: 5,
			name: 'bb.',
			rect: [[474,92],[543,92],[543,142],[472,142],]
		},
		{
			level: 5,
			name: 'o9.',
			rect: [[37,393],[79,392],[78,431],[35,431],]
		},
		{
			level: 6,
			name: 'g2.',
			rect: [[478,111],[523,111],[522,135],[479,137],]
		}
	]

	var liColor = ["#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c"]
	//"#f7fcf5", "#e5f5e0", 
	// var liColor = ["#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"]

	  // .style('display', function(d){
	  // 	if(d.level == 1)
	  // 		return 'block'
	  // 	return 'none'
	  // });

	var shadowColor1 = 'white'
	var shadow_width = 2;
	
	d3.select('#coversvg').selectAll('.treecoverrect_new')
	  .data(liRect)
	  .enter()
	  .append('rect')
	  .attr('class', 'treecoverrect_new')
	  .attr('level', function(d){
	  	return d['level']
	  })
	  .attr('width', function(d){
	  	console.log(' d ', d)
	  	return d['rect'][1][0] - d['rect'][0][0]
	  })
	  .attr('height', function(d){
	  	return d['rect'][2][1] - d['rect'][1][1]
	  })
	  .attr('x', function(d){
	  	return d['rect'][0][0]
	  })
	  .attr('y', function(d){
	  	return d['rect'][0][1]
	  })
	  .style('fill', function(d){
	  	return liColor[d.level]
	  })
	  .style('stroke', function(){
	  	return "black"//"#a6d854"//'black'
	  })
	  // .style('stroke-dasharray', '3 3')
	  .style('stroke-width', '2px')
	  .style('opacity', function(d){
	  	return 0.2
	  })
	  .style('display', function(d){
	  	return 'block'
	  })

	  //text
	  d3.select('#coversvg').selectAll('.treecovertext')
	  .data(liRect)
	  .enter()
	  .append('text')
	  .text(function(d){
	  	if(d.name != undefined)
	  		return d.name
	  	return 'A';
	  })
	  .attr('class', 'treecovertext')
	  .attr('level', function(d){
	  	return d['level']
	  })
	  .attr('x', function(d){
	  	return d['rect'][0][0] + 2.5
	  })
	  .attr('y', function(d){
	  	return d['rect'][0][1] + 12.5
	  })
	  .style('stroke', function(){
	  	return "#7a7575"//"#a6d854"//'black'
	  })
	  .style('font-size', '0.7em')
	  .style('display', function(d){
	  	return 'block'
	  	// if(d.level == 2)
	  	// 	return 'block'
	  	// return 'none'
	  })

 	  var coverG = d3.select('#coversvg')
	  .selectAll('.treecoverrect')
	  .data(liRect)
	  .enter()
	  .append('g')
	  .attr('class', 'treecoverrect')
	  .attr('level', function(d){
	  	return d.level;
	  })
	  .style('display', 'none')

	// coverG
	//   .append('line')
	//   .attr('x1', function(d){
	//   	return d['rect'][0][0]
	//   })
	//   .attr('x2', function(d){
	//   	return d['rect'][0][0]
	//   })
	//   .attr('y1', function(d){
	//   	return d['rect'][0][1]
	//   })
	//   .attr('y2', function(d){
	//   	return d['rect'][0][1] + d['rect'][2][1] - d['rect'][1][1]
	//   })
	//   .style('stroke', shadowColor1)
	//   .style('stroke-width', 3)

	// coverG
	//   .append('line')
	//   .attr('x1', function(d){
	//   	return d['rect'][0][0]
	//   })
	//   .attr('x2', function(d){
	//   	return d['rect'][0][0] + d['rect'][1][0] - d['rect'][0][0]
	//   })
	//   .attr('y1', function(d){
	//   	return d['rect'][0][1]
	//   })
	//   .attr('y2', function(d){
	//   	return d['rect'][0][1] 
	//   })
	//   .style('stroke', shadowColor1)
	//   .style('stroke-width', 3)

	coverG
	  .append('line')
	  .attr('x1', function(d){
	  	return d['rect'][0][0] + d['rect'][1][0] - d['rect'][0][0]
	  })
	  .attr('x2', function(d){
	  	return d['rect'][0][0] + d['rect'][1][0] - d['rect'][0][0]
	  })
	  .attr('y1', function(d){
	  	return d['rect'][0][1]
	  })
	  .attr('y2', function(d){
	  	return d['rect'][0][1] + d['rect'][2][1] - d['rect'][1][1]
	  })
	  .style('stroke', 'black')
	  .style('stroke-width', shadow_width)

	  coverG
	  .append('line')
	  .attr('x1', function(d){
	  	return d['rect'][0][0] 
	  })
	  .attr('x2', function(d){
	  	return d['rect'][0][0] + d['rect'][1][0] - d['rect'][0][0]
	  })
	  .attr('y1', function(d){
	  	return d['rect'][0][1] + d['rect'][2][1] - d['rect'][1][1]
	  })
	  .attr('y2', function(d){
	  	return d['rect'][0][1] + d['rect'][2][1] - d['rect'][1][1]
	  })
	  .style('stroke', 'black')
	  .style('stroke-width', shadow_width)

	// d3.select('#coversvg')
	//   .selectAll('.treecoverrect')
	  // .data(liRect)
	  // .enter()
	  	

	  var index = 0;
	  var stay = 0;
	  // var loopIndex = 12
	  var loopIndex = [1,2,3,4,5,6,5,4,3,2]
	  var liStay =    [6,5,4,4,4,6,4,4,4,5]

	  
	  setInterval(function(){

	  	var level = loopIndex[index]

	  	// console.log(" level ", level)
	  	// console.log(' level ', level);

	  	d3.selectAll('.treecoverrect')
	  	  .each(function(d){
	  	  	var level_temp = d3.select(this).attr('level')

	  	  	// d3.select(this).style('display', 'block')
	  	  	
	  	  	if(level == level_temp)
	  	  		d3.select(this).style('display', 'block')
	  	  	else
	  	  		d3.select(this).style('display', 'none')
	  	  	
	  	})

	  	  stay += 1
	  	  if(liStay[index] <= stay){
			index += 1
	  	  	stay = 0;
	  	  }

	  	if(index >= loopIndex.length){
	  		index = 0;
	  	}

	  }, 200)
	  
}