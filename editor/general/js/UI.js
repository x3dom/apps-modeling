/*
 * The UI object handles the getter and setter function for all GUI elements
 * @returns {UI}
 */
function UI(primitiveManager){
    
    // Variables that handle the toggle behaviour of the toolbars
    var fadeSwitch = [0, 0];
    // default color of all ui elements
    var defColor = "gray";
    // highlight color of all ui elements
    var highlightColor = "#fff";
    // primitive parameter map to synchronize names between editor and x3dom
    var primitiveParameterMap = createParameterMap("PrimitiveParameterMap.xml");;
    
    
    
    this.initialize = function(){ 
        initializeUI();
        primitiveManager.setUI(that);
    };
    
    
    
    function initializeUI(){

        that.TBHand = that.newImageProperty("ButtonHand");
        that.TBTranslate = that.newImageProperty("ButtonVerschieben");
        that.TBScale = that.newImageProperty("ButtonSkalieren");
        that.TBRotate = that.newImageProperty("ButtonRotieren");
        that.TBPrimitiveList = that.newComboBoxProperty("primitiveList");
        that.TBViewpoints = that.newComboBoxProperty("Views");
       
        that.BBPrimName = that.newTextProperty("primitiveName");
        that.BBDelete = that.newImageProperty("deletePrimitive");
        that.BBTransX = that.newSpinnerProperty("amountX");
        $("#amountX").spinner({
            stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
        
        that.BBTransY = that.newSpinnerProperty("amountY");
        $("#amountY").spinner({         
            stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
        
        that.BBTransZ = that.newSpinnerProperty("amountZ");
        $("#amountZ").spinner({         
            stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
        
        that.BBTransformMode = that.newLabelProperty("transformMode");
        
        /*addRightbarElement({name:"Propertie 1", value: 2.0, id:"id_01"});
        addRightbarElement({name:"Propertie 2", value: 1.0, id:"id_02"});
        addRightbarElement({name:"Propertie 3", value: 3.0, id:"id_03"});*/

        for (var prim in primitiveParameterMap){
            addLeftbarElement(primitiveParameterMap[prim].image, 
                              primitiveParameterMap[prim].editorName);
        }

        addLeftbarElement("images/box.jpg", "frei");

        // scrollbar for primitives of left bar   		
        $('#divs').slimScroll({
                height: '99%',
                size: '10px',
                color: '#FFFFFF',
                position: 'left'
        });

        // symbols of accordion on right bar
        var iconsAccordion = 
        {
                header: "ui-icon-circle-arrow-e",
                activeHeader: "ui-icon-circle-arrow-s"
        };

            // creation of the accordion on the right bar                        
        $("#accordeon-oben").accordion({
                heightStyle: "content",
                collapsible: false,
                active: false,
                icons: iconsAccordion
        });
    }
    
    
    
    /*
     * Creates an array with primitives an their parameters, including
     * a mapping between the x3dom names and editor names and a default value
     * @param {string} file path to map source file (XML)
     * @returns {Array}
     */
    function createParameterMap(file){
        var xhttp;
        
        if (window.XMLHttpRequest){
            xhttp=new XMLHttpRequest();
        }
        else {
            xhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.open("GET", file, false);
        xhttp.send();
       
       var xmlDoc = xhttp.responseXML.childNodes[0];
       var primitives = xmlDoc.getElementsByTagName("Primitive");
       
       var primitiveParameterMap = [];
       for (var i = 0; i < primitives.length; i++){
            primitiveParameterMap[primitives[i].getAttribute("editorName")] = {editorName: primitives[i].getAttribute("editorName"), 
                                                                               x3domName: primitives[i].getAttribute("x3domName"),
                                                                               image: primitives[i].getAttribute("image"),
                                                                               parameters : []}; 

            var parameters = primitives[i].getElementsByTagName("Parameter");
            for (var j = 0; j < parameters.length; j++){
                primitiveParameterMap[primitives[i].getAttribute("editorName")].parameters.push({editorName: parameters[j].getAttribute("editorName"), 
                                                                                                 x3domName: parameters[j].getAttribute("x3domName"),
                                                                                                 value: parameters[j].textContent}); 
            }
       }
       
       return primitiveParameterMap;
    }
    
    
    
    /*
     * Creates a new text field property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newSpinnerProperty = function(id){
        var obj = {};

        obj.get = function(){
            return document.getElementById(id).value;
        };
        
        obj.set = function(value){
            document.getElementById(id).value = value;
        };
        
        obj.disable = function(bool){
            $("#" + id).spinner( "option", "disabled", bool );
        };
        
        return obj;
    };
    
    
    
    /*
     * Creates a new text field property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newTextProperty = function(id){
        var obj = {};

        obj.get = function(){
            return document.getElementById(id).value;
        };
        
        obj.set = function(value){
            document.getElementById(id).value = value;
        };
        
        obj.disable = function(bool){
            if (bool) document.getElementById(id).style.opacity="0.5";
            else document.getElementById(id).style.opacity="1.0";
            document.getElementById(id).disabled = bool;
        };
        
        return obj;
    };
    
    
    
    
    /*
     * Creates a new label property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newLabelProperty = function(id){
        var obj = {};

        obj.get = function(){
            return document.getElementById(id).textContent;
        };
        
        obj.set = function(value){
            document.getElementById(id).textContent = value;
        };
        
        return obj;
    };
    
    
    
    /*
     * Creates a new image property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newImageProperty = function(id){
        var obj = {};

        obj.get = function(){
            return document.getElementById(id).value;
        };
        
        obj.set = function(value){
            document.getElementById(id).textContent = value;
        };
        
        obj.highlight = function(){
            document.getElementById(id).style.border = "solid 1px " + highlightColor;
        };
        
        obj.dehighlight = function(){
            document.getElementById(id).style.border = "solid 1px " + defColor;
        };
        
        obj.disable = function(bool){
            if (bool) document.getElementById(id).style.opacity="0.5";
            else document.getElementById(id).style.opacity="1.0";
            document.getElementById(id).disabled = bool;
        };
        
        return obj;
    };
    
    
    
    /*
     * Creates a new combobox property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newComboBoxProperty = function(id){
        var obj = {};

        obj.get = function(index){
            return document.getElementById(id)[index];
        };
        
        obj.set = function(index, value){
            document.getElementById(id)[index].text = value;
        };
        
        obj.disable = function(bool){
            if (bool) document.getElementById(id).style.opacity="0.5";
            else document.getElementById(id).style.opacity="1.0";
            document.getElementById(id).disabled = bool;
        };
        
        obj.idMap = function(index){
            return document.getElementById(id)[index].Primitive.IDMap;
        };
        
        obj.selectedIndex = function(){
            return document.getElementById(id).selectedIndex;
        };
        
        obj.selectIndex = function(index){
            document.getElementById(id).selectedIndex = index;
        };
        
        obj.add = function(option){
            document.getElementById(id).add(option,null);
        };
        
        obj.remove = function(index){
            document.getElementById(id).remove(index);
        };
        
        return obj;
    };
    
    

    /*
     * Toggeling fade function of the left toolbar
     */
    this.fadeLeft = function(){
       if (fadeSwitch[0] === 0){
           $("#Links").animate(
           {
               left: "-87px"
           }, 250);
           fadeSwitch[0]++;
       }
       else {
           $("#Links").animate(
           {
               left: "0px"
           }, 250);
           fadeSwitch[0]--;
       }
    };



   /*
    * Toggeling fade function of the right toolbar
    */
   this.fadeRight = function(){
       if (fadeSwitch[1] === 0){
           $("#Rechts").animate(
           {
               right: "-170px"
           }, 250);
           fadeSwitch[1]++;
       }
       else {
           $("#Rechts").animate(
           {
               right: "0px"
           }, 250);
           fadeSwitch[1]--;
       }
    }; 
       
    
	/*  
     * Open UI for the HTML Canvas
     */
    elementCanvas = function(name)
    {        	
		$("#htmlCanvas").dialog({
            height: 500,
            width: 600,
            modal: true
        });
        
        canvasLabeln = document.getElementById("htmlCanvas");
        canvasLabeln.innerHTML = "<canvas id='drawCanvas'> </canvas>" +
								 "<div id='divLine'></div>" +
						 		 	"<label>X Value: </label><input id='labelValueX'/>" + 
						 		 	"<label style='margin-left: 10px;'>Z Value: </label><input id='labelValueZ'/>" +
						 		 	"<button id='buttonCreateShape'>Create Shape</button>" +
						 	 	 "</div>";
		
		/**********************************************/
		canvas = document.getElementById("drawCanvas");
		draw = canvas.getContext("2d");
		
		draw.fillStyle = "rgb(255, 0, 0)"; 
		draw.beginPath();  
			draw.moveTo(5, 20);  
			draw.lineTo(20,  15);  
			draw.lineTo(15, 5);  
		draw.closePath();  
		draw.fill();
		/**********************************************/
		
		$("#labelValueX").spinner({
        	stop:function(e,ui){
            	
        	}
    	});
    	
        $("#labelValueZ").spinner({
        	stop:function(e,ui){
            	
        	}
    	});
    	
    	$("#buttonCreateShape").button()
			.click(function( event ) {
				event.preventDefault();
		});
	};  
    
    
    /*
     * Adds one primitive element to the left bar 
     * @returns (undefined)
     */
    function addLeftbarElement(img, name)
    {
        var divID = document.createElement("div");
        divID.setAttribute("id", name);
        divID.innerHTML = "<img src="+img+" width= 60 height= 60 />";
        divID.setAttribute("style", "width: 60px; height: 60px; margin: 5px; margin-left: 17px; border: solid 1px " + defColor + "; border-radius: 5px;");		

        divID.setAttribute("onmouseover", "this.style.cursor='pointer'; this.style.border = 'solid 1px " + highlightColor + "'; document.getElementById('" + name + "_inner').style.color = '" + highlightColor + "';");
        divID.setAttribute("onmouseout", "this.style.cursor='pointer'; this.style.border = 'solid 1px " + defColor + "'; document.getElementById('" + name + "_inner').style.color = '" + highlightColor + "';");
        divID.setAttribute("onmouseleave", "this.style.cursor='pointer'; this.style.border = 'solid 1px " + defColor + "'; document.getElementById('" + name + "_inner').style.color = '" + highlightColor + "';");
        
        if(name === "frei")
        {
            divID.onclick = function(){elementCanvas(name);};	
     	}
        else
        {
            divID.onclick = function(){primitiveManager.addPrimitive(primitiveParameterMap[name].x3domName, primitiveParameterMap[name].parameters);};	
        }

        var divIDinnen = document.createElement("div");
        divIDinnen.setAttribute("id", name+"_inner");
        divIDinnen.setAttribute("style", "color: " + highlightColor + "; margin-top: -40px; margin-bottom: 25px; margin-left: 8px;");
        divIDinnen.innerHTML = name;			

        divID.appendChild(divIDinnen);
        document.getElementById("divs").appendChild(divID);
    }
    
    
    
    /*
     * Clears all the properties on the right bar
     * @returns (undefined)
     */
    this.clearParameters = function(){
        var properties = document.getElementById("properties");
        for (var i = (properties.children.length - 1); i >= 0 ; i--){
            properties.removeChild(properties.children[i]);
        }
    };
    
    
    
    /*
     * Creates all given parameters and adds it to the right bar
     * @param {x3dom geometry} geometry geometry where the parameters should be set
     * @returns (undefined)
     */
    this.createParameters = function(parameters){
        for (var i = 0; i < parameters.length; i++){
            addRightbarElement({param: parameters[i], id: "property_" + i, primitive: parameters.Primitive});
        }
    };
    



    /*
     * Adds one prameter value to the right bar
     * @returns (undefined)
     */
    function addRightbarElement(object)
    {	
        var divID = document.createElement("div");	
        divID.setAttribute("style", "margin-top: 10px;");

        var newLabel = document.createElement("label");
        newLabel.innerText = object.param.editorName;

        var newInput = document.createElement("input");
        newInput.setAttribute("style", "width: 112px;");
        newInput.id = object.id;
        newInput.value= object.param.value;

        newLabel.appendChild(newInput);
        divID.appendChild(newLabel); 
        document.getElementById("properties").appendChild(divID);

        $("#"+object.id).spinner({         
            stop:function(e,ui){
                object.primitive._x3domNode._vf[object.param.x3domName] = 
                            parseFloat(document.getElementById(object.id).value);
                object.primitive._x3domNode.fieldChanged(object.param.x3domName);
                object.param.value = parseFloat(document.getElementById(object.id).value);
            }
        });
    }
   

    
    // Starts initialization of all ui components
    var that = this;
}


