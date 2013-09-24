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
                ui.BBTransMode.set("Translation:");
                ui.BBTX.set("Tx");
                ui.BBTY.set("Ty");
                ui.BBTZ.set("Tz");
                ui.BBTransX.min(null);
                ui.BBTransY.min(null);
                ui.BBTransZ.min(null);
            }
            else if (mode === "scale"){
                ui.TBHand.dehighlight();
                ui.TBTranslate.dehighlight();
                ui.TBScale.highlight();
                ui.TBRotate.dehighlight();
                ui.BBTransX.step(0.1);
                ui.BBTransY.step(0.1);
                ui.BBTransZ.step(0.1);
                ui.BBTransMode.set("Scale:");
                ui.BBTX.set("Sx");
                ui.BBTY.set("Sy");
                ui.BBTZ.set("Sz");
                ui.BBTransX.min(0.0);
                ui.BBTransY.min(0.0);
                ui.BBTransZ.min(0.0);
            }
            else if (mode === "rotation"){
                ui.TBHand.dehighlight();
                ui.TBTranslate.dehighlight();
                ui.TBScale.dehighlight();
                ui.TBRotate.highlight();
                ui.BBTransX.step(1.0);
                ui.BBTransY.step(1.0);
                ui.BBTransZ.step(1.0);
                ui.BBTransMode.set("Rotation:");
                ui.BBTX.set("Rx");
                ui.BBTY.set("Ry");
                ui.BBTZ.set("Rz");
                ui.BBTransX.min(null);
                ui.BBTransY.min(null);
                ui.BBTransZ.min(null);
            }
            else {
                ui.TBHand.highlight();
                ui.TBTranslate.dehighlight();
                ui.TBScale.dehighlight();
                ui.TBRotate.dehighlight();
                ui.BBTransMode.set("");
                ui.BBTX.set("X");
                ui.BBTY.set("Y");
                ui.BBTZ.set("Z");
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
                document.getElementById("depthMode").setAttribute("readOnly", "true");
                break;
            case "back":
                document.getElementById("orthoViewPointBack").setAttribute('set_bind','true');
                runtime.noNav();
                document.getElementById("planeId").setAttribute("rotation", "1 0 0 0");
                document.getElementById("depthMode").setAttribute("readOnly", "true");
                break;
            case "right":
                document.getElementById("orthoViewPointRight").setAttribute('set_bind','true');
                runtime.noNav();
                document.getElementById("planeId").setAttribute("rotation", "0 1 0 1.57079632679");
                document.getElementById("depthMode").setAttribute("readOnly", "true");
                break;
            case "left":
                document.getElementById("orthoViewPointLeft").setAttribute('set_bind','true');
                runtime.noNav();
                document.getElementById("planeId").setAttribute("rotation", "0 1 0 1.57079632679");
                document.getElementById("depthMode").setAttribute("readOnly", "true");
                break;
            case "top":
                document.getElementById("orthoViewPointTop").setAttribute('set_bind','true');
                runtime.noNav();
                document.getElementById("planeId").setAttribute("rotation", "1 0 0 -1.57079632679");
                document.getElementById("depthMode").setAttribute("readOnly", "true");
                break;
            case "bottom":
                document.getElementById("orthoViewPointBottom").setAttribute('set_bind','true');
                runtime.noNav();
                document.getElementById("planeId").setAttribute("rotation", "1 0 0 -1.57079632679");
                document.getElementById("depthMode").setAttribute("readOnly", "true");
                break;
            case "all":
                document.getElementById("viewPoint").setAttribute('set_bind','true');
                runtime.showObject(document.getElementById("root"));
                //runtime.showAll('negZ');
                runtime.examine();
                document.getElementById("planeId").setAttribute("rotation", "1 0 0 -1.57079632679");
                document.getElementById("depthMode").setAttribute("readOnly", "false");
                break;
            case "free":
                document.getElementById("viewPoint").setAttribute('set_bind','true');
                runtime.examine();
                document.getElementById("planeId").setAttribute("rotation", "1 0 0 -1.57079632679");
                document.getElementById("depthMode").setAttribute("readOnly", "false");
                break;
        }
    };
    
    
    
    /*
     * This function removes the axis cross 
     * @returns (undefined)
     */
    this.removeAxis = function()
    {
        var grid = document.getElementById("axis");
    	
        if(ui.TBGrid.highlighted)
    	{
            grid.setAttribute("render", "false");
            ui.TBGrid.dehighlight();
    	}
    	else
    	{
            grid.setAttribute("render", "true");
            ui.TBGrid.highlight();
    	}    	
    };
    
    
    
    /*
     * This function removes the orientation plane
     * @returns (undefined)
     */
    this.removePlane = function()
    {
    	var plane = document.getElementById("planeId");
    	
    	if (ui.TBPlane.highlighted)
    	{
            plane.setAttribute("render", "false");
            ui.TBPlane.dehighlight();
    	}
    	else
    	{
            plane.setAttribute("render", "true");
            ui.TBPlane.highlight();
    	}
    };
    
    
    
    this.snapPrimitiveToGrid = function(){
        var snapToGridButton = document.getElementById("ButtonSnapToGrid");
    	
    	if (ui.TBSnapToGrid.highlighted)
    	{
            snapToGridButton.setAttribute("render", "false");
            ui.TBSnapToGrid.dehighlight();
            ui.TBSnapToGrid.setImage("images/snapGrid_off.png");
    	}
    	else
    	{
            snapToGridButton.setAttribute("render", "true");
            ui.TBSnapToGrid.highlight();
            ui.TBSnapToGrid.setImage("images/snapGrid_on.png");
    	}

        primitiveManager.updateGridSize(this.getGridSize());
    };
    
    
    
    this.highlightSnapPrimitves = function() {
        if (ui.TBSnap.highlighted){
            ui.TBSnap.setImage("./images/magnet_off.png");
            ui.TBSnap.dehighlight();
        }
        else {
            ui.TBSnap.setImage("./images/magnet_on.png");
            ui.TBSnap.highlight();
        }
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



    this.drag = function(event) {
        if (event.dataTransfer) {
            var name = event.target.id;
            if (name.indexOf("_") >= 0)
                name = name.substring(name.indexOf("_") + 1);

            event.dataTransfer.setData("Text", name);
        }
    };

    this.drop = function(event) {
        event.preventDefault();

        if (event.dataTransfer) {
            var data = event.dataTransfer.getData("Text");
            //event.target.appendChild(document.getElementById(data));
            //console.log(data);
            if (!data)
                return true;

            var runtime = document.getElementById("x3d").runtime;

            // get ray from eye through mouse position and calc dist to ground plane
            var ray = runtime.getViewingRay(event.layerX, event.layerY);
            var len = 100;

            // if ray not parallel to plane and reasonably near then use d
            if (Math.abs(ray.dir.y) > x3dom.fields.Eps) {
                var d = -ray.pos.y / ray.dir.y;
                len = (d < len) ? d : len;
            }

            var pos = ray.pos.add(ray.dir.multiply(len));

            if (data == "Extrusion" || data == "Solid of Revolution") {
                ui.editor2D_show( (data == "Extrusion") );
                ui.setPrimitiveTypeNameAndPos(data, pos);
            }
            else {
                var obj = primitiveManager.addPrimitive(
                       ui.primitiveParameterMap[data].x3domName,
                       ui.primitiveParameterMap[data].parameters);

                if (obj) {
                    obj.setTranslationAsVec(pos);
                    primitiveManager.selectObject(obj.getID());
                }
            }
        }

        event.stopPropagation();
        event.returnValue = false;
        return false;
    };

    this.allowDrop = function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.returnValue = false;
        return false;
    };
}
