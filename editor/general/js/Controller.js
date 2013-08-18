/*
 * The Controller component handles all program specific actions, like activation
 * and deactivation of plane and axis, definition of viewpoint and transformation
 * control etc...
 * @returns {Controller}
 */
function Controller(ui){
    
    /*
     * Activates the specified transformation mode 
     * @param {string} mode transformation mode (translation, scale, rotation, hand)
     * @returns {Null}
     */
    this.Activate = function(mode){
        
        HANDLING_MODE = mode;
        
        if (mode === "translation"){
            ui.TBHand.dehighlight();
            ui.TBTranslate.highlight();
            ui.TBScale.dehighlight();
            ui.TBRotate.dehighlight();
        }
        else if (mode === "scale"){
            ui.TBHand.dehighlight();
            ui.TBTranslate.dehighlight();
            ui.TBScale.highlight();
            ui.TBRotate.dehighlight();
        }
        else if (mode === "rotation"){
            ui.TBHand.dehighlight();
            ui.TBTranslate.dehighlight();
            ui.TBScale.dehighlight();
            ui.TBRotate.highlight();
        }
        else {
            ui.TBHand.highlight();
            ui.TBTranslate.dehighlight();
            ui.TBScale.dehighlight();
            ui.TBRotate.dehighlight();
        }
    };
    
    
    
    /*
     * Sets the specified view point in the editor
     * @param {string} viewpoint name of the viewpoint that should be displayed
     * @returns {Null}
     */
    this.setViewpoint = function(point)
    {
        var runtime = document.getElementById("x3d").runtime;

        switch(point) {
            case "front":
            runtime.showAll('negX');
            break;
            case "back":
            runtime.showAll('posX');
            break;
            case "right":
            runtime.showAll('negZ');
            break;
            case "left":
            runtime.showAll('posZ');
            break;
            case "top":
            runtime.showAll('negY');
            break;
            case "bottom":
            runtime.showAll('posY');
            break;
            case "upright":
            runtime.uprightView();
            break;
            case "all":
            runtime.showAll('negZ');
            break;
            case "reset":
            runtime.resetView();
            break;
        }
    };
    
    
    
    /*
     * This function removes the axis cross 
     * @returns (undefined)
     */
    this.removeAxis = function()
    {
    	var coordSys = document.getElementById('axis');	
    	var render = (coordSys.getAttribute("render") === "true");
    	
        if(render)
    	{
            coordSys.setAttribute("render", "false");
            document.getElementById("DeleteAxis").style.border="solid 1px gray";
    	}
    	else
    	{
            coordSys.setAttribute("render", "true");
            document.getElementById("DeleteAxis").style.border="solid 1px #fff";
    	}    	
    };
    
    
    
    /*
     * This function removes the orientation plane
     * @returns (undefined)
     */
    this.removePlane = function()
    {
    	var renderWert = document.getElementById("plane");
    	
    	if(renderWert.getAttribute("render") === "true")
    	{
            renderWert.setAttribute("render", "false");
            document.getElementById("DeletePlane").style.border="solid 1px gray";
    	}
    	else
    	{
            renderWert.setAttribute("render", "true");
            document.getElementById("DeletePlane").style.border="solid 1px #fff";
    	}
    };
}


