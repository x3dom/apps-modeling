//@todo: there is currently no method to query key states in X3DOM (?)
var keyPressed={};

document.onkeydown=function(e){
    e = e || window.event;
    keyPressed[e.keyCode] = true;
};

document.onkeyup=function(e){
    e = e || window.event;
    keyPressed[e.keyCode] = false;
};


/*
 * The PrimitiveManager component handles all the behaviour of all 
 * added primitives of the workspace
 * @returns {PrimitiveManager}
 */
function PrimitiveManager(){
    
    // List of all created primitives
    var primitiveList = [];
    // actually active id
    var currentPrimitiveID = "";
    // list of all selected primitives (including the first selected one)
    var selectedPrimitiveIDs = [];
    // count of all primitives that were created during this session
    var primCounter = 0;
    // count of actually used primitives on workspace 
    var primitiveCounter = 0;
    // ui element to get access to the gui elements
    var ui = {};
    // toggle for bounding volume highlighting
    var boundingVolumeHighlighting = true;
    // toggle for primitive highlighting
    var primitiveHighlighting = true;
    // reference to this object
    var that = this;
    
    /*
     * Adds a new primitive to the working area and stores its reference
     * @param {UI} uiElement ui element that handles the access to gui elements
     * @returns {Null}
     */
    this.setUI = function(uiElement){
        ui = uiElement;
    };
    
    
    
    /*
     * Adds a new primitive to the working area and stores its reference
     * @param {type} primitive name of the primitive that should be created
     * @returns {Boolean}
     */
    this.addPrimitive = function(primitive, parameters){
   
        if (HANDLING_MODE === "hand")
            controller.Activate("translation");
   
        var id = "primitive_" + primCounter;
        primCounter++;
        
        var s = document.createElement('Shape');

        var t = document.createElement('Transform');
        t.setAttribute("id", id);
        t.setAttribute("translation", "0 0 0");
        t.setAttribute("scale", "1 1 1");

        t.IDMap = {id:id, shapeID:s.id, name:id, cboxNumber:(primitiveCounter + 1)};

        t.Parameters = [];
        // deep copy of parameters
        for (var k=0; k<parameters.length; k++) {
            var aParam = {};
            for (var partType in parameters[k]) {
                aParam[partType] = parameters[k][partType];
            }
            t.Parameters.push(aParam);
        }

        var mt = document.createElement('MatrixTransform');
        mt.setAttribute("id", 'mt_' + id);
        mt.Transformation = { rotationX : 0, rotationY : 0, rotationZ : 0 };
        var transformString = matrixToString(x3dom.fields.SFMatrix4f.identity());
        mt.setAttribute("matrix", transformString);

        // Appearance Node
        var app = document.createElement('Appearance');

        // Material Node
        var mat = document.createElement('Material');
        mat.setAttribute("diffuseColor", "#3F7EBD");
        mat.setAttribute("specularColor", "#2A2A2A");
        mat.setAttribute("emissiveColor", "#000000");
        mat.setAttribute("transparency", "0.0");
        mat.setAttribute("shininess", "0.2");
        t.Material = mat;

        app.appendChild(mat);
        s.appendChild(app);
        mt.appendChild(s);

        var prim = document.createElement(primitive);
        
        setDefaultParameters(prim, parameters);
        
        s.appendChild(prim);
        t.Parameters.Primitive = prim;
        t.Shape = s;

        var root = document.getElementById('root');
        t.appendChild(mt);
        root.appendChild(t);
        
        // wrapper for adding moving functionality, last param is callback function
        new x3dom.Moveable(document.getElementById("x3d"), t, notified);
        
        primitiveList[id] = t;
        primitiveList[id].addEventListener("mousedown", function(){primitiveSelected(id);}, false);
        setTransformValues(id, HANDLING_MODE);

        primitiveCounter++;
        selectedPrimitiveIDs = [];

        that.selectCurrentPrimitive(id);
        ui.treeViewer.addPrimitive(id, id);
    };
    
    

    /*
     * Selects the primitive and is triggered from outside
     * @param {string} id name of the primitive that should be selected
     * @returns {null}
     */
    this.selectPrimitive = function(id){
        if (HANDLING_MODE === "hand")
            controller.Activate("translation");
        currentPrimitiveID = id;
        that.highlight(id, true);
        ui.clearParameters();
        ui.createParameters(primitiveList[id].Parameters);
        ui.setMaterial(primitiveList[id].Material);
        that.setTransformationValues();
    };



    /*
     * Selects the primitive with the given ID as the current primitive, meaning that this is the primitive
     * which is affected by transformations and which can be inspected with the UI
     */
    this.selectCurrentPrimitive = function(id){
        if (selectedPrimitiveIDs.indexOf(id) === -1)
        {
            currentPrimitiveID = id;
            that.highlight(id, true);
            selectedPrimitiveIDs = [id];

            ui.clearParameters();
            ui.createParameters(primitiveList[id].Parameters);
            ui.setMaterial(primitiveList[id].Material);
        }
    };



    /*
     * Callback for handling movement values on mouse interaction
     * @param {X3DNode} the interacting element
     * @param {SFVec3f} new translation value
     */
    function notified(elem, pos) {
        var id = elem.getAttribute('id');
        that.highlight(id, true);
        
        // update GUI elements appropriately
        if (HANDLING_MODE === "translation" && id === currentPrimitiveID) {
            ui.BBTransX.set(pos.x.toFixed(3));
            ui.BBTransY.set(pos.y.toFixed(3));
            ui.BBTransZ.set(pos.z.toFixed(3));
        }
    }
    
    
    
    /*
     * Sets the default values of a new primitive to the propertie fields of the
     * right bars accordion
     * @param {Primitive} primitive the primitive where the default values should be set
     * @param {Parameters} parameters the parameters that should be set to primitive as default
     * @returns (undefined)
     */
    function setDefaultParameters(primitive, parameters){
        for (var i = 0; i < parameters.length; i++){
            primitive.setAttribute(parameters[i].x3domName, (parameters[i].type === "angle") ? 
                (parameters[i].value * Math.PI / 180).toString() : parameters[i].value);
        }
    }
    
    
    
    /*
     * Creates a string from SFMatrix4f that can be set on MatrixTransform
     * @param {SFMatrix4f} transformMat matrix that should be converted to a string
     * @returns (undefined)
     */
    function matrixToString(transformMat){
        return transformMat.toGL().toString();
    }
    
    
    
    /* 
     * Removes a primitive from the DOM and from primitive array
     * @returns {undefined}
     */  
    this.removeNode = function(force)
    {
        if (currentPrimitiveID !== null || force) {
            var ot = document.getElementById(currentPrimitiveID);
            
            if (ot._iMove) {
                ot._iMove.detachHandlers();
            }

            for (var i = 0; i < ot.childNodes.length; i++) 
            {
                // check if we have a real X3DOM Node; not just e.g. a Text-tag
                if (ot.childNodes[i].nodeType === Node.ELEMENT_NODE) 
                { 
                    ot.removeChild(ot.childNodes[i]);
                    ui.treeViewer.removeNode(currentPrimitiveID);
                    delete primitiveList[currentPrimitiveID];

                    clearTransformValues();
                    primitiveCounter--;
                }
            }
        }
    };


    /*
     * Removes all primitives from the DOM and from primitive array
     */
    this.removeAllNodes = function()
    {
        for (var key in primitiveList) {
            if (primitiveList[key]) {
                currentPrimitiveID = key;
                this.removeNode(true);
            }
        }

        primitiveList = [];
        currentPrimitiveID = "";
        primitiveCounter = 0;
    };
    
    
    
    /*
     * Changes the material of a primitive 
     * @param {elementid} element the id of the textfield with the color
     * @returns (undefined)
     */
    this.changePrimitiveMaterial = function(element){
        var rgb = document.getElementById(element).value;
        highlightPrimitive(null, false);
        if (element === "diffuse" || element === "specular" || element === "emissive") {
            primitiveList[currentPrimitiveID].Material.setAttribute(element+'Color', rgb);
        }
        if(element === "transparency" || element === "shininess") {
            primitiveList[currentPrimitiveID].Material.setAttribute(element, rgb);
        }
    };
    
    
    
    /*
     * Clears the value fields of the transformation
     * @returns {undefined}
     */
    this.clearTransformationValues = function(){
        clearTransformValues();
    };
    
    
    
    /*
     * Clears the value fields of the transformation
     * @returns {undefined}
     */
    function clearTransformValues(){
        ui.BBTransX.set("");
        ui.BBTransX.disable(true);
        ui.BBTransY.set("");
        ui.BBTransY.disable(true);
        ui.BBTransZ.set("");
        ui.BBTransZ.disable(true);
        ui.BBPrimName.set("");
        ui.BBPrimName.disable(true);
        ui.BBTransformMode.set("");
        ui.BBDelete.disable(true);
        ui.RBAccordion.disable(true);

        that.highlight(null, false);
    }

    

    /*
     * Will be called if a primitive is picked and should
     * set the values of translation, rotation or scaling
     * @param {type} id name of the primitive's values that should be set
     * @returns {null}
     */
    function primitiveSelected(id){
        ui.treeViewer.activate(id);
        
        if (typeof id !== 'undefined')
        {
            //if nothing is selected, use this as the primary primitive (which gets transformed etc.)
            if (currentPrimitiveID === "" || !keyPressed[16])
            {
                that.selectCurrentPrimitive(id);

                if (HANDLING_MODE === "hand")
                    controller.Activate("translation");
                setTransformValues(id, HANDLING_MODE);
            }
            //if there is already a selected object and SHIFT is pressed, add object to selection
            else if (keyPressed[16])
            {
                if (selectedPrimitiveIDs.indexOf(id) === -1)
                {
                    selectedPrimitiveIDs.push(id);

                    //primitiveList[id].highlight(false, "1 1 0");
                    //primitiveList[id].highlight(true,  "1 0.5 0");
                }
            }
            //@todo: debug
            console.log(selectedPrimitiveIDs.length);
        }
        else
        {
            x3dom.debug.logError("primitiveSelected: ID must be specified.");
        }
    }
    
    
    
    /*
     * Sets the bounding volume parameters for highlighting
     * @param {string} id primitive id of primitiveList that should be highlighted
     * @param {bool} bool false if all should be dehighlighted
     * @returns (undefined)
     */
    function highlightBoundingVolume(id, bool){  
        var transform = document.getElementById('cpnt_transform');
        var matrixTransform = document.getElementById('cpnt_matrixTransform');

        if (id !== null) {
            transform.setAttribute("translation", primitiveList[id].getAttribute("translation"));
            transform.setAttribute("scale", primitiveList[id].getAttribute("scale"));
            matrixTransform.setAttribute("matrix", primitiveList[id].children[0].getAttribute("matrix"));

            var volume = primitiveList[id].Parameters.Primitive._x3domNode.getVolume();

            var min = x3dom.fields.SFVec3f.parse(volume.min);
            var max = x3dom.fields.SFVec3f.parse(volume.max);
            if (max.subtract(min).length < x3dom.fields.Eps){
                min.x = -1; min.y = -1; min.z = -1;
                max.x = 1; max.y = 1; max.z = 1;
            }

            var box = document.getElementById('cpnt');
            box.setAttribute('point', min.x+' '+min.y+' '+min.z+', '+
                                      min.x+' '+min.y+' '+max.z+', '+
                                      max.x+' '+min.y+' '+max.z+', '+
                                      max.x+' '+min.y+' '+min.z+', '+
                                      min.x+' '+max.y+' '+min.z+', '+
                                      min.x+' '+max.y+' '+max.z+', '+
                                      max.x+' '+max.y+' '+max.z+', '+
                                      max.x+' '+max.y+' '+min.z );
        }

        transform.setAttribute("render", ""+bool);
    }
    
    
    
    /*
     * Highlights the actually selected (primary) primitive
     * @param {type} highlightOn false if all should be dehighlighted
     * @returns {null}
     */
    function highlightPrimitive(id, highlightOn){
        for (var key in primitiveList) {
            if (primitiveList[key]) {
                primitiveList[key].highlight(false, "1 1 0");
            }
        }
        if (highlightOn && primitiveList[currentPrimitiveID]) {
           //  TODO; shall depend on user preference (highlight/bbox checkboxes)
           primitiveList[currentPrimitiveID].highlight(true, "1 1 0");
        }
    }
    
    
    
     
    /*
     * Sets the values of the actual selected transformation
     * to the value fields in the bottom bar
     * @returns {null}
     */
    this.setTransformationValues = function(){
        setTransformValues(currentPrimitiveID, HANDLING_MODE);
    };
    
    
    
    /*
     * Toggles the bounding volume highlighting on/off
     * @returns (undefined)
     */
    this.showBoundingVolumeHighlighting = function(htmlID){
        boundingVolumeHighlighting = !boundingVolumeHighlighting;
        if (boundingVolumeHighlighting){
            document.getElementById(htmlID+"_tick").style.visibility = "visible";
            highlightBoundingVolume(currentPrimitiveID, true);
        }
        else {
            document.getElementById(htmlID+"_tick").style.visibility = "hidden";
            highlightBoundingVolume(currentPrimitiveID, false);
        }
    };
    
    
    
    /*
     * Toggles the primitive highlighting on/off
     * @returns (undefined)
     */
    this.showPrimitiveHighlighting = function(htmlID){
        primitiveHighlighting = !primitiveHighlighting;
        if (primitiveHighlighting){
            highlightPrimitive(currentPrimitiveID, true);
            document.getElementById(htmlID+"_tick").style.visibility = "visible";
        }
        else { 
            highlightPrimitive(currentPrimitiveID, false);
            document.getElementById(htmlID+"_tick").style.visibility = "hidden";
        }
    };



    /*
     * Highlights the primitives with selected highlighting modes
     * @returns (undefined)
     */
    this.highlight = function(id, on) {
        if (boundingVolumeHighlighting)
            highlightBoundingVolume(id, on);
        if (primitiveHighlighting)
            highlightPrimitive(id, on);
    };
    
    
    
    /*
     * 
     * @returns {undefined}
     */
    this.setTransformationValuesToPrimitive = function() {
        var MT = primitiveList[currentPrimitiveID].children[0];

        var tempValue = "";
        var transformMat = x3dom.fields.SFMatrix4f.identity();

        if (HANDLING_MODE === "translation" || HANDLING_MODE === "scale") {
            tempValue = ui.BBTransX.get() + " " +
                        ui.BBTransY.get() + " " +
                        ui.BBTransZ.get();   
            primitiveList[currentPrimitiveID].setAttribute(HANDLING_MODE, tempValue);
        }
        else if (HANDLING_MODE === "rotation") {
            MT.Transformation.rotationX = ui.BBTransX.get();
            MT.Transformation.rotationY = ui.BBTransY.get();
            MT.Transformation.rotationZ = ui.BBTransZ.get();
            var rotX = x3dom.fields.SFMatrix4f.rotationX(ui.BBTransX.get() * Math.PI / 180);
            var rotY = x3dom.fields.SFMatrix4f.rotationY(ui.BBTransY.get() * Math.PI / 180);
            var rotZ = x3dom.fields.SFMatrix4f.rotationZ(ui.BBTransZ.get() * Math.PI / 180);

            transformMat = rotX.mult(rotY).mult(rotZ);
            MT.setAttribute("matrix", matrixToString(transformMat));
        }
        
        this.highlight(currentPrimitiveID, true);
    };
    
    
    
    /*
     * Sets the values of the actual selected transformation
     * to the value fields in the bottom bar
     * @param {type} id name of the primitive's values that should be set
     * @param {type} mode type of transformation 
     * @returns {null}
     */
    function setTransformValues(id, mode){
        try {
            var MT = primitiveList[id].children[0];
        
            if (mode === "rotation"){
                ui.BBTransX.set(MT.Transformation.rotationX);
                ui.BBTransY.set(MT.Transformation.rotationY);
                ui.BBTransZ.set(MT.Transformation.rotationZ);
            }
            else {
                var vec = x3dom.fields.SFVec3f.parse(primitiveList[id].attributes[mode].nodeValue);
                ui.BBTransX.set(vec.x.toFixed(5));
                ui.BBTransY.set(vec.y.toFixed(5));
                ui.BBTransZ.set(vec.z.toFixed(5));
            }

            ui.BBPrimName.set(primitiveList[id].IDMap.name);
            ui.BBTransformMode.set(HANDLING_MODE.charAt(0).toUpperCase() + HANDLING_MODE.slice(1) + ':');
            
            ui.BBTransX.disable(false);
            ui.BBTransY.disable(false);
            ui.BBTransZ.disable(false);
            ui.BBPrimName.disable(false);
            ui.BBDelete.disable(false); 
            ui.RBAccordion.disable(false);

            that.highlight(id, true);
        }
        catch(ex){
            console.log(ex);
        }
    }
    
    
    
    /*
     * Sets the name of a primitive to the users defined value
     * @returns {null}
     */
    this.setPrimitiveName = function() {
        primitiveList[currentPrimitiveID].IDMap.name = ui.BBPrimName.get();
        ui.treeViewer.rename(currentPrimitiveID, ui.BBPrimName.get());
    };

    
    
    /*
     * Returns the actually selected primitive 
     * @returns {primitive}
     */
    this.getActualPrimitive = function(){
        return primitiveList[currentPrimitiveID];
    };

    /*
     *
     */
    this.deselectObjects = function(event) {
        // left button 1, middle 4, right 2
        if (event.button === 2) {
            currentPrimitiveID = "";
        }
    };
    
    
    /*
     * Returns the position of the required primitive 
     * @returns {SFVec3f}
     */
    this.getPosition = function(primitiveID){
        return x3dom.fields.SFVec3f.parse(primitiveList[primitiveID].getAttribute("translation"));
    };
    
    
    
    /*
     * Returns the scale of the required primitive 
     * @returns {SFVec3f}
     */
    this.getScale = function(primitiveID){
        return x3dom.fields.SFVec3f.parse(primitiveList[primitiveID].getAttribute("scale"));
    };
    
    
    
    /*
     * Returns the rotation of the required primitive 
     * @returns {SFMatrix4f}
     */
    this.getRotation = function(primitiveID){
        return x3dom.fields.SFMatrix4f.parse(primitiveList[primitiveID].children[0].getAttribute("matrix")).transpose();
    };
    
    
    
    /*
     * Returns a list with all primitives id's 
     * @returns {List of id's of all primitives}
     */
    this.getIDList = function(){
        var idList = [];
        for (var key in primitiveList){
            idList.push(key);
        }
        
        return idList;
    };
}

