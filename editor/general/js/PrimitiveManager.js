/*
 * Creates a string from SFMatrix4f that can be set on MatrixTransform
 * @param {SFMatrix4f} transformMat matrix that should be converted to a string
 * @returns (undefined)
 */
function matrixToString(transformMat){
    return transformMat.toGL().toString();
}



//@todo: there is currently no method to query key states in X3DOM (?)
var keyPressed={};

document.addEventListener('keydown', function (e) {
    e = e || window.event;
    keyPressed[e.keyCode] = true;
}, true);

document.addEventListener('keyup', function (e) {
    e = e || window.event;
    keyPressed[e.keyCode] = false;
}, true);



/*
 * The PrimitiveManager component handles all the behaviour of all 
 * added primitives of the workspace
 * @returns {PrimitiveManager}
 */
function PrimitiveManager(){
    
    // List of all created primitives
    this.primitiveList = [];
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
    // highlight color
    var highlightCol = "1 1 0";
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
     * Returns the list of selected primitive IDs
     */
    this.getSelectedPrimitiveIDs = function(){
        return selectedPrimitiveIDs;
    };



    /*
     * Adds a new primitive to the working area and stores its reference
     * @param {type} primitive name of the primitive that should be created
     * @returns {null}
     */
    this.addPrimitive = function(primitive, parameters){

        ui.toggleGroupMode(false);

        if (HANDLING_MODE === "hand")
            controller.Activate("translation");
   
        var id = "primitive_" + primCounter;
        primCounter++;
        
        var s = document.createElement('Shape');

        var t = document.createElement('Transform');
        t.setAttribute("id", id);
        t.setAttribute("translation", "0 0 0");
        t.setAttribute("scale", "1 1 1");
        
        t.PrimType = primitive;

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
        
        that.setDefaultParameters(prim, parameters);
        
        s.appendChild(prim);
        t.Parameters.Primitive = prim;
        t.Shape = s;

        var root = document.getElementById('root');
        t.appendChild(mt);
        root.appendChild(t);        
        
        // wrapper for adding moving functionality, last param is callback function
        // TODO: last param shall be grid size for snap-to-grid
        new x3dom.Moveable(document.getElementById("x3d"), t, primitiveMoved, controller.getGridSize());
        
        that.primitiveList[id] = t;
        that.primitiveList[id].addEventListener("mousedown",
            function(){ primitiveSelected(id); },
        false);
        that.updateTransformUIFromPrimitive(id, HANDLING_MODE);

        primitiveCounter++;
        selectedPrimitiveIDs = [];

        that.selectCurrentPrimitive(id);
        ui.treeViewer.addPrimitive(id, id);
        ui.treeViewer.moveExistableNodeToGroup(id, "Scene");
        
        return that.primitiveList[id];
    };
    
    
    
    /*
     * Clones a primitive with all it's parameters
     * @returns {null}
     */
    this.clonePrimitiveGroup = function(){
        var primitiveToClone = that.primitiveList[currentPrimitiveID];
        var clone = that.addPrimitive(that.primitiveList[currentPrimitiveID].PrimType, that.primitiveList[currentPrimitiveID].Parameters);
        clone.setAttribute("translation", primitiveToClone.getAttribute("translation"));
        clone.setAttribute("scale", primitiveToClone.getAttribute("scale"));
        clone.IDMap.name = "clone_" + primitiveToClone.IDMap.name;
        that.updateTransformUIFromPrimitive(currentPrimitiveID, HANDLING_MODE);
        ui.treeViewer.rename(currentPrimitiveID, clone.IDMap.name);
        that.highlightCurrentBoundingVolume(true);
    };
    

    
    
    /*
     * Sets the visibility of a primitive
     * @param {string} id name of the primitive
     * @param {bool} bool visibility that should be set (true: visible)
     * @returns {null}
     */
    this.setPrimitiveVisibility = function(id, bool){
        that.primitiveList[id].setAttribute("render", bool);
    };



    /*
     * Clears the current selection and disables the UI elements for transformation editing.
     */
    this.clearSelection = function() {
        currentPrimitiveID = "";
        that.highlightCurrentPrimitive(false);
        that.highlightCurrentBoundingVolume(false);

        this.disableTransformationUI();
        ui.RBAccordion.disable(true);
    };



    /*
     * Selects the primitive with the given ID as the current primitive, meaning that this is the primitive
     * which is affected by transformations and which can be inspected with the UI.
     * Note that this clears the list of selected primitives, only the primary primitive is selected afterwards.
     * @param {string} id name of the primitive that should be selected
     * @returns {null}
     */
    this.selectCurrentPrimitive = function(id){
        if (HANDLING_MODE === "hand")
            controller.Activate("translation");

        currentPrimitiveID = id;
        that.highlightCurrentPrimitive(true);
        selectedPrimitiveIDs = [id];

        ui.clearParameters();
        ui.createParameters(that.primitiveList[id].Parameters);
        ui.setMaterial(that.primitiveList[id].Material);

        ui.treeViewer.activate(id);

        that.enableTransformationUI();
        ui.RBAccordion.disable(false);

        that.updateTransformUIFromPrimitive(id, HANDLING_MODE);
    };



    /*
     * Callback for handling movement values on mouse interaction
     * @param {X3DNode} the interacting element
     * @param {SFVec3f} new translation value
     */
    function primitiveMoved(elem, pos) {
        //if SHIFT is pressed, do nothing (-> group selection)
        if (!keyPressed[16])
        {
            currentPrimitiveID = elem.getAttribute('id');
            that.highlightCurrentBoundingVolume(true);

            // update GUI elements appropriately
            // TODO; this is still  _very_ slow in Safari, seems to trigger something else
            ui.BBTransX.set(pos.x.toFixed(3));
            ui.BBTransY.set(pos.y.toFixed(3));
            ui.BBTransZ.set(pos.z.toFixed(3));
            
            // when snapping is active, the selected item position is always known and calculate the position the other
            snapping.startSnapping();
        }
    }
    
    
    
    /*
     * Sets the default values of a new primitive to the property fields of the
     * right bars accordion
     * @param {Primitive} primitive the primitive where the default values should be set
     * @param {Parameters} parameters the parameters that should be set to primitive as default
     * @returns (undefined)
     */
    this.setDefaultParameters = function(primitive, parameters) {
        var s = Math.PI / 180;
        for (var i = 0; i < parameters.length; i++){
            primitive.setAttribute(parameters[i].x3domName, (parameters[i].type === "angle") ? 
                (parameters[i].value * s).toString() : parameters[i].value);
        }
    };

    
    
	/* 
     * Removes snapNode
     * @returns {undefined}
     */  
    this.removeSnapNode = function(id)
    {
    	var snapPoint = document.getElementById(id);
        if (snapPoint && snapPoint.parentNode)
    	    snapPoint.parentNode.removeChild(snapPoint);
    };
	
    
    /* 
     * Removes a primitive from the DOM and from primitive array
     * @returns {undefined}
     */  
    this.removeNode = function()
    {
        if (currentPrimitiveID) {
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
                    delete that.primitiveList[currentPrimitiveID];

                    that.clearSelection();
                    primitiveCounter--;
                }
            }

            document.getElementById('root').removeChild(ot);
        }
    };


    /*
     * Removes all primitives from the DOM and from primitive array
     */
    this.removeAllNodes = function()
    {
        for (var key in that.primitiveList) {
            if (that.primitiveList[key]) {
                currentPrimitiveID = key;
                this.removeNode();
            }
        }

        that.primitiveList = [];
        currentPrimitiveID = "";
        primitiveCounter = 0;
    };


    this.updateGridSize = function(size)
    {
        for (var key in that.primitiveList) {
            if (that.primitiveList[key]) {
                var ot = document.getElementById(currentPrimitiveID);
                if (ot && ot._iMove) {
                    ot._iMove.setGridSize(size);
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
        that.highlightCurrentPrimitive(false);
        if (element === "diffuse" || element === "specular" || element === "emissive") {
            that.primitiveList[currentPrimitiveID].Material.setAttribute(element+'Color', rgb);
        }
        if(element === "transparency" || element === "shininess") {
            that. primitiveList[currentPrimitiveID].Material.setAttribute(element, rgb);
        }
    };



    /*
     * Will be called if a primitive is picked and should
     * set the values of translation, rotation or scaling
     * @param {type} id name of the primitive's values that should be set
     * @returns {null}
     */
    function primitiveSelected(id){
        var idx;

        if (typeof id !== 'undefined')
        {
            //if nothing is selected, use this as the primary primitive (which gets transformed etc.)
            if (selectedPrimitiveIDs.length === 0 || !keyPressed[16])
            {
                that.selectCurrentPrimitive(id);

                if (HANDLING_MODE === "hand")
				{
                    controller.Activate("translation");
				}

                that.updateTransformUIFromPrimitive(id, HANDLING_MODE);
            }
            //if there is already a selected object and SHIFT is pressed, add/remove object to/from selection
            else if (keyPressed[16] && selectedPrimitiveIDs[0] !== id)
            {
                idx = selectedPrimitiveIDs.indexOf(id);

                //add to selection
                if (idx === -1)
                {
                    selectedPrimitiveIDs.push(id);

                    that.primitiveList[id].highlight(false, highlightCol);
                    that.primitiveList[id].highlight(true,  highlightCol);
                }
                //remove from selection
                else
                {
                    selectedPrimitiveIDs.splice(idx, 1);

                    that.primitiveList[id].highlight(false, highlightCol);
                }

                //if we started to group primitives, disable the transformation UI
                if (selectedPrimitiveIDs.length === 2)
                {
                    that.disableTransformationUI();
                    ui.RBAccordion.disable(true);
                }
            }

            //if we stopped to group primitives, enable the transformation UI
            if (selectedPrimitiveIDs.length === 1)
            {
                that.enableTransformationUI();
                ui.RBAccordion.disable(false);
            }
        }
        else
        {
            x3dom.debug.logError("primitiveSelected: ID must be specified.");
        }
    }
    
    
    
    /*
     * Computes the bounding volume parameters for highlighting, and toggles its visibility.
     * @param {bool} bool parameter to show or to hide the bounding box
     * @returns (undefined)
     */
    this.highlightCurrentBoundingVolume = function(bool){
        var volume = null;
        var transform = document.getElementById('cpnt_transform');
        var matrixTransform = document.getElementById('cpnt_matrixTransform');

        //GROUP MODE
        if (ui.groupModeActive())
        {
            //@todo: testing, continue implementation
            var group = groupManager.getCurrentGroup();

            transform.setAttribute("translation",  group.getTransformNode().getAttribute("translation"));
            transform.setAttribute("scale",        group.getTransformNode().getAttribute("scale"));
            matrixTransform.setAttribute("matrix", group.getMatrixTransformNode().getAttribute("matrix"));

            //@todo: how does it work? (-> see Core.js)
            volume = group.getGroupNode()._x3domNode.getVolume();
        }
        //PRIMITIVE MODE
        else if (currentPrimitiveID !== "")
        {
            transform.setAttribute("translation",  that.primitiveList[currentPrimitiveID].getAttribute("translation"));
            transform.setAttribute("scale",        that.primitiveList[currentPrimitiveID].getAttribute("scale"));
            matrixTransform.setAttribute("matrix", that.primitiveList[currentPrimitiveID].children[0].getAttribute("matrix"));

            volume = that.primitiveList[currentPrimitiveID].Parameters.Primitive._x3domNode.getVolume();
        }

        if (volume)
        {
            var min = x3dom.fields.SFVec3f.copy(volume.min);
            var max = x3dom.fields.SFVec3f.copy(volume.max);

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
        transform.setAttribute("render", "" + bool);
    };



    /*
     * Highlights or un-highlights the currently selected primitive (if any)
     * @param {bool} on specifies whether highlighting should be active
     * @returns (undefined)
     */
    this.highlightCurrentPrimitive = function(on) {
        if (currentPrimitiveID !== "")
        {
            //update the bounding volume, or hide it
            that.highlightCurrentBoundingVolume(on);

            //un-highlight all primitives, then highlight the current primitive
            for (var key in that.primitiveList)
            {
                if (that.primitiveList[key])
                {
                    that.primitiveList[key].highlight(false, highlightCol);
                }
            }
            that.primitiveList[currentPrimitiveID].highlight(true, highlightCol);
        }
    };
    
    
    
    /*
     * 
     * @returns {undefined}
     */
    //@todo: this function is not very beautiful at the moment:
    //          - actually, some of this is UI functionality
    //          - with groups, this is not only about "primitives" any more
    this.updatePrimitiveTransformFromUI = function() {
        var group;
        var MT;

        //GROUP MODE
        if (ui.groupModeActive())
        {
            group = groupManager.getCurrentGroup();

            MT = group.getMatrixTransformNode();

            ui.BBPrimName.set(groupManager.getCurrentGroupID());
        }
        //PRIMITIVE MODE
        else
        {
            //that.primitiveList[currentPrimitiveID].children[0];
        }

        var tempValue = "";
        var transformMat = x3dom.fields.SFMatrix4f.identity();

        if (HANDLING_MODE === "translation" || HANDLING_MODE === "scale") {
            tempValue = ui.BBTransX.get() + " " +
                        ui.BBTransY.get() + " " +
                        ui.BBTransZ.get();

            //GROUP MODE
            if (ui.groupModeActive())
            {
               group.getTransformNode().setAttribute(HANDLING_MODE, tempValue);
            }
            //PRIMITIVE MODE
            else
            {
                that.primitiveList[currentPrimitiveID].setAttribute(HANDLING_MODE, tempValue);
            }
        }
        else if (HANDLING_MODE === "rotation") {
            //@todo: make this work for group mode
            MT.Transformation.rotationX = ui.BBTransX.get();
            MT.Transformation.rotationY = ui.BBTransY.get();
            MT.Transformation.rotationZ = ui.BBTransZ.get();
            var s = Math.PI / 180;
            var rotX = x3dom.fields.SFMatrix4f.rotationX(ui.BBTransX.get() * s);
            var rotY = x3dom.fields.SFMatrix4f.rotationY(ui.BBTransY.get() * s);
            var rotZ = x3dom.fields.SFMatrix4f.rotationZ(ui.BBTransZ.get() * s);

            transformMat = rotX.mult(rotY).mult(rotZ);
            MT.setAttribute("matrix", matrixToString(transformMat));
        }
        
        this.highlightCurrentBoundingVolume(true);
    };
    
    
    
    /*
     * Sets the values of the actual selected transformation
     * to the value fields in the bottom bar
     * @param {type} id name of the primitive's values that should be set
     * @param {type} mode type of transformation 
     * @returns {null}
     */
    //@todo: this function is not very beautiful at the moment:
    //          - actually, some of this is UI functionality
    //          - with groups, this is not only about "primitives" any more
    //          - better assume that we have no parameters, but we only handle the "current" primitive or group
    this.updateTransformUIFromPrimitive = function(id, mode) {
        var interactionMode = HANDLING_MODE;
        var MT;
        var group;
        var vec;

        //GROUP MODE
        if (ui.groupModeActive())
        {
            group = groupManager.getCurrentGroup();

            MT = group.getMatrixTransformNode();

            ui.BBPrimName.set(groupManager.getCurrentGroupID());
        }
        //PRIMITIVE MODE
        else
        {
            MT = that.primitiveList[id].children[0];

            ui.BBPrimName.set(that.primitiveList[id].IDMap.name);
        }

        if (interactionMode === "rotation")
        {
            //@todo: make this work for group mode
            ui.BBTransX.set(MT.Transformation.rotationX);
            ui.BBTransY.set(MT.Transformation.rotationY);
            ui.BBTransZ.set(MT.Transformation.rotationZ);
        }
        else
        {
            //GROUP MODE
            if (ui.groupModeActive())
            {
                vec = x3dom.fields.SFVec3f.parse(group.getTransformNode().getAttribute(interactionMode));
            }
            //PRIMITIVE MODE
            else
            {
                vec = x3dom.fields.SFVec3f.parse(that.primitiveList[id].attributes[interactionMode].nodeValue);
            }

            ui.BBTransX.set(vec.x.toFixed(3));
            ui.BBTransY.set(vec.y.toFixed(3));
            ui.BBTransZ.set(vec.z.toFixed(3));
        }
    };



    /*
     * Enables the transformation UI elements.
     */
    this.enableTransformationUI = function(){
        ui.BBTransX.disable(false);
        ui.BBTransY.disable(false);
        ui.BBTransZ.disable(false);
        ui.BBPrimName.disable(false);
        ui.BBDelete.disable(false);
        ui.BBClone.disable(false);
    };



    /*
     * Clears the value fields of the transformation
     * @returns {undefined}
     */
    this.disableTransformationUI = function(){
        //ui.BBTransX.set("");
        ui.BBTransX.disable(true);
        //ui.BBTransY.set("");
        ui.BBTransY.disable(true);
        //ui.BBTransZ.set("");
        ui.BBTransZ.disable(true);
        //ui.BBPrimName.set("");
        ui.BBPrimName.disable(true);
        ui.BBDelete.disable(true);
        ui.BBClone.disable(true);
    };



    /*
     * Sets the name of a primitive to the users defined value
     * @returns {null}
     */
    //@todo: this function is not very beautiful at the moment:
    //          - actually, some of this is UI functionality
    //          - with groups, this is not only about "primitives" any more
    this.setPrimitiveName = function() {
        if (ui.groupModeActive())
        {
            //@todo: implement
        }
        else
        {
            that.primitiveList[currentPrimitiveID].IDMap.name = ui.BBPrimName.get();
            ui.treeViewer.rename(currentPrimitiveID, ui.BBPrimName.get());
        }
    };

    
    
    /*
     * Returns the currently selected primitive
     * @returns {primitive}
     */
    this.getCurrentPrimitive = function(){
        return that.primitiveList[currentPrimitiveID];
    };



    /*
     * Returns the ID of the currently selected primitive
     * @returns {primitive}
     */
    this.getCurrentPrimitiveID = function(){
        return currentPrimitiveID;
    };



    /*
     * Returns primitive with the given ID, if any
     * @returns {primitive}
     */
    this.getPrimitiveByID = function(id){
        if (id) {
            return that.primitiveList[id];
        }
        else {
            return null;
        }
    };



    /*
     * Returns the position of the required primitive 
     * @returns {SFVec3f}
     */
    this.getPosition = function(primitiveID){
        return x3dom.fields.SFVec3f.parse(that.primitiveList[primitiveID].getAttribute("translation"));
    };
    
    
    
    /*
     * Returns the scale of the required primitive 
     * @returns {SFVec3f}
     */
    this.getScale = function(primitiveID){
        return x3dom.fields.SFVec3f.parse(that.primitiveList[primitiveID].getAttribute("scale"));
    };
    
    
    
    /*
     * Returns the rotation of the required primitive 
     * @returns {SFMatrix4f}
     */
    this.getRotation = function(primitiveID){
        return x3dom.fields.SFMatrix4f.parse(that.primitiveList[primitiveID].children[0].getAttribute("matrix")).transpose();
    };



    /*
     * Returns a list with all primitives IDs
     * @returns {List of IDs of all primitives}
     */
    this.getIDList = function(){
        var idList = [];
        for (var key in that.primitiveList){
            idList.push(key);
        }
        
        return idList;
    };
}
