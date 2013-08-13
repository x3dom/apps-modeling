// PrimitiveManager handles the adding of new primitives and their behaviour
var primitiveManager = new PrimitiveManager();
// UI handles all the access to all gui elements
var ui = new UI(primitiveManager);
// Controller that handles the activation of the transformation modes
var controller = new Controller();
// Variable that defines the handling mode
var HANDLING_MODE = "translation";



window.onload = function(){
    controller.Activate("hand");
    ui.initialize(); 
};

