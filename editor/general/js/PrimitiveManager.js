//utility function - we need it if we want to move an X3DOM object inside the DOM
//in that case, the X3DOM backend graph needs to be cleared, it then gets rebuilt after re-insertion
// TODO: this does not trigger any internal cleanups, better also call removeChild on DOM node first
function removeX3DOMBackendGraph(domNode)
{
    var children = domNode.childNodes;
    var i;

    for (i = 0; i < children.length; ++i)
    {
        removeX3DOMBackendGraph(children[i]);
    }

    domNode._x3domNode = null;
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
 * Sets the default values of a new primitive to the property fields of the
 * right bars accordion
 * @param {Primitive} primitive the primitive where the default values should be set
 * @param {Parameters} parameters the parameters that should be set to primitive as default
 * @returns (undefined)
 */
setDefaultParameters = function(primitive, parameters) {
    var s = Math.PI / 180;
    for (var i = 0; i < parameters.length; i++){
        primitive.setAttribute(parameters[i].x3domName, (parameters[i].type === "angle") ?
            (parameters[i].value * s).toString() : parameters[i].value);
    }
};



/*
 * Primitive class, inherits from TransformableObject.
 * This class encapsulates all data which is related to a single primitive.
 */
Primitive.prototype = new TransformableObject();
Primitive.prototype.constructor = Primitive;
function Primitive(primType, parameters){
    if (arguments.length < 2)
    {
        console.log("Error: Primitive constructor needs primType and parameters.");
        return;
    }

    //not very elegant, but necessary because of the dynamic id
    //(which differs among instances, in contrast to other members of the prototype)
    this.init();


    this.primType   = primType;
    this.domNode    = document.createElement(this.primType);
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

    setDefaultParameters(this.domNode, parameters);

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
    shape.appendChild(this.domNode);

    this.matrixTransformNode.appendChild(shape);

    document.getElementById('root').appendChild(this.matrixTransformNode);


    // wrapper for adding moving functionality, last param is callback function,
    // must be called _after_ having added node to tree since otherwise uninitialized
    var that = this;
    new x3dom.Moveable(document.getElementById("x3d"),
        this.matrixTransformNode,
        function(elem, pos){ primitiveManager.primitiveMoved(elem, pos, that) },
        controller.getGridSize());
}



/*
 * Returns the material which is associated with this primitive.
 */
Primitive.prototype.getMaterial = function(){
    return this.material;
};


/*
 * Returns the parameters which are associated with this primitive.
 */
Primitive.prototype.getParameters = function(){
    return this.parameters;
};



/*
 * Returns the primitive type as a string (for instance, "cone").
 */
Primitive.prototype.getPrimType = function(){
    return this.primType;
}



/*
 * Returns the DOM node which represents this object.
 */
Primitive.prototype.getDOMNode = function(){
    return this.domNode;
};



/*
 * The PrimitiveManager component handles all the behaviour of all 
 * added primitives of the workspace
 * @returns {PrimitiveManager}
 */
function PrimitiveManager(){
    
    // List of all created primitives
    this.primitiveList = {};
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

        prim.getDOMNode().addEventListener("mousedown",
            function(){ primitiveManager.primitiveSelected(id); snapping.newSnapObject(); },
            false);

        this.primitiveList[id] = prim;

        this.updateTransformUIFromCurrentObject();

        selectedPrimitiveIDs = [];

        this.selectCurrentPrimitive(id);
        ui.treeViewer.addPrimitive(id, prim.getName());
        ui.treeViewer.moveExistableNodeToGroup(id, "Scene");
                
        return this.primitiveList[id];
    };
    
    
    
    /*
     * Clones a primitive with all its parameters
     * @returns {null}
     */
    this.clonePrimitiveGroup = function(){
        var primitiveToClone = this.primitiveList[currentPrimitiveID];

        var clone = this.addPrimitive(primitiveToClone.getPrimType(), primitiveToClone.getParameters());

        clone.setTranslationAsVec(primitiveToClone.getTranslation());
        clone.setScaleAsVec(primitiveToClone.getScale());

        this.updateTransformUIFromCurrentObject();

        this.highlightCurrentBoundingVolume(true);
    };
    

    
    
    /*
     * Sets the visibility of a primitive
     * @param {string} id of the primitive
     * @param {bool} bool visibility that should be set (true: visible)
     * @returns {null}
     */
    this.setPrimitiveVisibility = function(id, bool){
        this.primitiveList[id].getMatrixTransformNode().setAttribute("render", bool);
    };



    /*
     * Clears the current selection and disables the UI elements for transformation editing.
     */
    this.clearSelection = function() {
        currentPrimitiveID = "";
        this.highlightCurrentPrimitive(false);
        this.highlightCurrentBoundingVolume(false);

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
        this.highlightCurrentPrimitive(true);
        selectedPrimitiveIDs = [id];

        ui.clearParameters();
        ui.createParameters(this.primitiveList[id].getParameters(), this.primitiveList[id].getDOMNode());
        ui.setMaterial(this.primitiveList[id].getMaterial());

        ui.treeViewer.activate(id);

        this.enableTransformationUI();
        ui.RBAccordion.disable(false);

        this.updateTransformUIFromCurrentObject();
    };



    /*
     * Callback for handling movement values on mouse interaction
     * @param {X3DNode} the interacting element
     * @param {SFVec3f} new translation value
     */
    this.primitiveMoved = function(elem, pos, primitive) {
        //if SHIFT is pressed, do nothing (-> group selection)
        if (!keyPressed[16])
        {
            HANDLING_MODE = 'translation';

            primitiveManager.highlightCurrentBoundingVolume(true);

            // update stored transform values and GUI elements appropriately
            // TODO; this is still  _very_ slow in Safari, seems to trigger something else
            primitive.setTranslation(pos.x, pos.y, pos.z);
            primitiveManager.updateTransformUIFromCurrentObject();

            // when snapping is active, the selected item position is always known and calculate the position the other
            snapping.startSnapping();
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
        if (currentPrimitiveID  && currentPrimitiveID !== "") {
            var matrixTransformNode = this.primitiveList[currentPrimitiveID].getMatrixTransformNode();
            
            if (matrixTransformNode._iMove) {
                matrixTransformNode._iMove.detachHandlers();
            }

            for (var i = 0; i < matrixTransformNode.childNodes.length; i++)
            {
                // check if we have a real X3DOM Node; not just e.g. a Text-tag
                if (matrixTransformNode.childNodes[i].nodeType === Node.ELEMENT_NODE)
                { 
                    matrixTransformNode.removeChild(matrixTransformNode.childNodes[i]);
                    ui.treeViewer.removeNode(currentPrimitiveID);
                    delete this.primitiveList[currentPrimitiveID];

                    this.clearSelection();
                    this.primitiveCounter--;
                }
            }

            document.getElementById('root').removeChild(matrixTransformNode);
        }
    };


    /*
     * Removes all primitives from the DOM and from primitive array
     */
    this.removeAllNodes = function()
    {
        for (var key in this.primitiveList) {
            if (this.primitiveList[key]) {
                currentPrimitiveID = key;
                this.removeNode();
            }
        }

        this.primitiveList = [];
        currentPrimitiveID = "";
        this.primitiveCounter = 0;
    };


    this.updateGridSize = function(size)
    {
        for (var key in this.primitiveList) {
            if (this.primitiveList[key]) {
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
        this.highlightCurrentPrimitive(false);
        if (element === "diffuse" || element === "specular" || element === "emissive") {
            this.primitiveList[currentPrimitiveID].material.setAttribute(element+'Color', rgb);
        }
        if(element === "transparency" || element === "shininess") {
            this. primitiveList[currentPrimitiveID].material.setAttribute(element, rgb);
        }
    };



    /*
     * Will be called if a primitive is picked and should
     * set the values of translation, rotation or scaling
     * @param {type} id name of the primitive's values that should be set
     * @returns {null}
     */
    this.primitiveSelected = function(id){
        var idx;

        if (typeof id !== 'undefined')
        {
            //if nothing is selected, use this as the primary primitive (which gets transformed etc.)
            if (selectedPrimitiveIDs.length === 0 || !keyPressed[16])
            {
                this.selectCurrentPrimitive(id);

                if (HANDLING_MODE === "hand")
				{
                    controller.Activate("translation");
				}

                this.updateTransformUIFromCurrentObject();
            }
            //if there is already a selected object and SHIFT is pressed, add/remove object to/from selection
            else if (keyPressed[16] && selectedPrimitiveIDs[0] !== id)
            {
                idx = selectedPrimitiveIDs.indexOf(id);

                //add to selection
                if (idx === -1)
                {
                    selectedPrimitiveIDs.push(id);

                    this.primitiveList[id].getMatrixTransformNode().highlight(false, highlightCol);
                    this.primitiveList[id].getMatrixTransformNode().highlight(true,  highlightCol);
                }
                //remove from selection
                else
                {
                    selectedPrimitiveIDs.splice(idx, 1);

                    this.primitiveList[id].getMatrixTransformNode().highlight(false, highlightCol);
                }

                //if we started to group primitives, disable the transformation UI
                if (selectedPrimitiveIDs.length === 2)
                {
                    this.disableTransformationUI();
                    ui.RBAccordion.disable(true);
                }
            }

            //if we stopped to group primitives, enable the transformation UI
            if (selectedPrimitiveIDs.length === 1)
            {
                this.enableTransformationUI();
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
            var thePrimitive = this.primitiveList[currentPrimitiveID];

            bbTransform.setAttribute("matrix", thePrimitive.getMatrixTransformNode().getAttribute("matrix"));

            volume = thePrimitive.getDOMNode()._x3domNode.getVolume();
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
            this.highlightCurrentBoundingVolume(on);

            //un-highlight all primitives, then highlight the current primitive
            for (var key in this.primitiveList)
            {
                if (this.primitiveList[key])
                {
                    this.primitiveList[key].getMatrixTransformNode().highlight(false, highlightCol);
                }
            }
            this.primitiveList[currentPrimitiveID].getMatrixTransformNode().highlight(true, highlightCol);
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
            objectToBeUpdated = groupManager.getCurrentGroup();
        }
        //PRIMITIVE MODE
        else
        {
            objectToBeUpdated = this.primitiveList[currentPrimitiveID];
        }

        var valX = ui.BBTransX.get();
        var valY = ui.BBTransY.get();
        var valZ = ui.BBTransZ.get();

        if (HANDLING_MODE === "translation")
        {
            objectToBeUpdated.setTranslation(valX, valY, valZ);
        }
        else if (HANDLING_MODE === "rotation")
        {
            objectToBeUpdated.setRotationAngles(valX, valY, valZ);
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
    //          - better assume that we have no parameters, but we only handle the "current" primitive or group
    this.updateTransformUIFromCurrentObject = function() {
        if (currentPrimitiveID != "")
        {
            var currentObject;
            var vec;

            if (ui.groupModeActive())
            {
                currentObject = groupManager.getCurrentGroup();
            }
            else
            {
                currentObject = this.primitiveList[currentPrimitiveID];
            }

            ui.BBPrimName.set(currentObject.getName());

            if (HANDLING_MODE === "rotation")
            {
                vec = currentObject.getRotationAngles();
            }
            else if (HANDLING_MODE === "translation")
            {
                vec = currentObject.getTranslation();
            }
            else if (HANDLING_MODE === "scale")
            {
                vec = currentObject.getScale();
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
            this.primitiveList[currentPrimitiveID].setName(ui.BBPrimName.get());
            ui.treeViewer.rename(currentPrimitiveID, ui.BBPrimName.get());
        }
    };

    
    
    /*
     * Returns the currently selected primitive
     * @returns {primitive}
     */
    this.getCurrentPrimitive = function(){
        return this.primitiveList[currentPrimitiveID];
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
            return this.primitiveList[id];
        }
        else {
            return null;
        }
    };



    /*
     * Returns a list with all primitives IDs
     * @returns {List of IDs of all primitives}
     */
    this.getIDList = function(){
        var idList = [];
        for (var key in this.primitiveList){
            idList.push(key);
        }
        
        return idList;
    };
}
