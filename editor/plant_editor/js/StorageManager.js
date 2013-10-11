function StorageManager(){}


// TODO: this address needs to be parameterizable
// the server which holds the 3D data of the components
//var server_3D_url = "http://146.140.4.36:8080/";
var server_3D_url = "";



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

            //"componentOccurences" is simply the JSON object returned by the server, holding all "OccurenceDeComposant" objects
            for (componentOccurence in componentOccurences)
            {
                componentOccurenceName      = componentOccurence;   //this is the "idFonct"

                //TODO: "Composants" are currently not used
                //componentName               = componentURLToComponentName[componentOccurences[componentOccurence][1]];
                componentName = "Composants";

                componentGeometryIdentifier = componentOccurences[componentOccurence][0];   //this is the "Occurence..." URI

                ui.catalogueTreeNodes.push({name: componentOccurenceName, groupName: componentName});

                //get the component's X3D mesh from the server
                //(if there are multiple components using the same one, we currently just rely on the browser cache here)
                (function(compName, compOccName, geomID){

                    $.get(server_3D_url + "/get_x3dmesh_for_occurrence?uri=" + geomID,
                        function(data, textStatus, jqXHR){

                            console.log("X3D mesh for component \"" + geomID + "\" loaded.");

                            var x3dStr = JSON.parse(jqXHR.responseText);

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
    //TODO: "Composants" are currently not used

    //------
    //FOR DEMONSTRATION:
    componentURLToComponentName       = {};
    componentURLToComponentName ["*"] = "Composants";
    //------

    /*
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
    */

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
};



StorageManager.prototype.saveScene = function()
{
    //TODO: Implement
};
