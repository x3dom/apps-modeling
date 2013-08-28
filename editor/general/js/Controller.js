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
        //@todo: make sure to also "activate" the corresponding button
        //(since this function can also be triggered from the application:
        // dragging an object around automatically leads to translation mode)

        var currPrimID;

        HANDLING_MODE = mode;
        
        if (mode === "translation"){
            ui.TBHand.dehighlight();
            ui.TBTranslate.highlight();
            ui.TBScale.dehighlight();
            ui.TBRotate.dehighlight();
            ui.BBTransX.step(0.1);
            ui.BBTransY.step(0.1);
            ui.BBTransZ.step(0.1);
        }
        else if (mode === "scale"){
            ui.TBHand.dehighlight();
            ui.TBTranslate.dehighlight();
            ui.TBScale.highlight();
            ui.TBRotate.dehighlight();
            ui.BBTransX.step(0.1);
            ui.BBTransY.step(0.1);
            ui.BBTransZ.step(0.1);
        }
        else if (mode === "rotation"){
            ui.TBHand.dehighlight();
            ui.TBTranslate.dehighlight();
            ui.TBScale.dehighlight();
            ui.TBRotate.highlight();
            ui.BBTransX.step(1.0);
            ui.BBTransY.step(1.0);
            ui.BBTransZ.step(1.0);
        }
        else {
            ui.TBHand.highlight();
            ui.TBTranslate.dehighlight();
            ui.TBScale.dehighlight();
            ui.TBRotate.dehighlight();
        }

        currPrimID = primitiveManager.getCurrentPrimitiveID();

        if (currPrimID !== "")
        {
            primitiveManager.updateTransformUIFromPrimitive(currPrimID, HANDLING_MODE);
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
            runtime.showAll('negZ');
            break;
            case "back":
            runtime.showAll('posZ');
            break;
            case "right":
            runtime.showAll('negX');
            break;
            case "left":
            runtime.showAll('posX');
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
    	var plane = document.getElementById("planeId");
    	
    	if (plane.getAttribute("render") === "true")
    	{
            plane.setAttribute("render", "false");
            document.getElementById("DeletePlane").style.border="solid 1px gray";
    	}
    	else
    	{
            plane.setAttribute("render", "true");
            document.getElementById("DeletePlane").style.border="solid 1px #fff";
    	}
    };
}


