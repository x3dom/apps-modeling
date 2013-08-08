/*
 * The PrimitiveManager component handles all the behaviour of all 
 * added primitives of the workspace
 * @returns {PrimitiveManager}
 */
function PrimitiveManager(){
    
    // List of all created primitives
    var primitiveList = [];
    // actually active id
    var actualID = "";
    // count of primitives
    var primCounter = 0;
    var primitiveCounter = 0;
    
    
    
    /*
     * Adds a new primitive to the working area and stores its reference
     * @param {type} primitive name of the primitive that should be created
     * @returns {Boolean}
     */
    this.addPrimitive = function(primitive){
   
        if (HANDLING_MODE === "hand") HANDLING_MODE = "translation";
   
        var id = "primitive_" + primCounter;
        primCounter++;
        
        var t = document.createElement('Transform');
        t.setAttribute("id", id);
        t.setAttribute("translation", "0 0 0");
        var s = document.createElement('Shape');
        t.IDMap = {id:id, shapeID:s.id, name:id, cboxNumber:(primitiveCounter)};

        // Appearance Node
        var app = document.createElement('Appearance');

        // Material Node
        var mat = document.createElement('Material');
        mat.setAttribute("emissiveColor", "0 0 1");
        mat.setAttribute("transparency", ".4");
        mat.setAttribute("shininess", ".3");

        app.appendChild(mat);
        s.appendChild(app);
        t.appendChild(s);

        var prim = document.createElement(primitive);
        s.appendChild(prim);

        var root = document.getElementById('root');
        root.appendChild(t);
        
        primitiveList[id] = t;
        primitiveList[id].addEventListener("click", function(){primitiveSelected(id);}, false);
        addPrimitiveToComboBox(t.IDMap.name);
        setTransformValues(id, HANDLING_MODE);
        
        actualID = id;
        primitiveCounter++;
    };
    
    
    
    /* TODO: SYNCHRONIZATION WITH COMBOBOX
     * Removes a primitive from the DOM and from primitive array
     * @returns {undefined}
     */  
    this.removeNode = function()
    {
        var ot = document.getElementById(actualID);

        for (var i = 0; i < ot.childNodes.length; i++) 
        {
            // check if we have a real X3DOM Node; not just e.g. a Text-tag
            if (ot.childNodes[i].nodeType === Node.ELEMENT_NODE) 
            {
                for (var j = primitiveList[actualID].IDMap.cboxNumber + 1; j < primitiveCounter; j++){
                    primitiveList["primitive_" + j].IDMap.cboxNumber--;
                }
                ot.removeChild(ot.childNodes[i]);
                delete document.getElementById("primitiveList").remove(primitiveList[actualID].IDMap.cboxNumber);
                delete primitiveList[actualID];
                
                clearTransformValues();
                primitiveCounter--;
                    break;
            }
        }
    };
    
    
    
    /*
     * Clears the value fields of the transformation
     * @returns {undefined}
     */
    this.clearTransformationValues = function(){
        clearTransformValues();
    };
    
    
    
    /*
     * Clears the value fields of the transformation
     * @returns {undefined}
     */
    function clearTransformValues(){
        document.getElementById("amount-x").value = "";
        document.getElementById("amount-y").value = "";
        document.getElementById("amount-z").value = "";
        document.getElementById("ObjektName").value = "";
    }

    
    
    /*
     * Will be called if a primitive is selected and should
     * set the values of translation, rotation or scaling
     * @param {type} id name of the primitive's values that should be set
     * @returns {null}
     */
    function primitiveSelected(id)
    {
        actualID = id;
        setTransformValues(id, HANDLING_MODE);
    }
    
    
    
    /*
     * Sets the values of the actual selected transformation
     * to the value fields in the bottom bar
     * @returns {null}
     */
    this.setTransformationValues = function(){
        setTransformValues(actualID, HANDLING_MODE);
    };
    
    
    
    /*
     * 
     * @returns {undefined}
     */
    this.setTransformationValuesToPrimitive = function() {
        var tempValue = ""; 

        if(HANDLING_MODE === "translation") {
            tempValue = document.getElementById("amount-x").value + " " +
                        document.getElementById("amount-y").value + " " +
                        document.getElementById("amount-z").value;
            primitiveList[actualID].setAttribute(HANDLING_MODE, tempValue);
        }
        else if (HANDLING_MODE === "rotation") {
            primitiveList[actualID].setAttribute(HANDLING_MODE, "1,0,0," + (document.getElementById("amount-x").value * (Math.PI / 180.0)));
            //primitiveList[actualID].setAttribute(HANDLING_MODE, "0,1,0," + (document.getElementById("amount-y").value * (Math.PI / 180.0)));
            //primitiveList[actualID].setAttribute(HANDLING_MODE, "0,0,1," + (document.getElementById("amount-z").value * (Math.PI / 180.0)));
        }
        else {
            tempValue = document.getElementById("amount-x").value + "," +
                        document.getElementById("amount-y").value + "," +
                        document.getElementById("amount-z").value;
            primitiveList[actualID].setAttribute(HANDLING_MODE, tempValue);
        }
    };
    
    
    
    /*
     * Handles the synchronization if a primitive is selected at the combobox
     * @param {type} id identifier of the primitive that should be set to active
     * @returns {undefined}
     */
    this.comboBoxChanged = function(id){
        actualID = document.getElementById("primitiveList")[id].Node.IDMap.id;
        setTransformValues(actualID, HANDLING_MODE);
    };
    
    
    
    /*
     * Sets the values of the actual selected transformation
     * to the value fields in the bottom bar
     * @param {type} id name of the primitive's values that should be set
     * @param {type} mode type of transformation 
     * @returns {null}
     */
    function setTransformValues(id, mode){
        try {
            var xyz = ""; 

            (mode === "translation") ? xyz = primitiveList[id].attributes[mode].nodeValue.split(" ") : 
                                       xyz = primitiveList[id].attributes[mode].nodeValue.split(",");

            document.getElementById("amount-x").value = xyz[0].substr(0, 5);
            document.getElementById("amount-y").value = xyz[1].substr(0, 5);
            document.getElementById("amount-z").value = xyz[2].substr(0, 5);

            document.getElementById("ObjektName").value = primitiveList[id].IDMap.name;
            document.getElementById("primitiveList").selectedIndex = primitiveList[id].IDMap.cboxNumber;
            document.getElementById('transformMode').textContent = HANDLING_MODE.toUpperCase() + ':';
        }
        catch(ex){ }
    }
    
    
    
    /*
     * Sets the name of a primitive to the users defined value
     * @returns {null}
     */
    this.setPrimitiveName = function() {
        document.getElementById("primitiveList")[primitiveList[actualID].IDMap.cboxNumber].text = document.getElementById("ObjektName").value;
        primitiveList[actualID].IDMap.name = document.getElementById("ObjektName").value;
    };
    
    
    
    /*
     * Adds an option field to the select box with the name of a primitive
     * @param {type} id name of the primitive's values that should be set
     * @returns {null}
     */
    function addPrimitiveToComboBox(id){
        var x=document.getElementById("primitiveList");
        var option=document.createElement("option");
        option.Node = primitiveList[id];
        option.text = id;
        
        try {
            // for IE earlier than version 8
            x.add(option,x.options[null]);
        }
        catch (e){
            x.add(option,null);
        }
    }
}