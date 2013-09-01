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
    primitiveManager.clearSelection();
    ui.treeViewer.addGroup("Scene", "Scene");
};


//utility function - we need it if we want to move an X3DOM object inside the DOM
//in that case, the X3DOM backend graph needs to be cleared, it then gets rebuilt after re-insertion
// TODO: this does not trigger any internal cleanups, better also call removeChild on DOM node first
function removeX3DOMBackendGraph(domNode)
{
    var children = domNode.childNodes;
    var i;

    for (i = 0; i < children.length; ++i)
    {
        removeX3DOMBackendGraph(children[i]);
    }

    domNode._x3domNode = null;
}
