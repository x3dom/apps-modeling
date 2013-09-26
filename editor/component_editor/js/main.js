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
//handles server communication
var storageManager = new StorageManager();
// Shows if origin point and refPoints are added to scene
var origin_refPoints_added = [0, 0];
// primType counter 
var primType_counter = {};



/*
 * Initializes the entire application
 * @returns {undefined}
 */
document.onload = function(){
    ui.initialize();
    ui.initializeComponentEditorSpecialUI();
    controller.Activate("hand");
    primitiveManager.clearSelection();
    ui.treeViewer.addGroup("Scene", "Scene");
};



/*
 * This function monitors the closing of a tab or the browser. If the work isn't
 * completed this function will react by a closing dialog
 * @returns {null}
 */
//window.onbeforeunload = onBeforeUnload;
function onBeforeUnload(oEvent) {
    // return a string to show the warning message (not every browser will use this string in the dialog)
    // or run the code you need when the user closes your page  
    if (origin_refPoints_added[0] === 0 ||
        origin_refPoints_added[1] === 0)
        return "You are closing the application without a complete work.\n" +
               "You have to define an 'Origin' and the 'Reference Points'.\n" +
               "Do you really want to exit the application?";       
}
