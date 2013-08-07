/*
 * The PrimitiveManager component handles all the behaviour of all 
 * added primitives of the workspace
 * @returns {PrimitiveManager}
 */
function PrimitiveManager(){
    
    // Counter to create unique identificators
    var shapeCounter = 0;
    // List of all created primitives
    var primitiveList = [];
    // actually active id
    var actualID = "";
    
    
    /*
     * Adds a new primitive to the working area and stores its reference
     * @param {type} primitive name of the primitive that should be created
     * @returns {Boolean}
     */
    this.addPrimitive = function(primitive){
   
        var id = "element_" + shapeCounter;
        shapeCounter++;

        var t = document.createElement('Transform');
        t.setAttribute("id", id);
        t.setAttribute("translation", "0 0 0");
        var s = document.createElement('Shape');

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

        var b = document.createElement(primitive);
        s.appendChild(b);

        var ot = document.getElementById('root');
        ot.appendChild(t);
        
        primitiveList[id] = t;
        primitiveList[id].addEventListener("click", function(){primitiveSelected(id);}, false);
        
        var trans = (Math.random() * 100 % 5) + " " + (Math.random() * 100 % 5) + " " + (Math.random() * 100 % 5);
        primitiveList[id].setAttribute("translation", trans);
        setTransformValues(id, HANDLING_MODE);
        
        actualID = id;
    };
    
    
    
    /*
     * 
     * TODO: Das Element muss auch aus der primitiveList[] entfernt werden
     * Remove Node
     */     
    this.removeNode = function()
    {
        var ot = document.getElementById(actualID);

        for (var i = 0; i < ot.childNodes.length; i++) 
        {
            // check if we have a real X3DOM Node; not just e.g. a Text-tag
            if (ot.childNodes[i].nodeType === Node.ELEMENT_NODE) 
            {
                ot.removeChild(ot.childNodes[i]);
                    break;
            }
        }
    };

    
    
    
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
     * Sets the values of the actual selected transformation
     * to the value fields in the bottom bar
     * @param {type} id name of the primitive's values that should be set
     * @param {type} mode type of transformation 
     * @returns {null}
     */
    function setTransformValues(id, mode){
        var xyz = ""; 
        
        (mode === "translation") ? xyz = primitiveList[id].attributes[mode].nodeValue.split(" ") : 
                                   xyz = primitiveList[id].attributes[mode].nodeValue.split(",");
        
        document.getElementById("amount-x").value = xyz[0].substr(0, 5);
        document.getElementById("amount-y").value = xyz[1].substr(0, 5);
        document.getElementById("amount-z").value = xyz[2].substr(0, 5);
        
        document.getElementById("ObjektName").value = id;
    }
}
