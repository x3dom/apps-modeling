/*
 * Group class. A Group object contains all information about a Group of objects.
 * This includes, for instance, the ids of the objects as well as the group's name.
 */
function Group(name){
    var that = this;

    //list of object IDs
    this.objectIDList = [];
    //name the group
    this.name = "";
    //group, transform and matrixTransform nodes, which represents this group inside the scene graph
    this.groupNode           = document.createElement("Group");
    this.transformNode       = document.createElement("Transform");
    this.matrixTransformNode = document.createElement("MatrixTransform");

    document.getElementById('root').appendChild(this.transformNode);
    this.transformNode.appendChild(this.matrixTransformNode);
    this.matrixTransformNode.appendChild(this.groupNode);

    if (typeof name === 'undefined')
    {
        this.name = "group_" + groupManager.groupCounter++;
    };



    this.getGroupNode = function(){
        return that.groupNode;
    };



    this.getTransformNode = function(){
        return that.transformNode;
    };



    this.getMatrixTransformNode = function(){
        return that.matrixTransformNode;
    };



    /*
     * Appends a list of object IDs to the current object ID list.
     * Duplicate entries are avoided.
     */
    this.addObjectList = function(objIDs){
        var root;
        var i;

        //move all new object IDs into this group
        for (i = 0; i < objIDs.length; ++i)
        {
            that.addObject(objIDs[i]);
        }
    };



    /*
     * Adds the object with the given id to this group.
     * Duplicate entries are avoided.
     */
    this.addObject = function(id){
        var prim;

        if (typeof id !== 'undefined')
        {
            //check whether the object is inside the list - if so, do nothing
            if (that.objectIDList.indexOf(id) === -1)
            {
                prim = primitiveManager.getPrimitiveByID(id);

                document.getElementById('root').removeChild(prim);

                //important - otherwise, the backend graph is not properly rebuilt after insertion
                removeX3DOMBackendGraph(prim);

                that.groupNode.appendChild(prim);

                //after deletion of the backend graph, the highlight property got lost
                prim.highlight(false, "1 1 0");
                prim.highlight(true,  "1 1 0");

                that.objectIDList.push(id);
            }
        }
        else
        {
            x3dom.debug.logError("Cannot add object to group: ID must be specified.");
        }
    };



    /*
     * Removes the object with the given id from this group.
     */
    this.removeObject = function(id){
        //@todo: DOM manipulations

        var idx;

        if (typeof id !== 'undefined')
        {
            idx = objectIDList.indexOf(id);

            //if there is an object with the given ID in the list, remove it - else, do nothing
            if (idx === -1)
            {
                objectIDList.splice(idx, 1);
            }
        }
        else
        {
            x3dom.debug.logError("Cannot remove object from group: ID must be specified.");
        }
    };
};


/*
 * The GroupManager component handles all grouping functionality.
 * @returns {GroupManager}
 */
function GroupManager(){

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



    this.groupSelectedObjects = function(){
        var g;

        //avoid that two objects belong to the same group:
        //if the user wants to group objects while a group is selected, do nothing
        if (!ui.groupModeActive())
        {
            //put the IDs of the selected objects into a new group
            //(a default name is assigned to the new group)
            g = new Group();
            g.addObjectList(primitiveManager.getSelectedPrimitiveIDs());

            //put the new group in the list of groups
            that.groupList.push(g);

            //make this the current group
            that.currentGroup = g;

            //enable group mode in the ui
            ui.toggleGroupMode(true);

            //this is necessary in order to properly initialize the group's bounding box
            that.currentGroup.getTransformNode()._x3domNode.nodeChanged();
            primitiveManager.highlightCurrentBoundingVolume(true);
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
};
