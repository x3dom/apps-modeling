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
        function(elem, pos){ primitiveManager.objectMoved(elem, pos, that) },
        controller.getGridSize());

    this.domNode.addEventListener("mousedown",
        (function(id){
            return function(){ primitiveManager.groupPicked(id); }
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
