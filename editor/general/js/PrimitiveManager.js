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
 *
 */
function Primitive(primType, parameters){
    if (arguments.length < 2)
    {
        console.log("Error: Primitive constructor needs primType and parameters.");
        return;
    }

    var that = this;

    this.id = "primitive_" + primitiveManager.primCounter;
    primitiveManager.primCounter++;

    this.matrixTransformNode = document.createElement('MatrixTransform');
    this.matrixTransformNode.setAttribute("matrix", matrixToString(x3dom.fields.SFMatrix4f.identity()));

    // wrapper for adding moving functionality, last param is callback function
    new x3dom.Moveable(document.getElementById("x3d"),
                       this.matrixTransformNode,
                       primitiveManager.primitiveMoved,
                       controller.getGridSize());

    //translation values
    this.transX = 0;
    this.transY = 0;
    this.transZ = 0;
    //eulerian angles for rotation
    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;
    //scale factors
    this.scaleX = 1;
    this.scaleY = 1;
    this.scaleZ = 1;

    this.primType = primType;

    this.parameters = [];

    // deep copy of parameters
    var k;
    var aParam;
    var partType;

    for (k = 0; k < parameters.length; k++) {
        aParam = {};
        for (partType in parameters[k]) {
            aParam[partType] = parameters[k][partType];
        }
        this.parameters.push(aParam);
    }

    this.primitiveNode = document.createElement(this.primType);

    primitiveManager.setDefaultParameters(this.primitiveNode, parameters);

    this.material = document.createElement('Material');

    this.material.setAttribute("diffuseColor",  "#3F7EBD");
    this.material.setAttribute("specularColor", "#2A2A2A");
    this.material.setAttribute("emissiveColor", "#000000");
    this.material.setAttribute("transparency", "0.0");
    this.material.setAttribute("shininess", "0.2");

    // insert nodes into DOM
    var appearance = document.createElement('Appearance');
    appearance.appendChild(this.material);

    var shape = document.createElement('Shape');
    shape.appendChild(appearance);
    shape.appendChild(this.primitiveNode);

    this.matrixTransformNode.appendChild(shape);

    document.getElementById('root').appendChild(this.matrixTransformNode);



    /*
     * Returns the ID / name of the primitive.
     */
    this.getID = function(){
        return that.id;
    }



    this.getParameters = function(){
        return that.parameters;
    }



    this.getMaterial = function(){
        return that.material;
    }



    /*
     * Returns the DOM node of the primitive.
     */
    this.getPrimitiveNode = function(){
        return that.primitiveNode;
    }



    /*
     * Returns the DOM Node of this group's matrix transform.
     * @returns {DOMNode}
     */
    this.getMatrixTransformNode = function(){
        return that.matrixTransformNode;
    };



    this.getTranslationAsString =  function(){
        return that.transX + ' ' + that.transY + ' ' + that.transZ;
    }



    this.getScaleAsString =  function(){
        return that.scaleX + ' ' + that.scaleY + ' ' + that.scaleZ;
    }


    this.setRotation = function(x, y, z){
        this.rotX = x;
        this.rotY = y;
        this.rotZ = z;

        that.updateMatrixTransform();
    }



    this.setTranslation = function(x, y, z){
        this.transX = x;
        this.transY = y;
        this.transZ = z;

        that.updateMatrixTransform();
    }



    this.setScale = function(x, y, z){
        this.scaleX = x;
        this.scaleY = y;
        this.scaleZ = z;

        that.updateMatrixTransform();
    }



    this.getTranslationAsVec = function(){
        return new x3dom.fields.SFVec3f(this.transX, this.transY, this.transZ)
    };



    this.getRotationAsVec = function(){
        return new x3dom.fields.SFVec3f(this.rotX, this.rotY, this.rotZ)
    };



    this.getScaleAsVec = function(){
        return new x3dom.fields.SFVec3f(this.scaleX, this.scaleY, this.scaleZ)
    };



    this.updateMatrixTransform = function(){
        var deg2Rad = Math.PI / 180.0;

        var matTr = x3dom.fields.SFMatrix4f.translation(this.getTranslationAsVec());

        var matRX = x3dom.fields.SFMatrix4f.rotationX(this.rotX  * deg2Rad);
        var matRY = x3dom.fields.SFMatrix4f.rotationY(this.rotY  * deg2Rad);
        var matRZ = x3dom.fields.SFMatrix4f.rotationZ(this.rotZ  * deg2Rad);

        var matSc = x3dom.fields.SFMatrix4f.scale(this.getScaleAsVec());

        var transformMat = matTr;
        transformMat     = transformMat.mult(matRX.mult(matRY).mult(matRZ));
        transformMat     = transformMat.mult(matSc);

        that.matrixTransformNode.setAttribute("matrix", matrixToString(transformMat));
    };
}



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
    this.primCounter = 0;
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

        var prim = new Primitive(primitive, parameters);

        var id   = prim.getID();

        prim.getPrimitiveNode().addEventListener("mousedown",
            function(){ primitiveSelected(id); snapping.newSnapObject(); },
            false);

        that.primitiveList[id] = prim;

        that.updateTransformUIFromPrimitive(id, HANDLING_MODE);

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

        //@todo: check
        /*
        var clone = that.addPrimitive(that.primitiveList[currentPrimitiveID].getPrimType(),
                                      that.primitiveList[currentPrimitiveID].getParameters());

        clone.setAttribute("translation", primitiveToClone.getAttribute("translation"));
        clone.setAttribute("scale", primitiveToClone.getAttribute("scale"));

        clone.IDMap.name = "clone_" + primitiveToClone.IDMap.name;

        that.updateTransformUIFromPrimitive(currentPrimitiveID, HANDLING_MODE);
        ui.treeViewer.rename(currentPrimitiveID, clone.IDMap.name);
        that.highlightCurrentBoundingVolume(true);
        */
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
        ui.createParameters(that.primitiveList[id].getParameters(), that.primitiveList[id].getPrimitiveNode());
        ui.setMaterial(that.primitiveList[id].getMaterial());

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
    this.primitiveMoved = function(elem, pos) {

        //if SHIFT is pressed, do nothing (-> group selection)
        if (!keyPressed[16])
        {
            HANDLING_MODE = 'translation';

            currentPrimitiveID = elem.getAttribute('id');
            that.highlightCurrentBoundingVolume(true);

            // update stored transform values and GUI elements appropriately
            // TODO; this is still  _very_ slow in Safari, seems to trigger something else
            that.primitiveList[currentPrimitiveID].setTranslation(pos.x, pos.y, pos.z);
            that.updateTransformUIFromPrimitive();

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

        var bbTransform = document.getElementById('bbox_transform');

        //GROUP MODE
        if (ui.groupModeActive())
        {
            var group = groupManager.getCurrentGroup();

            bbTransform.setAttribute("matrix", group.getMatrixTransformNode().getAttribute("matrix"));

            volume = group.getGroupNode()._x3domNode.getVolume();
        }
        //PRIMITIVE MODE
        else if (currentPrimitiveID !== "")
        {
            bbTransform.setAttribute("matrix", that.primitiveList[currentPrimitiveID].getMatrixTransformNode().getAttribute("matrix"));

            volume = that.primitiveList[currentPrimitiveID].getPrimitiveNode()._x3domNode.getVolume();
        }

        if (volume)
        {
            var min = x3dom.fields.SFVec3f.copy(volume.min);
            var max = x3dom.fields.SFVec3f.copy(volume.max);

            var box = document.getElementById('bbox_points');
            box.setAttribute('point', min.x+' '+min.y+' '+min.z+', '+
                                      min.x+' '+min.y+' '+max.z+', '+
                                      max.x+' '+min.y+' '+max.z+', '+
                                      max.x+' '+min.y+' '+min.z+', '+
                                      min.x+' '+max.y+' '+min.z+', '+
                                      min.x+' '+max.y+' '+max.z+', '+
                                      max.x+' '+max.y+' '+max.z+', '+
                                      max.x+' '+max.y+' '+min.z );
        }

        bbTransform.setAttribute("render", "" + bool);
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
                    that.primitiveList[key].getMatrixTransformNode().highlight(false, highlightCol);
                }
            }
            that.primitiveList[currentPrimitiveID].getMatrixTransformNode().highlight(true, highlightCol);
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
        var objectToBeUpdated;

        //GROUP MODE
        if (ui.groupModeActive())
        {
            /*
            group       = groupManager.getCurrentGroup();

            translation = group.getTransformNode();
            rotation    = group.getMatrixTransformNode();
            //@todo: make it work
            //scale       = group.getScaleNode();

            ui.BBPrimName.set(groupManager.getCurrentGroupID());
            */
        }
        //PRIMITIVE MODE
        else
        {
            objectToBeUpdated = that.primitiveList[currentPrimitiveID];

            ui.BBPrimName.set(objectToBeUpdated.getID());
        }

        var valX = ui.BBTransX.get();
        var valY = ui.BBTransY.get();
        var valZ = ui.BBTransZ.get();

        var tempValue = valX + ' ' + valY + ' ' + valZ;

        if (HANDLING_MODE === "translation")
        {
            objectToBeUpdated.setTranslation(valX, valY, valZ);
        }
        else if (HANDLING_MODE === "rotation")
        {
            objectToBeUpdated.setRotation(valX, valY, valZ);
        }
        else if (HANDLING_MODE === "scale")
        {
            objectToBeUpdated.setScale(valX, valY, valZ);
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
            MT = that.primitiveList[id].getMatrixTransformNode();

            ui.BBPrimName.set(that.primitiveList[id].getID());
        }

        if (interactionMode === "rotation")
        {
            vec = that.primitiveList[id].getRotationAsVec();
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
                if (interactionMode === "translation")
                {
                    vec = that.primitiveList[id].getTranslationAsVec();
                }
                else if (interactionMode === "scale")
                {
                    vec = that.primitiveList[id].getScaleAsVec();
                }
            }
        }

        ui.BBTransX.set(vec.x.toFixed(3));
        ui.BBTransY.set(vec.y.toFixed(3));
        ui.BBTransZ.set(vec.z.toFixed(3));
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
