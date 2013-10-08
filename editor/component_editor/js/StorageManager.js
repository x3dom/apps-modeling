function StorageManager(){}

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
        if ((prim.sX!=1.0) || (prim.sY!=1.0) || (prim.sZ!=1.0))
            {
            shapeDataDSL += prim.id + " = scale_shape(" + prim.id + "," + prim.sX + "," + prim.sY + "," + prim.sZ + ")\n";
            }
        // then do the same with rotation
        if ((prim.rX!=0.0) || (prim.rY!=0.0) || (prim.rZ!=0.0))
            {
            shapeDataDSL += prim.id + " = rotate_shape_3_axis(" + prim.id + "," + prim.rX + "," + prim.rY + "," + prim.rZ + ")\n";
            }
        // @todo: the comparison with 0.0 is not safe. 
        if ((prim.tX!=0.0) || (prim.tY!=0.0) || (prim.tZ!=0.0))
            {
            shapeDataDSL += prim.id + " = translate_shape(" + prim.id + "," + that.vectorInDSL(prim.tX, prim.tY, prim.tZ)+ ")\n";
            }
        
    });

    // finish the shape : fuse all positive and negative primitives and create the resulting shape
    shapeDataDSL += "final_shape = (";
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
        data = $.parseJSON(response)
        console.log("stdout: " + data.stdout);
        console.log("stderr: " + data.stderr);
        console.log("URI geometrie tesselee: " + data.uri_geometrie_tesselee);
        console.log("URI occurrence geometrique: " + data.uri_occurrence_geometrique);
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

        case "Nozzle":
            dslCommands = id + " = make_nozzle(" + paramValueMap["Height"] + "," + paramValueMap["RInside"] + "," + paramValueMap["ROutside"] + "," + paramValueMap["Nozzle Height"] +"," + paramValueMap["Nozzle Radius"] + ")\n";
            break;

        case "Snout":
            dslCommands = id + " = make_snout(" + paramValueMap["DTop"] + "," + paramValueMap["DBottom"] + "," + paramValueMap["XOff"] + "," + paramValueMap["YOff"] +"," + paramValueMap["Height"] + ")\n";
            break;

        case "Pyramid":
            dslCommands = id + " = make_pyramid(" + paramValueMap["XBottom"] + "," + paramValueMap["YBottom"] + "," + paramValueMap["XTop"] + "," + paramValueMap["YTop"] +"," + paramValueMap["Height"]+"," + paramValueMap["XOff"] + "," + paramValueMap["YOff"] + ")\n";
            break;

        case "SlopedCylinder":
            dslCommands = id + " = make_sloped_cylinder(" + paramValueMap["Radius"] + "," + paramValueMap["Height"] + "," + paramValueMap["XTShear"] + "," + paramValueMap["YTShear"] +"," + paramValueMap["XBShear"]+"," + paramValueMap["YBShear"] + ")\n";
            break;

        case "Dish":
            dslCommands = id + " = make_dish(" + paramValueMap["Diameter"] + "," + paramValueMap["Radius"] + "," + paramValueMap["Height"] + ")\n";
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
