
window.URL = window.URL || window.webkitURL;


//this map holds the information whether a component with a given name has already been registered
var registeredComponentTypeToX3DStrings = {};


function getOrCreateRegisteredComponentX3DString(typeName, x3dStr){
    var inlineElement;
    var modelStringURLBlob;

    if (typeof registeredComponentTypeToX3DStrings[typeName] === 'undefined')
    {
        registeredComponentTypeToX3DStrings[typeName] = x3dStr;

        inlineElement = document.createElement("inline");

        //create a blob from the component's x3d representation, and use it as url for the inline node
        modelStringURLBlob = new Blob([x3dStr], {type: 'text/plain'});

        modelStringURL = window.URL.createObjectURL(modelStringURLBlob);

        inlineElement.setAttribute("DEF", "COMPONENT_" + typeName);
        inlineElement.setAttribute("url", modelStringURL);

        document.getElementById('componentsRoot').appendChild(inlineElement);
    }

    return registeredComponentTypeToX3DStrings[typeName];
};


Component.prototype = new TransformableObject();
Component.prototype.constructor = Component;

function Component(typeName){
    //here, we assume that the component type has already been registered!
    if (typeof registeredComponentTypeToX3DStrings[typeName] === 'undefined')
    {
        x3dom.debug.logError("Cannot create component instance of type \"" + typeName + "\", no such type registered.");
        return;
    }

    //not very elegant, but necessary because of the dynamic id
    //(which differs among instances, in contrast to other members of the prototype)
    this.init();

    var that = this;

    //scale to editor units
    this.setScale(0.01, 0.01, 0.01);

    this.domNode = document.createElement("inline");

    this.matrixTransformNode.appendChild(this.domNode);

    document.getElementById('root').appendChild(this.matrixTransformNode);

    //===============
    //BEGIN ISSUE: somehow, the USE mechanism is not working here

    //A) how we want it
    //this.domNode.setAttribute("USE", "COMPONENT_" + typeName);

    //B) workaround (brute-force reloading the inlined scene)
    var modelStringURLBlob = new Blob([getOrCreateRegisteredComponentX3DString(typeName)], {type: 'text/plain'});
    var modelStringURL     = window.URL.createObjectURL(modelStringURLBlob);
    this.domNode.setAttribute("url", modelStringURL);

    //END ISSUE
    //===============

    // wrapper for adding moving functionality, last param is callback function,
    // must be called _after_ having added node to tree since otherwise uninitialized
    new x3dom.Moveable(document.getElementById("x3d"),
        this.matrixTransformNode,
        function(elem, pos){ primitiveManager.objectMoved(elem, pos, that); },
        controller.getGridSize());
};
