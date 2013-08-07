/*
 * The PrimitiveManager component handles all the behaviour of all 
 * added primitives of the workspace
 * @returns {PrimitiveManager}
 */
function PrimitiveManager()
{    
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
    this.addPrimitive = function(primitive)
    {
    
        actualID = "element_" + shapeCounter;
        shapeCounter++;

        var t = document.createElement('Transform');
        t.setAttribute("id", actualID);
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

        document.getElementById(actualID).addEventListener("click", function(){primitiveSelected(actualID)}, false);
        
        var trans = (Math.random() * 100 % 5) + " " + (Math.random() * 100 % 5) + " " + (Math.random() * 100 % 5);
        document.getElementById(actualID).setAttribute("translation", trans);
        setTranslationValues(actualID, HANDLING_MODE);
        
        primitiveList[actualID] = t;
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
     */
    function primitiveSelected(id)
    {
        setTranslationValues(id, HANDLING_MODE);
        alert(primitiveList[id].children.shape.children[1].attributes.length);
        actualID = id;
    }
    
    
    this.setValues = function(){
        setTranslationValues(actualID, HANDLING_MODE);
    };
    
    
    /*
     * Sets the translation
     */
    function setTranslationValues(id, mode)
    {
        var shape = document.getElementById(id);
        var xyz; (mode === "translation") ? xyz = shape.attributes[mode].nodeValue.split(" ") : 
                                            xyz = shape.attributes[mode].nodeValue.split(",");
        
        document.getElementById("amount-x").value = xyz[0].substr(0, 5);
        document.getElementById("amount-y").value = xyz[1].substr(0, 5);
        document.getElementById("amount-z").value = xyz[2].substr(0, 5);
    }
}
