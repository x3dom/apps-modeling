// PrimitiveManager handles the adding of new primitives and their behaviour
var primitiveManager = new PrimitiveManager();
// UI handles all the access to all gui elements
var ui = new UI(primitiveManager);
// Controller that handles the activation of the transformation modes
var controller = new Controller(ui);
// Variable that defines the handling mode
var HANDLING_MODE = "translation";
//handles server communication
var storageManager = new StorageManager();
//Starting Snapping
var snapping = new Snapping();
var snapContext = new SnapContext();


window.onload = function(){
    ui.initialize();
    ui.initializePlantEditorSpecialUI();
    controller.Activate("hand");
    primitiveManager.clearSelection();
    ui.treeViewer.addGroup("Scene", "Scene");

    ui.catalogueTreeViewer = new SimpleTreeViewer("catalogueTree", false);
};
