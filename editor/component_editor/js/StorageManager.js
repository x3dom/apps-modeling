function StorageManager(){}

// the server to which the DSL description is sent
var server_3D_url = "http://localhost:8080/";

StorageManager.prototype.saveScene = function()
{
    var shapeDataDSL = "# scene data exported from X3DOM component editor\n";
    var primitivesJSON = [];

    var that = this;

    //get the scene data from the primitive manager
    primitiveManager.getSceneData(primitivesJSON);
    // compute how many positive and negative shapes
    var numberOfPrimitives = primitivesJSON.length;
    var numberOfPositivePrimitives = 0;
    var numberOfNegativePrimitives = 0;
    
    Array.forEach(primitivesJSON, function(prim){
        if (prim.paramValueMap["Positive Element"] == "true") {
            numberOfPositivePrimitives++;}
        else {
            numberOfNegativePrimitives++;
        }
    });
    // go through all primitives:
    // write each primitive's creation command and transform

    Array.forEach(primitivesJSON, function(prim){
        //@todo: replace with matching primType
        shapeDataDSL += that.primitiveInDSL(prim.id, prim.type, prim.paramValueMap);

        // @todo: the comparison with 0.0 is not safe. 
        if ((prim.tX!=0.0) && (prim.tY!=0.0) && (prim.tZ!=0.0))
            {
            shapeDataDSL += prim.id + " = translate_shape(" + prim.id + "," + that.vectorInDSL(prim.tX, prim.tY, prim.tZ)+ ")\n";
            }
        // @todo: the comparison with 0.0 is not safe. 
        if ((prim.sX!=1.0) || (prim.sY!=1.0) || (prim.sZ!=1.0))
            {
            shapeDataDSL += prim.id + " = scale_shape(" + prim.sX + "," + prim.sY + "," + prim.sZ + ")\n";
            }
        // then do the same with rotation
        shapeDataDSL += prim.id + " = rotate_shape(" + prim.rX + "," + prim.rY + "," + prim.rZ + ")\n";
            
    });

    // finish the shape : fuse all positive and negative primitives and create the resulting shape
    shapeDataDSL += "component_shape = (";
    var positivePrimitiveIndex = 0;
    Array.forEach(primitivesJSON, function(prim){
        if (prim.paramValueMap["Positive Element"] == "true") { 
            shapeDataDSL += " " + prim.id + " ";
          if (positivePrimitiveIndex < numberOfPositivePrimitives - 1)
                {
                  shapeDataDSL += " + " ;
                  positivePrimitiveIndex += 1; 
                }
        }
    });
    shapeDataDSL += " )";

    // then do the same for negative shapes
    if (numberOfNegativePrimitives>0) {
        shapeDataDSL += " - ( ";
        var negativePrimitiveIndex = 0;
        Array.forEach(primitivesJSON, function(prim){
            if (prim.paramValueMap["Positive Element"] == false) { 
                shapeDataDSL += " " + prim.id + " ";
                if (negativePrimitiveIndex < numberOfNegativePrimitives - 1)
                    {
                    shapeDataDSL += " - " ;
                    negativePrimitiveIndex += 1; 
                    }
            }
        });
    shapeDataDSL += " )";
    }
    shapeDataDSL += " \n";

    //@todo: coord system orientation
    console.log("Scene Data in DSL:");
    console.log(shapeDataDSL);
    //
    that.processDSL(shapeDataDSL);
};

StorageManager.prototype.processDSL = function(shapeDataDSL){
    // this method sends the DSL description to the 3D server
    // and get back a json object including :
    // the result (succesfull, fail, etc.)
    console.log("Requesting 3D server ...");
    $.post('/process_dsl',{shape_model:shapeDataDSL}, function(response) {
    // log the response to the console
    console.log("Response: " + response);
    });
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
