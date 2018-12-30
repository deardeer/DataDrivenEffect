# Dynamic Effects

This repository provides the Source Code for the three Dynamic Effects in [Activating Chart Project](https://vizgroup.github.io/activateviz/)

- [Marching Ants](#marching-ants)

- [Geometric Deformation](#geometric-deformation)

- [Gradual Appearance](#gradual-appearance)

*File Structure*

	- lib: //the 3rd party library
	- src: //core codes 
	- examples: //to demonstrate the usage of API
	- API.md //API document
	

## Marching Ants


#####  <span style="color:blue">marchingAnt ([Path], [Ant], Interval, Gap, Shape [,Groupid, Color]) </span>
Constructs a new effect of Ant with the settings. 

[A demo is given in ./example/ma_basic1.js]

###### Parameters
- The Path is an array of dots composed of the path that the ant marches defined by users, for instance, using a line represent the path of ant marching

	  e.g.,
	  Path = [[x1, y1], [x2, y2], ...], where [x_i, y_i] is the dot position
  
- The Ant is an array of dots which compose the shape (visual proxity) of ant defined by users
	
	  e.g.,
	  Ant = [[x1,y1], [x2,y2], [x3,y3]], where ant is marching with a shape of a triangle, the Ant is the array of dots of triangle. 

- The Interval is the speed that the ant marches, its value is in the range[10, 30], the smaller the Interval is, the faster the ant marches. 



- The Gap is the distance between every two ants, its value is in the range[10，30], the bigger the Gap is, the sparser ants are from each other. 


- If Color is specifying, it represents the color of ant. 


 	 e.g., Color = "#aabbcc"

- The Groupid represents the groups of ants in common fate. That is, if two or more ants are the same Groupid, the Interval or Gap of these ants will change simutanouesly when modifying the Interval or Gap. 

##### <span style="color:blue"> loadMA (fileName [, canvasId]) </span>
Constructs a new effect of Ant on the basis of the content in JSON file user defined.

[A demo is given in ./example/ma_basic2.js]

###### Parameters
- fileName: the JSON file which configures the information of ants you want to load. 

	e.g., fileName = "circos.json"

	Below is the content of JSON file.

    
	    {
	        "_id" : 1, "name":"circos"
	        "magroups" : {
	            "orange" : {
	                "mainfo" : {
	                    "ae" : "MA",
	                    "antcolor" : "#521225",
	                    "antshape" : "self-defined",
	                    "groupid" : "orange",
	                    "antgap" : 40,
	                    "antinterval" : 5
	                },
	                "malist" : [ 
	                    {
	                        "path" : {
	                            "geotype" : "polyline",
	                            "dots" : [ 
	                                [693,254], 
	                                [670,263], 
	                                [645,267], 
	                                [626,270], 
	                            ]
	                        },
	                        "ant" : {
	                            "dots" : [ 
	                                [717.721943014525,302.207587672443], 
	                                [703.709071225713,294.883693610518], 
	                                [684.058857780444,278.547564584479],
	                            ]
	                        },
	                        "boundary" : {
	                            "geotype" : "area",
	                            "dots" : [ 
	                                [677,218], 
	                                [658,228], 
	                                [634,244], 
	                                [620,248], 
	                            ]
	                        }
	                    }]
	            }}
	    }

  
	where "name" represents the name of the effect, "magroups" holds multiple Marching Ants effects. Each one is indexed by a unique id (e.g., "orange" here), and two decriptive information "mainfo" and "malist". "mainfo" stored the non-geometric information of the ant, such as color, groupid, gap. "malist" defines the geometry information, i.e., "path", "ant" and "boundary".


- canvasId: the id of the canvas on which Dynamic Effect to be rendered. If canvas is undefined, a 800x800 canvas will be created.

	e.g., canvasId = "aecanvas"


## Geometric Deformation


<a names="ga"/>
## Gradual Appearance
