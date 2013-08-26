/*
 * The GroupManager component handles all grouping functionality.
 * @returns {GroupManager}
 */
function GroupManager(){

    // list of all created groups
    var groupList = {};
    // id of the current group, if any
    var currentGroup = null;
    // count of all groups that were created during this session
    var groupCounter = 0;
    // reference to this object
    var that = this;


    this.groupSelectedObjects = function(){
        //@todo: make it work
        console.log("Bla");
    };

    this.ungroupSelectedObjects = function(){
        //@todo: make it work
        console.log("Blubb");
    };
};
