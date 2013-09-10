/*
 * Group class, inherits from TransformableObject.
 * A Group object contains all information about a Group of objects.
 * This includes, for instance, the ids of the objects.
 */
Group.prototype = new TransformableObject();
Group.prototype.constructor = Group;
function Group(primIDs) {

    this.init();

    //list of primitive IDs
    this.primitiveIDList = [];
    //group node, which represents this group inside the scene graph
    this.domNode = document.createElement("Group");


    var root = document.getElementById('root');
    var i;
    var prim;
    var primMatrixTransformNode;
    var vol;
    var vec;

    this.matrixTransformNode.appendChild(this.domNode);
    root.appendChild(this.matrixTransformNode);

    //move all new object IDs into this group
    for (i = 0; i < primIDs.length; ++i)
    {
        //check whether the object is inside the list - if so, do nothing
        if (this.primitiveIDList.indexOf(primIDs[i]) === -1)
        {
            primMatrixTransformNode = primitiveManager.getPrimitiveByID(primIDs[i]).getMatrixTransformNode();

            root.removeChild(primMatrixTransformNode);

            this.domNode.appendChild(primMatrixTransformNode);

            //after deletion of the backend graph, the highlight property got lost
            primMatrixTransformNode.highlight(false, "1 1 0");
            primMatrixTransformNode.highlight(true,  "1 1 0");

            this.primitiveIDList.push(primIDs[i]);
        }
    }

    //in order to properly rotate/translate the group, change the transform values of all its primitives:
    //each primitive needs to be transformed relative to the group's center point
    vol = this.domNode._x3domNode.getVolume();

    for (i = 0; i < primIDs.length; ++i)
    {
        prim = primitiveManager.getPrimitiveByID(primIDs[i]);

        vec = prim.getTranslation().subtract(vol.center);

        prim.setTranslationAsVec(vec);
    }

    this.setTranslationAsVec(vol.center);

    // wrapper for adding moving functionality, last param is callback function,
    // must be called _after_ having added node to tree since otherwise uninitialized
    var that = this;
    new x3dom.Moveable(document.getElementById("x3d"),
        this.matrixTransformNode,
        function(elem, pos){ primitiveManager.objectMoved(elem, pos, that); },
        controller.getGridSize());

    this.domNode.addEventListener("mousedown",
        (function(id){
            return function(){ primitiveManager.groupPicked(id); };
        })(this.id),
        false);
}



/*
 * Returns the DOM Node of this group.
 * @returns {DOMNode}
 */
Group.prototype.getDOMNode = function(){
    return this.domNode;
};



/*
 * Returns the list of all primitive IDs for this group.
 * @returns {DOMNode}
 */
Group.prototype.getPrimitiveIDList = function(){
    return this.primitiveIDList;
};



/**
 * Releases all primitives from this group, puts them back into the DOM.
 */
Group.prototype.releaseAllPrimitives = function(){
    //@todo: make it work!
    var root = document.getElementById('root');
    var i;
    var prim;
    var primMatrixTransformNode;
    var primMatrix;
    var groupMatrix;
    var transVec = new x3dom.fields.SFVec3f(0, 0, 0);
    var scaleVec = new x3dom.fields.SFVec3f(1, 1, 1);
    var scaleRotQuat = new x3dom.fields.Quaternion(0, 0, 1, 0);
    var rotationQuat = new x3dom.fields.Quaternion(0, 0, 1, 0);
    var angles;
    var rad2Deg = 180.0 / Math.PI;

    //apply the group's transformations to all the primitives
    groupMatrix = x3dom.fields.SFMatrix4f.parse(this.matrixTransformNode.getAttribute("matrix")).transpose();

    for (i = 0; i < this.primitiveIDList.length; ++i)
    {
        prim                    = primitiveManager.getPrimitiveByID(this.primitiveIDList[i]);
        primMatrixTransformNode = prim.getMatrixTransformNode();
        primMatrix              = x3dom.fields.SFMatrix4f.parse(primMatrixTransformNode.getAttribute("matrix")).transpose();

        primMatrix = groupMatrix.mult(primMatrix);


        //@todo: extract trans, rot, scale and center, and update values of each primitive's matrix
        primMatrix.getTransform(transVec, rotationQuat, scaleVec, scaleRotQuat);

        prim.setTranslationAsVec(transVec);
        prim.setScaleAsVec(scaleVec);

        //for rotation, find euler angles
        angles = rotationQuat.toMatrix().getEulerAngles();
        prim.setRotationAngles(angles[0] * rad2Deg, angles[1] * rad2Deg, angles[2] * rad2Deg);

        primMatrixTransformNode.setAttribute("matrix", matrixToGLString(primMatrix));
    }


    //move DOM objects out of the group
    for (i = 0; i < this.primitiveIDList.length; ++i)
    {
        prim                    = primitiveManager.getPrimitiveByID(this.primitiveIDList[i]);
        primMatrixTransformNode = prim.getMatrixTransformNode();

        this.domNode.removeChild(primMatrixTransformNode);

        root.appendChild(primMatrixTransformNode);

        //re-initialize mouse callbacks
        prim.getDOMNode().addEventListener("mousedown",
            (function(id){
                return function(){ primitiveManager.primitivePicked(id); snapping.newSnapObject(); }
            })(prim.getID()),
            false);

        // wrapper for adding moving functionality, last param is callback function,
        // must be called _after_ having added node to tree since otherwise uninitialized

        new x3dom.Moveable(document.getElementById("x3d"),
            primMatrixTransformNode,
            (function(primitive){
                return function(elem, pos){ primitiveManager.objectMoved(elem, pos, primitive); }
            })(prim),
            controller.getGridSize());
    }

    //remove the group from the DOM
    root.removeChild(this.matrixTransformNode);


    //finally, empty the list of primitive IDs
    this.primitiveIDList = [];
}
