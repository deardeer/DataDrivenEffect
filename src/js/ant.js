// import dommanage from "./animatedommanager.js"
// import animateeditor from "./animateeditor.js"
// import animateenhancer from "./animateeditor.js"
// import functionhub from "./functionhub.js"
// import geodefiner from "./geometrydefiner.js"
// import geosaver from "./geometrysaver.js"

var AnimateDomManage = require("./animatedommanager.js");
var AnimateEditor = require("./animateeditor.js");
var AnimateEnhancer =  require("./animateenhancer.js");
var FunctionHub = require("./functionhub.js");
var GeometryDefiner = require("./geometrydefiner.js");
var GeometrySaver = require("./geometrysaver.js");


window.loadMa = function(filename, canvasid){

    d3.json(filename, function(error,data){
        if(error){
            console.log(error)
        }
        console.log("json",data)
        //marchingAnt3(data)
        console.log("loadcanvas", canvasid)
        if(canvasid == undefined){
            var canvas = document.createElement("canvas");
            canvas.width = 800
            canvas.height = 800
            canvas.id = "hhhcanvas"
            canvasid = canvas.id
            document.body.append(canvas)
        }
        if(canvasid != undefined){
            var canvas = document.getElementById(canvasid)
        }

        console.log("canvas",canvas)
        paper.setup(canvas)
        paper.install(window)

        this._functionHub = FunctionHub();

        var mapGroupIdMaList = data["magroups"]
        var drawPath = data["drawpath"]
        var liGroupId = Object.keys(mapGroupIdMaList)
        for(var i = 0; i < liGroupId.length; i++){
            var groupId = liGroupId[i]
            this._functionHub.addMAbyGroupInfo(mapGroupIdMaList[groupId], drawPath, canvasid)
        }

        this._functionHub._type = "animate"
        this._functionHub.initFunc()
    }) 
}

window.marchingAnt = function(Path, Ant, Interval, Gap, GroupId, Color){

    var canvas = document.getElementById('aecanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    paper.install(window);

    this._functionHub = FunctionHub();
    this._geometrySaver = new GeometrySaver(this);
    this._animateEditor = new AnimateEditor(this);
    this._animateEnhancer = new AnimateEnhancer();
    this._animateDomManager = new AnimateDomManager(this);

    this._liStoreMAIndex = []
    var malist = []
    var aeInfo = {}
    var malistpath = {"geotype":"area", "dots":Path}
    var malistant = {"geotype":"area", "dots":Ant} 
    malist.push({"path": malistpath, "ant": malistant})
    aeInfo["ae"] = "MA"
    aeInfo["antcolor"] = Color
    aeInfo["antgap"] = Gap
    aeInfo["antinterval"] = Interval
    aeInfo["groupid"] = GroupId ;
    console.log("malist:", malist);
    console.log("aeInfo", aeInfo) ;

    if(malist != undefined){
        var liGeometryType = ['path','ant','boundary'];
        //todo-clear original
        // for(var index in mapIndexMA){
        for(var j = 0; j < malist.length; j ++){
            var ma = malist[j];
            //geometry
            for(var p = 0; p < liGeometryType.length; p ++){
                var type = liGeometryType[p];
                console.log("ma",ma)
                console.log("type",type)
                console.log("ma[type]",ma[type])
                if(ma[type] != undefined){
                    console.log(' create geo ', ma[type]['dots']);
                    this._geometrySaver.saveGeometryNew({'type': type, 'geotype': ma[type]['geoType']}, ma[type]['dots']);
                }   
            }
            //mainfo
            var MAGeometryInfo = this._geometrySaver.getCurrentMAGeometry();
            console.log(" MAGeometryInfo ", MAGeometryInfo, aeInfo);
            var MAGeometryIndex = this._geometrySaver.addMAGeometry(MAGeometryInfo);
            this._liStoreMAIndex.push(MAGeometryIndex);
            var animateResult = this._animateEnhancer.activateDOM(MAGeometryInfo, aeInfo);
            var metainfo = animateResult['metainfo'];
            console.log("metainfo", metainfo)
            //clear current MAGeometry
            //not exist before
            //this._geometrySaver.clearCurrentMAGeometry();
            this._animateDomManager.addMetaInfo(MAGeometryIndex, metainfo)
            this._animateEditor.addMADoms(MAGeometryIndex, metainfo); 
            this._functionHub._type = 'animate'
            this._functionHub.initFunc()  
        }
    }

}
