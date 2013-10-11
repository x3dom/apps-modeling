function StorageManager(){}


// TODO: this address needs to be parameterizable
// the server which holds the 3D data of the components
var server_3D_url = "http://146.140.4.36:8080/";



StorageManager.prototype.loadScene = function(){
    console.log("WARNING: This function is currently not implemented. Please use the search bar and hit the button to fetch matching data from the DB.");
};



/*
 * Loads components, which are matching the given string, from the server.
 */
StorageManager.prototype.loadComponents = function(searchStr){

    var componentURLToComponentName = null;
    var componentOccurences         = null;

    ui.catalogueTreeNodes     = [];

    clearRegisteredComponentX3DStrings();


    //TESTING
    //======
    //@tpaviot: this works in chrome and FF, but the real GET cases below don't work in FF on Win7,
    //          there is a response "200 OK", but somehow the callback is not invoked (empy response?)
    //          Is this maybe an issue with the 3D server?
    $.get("http://echo.jsontest.com/hello/world",
        function(data, textStatus, jqXHR)
        {
            var jsonObj = JSON.parse(jqXHR.responseText);

            console.log("JSON GET Test: \"Hello, " + jsonObj["hello"] + "\"");
        }
    );
    //======


    var finishedLoading = function()
    {
        var component;
        var componentOccurence;
        var componentOccurenceName;
        var componentName;
        var componentGeometryIdentifier;
        var errMsg;

        if (componentURLToComponentName && componentOccurences)
        {
            for (component in componentURLToComponentName)
            {
                ui.catalogueTreeNodes.push({name: componentURLToComponentName[component], groupName: ""});
            }

            //@tpaviot: this is just for the test below, we can remove it afterwards
            var geomTessTestIdx = 0;

            //@tpaviot: "componentOccurences" is simply the JSON object returned by the server,
            //          which holds all "OccurenceDeComposant" objects
            for (componentOccurence in componentOccurences)
            {
                componentOccurenceName      = componentOccurence;   //this is the "idFonct"
                componentName               = componentURLToComponentName[componentOccurences[componentOccurence][1]];
                componentGeometryIdentifier = componentOccurences[componentOccurence][0];   //this is the "Occurence..." URI

                ui.catalogueTreeNodes.push({name: componentOccurenceName, groupName: componentName});

                //get the component's X3D mesh from the server
                //(if there are multiple components using the same one, we currently just rely on the browser cache here)
                (function(compName, compOccName, geomID){

                    $.get(server_3D_url + "/get_x3dmesh_for_occurrence?uri=" + geomID,
                        function(data, textStatus, jqXHR){

                            console.log("X3D mesh for component \"" + geomID + "\" loaded.");

                            var x3dStr = JSON.parse(jqXHR.responseText);

                            //@tpaviot: we can remove this line after the special characters have been removed
                            //          from the result which is returned by the 3d server / play framework
                            x3dStr = x3dStr.replace(/\\n/gi, "");
                            x3dStr = x3dStr.replace(/\\r/gi, "");

                            getOrCreateRegisteredComponentX3DString(compName + "_" + compOccName, x3dStr);
                        }
                    );

                })(componentName, componentOccurenceName, componentGeometryIdentifier);
            }

            ui.buildCatalogueTreeFromGroupsAndNodes();
        }
        else
        {
            errMsg = "Error: \"finishedLoading\" called, but no data available.";
            console.log(errMsg);
            x3dom.debug.logError(errMsg);
        }
    };


    //TODO: here, we could notify the user about the progress of loading

    //get a list with all "Component Classes" / "Composants" from the server
    $.get(server_3D_url + "/composants",
        function(data, textStatus, jqXHR){

            console.log("Composants loaded.");

            componentURLToComponentName = JSON.parse(jqXHR.responseText);

            if (componentOccurences)
            {
                finishedLoading();
            }
        }
    );

    //get a list with all "Component Occurences" / "Occurences de Composants" from the server
    $.get(server_3D_url + "/occurrences_de_composant?search=" + searchStr,
        function(data, textStatus, jqXHR){

            console.log("Occurrences de composant loaded.");

            componentOccurences = JSON.parse(jqXHR.responseText);

            if (componentURLToComponentName)
            {
                finishedLoading();
            }
        }
    );


    //TESTING
    //======
    (function(){

    var testComponentNames  = ["Tank", "Tube"];
    var testComponentFiles  = ["../static/testing/components/CompA.x3d", "../static/testing/components/CompB.x3d"];
    var testComponentThumbs = ["../static/testing/components/CompA.png", "../static/testing/components/CompB.png"];

    var i = 0;
    var xhr;
    var x3dStr;
    var comp;

    for (; i < testComponentNames.length; ++i)
    {
        xhr = new XMLHttpRequest();

        xhr.open('GET', testComponentFiles[i], false);
        xhr.send(null);
        x3dStr = xhr.responseText;

        //register this component type
        getOrCreateRegisteredComponentX3DString(testComponentNames[i], x3dStr);

        ui.addComponentType(testComponentNames[i], testComponentThumbs[i]);
    }

    })();
    //======
    //END TESTING
};



StorageManager.prototype.saveScene = function()
{
    var sceneDataDSL = "# scene data exported from X3DOM component editor\n";
    var positivePrimitivesJSON = [];
    var negativePrimitivesJSON = [];

    var that = this;

    //get the scene data from the primitive manager
    primitiveManager.getSceneData(positivePrimitivesJSON, negativePrimitivesJSON);

    //go through all positive primitives:
    //write each primitive's creation command and transform
    Array.forEach(positivePrimitivesJSON, function(prim){
        //@todo: replace with matching primType
        sceneDataDSL += that.primitiveInDSL(prim.id, prim.type, prim.parameters);

        sceneDataDSL += prim.id + " = translate_shape(" + prim.id + "," + that.vectorInDSL(prim.tX, prim.tY, prim.tZ)+ ")\n";

        //sceneDataDSL += "rotate_shape(" + prim.id + ", Vector(" + prim.tX ", " + prim.tY + ", " + prim.tZ + "))";
        //@todo: pythonOCC allows scaling with origin and a single scalar factor
        //sceneDataDSL += "scale_shape(" + prim.id + ", Vector(" + prim.tX ", " + prim.tY + ", " + prim.tZ + "))";

        //@todo: only debugging
        sceneDataDSL += "affiche(" + prim.id + ")\n";
    });

    //do the same for all negative primitives and use them for subtraction
    //...

    //@todo: coord system orientation

    console.log("Scene Data in DSL:");
    console.log(sceneDataDSL);
};



StorageManager.prototype.vectorInDSL = function(x, y, z){
    return "Vector(" + x + ", " + y + ", " + z + ")";
};


StorageManager.prototype.primitiveInDSL = function(id, primType, parameters){
    var that = this;

    var dslCommands = "";

    var paramValueMap = {};
    var i;
    var param;
    var val;

    for (i = 0; i < parameters.length; ++i)
    {
        param = parameters[i];
        val   = null;

        switch (param.type)
        {
            case "bool":
            case "spinner":
                val = param.value;
                break;

            case "vec3":
                (function(){
                var splitStr = param.value.split(",");
                val = new x3dom.fields.SFVec3f(splitStr[0], splitStr[1], splitStr[2]);
                })();
                break;

            default:
                break;
        }

        paramValueMap[param.editorName] = val;
    }


    switch (primType)
    {
        //box, cylinder and cone are the trivial cases
        case "Box":
            dslCommands = id + " = make_box(" + paramValueMap["Size"].x + ", " + paramValueMap["Size"].y + ", " + paramValueMap["Size"].z + ")\n";
            break;

        case "Cylinder":
            dslCommands = id + " = make_cylinder(" + (paramValueMap["Radius"] * 2.0) + "," + paramValueMap["Height"] + ")\n";
            break;

        case "Cone":
            dslCommands = id + " = make_cone(" + paramValueMap["Bottom Radius"] + "," + paramValueMap["Top Radius"] + ","+ paramValueMap["Height"] + ")\n";
            break;

        //construct dish by scaling a sphere and subtracting a cylinder from it
        case "Dish":
            (function(){
                var id_cut = id + "_cut";

                //create sphere
                dslCommands = id + " = make_sphere(" + (paramValueMap["Diameter"] * 0.5) + ")\n";

                //scale, if the radius parameter has been specified
                if (paramValueMap["Radius"] != 0)
                {
                    //@todo: here, we currently have a problem:
                    // //it is impossible to specify a non-uniform scale operation in DSL
                    //dslCommands += id + " = scale_shape(" + id + ", " + that.vectorInDSL(0, 0, 0) + "," + PROBLEM + ");"
                }

                dslCommands += id_cut + " = make_cylinder(" + paramValueMap["Diameter"] + ", " + (paramValueMap["Diameter"] * 0.5) + ")\n";
                dslCommands += id_cut + " = translate_shape(" + id + "_cut, " + that.vectorInDSL(0, 0, -paramValueMap["Diameter"] * 0.5) + ")\n";
                dslCommands += id + "= cut_shapes(" + id + ", " + id + "_cut)\n";

            })();
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

        case "":
            break;

        //the two free form primitives can not be implemented that easily with DSL,
        //they are currently left out and cannot be exported
        case "Extrusion":
            //...
            break;

        case "Solid of Revolution":
            //...
            break;

        default:;
    }

    return dslCommands;
};
