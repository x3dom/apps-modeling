/*
 * The PrimitiveManager component handles all the behaviour of all 
 * added primitives of the workspace
 * @returns {PrimitiveManager}
 */
function PrimitiveManager(){
    
    // List of all created primitives
    var primitiveList = [];
    // actually active id
    var actualID = "";
    // count of all primitives that were created during this session
    var primCounter = 0;
    // count of actually used primitives on workspace 
    var primitiveCounter = 0;
    // ui element to get access to the gui elements
    var ui = {};
    
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
        mat.setAttribute("specularColor", "#222222");
        mat.setAttribute("emissiveColor", "#000000");
        mat.setAttribute("transparency", "0.0");
        mat.setAttribute("shininess", "0.3");
        t.Material = mat;

        app.appendChild(mat);
        s.appendChild(app);
        mt.appendChild(s);

        var prim = document.createElement(primitive);
        
        prim.setAttribute("useGeoCache", "false");
        prim.setAttribute("solid", "false");
        // set attributes before inserting into live tree to avoid update
        setDefaultParameters(prim, parameters);
        
        s.appendChild(prim);
        t.Parameters.Primitive = prim;
        t.Shape = s;

        var root = document.getElementById('root');
        t.appendChild(mt);
        root.appendChild(t);
        
        // wrapper for adding moving functionality, last param is callback function
        new Moveable(document.getElementById("x3d"), t, notified);
        
        primitiveList[id] = t;
        primitiveList[id].addEventListener("mousedown", function(){primitiveSelected(id);}, false);
        addPrimitiveToComboBox(t.IDMap.name);
        setTransformValues(id, HANDLING_MODE);
        
        actualID = id;
        primitiveCounter++;
        ui.setMaterial(mat);
        
        this.highlight(id, true);
        ui.clearParameters();
        ui.createParameters(t.Parameters);
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
        if (HANDLING_MODE === "translation" && id == actualID) {
            ui.BBTransX.set(pos.x.toFixed(5));
            ui.BBTransY.set(pos.y.toFixed(5));
            ui.BBTransZ.set(pos.z.toFixed(5));
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
    this.removeNode = function()
    {
        if (ui.TBPrimitiveList.selectedIndex() !== 0) {
            var ot = document.getElementById(actualID);

            for (var i = 0; i < ot.childNodes.length; i++) 
            {
                // check if we have a real X3DOM Node; not just e.g. a Text-tag
                if (ot.childNodes[i].nodeType === Node.ELEMENT_NODE) 
                { 
                    ot.removeChild(ot.childNodes[i]);
                    for (var j = primitiveList[actualID].IDMap.cboxNumber + 1; j < (primCounter + 1); j++){
                        try {
                            ui.TBPrimitiveList.idMap(j).cboxNumber--;
                        }
                        catch (ex){}
                    }
                    ui.TBPrimitiveList.remove(primitiveList[actualID].IDMap.cboxNumber);
                    delete primitiveList[actualID];

                    clearTransformValues();
                    primitiveCounter--;
                        break;
                }
            }
        }
    };
    
    
    
    /*
     * Changes the material of a primitive 
     * @param {elementid} element the id of the textfield with the color
     * @returns (undefined)
     */
    this.changePrimitiveMaterial = function(element){
        var rgb = document.getElementById(element).value;
        highlightPrimitive(null, false);
        if (element == "diffuse" || element == "specular" || element == "emissive") {
            primitiveList[actualID].Material.setAttribute(element+'Color', rgb);
        }
        if(element == "transparency" || element == "shininess") {
            primitiveList[actualID].Material.setAttribute(element, rgb);
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
        ui.TBPrimitiveList.selectIndex(0);
        ui.TBPrimitiveList.disable(true);
        ui.RBAccordion.disable(true);

        that.highlight(null, false);
    }

    

    /*
     * Will be called if a primitive is selected and should
     * set the values of translation, rotation or scaling
     * @param {type} id name of the primitive's values that should be set
     * @returns {null}
     */
    function primitiveSelected(id){
        actualID = id;
        that.highlight(id, true);

        ui.clearParameters();
        ui.createParameters(primitiveList[id].Parameters);
        ui.setMaterial(primitiveList[id].Material);
        if (HANDLING_MODE === "hand")
            controller.Activate("translation");
        setTransformValues(id, HANDLING_MODE);
    }
    
    
    
    function highlightBoundingVolume(id, bool){  
        var transform = document.getElementById('cpnt_transform');
        var matrixTransform = document.getElementById('cpnt_matrixTransform');

        if (id != null) {
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
     * Highlights the actually selected primitive
     * @param {type} highlightOn false if all should be dehighlighted
     * @returns {null}
     */
    function highlightPrimitive(id, highlightOn){
        // TODO FIXME only switch off prevElem and only do something on change
        for (var key in primitiveList) {
            if (primitiveList[key]) {
                primitiveList[key].highlight(false, "1 1 0");
            }
        }
        if (highlightOn && primitiveList[actualID]) {
           //  TODO; shall depend on user preference (highlight/bbox checkboxes)
           primitiveList[actualID].highlight(true, "1 1 0");
        }
    }
    
    
    
     
    /*
     * Sets the values of the actual selected transformation
     * to the value fields in the bottom bar
     * @returns {null}
     */
    this.setTransformationValues = function(){
        setTransformValues(actualID, HANDLING_MODE);
    };



    /*
     *
     */
    this.highlight = function(id, on) {
        highlightBoundingVolume(id, on);
        highlightPrimitive(id, on);
    };
    
    
    
    /*
     * 
     * @returns {undefined}
     */
    this.setTransformationValuesToPrimitive = function() {
        var MT = primitiveList[actualID].children[0];

        var tempValue = "";
        var transformMat = x3dom.fields.SFMatrix4f.identity();

        if (HANDLING_MODE === "translation" || HANDLING_MODE === "scale") {
            tempValue = ui.BBTransX.get() + " " +
                        ui.BBTransY.get() + " " +
                        ui.BBTransZ.get();   
            primitiveList[actualID].setAttribute(HANDLING_MODE, tempValue);
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
        
        this.highlight(actualID, true);
    };
    
    
    
    /*
     * Handles the synchronization if a primitive is selected at the combobox
     * @param {type} id identifier of the primitive that should be set to active
     * @returns {undefined}
     */
    this.comboBoxChanged = function(id){
        if (ui.TBPrimitiveList.selectedIndex() === 0) {
            clearTransformValues();
        }
        else {
            actualID = ui.TBPrimitiveList.idMap(id).id;
            setTransformValues(actualID, HANDLING_MODE);
            ui.clearParameters();
            ui.createParameters(primitiveList[actualID].Parameters);
        }
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
            ui.TBPrimitiveList.selectIndex(primitiveList[id].IDMap.cboxNumber);
            ui.BBTransformMode.set(HANDLING_MODE.charAt(0).toUpperCase() + HANDLING_MODE.slice(1) + ':');
            
            ui.BBTransX.disable(false);
            ui.BBTransY.disable(false);
            ui.BBTransZ.disable(false);
            ui.BBPrimName.disable(false);
            ui.BBDelete.disable(false); 
            ui.TBPrimitiveList.disable(false);
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
        ui.TBPrimitiveList.set(primitiveList[actualID].IDMap.cboxNumber, ui.BBPrimName.get());
        primitiveList[actualID].IDMap.name = ui.BBPrimName.get();
    };
    
    
    
    /*
     * Adds an option field to the select box with the name of a primitive
     * @param {type} id name of the primitive's values that should be set
     * @returns {null}
     */
    function addPrimitiveToComboBox(id){
        var option=document.createElement("option");
        option.Primitive = primitiveList[id];
        option.text = id;
        
        ui.TBPrimitiveList.add(option);
    }
    
    
    
    /*
     * Returns the actually selected primitive 
     * @returns {primitive}
     */
    this.getActualPrimitive = function(){
        return primitiveList[actualID];
    };
}

