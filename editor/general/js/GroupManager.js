/*
 * Group class. A Group object contains all information about a Group of objects.
 * This includes, for instance, the ids of the objects as well as the group's name.
 */
function Group(objIDs, name) {
    var root;
    var i;
    var prim;
    var vol;
    var vec;

    var that = this;

    //list of object IDs
    this.objectIDList = [];
    //name the group
    this.name = "";
    //group, transform and matrixTransform nodes, which represents this group inside the scene graph
    this.groupNode           = document.createElement("Group");
    this.transformNode       = document.createElement("Transform");
    this.matrixTransformNode = document.createElement("MatrixTransform");
    this.matrixTransformNode.Transformation = {};
    this.matrixTransformNode.Transformation.rotationX = 0.0;
    this.matrixTransformNode.Transformation.rotationY = 0.0;
    this.matrixTransformNode.Transformation.rotationZ = 0.0;

    root = document.getElementById('root');
    root.appendChild(this.transformNode);
    this.transformNode.appendChild(this.matrixTransformNode);
    this.matrixTransformNode.appendChild(this.groupNode);

    if (typeof name === 'undefined')
    {
        this.name = "group_" + groupManager.groupCounter++;
    }

    //move all new object IDs into this group
    for (i = 0; i < objIDs.length; ++i)
    {
        //check whether the object is inside the list - if so, do nothing
        if (this.objectIDList.indexOf(objIDs[i]) === -1)
        {
            prim = primitiveManager.getPrimitiveByID(objIDs[i]);

            root.removeChild(prim);

            //important - otherwise, the backend graph is not properly rebuilt after insertion
            removeX3DOMBackendGraph(prim);

            this.groupNode.appendChild(prim);

            //after deletion of the backend graph, the highlight property got lost
            prim.highlight(false, "1 1 0");
            prim.highlight(true,  "1 1 0");

            this.objectIDList.push(objIDs[i]);
        }
    }

    //in order to properly rotate/translate the group, change the transform values of all its primitives:
    //each primitive needs to be transformed relative to the group's center point
    vol = this.groupNode._x3domNode.getVolume();

    for (i = 0; i < objIDs.length; ++i)
    {
        prim = primitiveManager.getPrimitiveByID(objIDs[i]);

        //'prim' is already the transform node
        vec = x3dom.fields.SFVec3f.parse(prim.getAttribute('translation')).subtract(vol.center);

        prim.setAttribute('translation', vec.toString());
    }

    this.transformNode.setAttribute('translation', vol.center.toString());



    /*
     * Returns the DOM Node of this group.
     * @returns {DOMNode}
     */
    this.getGroupNode = function(){
        return that.groupNode;
    };



    /*
     * Returns the DOM Node of this group's transform.
     * @returns {DOMNode}
     */
    this.getTransformNode = function(){
        return that.transformNode;
    };



    /*
     * Returns the DOM Node of this group's matrix transform.
     * @returns {DOMNode}
     */
    this.getMatrixTransformNode = function(){
        return that.matrixTransformNode;
    };
}


/*
 * The GroupManager component handles all grouping functionality.
 * @returns {GroupManager}
 */
function GroupManager() {

    // list of all created groups
    this.groupList = [];
    // current group, if any
    this.currentGroup = null;
    // count of all groups that were created during this session
    this.groupCounter = 0;
    // reference to this object
    var that = this;



    this.getCurrentGroup = function(){
        return that.currentGroup;
    };



    this.getCurrentGroupID = function(){
        return that.currentGroup.name;
    };



    this.setCurrentGroup = function(g){
        that.currentGroup = g;
    };


    this.primitiveMoved = function(elem, pos) {
        primitiveManager.highlightCurrentBoundingVolume(true);
    };


    this.groupSelectedObjects = function(){
        //avoid that two objects belong to the same group:
        //if the user wants to group objects while a group is selected, do nothing
        if (!ui.groupModeActive())
        {
            //put the IDs of the selected objects into a new group
            //(a default name is assigned to the new group)
            var g = new Group(primitiveManager.getSelectedPrimitiveIDs());

            //put the new group in the list of groups
            that.groupList.push(g);

            //make this the current group
            that.currentGroup = g;

            //enable group mode in the ui
            ui.toggleGroupMode(true);

            //this is necessary in order to properly initialize the group's bounding box
            var t = that.currentGroup.getTransformNode();
            t._x3domNode.nodeChanged();
            primitiveManager.highlightCurrentBoundingVolume(true);

            new x3dom.Moveable(document.getElementById("x3d"), t, this.primitiveMoved, controller.getGridSize());
        }
    };

    this.updateGridSize = function(size)
    {
        if (this.currentGroup) {
            var ot = this.currentGroup.getTransformNode();
            if (ot && ot._iMove) {
                ot._iMove.setGridSize(size);
            }
        }
    };


    this.ungroupSelectedObjects = function(){
        if (that.currentGroup){
            //remove the current group
            //@todo: make it work
            //...

        }

        //disable group mode in the ui
        ui.toggleGroupMode(false);
    };
}
