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
        if(point === "none")
        {
            var vPoint = document.getElementById("viewPoint");
            vPoint.setAttribute("position", "9.89187 11.41910 20.11090");
            vPoint.setAttribute("orientation", "-0.69262 0.71082 0.12256 0.61209");

            var vPlane = document.getElementById("planeId");
            vPlane.setAttribute("rotation", "1 0 0 1.571");
        }
        else if(point === "front")
        {
            var vPoint = document.getElementById("viewPoint");
            vPoint.setAttribute("position", "0 0 30");
            vPoint.setAttribute("orientation", "0 0 0 0");

            var vPlane = document.getElementById("planeId");
            vPlane.setAttribute("rotation", "1 0 0 0");
        }
        else if(point === "back")
        {
            var vPoint = document.getElementById("viewPoint");
            vPoint.setAttribute("position", "0 0 -30");
            vPoint.setAttribute("orientation", "0 1 0 3.142");

            var vPlane = document.getElementById("planeId");
            vPlane.setAttribute("rotation", "1 0 0 0");
        }
        else if(point === "right")
        {
            var vPoint = document.getElementById("viewPoint");
            vPoint.setAttribute("position", "30 0 0");
            vPoint.setAttribute("orientation", "0 1 0 1.571");

            var vPlane = document.getElementById("planeId");
            vPlane.setAttribute("rotation", "0 1 0 1.571");
        }
        else if(point === "left")
        {
            var vPoint = document.getElementById("viewPoint");
            vPoint.setAttribute("position", "-30 0 0");
            vPoint.setAttribute("orientation", "0 1 0 -1.571");

            var vPlane = document.getElementById("planeId");
            vPlane.setAttribute("rotation", "0 1 0 1.571");
        }
        else if(point === "top")
        {
            var vPoint = document.getElementById("viewPoint");
            vPoint.setAttribute("position", "0 30 0");
            vPoint.setAttribute("orientation", "1 0 0 -1.571");

            var vPlane = document.getElementById("planeId");
            vPlane.setAttribute("rotation", "1 0 0 1.571");
        }
        else if(point === "bottom")
        {		
            var vPoint = document.getElementById("viewPoint");
            vPoint.setAttribute("position", "0 -30 0");
            vPoint.setAttribute("orientation", "1 0 0 1.571");

            var vPlane = document.getElementById("planeId");
            vPlane.setAttribute("rotation", "1 0 0 1.571");
        }		
    };
    
    
    
    /*
     * This function removes the axis cross 
     * @returns (undefined)
     */
    this.removeAxis = function()
    {
    	
        if(document.getElementById("axis"))
    	{
            delete document.getElementById("axis").remove();
            document.getElementById("DeleteAxis").style.border="solid 1px gray";
    	}
    	else
    	{
            var t = document.createElement('Transform');
            t.setAttribute('id', 'axis');

            var innen = document.createElement('inline');
            innen.setAttribute('url', 'x3d/axis.x3d');	   
            t.appendChild(innen);

            var onOff = document.getElementById('onOff');
            onOff.appendChild(t);

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
    	
    	if(renderWert.getAttribute("render", 0) === "true")
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


