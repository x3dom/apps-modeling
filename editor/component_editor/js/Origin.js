/*
 * Origin class, inherits from TransformableObject.
 * This class encapsulates all data which is related to a new origin point.
 */
Origin.prototype = new TransformableObject();
Origin.prototype.constructor = Origin;
var origin = null;



/*
 * This function creates the origin by a singleton pattern
 * @returns {undefined}
 */
createSingletonOrigin = function(ui){
    
    var originElement = document.getElementById("origin_transform");
    
    if (origin === null){
        origin = new Origin(ui);
    }
    
    // visual feedback on button 
    if(ui.TBOrigin.highlighted) { 
        ui.TBOrigin.dehighlight();
        originElement.setAttribute("render", "false");
    } 
    else {
        ui.TBOrigin.highlight();
        originElement.setAttribute("render", "true");
    }
    
    
};



/*
 * This object sets a new origin for the component. If it is not set the origin
 * of the scene will be the origin of the final component
 * @returns {undefined}
 */
function Origin(ui){

}



/*
 * Returns the type of this element as string, for instance ("origin").
 */
Origin.prototype.getPrimType = function(){
    return "origin";
};
