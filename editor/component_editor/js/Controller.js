/*
 * The Controller component handles all program specific actions, like activation
 * and deactivation of plane and axis, definition of viewpoint and transformation
 * control etc...
 * @returns {Controller}
 */
function Controller(ui){
    
    // IntervalID for automatically saving mode
    var saveInterval = null;
    
    
    /*
     * Activates the specified transformation mode 
     * @param {string} mode transformation mode (translation, scale, rotation, hand)
     * @returns {Null}
     */
    this.Activate = function(mode){
        if (HANDLING_MODE !== mode){

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

        }
    };
    
    
    var currentViewPoint = "perspective";
    
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
                document.getElementById("orthoViewPointFront").setAttribute('set_bind','true');
                runtime.noNav();
                document.getElementById("planeId").setAttribute("rotation", "1 0 0 0");
                break;
            case "back":
                document.getElementById("orthoViewPointBack").setAttribute('set_bind','true');
                runtime.noNav();
                document.getElementById("planeId").setAttribute("rotation", "1 0 0 0");
                break;
            case "right":
                document.getElementById("orthoViewPointRight").setAttribute('set_bind','true');
                runtime.noNav();
                document.getElementById("planeId").setAttribute("rotation", "0 1 0 1.57079632679");
                break;
            case "left":
                document.getElementById("orthoViewPointLeft").setAttribute('set_bind','true');
                runtime.noNav();
                document.getElementById("planeId").setAttribute("rotation", "0 1 0 1.57079632679");
                break;
            case "top":
                document.getElementById("orthoViewPointTop").setAttribute('set_bind','true');
                runtime.noNav();
                document.getElementById("planeId").setAttribute("rotation", "1 0 0 -1.57079632679");
                break;
            case "bottom":
                document.getElementById("orthoViewPointBottom").setAttribute('set_bind','true');
                runtime.noNav();
                document.getElementById("planeId").setAttribute("rotation", "1 0 0 -1.57079632679");
                break;
            case "all":
                document.getElementById("viewPoint").setAttribute('set_bind','true');
                runtime.showObject(document.getElementById("root"));
                //runtime.showAll('negZ');
                runtime.examine();
                document.getElementById("planeId").setAttribute("rotation", "1 0 0 -1.57079632679");
                break;
            case "free":
                document.getElementById("viewPoint").setAttribute('set_bind','true');
                runtime.examine();
                document.getElementById("planeId").setAttribute("rotation", "1 0 0 -1.57079632679");
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
    
    
    
    this.snapPrimitiveToGrid = function(){
        var snapToGridButton = document.getElementById("ButtonSnapToGrid");
    	
    	if (snapToGridButton.getAttribute("render") === "true")
    	{
            snapToGridButton.setAttribute("render", "false");
            snapToGridButton.style.border="solid 1px gray";
            snapToGridButton.src="images/snapGrid_off.png";
    	}
    	else
    	{
            snapToGridButton.setAttribute("render", "true");
            snapToGridButton.style.border="solid 1px #fff";
            snapToGridButton.src="images/snapGrid_on.png";
    	}

        primitiveManager.updateGridSize(this.getGridSize());
    };


    /*
     * Gets grid size or 0 if no snapping
     */
    this.getGridSize = function()
    {
        var snapToGrid = (document.getElementById("ButtonSnapToGrid").getAttribute("render") === "true");
        // TODO: what about user-definable grid size?
        // But perhaps requires dynamic adaptions of grid plane...
        return (snapToGrid == true) ? 0.5 : 0;
    };
    
    
    
    /*
     * Toggles the auto save mode. If on the scene will be automatically saved
     * every given seconds
     * @param {number} seconds saving interval
     * @returns {Null}
     */
    this.autoSave = function(seconds){
        if (ui.TBAutoSave.highlighted){ 
            ui.TBAutoSave.dehighlight();
            ui.TBAutoSave.setImage("images/autoSave_off.png");
            clearInterval(saveInterval);
        }
        else {
            ui.TBAutoSave.highlight();
            ui.TBAutoSave.setImage("images/autoSave_on.png");
            saveInterval = setInterval(saveScene, (seconds * 1000));
        }
    };
    
    
    
    /*
     * Saves the scene 
     * @returns {Null}
     */
    function saveScene(){
        alert("saving scene");
    }
}
