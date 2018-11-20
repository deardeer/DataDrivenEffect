function setRadialGradient(defs, radialGradientID, liPerColor){
    var radialGradient = defs
        .append("radialGradient")
        .attr("id", radialGradientID);

    for (var i = 0; i < liPerColor.length; i ++) {
        var offset = liPerColor[i]['offset']
        var color = liPerColor[i]['stop-color']
        radialGradient.append('stop')
        .attr('offset', offset)
        .attr('stop-color', color);
    }; 
}