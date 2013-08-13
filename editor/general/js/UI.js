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
    
    
    
    this.initialize = function(){ 
        initializeUI();
        primitiveManager.setUI(that);
    };
    
    
    
    function initializeUI(){
        
        that.TBHand = that.newImageProperty("ButtonHand");
        that.TBTranslate = that.newImageProperty("ButtonVerschieben");
        that.TBScale = that.newImageProperty("ButtonSkalieren");
        that.TBRotate = that.newImageProperty("ButtonRotieren");
       
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
        
        addRightbarElement({name:"Propertie 1", value: 2.0, id:"id_01"});
        addRightbarElement({name:"Propertie 2", value: 1.0, id:"id_02"});
        addRightbarElement({name:"Propertie 3", value: 3.0, id:"id_03"});

        addLeftbarElement("images/box.jpg", "Box");
        addLeftbarElement("images/sphere.jpg", "Sphere");
        addLeftbarElement("images/cone.jpg", "Cone");
        addLeftbarElement("images/cylinder.jpg", "Cylinder");
        addLeftbarElement("images/dish.jpg", "Dish");
        addLeftbarElement("images/snout.jpg", "Snout");
        addLeftbarElement("images/pyramid.jpg", "Pyramid");
        addLeftbarElement("images/slopedcylinder.jpg", "Sloped Cylinder");

        addLeftbarElement("images/box.jpg", "Box");
        addLeftbarElement("images/box.jpg", "Box");
        addLeftbarElement("images/box.jpg", "Box");
        addLeftbarElement("images/box.jpg", "Box");
        addLeftbarElement("images/box.jpg", "Box");
        
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
            //$("#" + id).spinner( "option", "disabled", bool );
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
            document.getElementById(id).disabled = bool;
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
        divID.onclick = function(){primitiveManager.addPrimitive(name.replace(new RegExp(' ', 'g'), ''));};

        var divIDinnen = document.createElement("div");
        divIDinnen.setAttribute("id", name+"_inner");
        divIDinnen.setAttribute("style", "color: " + highlightColor + "; margin-top: -40px; margin-bottom: 25px; margin-left: 8px;");
        divIDinnen.innerHTML = name;			

        divID.appendChild(divIDinnen);
        document.getElementById("divs").appendChild(divID);
    }



   /*
    * Adds one prameter value to the right bar
    * @returns (undefined)
    */
    function addRightbarElement(object)
    {	
        var divID = document.createElement("div");	
        divID.setAttribute("style", "margin-top: 10px;");

        var newLabel = document.createElement("label");
        newLabel.innerText = object.name;

        var newInput = document.createElement("input");
        newInput.setAttribute("style", "width: 112px;");
        newInput.id = object.id;
        newInput.value= object.value;

        newLabel.appendChild(newInput);
        divID.appendChild(newLabel); 
        document.getElementById("properties").appendChild(divID);

        $("#"+object.id).spinner({});
    }
   

    
    // Starts initialization of all ui components
    var that = this;
}


