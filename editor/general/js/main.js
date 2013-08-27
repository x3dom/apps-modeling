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
// snapping added
var snapping = new Snapping();


window.onload = function(){
    ui.initialize(); 
    controller.Activate("hand");
    primitiveManager.clearTransformationValues();
};

