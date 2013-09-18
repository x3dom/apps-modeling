
/*
 * This function creates the origin by a singleton pattern
 * @returns {undefined}
 */
createSingletonOrigin = function(ui){
    if (origin === null){
        origin = new Origin();
    }
    
    // visual feedback on button 
    if(ui.TBOrigin.highlighted) { 
        ui.TBOrigin.dehighlight();
        origin.getDOMNode().setAttribute("render", "false");
    } 
    else {
        ui.TBOrigin.highlight();
        origin.getDOMNode().setAttribute("render", "true");
    }
};
