// PrimitiveManager handles the adding of new primitives and their behaviour
var primitiveManager = new PrimitiveManager();
// GroupManager handles grouping of primitives
var groupManager = new GroupManager();
// UI handles all the access to all gui elements
var ui = new UI(primitiveManager);
// Controller that handles the activation of the transformation modes
var controller = new Controller(ui);
// Variable that defines the handling mode
var HANDLING_MODE = "translation";

window.onload = function(){
    ui.initialize(); 
    controller.Activate("hand");
    primitiveManager.clearTransformationValues();
    /*for (var i = 0; i < 60; i++){
        addElement("Element_"+i, "Primitive: "+i);
    }

    for (var i = 0; i < 2; i++){
        addGroup("Group_"+i, "Group: "+i);
    }

    for (var i = 3; i < 15; i++){
        moveExistableNodeToGroup("Element_"+i, "Group_0");
    }

    for (var i = 5; i < 8; i++){
        moveExistableNodeToGroup("Element_"+i, "Group_1");
    }*/
};

