function StorageManager(){}

// the server to which the DSL description is sent
var server_3D_url = "http://localhost:8080/";

StorageManager.prototype.saveScene = function()
{
    var sceneDataDSL = "# scene data exported from X3DOM component editor\n";
    var positivePrimitivesJSON = [];

    var that = this;

    //get the scene data from the primitive manager
    primitiveManager.getSceneData(positivePrimitivesJSON);

    //go through all positive primitives:
    //write each primitive's creation command and transform
    Array.forEach(positivePrimitivesJSON, function(prim){
        //@todo: replace with matching primType
        sceneDataDSL += that.primitiveInDSL(prim.id, prim.type, prim.paramValueMap);

        // @todo: the comparison with 0.0 is not safe. 
        if ((prim.tX!=0.0) && (prim.tY!=0.0) && (prim.tZ!=0.0))
            {
            sceneDataDSL += prim.id + " = translate_shape(" + prim.id + "," + that.vectorInDSL(prim.tX, prim.tY, prim.tZ)+ ")\n";
            }
        console.log("Primitive is positive",prim.positive)
        //sceneDataDSL += "rotate_shape(" + prim.id + ", Vector(" + prim.tX ", " + prim.tY + ", " + prim.tZ + "))";
        //@todo: pythonOCC allows scaling with origin and a single scalar factor
        //sceneDataDSL += "scale_shape(" + prim.id + ", Vector(" + prim.tX ", " + prim.tY + ", " + prim.tZ + "))";

        // display is commented out, useful only for debug purpose
        sceneDataDSL += "# affiche(" + prim.id + ")\n";
    });

    //do the same for all negative primitives and use them for subtraction
    //...

    //@todo: coord system orientation

    console.log("Scene Data in DSL:");
    console.log(sceneDataDSL);
    //
    that.processDSL(sceneDataDSL);
};

StorageManager.prototype.processDSL = function(sceneDataDSL){
    // this method sends the DSL description to the 3D server
    // and get back a json object including :
    // the result (succesfull, fail, etc.)
    console.log("Requesting 3D server ...");
    $.post('/process_dsl',{component_description:sceneDataDSL}, function(response) {
    // log the response to the console
    console.log("Response: "+response);
    })
};


StorageManager.prototype.vectorInDSL = function(x, y, z){
    return "Vector(" + x + ", " + y + ", " + z + ")";
};


StorageManager.prototype.primitiveInDSL = function(id, primType, paramValueMap){
    var that = this;

    var dslCommands = "";

    switch (primType)
    {
        case "Box":
            dslCommands = id + " = make_box(" + paramValueMap["Size"].x + ", " + paramValueMap["Size"].y + ", " + paramValueMap["Size"].z + ")\n";
            break;

        case "Cylinder":
            dslCommands = id + " = make_cylinder(" + (paramValueMap["Radius"] * 2.0) + "," + paramValueMap["Height"] + ")\n";
            break;

        case "Cone":
            dslCommands = id + " = make_cone(" + paramValueMap["Bottom Radius"] + "," + paramValueMap["Top Radius"] + ","+ paramValueMap["Height"] + ")\n";
            break;

        case "Torus":
            dslCommands = id + " = make_torus(" + paramValueMap["ROutside"] + "," + paramValueMap["RInside"] + "," + paramValueMap["Angle"] + ")\n";
            break;

        case "RectangularTorus":
            dslCommands = id + " = make_rectangular_torus(" + paramValueMap["ROutside"] + "," + paramValueMap["RInside"] + "," + paramValueMap["Height"] +"," + paramValueMap["Angle"] + ")\n";
            break;

        case "":
            break;

        case "":
            break;

        case "":
            break;

        case "":
            break;

        case "":
            break;

        case "Extrusion":
            dslCommands = "# Extrusion export not yet implemented";
            break;

        case "Revolution":
            dslCommands = "# Revolution export not yet implemented";
            break;

        default:;
    }

    return dslCommands;
};
