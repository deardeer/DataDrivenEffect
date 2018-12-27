# Dynamic Effects

This repository provides the Source Code for the three Dynamic Effects in [Activating Chart Project] (https://vizgroup.github.io/activateviz/)

[Marching Ants](#ma)

[Geometric Deformation](#gd)

[Gradual Appearance](#ga)


<a name="ma"/>
## Marching Ants


##### marchingAnt([Path], [Ant], Interval, Gap, Shape[,Groupid, Color])
Constructs a new effect of Ant with the settings.
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

##### loadMA(JsonFilename[,canvasId])
Constructs a new effect of Ant on the basis of the content in JSON file user defined.
###### Parameters
- The JsonFilename is the file which contains the information of ants you want to load. 

	e.g., JsonFilename = "circos.json"

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

  
	"name" represents the name of the effect, "magroups" contains the information of ant. In "magroups", "orange" represents the groupid of the this part of ant which consists of "mainfo" and "malist". "mainfo" stored the information of the ant, such as color, shape, groupid, gap. "malist" consists of "path", "ant" and "boundary". "path", "ant" and "boundary" present aspectively the path, itself and the boundary of the effect.



- If you create the canvas, please set the id of the canvas you create as the canvasId, the effect of the ant will render on the canvas you create. If you don't create canvas which means you don't specify canvasId or the canvasId you input is undefined, the function will create a 800x800 canvas and the effect of ant will render on this canvas.

	e.g., canvasId = "aecanvas"

<a names="gd"/>
##Geometric Deformation


<a names="ga"/>
##Gradual Appearance
