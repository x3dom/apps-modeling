/*
 * Group class. A Group object contains all information about a Group of objects.
 * This includes, for instance, the ids of the objects as well as the group's name.
 */
function Group(name){
    //list of object IDs
    this.objectIDList = [];

    //name the group
    if (typeof name === 'undefined')
    {
        this.name = "group_" + groupCounter++;
    };



    /*
     * Appends a list of object IDs to the current object ID list.
     * Duplicate entries are avoided.
     */
    this.addObjectList(objIDs)
    {
        objectIDList = objectIDList.concat(objIDs);
    };



    /*
     * Adds the object with the given id to this group.
     */
    this.addObject = function(id){
        if (typeof id !== 'undefined')
        {
            //check whether the object is inside the list - if so, do nothing
            if (objectIDList.indexOf(id) === -1)
            {
                objectIDList.push(id);
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
    var groupList = [];
    // id of the current group, if any
    var currentGroup = null;
    // count of all groups that were created during this session
    var groupCounter = 0;
    // reference to this object
    var that = this;


    this.groupSelectedObjects = function(){
        var g;

        //avoid that two objects belong to the same group:
        //if the user wants to group objects while a group is selected, do nothing
        if (!ui.groupModeActive())
        {
            //put the IDs of the selected objects into a new group
            //(a default name is assigned to the new group)
            g = new Group();
            g.addObjectList(primitiveManager.getSelectedObjectIDs());

            //put the new group in the list of groups
            groupList.push(g);

            //make this the current group
            currentGroup = g;

           //enable group mode in the ui
            ui.toggleGroupMode(true);
        }
    };



    this.ungroupSelectedObjects = function(){
        if (currentGroup){
            //remove the current group
            //@todo: make it work
            //...

        }

        //disable group mode in the ui
        ui.toggleGroupMode(false);
    };
};
