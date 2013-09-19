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
        x3dom.debug.logError("Error: Primitive constructor needs primType and parameters.");
        return;
    }

    //not very elegant, but necessary because of the dynamic id
    //(which differs among instances, in contrast to other members of the prototype)
    this.init();

    var that = this;

    this.primType   = primType;
    this.domNode    = document.createElement(this.primType);

    //two exceptions:
    //for the "Origin" and "Reference Point" primitives, create a special indexedlineset,
    //which represents a moveable coordinate frame
    if (this.primType === "IndexedLineSet")
    {
        (function(){
            var coordIndexStr = "";
            var pointStr      = "";
            var colorStr       = "";

            //"Origin" geometry
            if (parameters[0].isOrigin)
            {
                coordIndexStr = "0 1 -1, 2 3 -1, 4 5 -1";
                pointStr      = "1 0 0, 0 0 0, 0 1 0, 0 0 0, 0 0 1, 0 0 0";
                colorStr      = "1 0 0, 1 0 0, 0 0 1, 0 0 1, 0 1 0, 0 1 0";
                origin_refPoints_added[0] = 1;
            }
            //"Reference Point" geometry
            else
            {
                //todo: adapt for refpoint 3D icon
                coordIndexStr = "0 1 -1, 2 3 -1, 4 5 -1, 6 7 -1, 8 9 -1, 10 11 -1, 12 13 -1, \n\
                                 14 15 -1, 16 17 -1, 18 19 -1, 20 21 -1,\n\
                                 22 23 -1, 24 25 -1, 26 27 -1, 28 29 -1,\n\
                                 30 31 -1, 32 33 -1, 34 35 -1, 36 37 -1";
                pointStr      = "-0.05 0.25 0, 0.05 0.25 0, \n\
                                 0 0.35 0, 0 0 0, \n\
                                 0.05 0.25 0, 0 0.35 0, -0.05 0.25 0, 0 0.35 0, \n\
                                 0.0 0.25 0.05, 0 0.35 0, 0.0 0.25 -0.05, 0 0.35 0\n\
                                 0.0 0.25 -0.05, 0 0.25 0.05,\n\
                                 -0.025 0 -0.025, 0.025 0 -0.025, 0.025 0 -0.025, 0.025 0 0.025, -0.025 0 -0.025, -0.025 0 0.025, -0.025 0 0.025, 0.025 0 0.025,\n\
                                 -0.025 0.025 -0.025, 0.025 0.025 -0.025, 0.025 0.025 -0.025, 0.025 0.025 0.025, -0.025 0.025 -0.025, -0.025 0.025 0.025, -0.025 0.025 0.025, 0.025 0.025 0.025,\n\
                                 -0.025 0 -0.025, -0.025 0.025 -0.025, -0.025 0 0.025, -0.025 0.025 0.025, 0.025 0 -0.025, 0.025 0.025 -0.025, 0.025 0 0.025, 0.025 0.025 0.025, ";
                colorStr      = "0.12 0.8 0, 0.12 0.8 0, 0.12 0.8 0, 0.12 0.8 0, 0.12 0.8 0, 0.12 0.8 0, 0.12 0.8 0, \n\
                                 0.12 0.8 0, 0.12 0.8 0, 0.12 0.8 0, 0.12 0.8 0, 0.12 0.8 0, 0.12 0.8 0, 0.12 0.8 0, \n\
                                 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9,\n\
                                 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9,\n\
                                 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, \n\
                                 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9, 0 0.5 0.9";
                origin_refPoints_added[1]++;
            }

            if (origin_refPoints_added[0] > 0 && origin_refPoints_added[1] > 0){
                document.getElementById("warning").style.visibility = "hidden";
            }
            else {
                document.getElementById("warning").style.visibility = "visible";
            }

            that.domNode.setAttribute("coordIndex", coordIndexStr);
            that.domNode.setAttribute("isPickable", "true");

            var coordNode = document.createElement("Coordinate");
            var colorNode = document.createElement("Color");

            coordNode.setAttribute("point", pointStr);
            colorNode.setAttribute("color", colorStr);

            that.domNode.appendChild(coordNode);
            that.domNode.appendChild(colorNode);
        })();
    }

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

    if (this.domNode.getAttribute("positive") === "false") {
        this.material.setAttribute("diffuseColor", "#E77F65");
    }

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
    new x3dom.Moveable(document.getElementById("x3d"),
        this.matrixTransformNode,
        function(elem, pos){ primitiveManager.objectMoved(elem, pos, that); },
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
};



/*
 * Returns a simple JSON representation of this object.
 * This includes all relevant members, but no X3DOM nodes.
 * The object is rotated by 90 degrees around the x-axis,
 * so that z points upwards.
 */
Primitive.prototype.toJSON = function(){
    var jsonObj = {
        tX         :  this.translation.x,
        tY         : -this.translation.z,
        tZ         :  this.translation.y,

        rX         :  this.rotationAngles.x,
        rY         : -this.rotationAngles.z,
        rZ         :  this.rotationAngles.y,

        sX         :  this.scale.x,
        sY         : -this.scale.z,
        sZ         :  this.scale.y,

        type       : this.primType,
        parameters : this.parameters,
        id         : this.id
    };
    return jsonObj;
};



/*
 * The PrimitiveManager component handles all the behaviour of all 
 * added primitives of the workspace
 * @returns {PrimitiveManager}
 */
function PrimitiveManager(){
    
    // List of all created primitives
    this.primitiveList = {};

    // list of all created groups
    this.groupList = {};

    //ID of the origin primitive, if any
    this.originID = "";

    //counter for enumerating reference points
    this.refPointCounter = 1;

    // actually active id
    var currentObjectID = "";

    // list of all selected primitives (including the first selected one)
    var selectedPrimitiveIDs = [];

    // ui element to get access to the gui elements
    var ui = {};

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

        //special case: allow only one origin instance
        if (primitive === "IndexedLineSet" && this.originID !== "" && parameters[0].isOrigin === "true")
        {
            return;
        }

        ui.toggleGroupMode(false);

        if (HANDLING_MODE === "hand")
            controller.Activate("translation");

        var prim = new Primitive(primitive, parameters);

        var id   = prim.getID();

        if (primitive === "IndexedLineSet")
        {
            if (parameters[0].value == "true")
            {
                prim.setName("Origin");
                this.originID = id;
            }
            else
            {
                prim.setName("RefPnt_" + this.refPointCounter++);
            }
        }

        prim.getDOMNode().addEventListener("mousedown",
            function(){ primitiveManager.primitivePicked(id); snapping.newSnapObject(); },
            false);

        this.primitiveList[id] = prim;

        selectedPrimitiveIDs = [];

        this.selectObject(id);

        this.updateTransformUIFromCurrentObject();

        ui.treeViewer.addPrimitive(id, prim.getName());
        ui.treeViewer.moveExistableNodeToGroup(id, "Scene");
                
        return prim;
    };
    
    
    
    /*
     * Clones a primitive with all its parameters
     * @returns {null}
     */
    this.cloneObject = function(){
        var originalGroup;
        var clonedGroup;
        var primitiveIDs;
        var i;
        var newPrimitiveIDs = [];

        var that = this;

        //creates a clone of the given primitive and returns it
        var clonePrimitive = function(prim)
        {
            var clonedPrim = that.addPrimitive(prim.getPrimType(), prim.getParameters());

            clonedPrim.setTranslationAsVec(prim.getTranslation());
            clonedPrim.setRotationAnglesAsVec(prim.getRotationAngles());
            clonedPrim.setScaleAsVec(prim.getScale());

            return clonedPrim;
        };

        if (!ui.groupModeActive())
        {
            clonePrimitive(this.primitiveList[currentObjectID]);
        }
        else
        {
            originalGroup = this.groupList[currentObjectID];

            //add new primitives, which are clones of the original primitives
            primitiveIDs = originalGroup.getPrimitiveIDList();

            for (i = 0; i < primitiveIDs.length; ++i)
            {
                newPrimitiveIDs.push(clonePrimitive(this.primitiveList[primitiveIDs[i]]).getID());
            }

            selectedPrimitiveIDs = newPrimitiveIDs;

            this.groupSelectedPrimitives();

            clonedGroup = this.groupList[currentObjectID];

            //apply the original group's transformations to the new group
            clonedGroup.setTranslationAsVec(originalGroup.getTranslation());
            clonedGroup.setRotationAnglesAsVec(originalGroup.getRotationAngles());
            clonedGroup.setScaleAsVec(originalGroup.getScale());
        }

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
        this.highlightCurrentObject(false);
        this.highlightCurrentBoundingVolume(false);

        this.disableTransformationUI();
        ui.RBAccordion.disable(true);
        currentObjectID = "";
    };



    /*
     * Selects the primitive with the given ID as the current primitive, meaning that this is the primitive
     * which is affected by transformations and which can be inspected with the UI.
     * Note that this clears the list of selected primitives, only the primary primitive is selected afterwards.
     * @param {string} id name of the primitive or group that should be selected
     * @returns {null}
     */
    this.selectObject = function(id){
        var groupID;

        if (HANDLING_MODE === "hand")
            controller.Activate("translation");

        currentObjectID = id;

        if (!ui.groupModeActive() && (typeof this.groupList[id] !== 'undefined'))
        {
            ui.toggleGroupMode(true);
        }
        else if (ui.groupModeActive() && (typeof this.groupList[id] === 'undefined'))
        {
            ui.toggleGroupMode(false);
        }

        if (ui.groupModeActive())
        {
            selectedPrimitiveIDs = this.groupList[id].getPrimitiveIDList();
        }
        else
        {
            //if a primitive within a group is selected (for instance, in the tree view), select the group instead
            groupID = this.findGroupOfPrimitive(id);
            if (groupID !== "")
            {
                this.selectObject(groupID);
                return;
            }

            selectedPrimitiveIDs = [id];
            ui.clearParameters();
            ui.createParameters(this.primitiveList[id].getParameters(), this.primitiveList[id].getDOMNode());
            ui.setMaterial(this.primitiveList[id].getMaterial());
            ui.RBAccordion.disable(false);
        }

        this.highlightCurrentObject(true);

        ui.treeViewer.activate(id);

        this.enableTransformationUI();

        this.updateTransformUIFromCurrentObject();
    };



    /*
     * Callback for handling movement values on mouse interaction
     * @param {X3DNode} the interacting element
     * @param {SFVec3f} new translation value
     */
    // TODO; this is still  _very_ slow in Safari, seems to trigger something else
    this.objectMoved = function(elem, pos, object) {
        //if SHIFT is pressed, do nothing (-> group selection)
        if (!keyPressed[16])
        {
            controller.Activate('translation')

            //update stored transform values and GUI elements appropriately
            object.setTranslation(pos.x, pos.y, pos.z);

            if (object.getID() !== currentObjectID)
            {
                primitiveManager.selectObject(object.getID());
            }
            else
            {
                primitiveManager.updateTransformUIFromCurrentObject();
                primitiveManager.highlightCurrentBoundingVolume(true);
            }

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
    this.removeCurrentObject = function()
    {
        if (currentObjectID  && currentObjectID !== "") {
            //@todo: make it work for groups
            if (!ui.groupModeActive())
            {
                var matrixTransformNode = this.primitiveList[currentObjectID].getMatrixTransformNode();

                if (matrixTransformNode._iMove) {
                    matrixTransformNode._iMove.detachHandlers();
                }

                for (var i = 0; i < matrixTransformNode.childNodes.length; i++)
                {
                    // check if we have a real X3DOM Node; not just e.g. a Text-tag
                    if (matrixTransformNode.childNodes[i].nodeType === Node.ELEMENT_NODE)
                    {
                        matrixTransformNode.removeChild(matrixTransformNode.childNodes[i]);
                        ui.treeViewer.removeNode(currentObjectID);
                        
                        if (this.primitiveList[currentObjectID].parameters[0].isRefPoint){
                            origin_refPoints_added[1]--;
                        }
                        if (this.primitiveList[currentObjectID].parameters[0].isOrigin){
                            origin_refPoints_added[0] = 0;
                        }
                        if (origin_refPoints_added[0] > 0 && origin_refPoints_added[1] > 0){
                            document.getElementById("warning").style.visibility = "hidden";
                        }
                        else {
                            document.getElementById("warning").style.visibility = "visible";
                        }
                        
                        delete this.primitiveList[currentObjectID];

                        this.clearSelection();
                        this.primitiveCounter--;
                    }
                }

                document.getElementById('root').removeChild(matrixTransformNode);

                this.highlightCurrentBoundingVolume(false);
            }
        }
    };


    /*
     * Removes all primitives from the DOM and from primitive array
     */
    this.removeAllObjects = function()
    {
        for (var key in this.primitiveList) {
            if (this.primitiveList[key]) {
                currentObjectID = key;
                this.removeCurrentObject();
            }
        }

        this.primitiveList = [];
        currentObjectID = "";
        this.primitiveCounter = 0;
    };


    this.updateGridSize = function(size)
    {
        var key, ot;

        for (key in this.primitiveList) {
            if (this.primitiveList[key]) {
                ot = this.primitiveList[key].getMatrixTransformNode();
                if (ot && ot._iMove) {
                    ot._iMove.setGridSize(size);
                }
            }
        }

        for (key in this.groupList) {
            if (this.groupList[key]) {
                ot = this.groupList[key].getMatrixTransformNode();
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
        this.highlightCurrentObject(false);
        if (element === "diffuse" || element === "specular" || element === "emissive") {
            this.primitiveList[currentObjectID].material.setAttribute(element+'Color', rgb);
        }
        if(element === "transparency" || element === "shininess") {
            this. primitiveList[currentObjectID].material.setAttribute(element, rgb);
        }
    };



    /*
     * Will be called if a group is picked.
     * @param {type} id name of the group that was picked
     * @returns {null}
     */
    this.groupPicked = function(id){
        if (id !== currentObjectID)
        {
            primitiveManager.selectObject(id);
        }
        else
        {
            primitiveManager.updateTransformUIFromCurrentObject();
            primitiveManager.highlightCurrentBoundingVolume(true);
        }
    };



    /*
     * Will be called if a primitive is picked.
     * @param {type} id name of the primitive that was picked
     * @returns {null}
     */
    this.primitivePicked = function(id){
        var idx;
        var trafo;

        //if nothing is selected, use this as the primary primitive (which gets transformed etc.)
        if (selectedPrimitiveIDs.length === 0 || !keyPressed[16])
        {
            this.selectObject(id);

            if (HANDLING_MODE === "hand")
            {
                controller.Activate("translation");
            }

            this.updateTransformUIFromCurrentObject();
        }
        //if there is already a selected object and SHIFT is pressed, add/remove object to/from selection
        else if (keyPressed[16] && selectedPrimitiveIDs[0] !== id)
        {
            trafo = this.primitiveList[id].getMatrixTransformNode();

            idx = selectedPrimitiveIDs.indexOf(id);

            //add to selection
            if (idx === -1)
            {
                selectedPrimitiveIDs.push(id);

                trafo.highlight(false, highlightCol);
                trafo.highlight(true,  highlightCol);
            }
            //remove from selection
            else
            {
                selectedPrimitiveIDs.splice(idx, 1);

                trafo.highlight(false, highlightCol);
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
    };
    
    
    
    /*
     * Computes the bounding volume parameters for highlighting, and toggles its visibility.
     * @param {bool} bool parameter to show or to hide the bounding box
     * @returns (undefined)
     */
    this.highlightCurrentBoundingVolume = function(bool){
        var object = this.getCurrentObject();
        var bbTransform = document.getElementById('bbox_transform');
        var volume;
        var min;
        var max;
        var box;

        if (object)
        {
            volume = object.getDOMNode()._x3domNode.getVolume();

            bbTransform.setAttribute("matrix", object.getMatrixTransformNode().getAttribute("matrix"));

            if (volume)
            {
                min = x3dom.fields.SFVec3f.copy(volume.min);
                max = x3dom.fields.SFVec3f.copy(volume.max);

                box = document.getElementById('bbox_points');
                box.setAttribute('point', min.x+' '+min.y+' '+min.z+', '+
                                          min.x+' '+min.y+' '+max.z+', '+
                                          max.x+' '+min.y+' '+max.z+', '+
                                          max.x+' '+min.y+' '+min.z+', '+
                                          min.x+' '+max.y+' '+min.z+', '+
                                          min.x+' '+max.y+' '+max.z+', '+
                                          max.x+' '+max.y+' '+max.z+', '+
                                          max.x+' '+max.y+' '+min.z );
            }
        }

        bbTransform.setAttribute("render", "" + bool);
    };



    /*
     * Highlights or un-highlights the currently selected primitive or group (if any)
     * @param {bool} on specifies whether highlighting should be active
     * @returns (undefined)
     */
    this.highlightCurrentObject = function(on) {
        if (currentObjectID !== "")
        {
            //update the bounding volume, or hide it
            this.highlightCurrentBoundingVolume(true);

            //un-highlight all primitives, then highlight the current primitive
            for (var key in this.primitiveList)
            {
                if (this.primitiveList[key])
                {
                    this.primitiveList[key].getMatrixTransformNode().highlight(false, highlightCol);
                }
            }
            if (on)
            {
                this.getCurrentObject().getMatrixTransformNode().highlight(true, highlightCol);
            }
        }
    };


    
    /*
     * 
     * @returns {undefined}
     */
    //@todo: this function is not very beautiful at the moment:
    //          - actually, some of this is UI functionality
    this.updatePrimitiveTransformFromUI = function() {
        var objectToBeUpdated = this.getCurrentObject();

        var valX =  ui.BBTransX.get();
        var valY =  ui.BBTransZ.get();
        var valZ = -ui.BBTransY.get();

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
            objectToBeUpdated.setScale(valX, valY, -valZ);
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
        if (currentObjectID != "")
        {
            var currentObject;
            var vec;

            currentObject = this.getCurrentObject();

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

            ui.BBTransX.set( vec.x.toFixed(3));
            ui.BBTransZ.set( vec.y.toFixed(3));

            if (HANDLING_MODE !== "scale")
            {
                ui.BBTransY.set(-vec.z.toFixed(3));
            }
            else
            {
                ui.BBTransY.set(vec.z.toFixed(3));
            }
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
    this.setObjectName = function() {
        if (ui.groupModeActive())
        {
            this.groupList[currentObjectID].setName(ui.BBPrimName.get());
        }
        else
        {
            this.primitiveList[currentObjectID].setName(ui.BBPrimName.get());
            ui.treeViewer.rename(currentObjectID, ui.BBPrimName.get());
        }
    };

    
    
    /*
     * Returns the currently selected primitive or group.
     * @returns {primitive}
     */
    this.getCurrentObject = function(){
        var currObj;

        if (ui.groupModeActive())
        {
            currObj = this.groupList[currentObjectID];
        }
        else
        {
            currObj = this.primitiveList[currentObjectID];
        }

        if (typeof currObj === 'undefined')
        {
            if (ui.groupModeActive())
            {
                x3dom.debug.logError("No group with id \"" + currentObjectID + "\" found!");
            }
            else
            {
                // Not really an issue, on init for example there is no current object
                x3dom.debug.logWarning("No primitive with id \"" + currentObjectID + "\" found!");
            }
            return null;
        }

        return currObj;
    };



    /*
     * Returns the ID of the currently selected primitive
     * @returns {primitive}
     */
    this.getCurrentPrimitiveID = function(){
        return currentObjectID;
    };



    /*
     * Returns the currently selected primitive
     * @returns {primitive}
     */
    this.getCurrentPrimitive = function(){
        return this.primitiveList[currentObjectID];
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
     *
     */
    this.getMaterialFor = function(primitive) {
        for (var key in this.primitiveList)
        {
            if (this.primitiveList[key].getDOMNode() == primitive)
                return this.primitiveList[key].getMaterial();
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



    this.groupSelectedPrimitives = function(){
        //avoid that two objects belong to the same group:
        //if the user wants to group objects while a group is selected, do nothing
        if (!ui.groupModeActive())
        {
            //put the IDs of the selected objects into a new group
            //(a default name is assigned to the new group)
            var g = new Group(this.getSelectedPrimitiveIDs());

            //put the new group in the list of groups
            this.groupList[g.getID()] = g;

            //make this the current object
            currentObjectID = g.getID();

            //enable group mode in the ui
            ui.toggleGroupMode(true);

            //this is necessary in order to properly initialize the group's bounding box
            var t = this.getCurrentObject().getMatrixTransformNode();
            t._x3domNode.nodeChanged();

            this.highlightCurrentBoundingVolume(true);
        }
    };



    this.ungroupSelectedPrimitives = function(){
        var group;

        if (ui.groupModeActive() && currentObjectID != "")
        {
            group = this.groupList[currentObjectID];

            group.releaseAllPrimitives();

            //remove the current group form the list
            delete this.groupList[currentObjectID];
        }

        //make sure nothing is selected after the group has been resolved
        primitiveManager.clearSelection();

        //disable group mode in the ui
        ui.toggleGroupMode(false);
    };



    this.findGroupOfPrimitive = function(id){
        var group;

        for (group in this.groupList)
        {
            if (this.groupList[group].getPrimitiveIDList().indexOf(id) !== -1)
            {
                return this.groupList[group].getID();
            }
        }

        return "";
    };



    /**
     * Writes all primitives to the given arrays. Groups are resolved.
     * Positive primitives and negative primitives are distinguished.
     * This also uses a coordinate system which has the z axis pointing upwards,
     * which is the X3DOM coordinate system rotated around the X-axis by -90 degrees.
     */
    this.getSceneData = function(positivePrimitivesJSON, negativePrimitivesJSON)
    {
        var p;
        var g;

        this.clearSelection();

        //resolve groups
        for (g in this.groupList) {
            this.groupList[g].releaseAllPrimitives();
        }

        this.groupList =[];

        //export positive primitives
        for (p in this.primitiveList) {
            positivePrimitivesJSON.push(this.primitiveList[p].toJSON());
        }

        //export negative primitives
        //@todo: make it work
        //...
    }
}
