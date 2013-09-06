/*
 * Group class. A Group object contains all information about a Group of objects.
 * This includes, for instance, the ids of the objects as well as the group's name.
 */
function Group(objIDs, name) {
    var root;
    var i;
    var prim;
    var primMatrixTransformNode;
    var vol;
    var vec;

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

    var that = this;


    /*
     * Returns the DOM Node of this group.
     * @returns {DOMNode}
     */
    this.getGroupNode = function(){
        return that.groupNode;
    };



    /*
     * Returns the DOM Node of this group's matrix transform.
     * @returns {DOMNode}
     */
    this.getMatrixTransformNode = function(){
        return that.matrixTransformNode;
    };



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


    //list of object IDs
    this.objectIDList = [];
    //name the group
    this.name = "";
    //group, transform and matrixTransform nodes, which represents this group inside the scene graph
    this.groupNode           = document.createElement("Group");
    this.matrixTransformNode = document.createElement("MatrixTransform");

    root = document.getElementById('root');
    root.appendChild(this.matrixTransformNode);
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
            primMatrixTransformNode = primitiveManager.getPrimitiveByID(objIDs[i]).getMatrixTransformNode();

            root.removeChild(primMatrixTransformNode);

            //important - otherwise, the backend graph is not properly rebuilt after insertion
            removeX3DOMBackendGraph(primMatrixTransformNode);

            this.groupNode.appendChild(primMatrixTransformNode);

            //after deletion of the backend graph, the highlight property got lost
            primMatrixTransformNode.highlight(false, "1 1 0");
            primMatrixTransformNode.highlight(true,  "1 1 0");

            this.objectIDList.push(objIDs[i]);
        }
    }

    //in order to properly rotate/translate the group, change the transform values of all its primitives:
    //each primitive needs to be transformed relative to the group's center point
    vol = this.groupNode._x3domNode.getVolume();

    for (i = 0; i < objIDs.length; ++i)
    {
        prim = primitiveManager.getPrimitiveByID(objIDs[i]);

        vec = prim.getTranslationAsVec().subtract(vol.center);

        prim.setTranslation(vec.x, vec.y, vec.z);
    }

    this.setTranslation(vol.center.x,vol.center.y, vol.center.z);




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
            var t = that.currentGroup.getMatrixTransformNode();
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
