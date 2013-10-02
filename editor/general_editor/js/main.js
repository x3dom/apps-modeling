// PrimitiveManager handles the adding of new primitives and their behaviour
var primitiveManager = new PrimitiveManager();
// UI handles all the access to all gui elements
var ui = new UI(primitiveManager);
// Controller that handles the activation of the transformation modes
var controller = new Controller(ui);
// Variable that defines the handling mode
var HANDLING_MODE = "translation";
// Start snapping
var snapping = new Snapping();
// Snapping with mouseevent
var snapContext = new SnapContext();
//handles server communication
var storageManager = new StorageManager();


window.onload = function(){
    ui.initialize();
    controller.Activate("hand");
    primitiveManager.clearSelection();
    ui.treeViewer.addGroup("Scene", "Scene");
};
