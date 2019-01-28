var loop = false; 

GA_Loop = function(){
    loop = true;
}

gradualAppearance = function(Visual_proxy, Offset, Repetition, Speed){

    var highlightcolor = "black"
    var index = 0
    var repetitionflag = 0
    var proxy_clone = Visual_proxy.select(function(){
        return this.parentNode.insertBefore(this.cloneNode(1), this.nextSibling)
    })
        .style("fill", "none");

    intervalhandler = setInterval(function(){
        proxy_clone
            .attr("class", "clonenode") 
            .style("stroke", function(d){
                if(Offset > 0){
                    if(index < Offset)
                        return "none";
                    else{
                        repetitionflag += 1
                        return highlightcolor;
                    }
                }
                else if(Offset <= 0){
                    return "none";
                }       
            })
    
            index += 1;

            if(repetitionflag >= Repetition+1){
                proxy_clone
                    .style("stroke", "none")
                // clearInterval(intervalhandler)
                if(loop == true){
                  repetitionflag = 0
                  index = 0
                }
            }
    }, Speed * 1000)
}