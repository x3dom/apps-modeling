/*
 * The UI object handles the getter and setter function for all GUI elements
 * @returns {UI}
 */
function UI(primitiveManager){
    
    // Variables that handle the toggle behaviour of the toolbars
    var fadeSwitch = [0, 0];
    
    
    
    this.initialize = function(){ 
        initializeUI();
        primitiveManager.setUI(that);
    };
    
    
    
    function initializeUI(){
        that.BBPrimName = that.newTextProperty("primitiveName");
        
        that.BBTransX = that.newTextProperty("amountX");
        $("#amountX").spinner({
            stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
        
        that.BBTransY = that.newTextProperty("amountY");
        $("#amountY").spinner({         
            stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
        
        that.BBTransZ = that.newTextProperty("amountZ");
        $("#amountZ").spinner({         
            stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
        
        that.TransformMode = that.newLabelProperty("transformMode");
        
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
        
        
        $("#menu-accordeon").button();
        $("#loeschen").button();
        
        
        /** Slider an der linke Leiste */    		
	$('#divs').slimScroll({
		height: '99%',
		size: '10px',
		color: '#FFFFFF',
		position: 'left'
	});
			
    
        /*** Das hier ist alles fuer das Accordeon-Menue ************************************************************/			
	
	/* Das blendet die kleine Symbole beim Accordion ein */
	var iconsAccordion = 
	{
		header: "ui-icon-circle-arrow-e",
		activeHeader: "ui-icon-circle-arrow-s"
	};
				
	$("#accordeon-oben").accordion({
		heightStyle: "content",
		collapsible: false,
		active: false,
		icons: iconsAccordion
	});	
	

        /*******************************************************************************************************************************/


	// Slider zum Verschieben ////////////////////////////////////////////////////////////////////////////////////////////////// 
	$(".slider1").slider({min: 0, max: 15, value:0, step: 0.001, slide: function(event, ui) {
								
        var koordinaten = $("#x-sliderV").slider('option', 'value') + " " + 
                                      $("#y-sliderV").slider('option', 'value') + " " + 
                                      $("#z-sliderV").slider('option', 'value');

            document.getElementById(aktuelleID).setAttribute("translation", koordinaten);
            alert(koordinaten);
            // Textfelder aktualisieren
            $( "#amount-x" ).val( $("#x-sliderV").slider('option', 'value') );
            $( "#amount-y" ).val( $("#y-sliderV").slider('option', 'value') );
            $( "#amount-z" ).val( $("#z-sliderV").slider('option', 'value') );

        }});


            // Slider zum Skalieren ////////////////////////////////////////////////////////////////////////////////////////////////////
            $(".slider2").slider({min: 0, max: 15, value:0, step: 0.001, slide: function(event, ui) {
            var koordinaten =   $("#sliderS").slider('option', 'value') + " " 
                                  + $("#sliderS").slider('option', 'value') + " "  
                              + $("#sliderS").slider('option', 'value');

            document.getElementById(aktuelleID).setAttribute("scale", koordinaten);

            $( "#amount-S" ).val( $( "#sliderS" ).slider( "value" ) );     
         }});


            // Slider zum Drehen ////////////////////////////////////////////////////////////////////////////////////////////////////////
            $(".slider3").slider({min: 0, max: 360, value:0, step: 0.001, slide: function(event, ui) {

                    var winkel = $("#x-sliderD").slider('option', 'value');
                    var bogenmass = winkel * (3.14 / 180);
            var koordinatenX = winkel + " " + 0 + " "  + 0 + " " + bogenmass;

            document.getElementById(aktuelleID).setAttribute("rotation", koordinatenX);
            $( "#amount-x" ).val( $( "#x-sliderD" ).slider( "value" ) );
        }});

        $(".slider4").slider({min: 0, max: 360, value:0, step: 0.001, slide: function(event, ui) {

            var winkel = $("#y-sliderD").slider('option', 'value');
                    var bogenmass = winkel * (3.14 / 180);
            var koordinatenY = 0 + " " + winkel + " "  + 0 + " " + bogenmass;

            document.getElementById(aktuelleID).setAttribute("rotation", koordinatenY);
            $( "#amount-y" ).val( $( "#y-sliderD" ).slider( "value" ) );
        }});

        $(".slider5").slider({min: 0, max: 360, value:0, step: 0.001, slide: function(event, ui) {

                    var winkel = $("#z-sliderD").slider('option', 'value');
                    var bogenmass = winkel * (3.14 / 180);
            var koordinatenZ = 0 + " " + 0 + " "  + winkel + " " + bogenmass;

            document.getElementById(aktuelleID).setAttribute("rotation", koordinatenZ);
            $( "#amount-z" ).val( $( "#z-sliderD" ).slider( "value" ) );
        }});
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        
        // Grundelemente mit Button-Klick einfuegen
        /*$("#Cylinder").click(function(){primitiveManager.addPrimitive("Cylinder");});
        $("#Sphere").click(function(){primitiveManager.addPrimitive("Sphere");});
        $("#Cone").click(function(){primitiveManager.addPrimitive("Cone");});
        $("#Box").click(function(){primitiveManager.addPrimitive("Box");});
        $("#Dish").click(function(){primitiveManager.addPrimitive("Dish");});
        $("#Snout").click(function(){primitiveManager.addPrimitive("Snout");});
        $("#Pyramid").click(function(){primitiveManager.addPrimitive("Pyramid");});
        $("#SlopedCylinder").click(function(){primitiveManager.addPrimitive("SlopeBottomCylinder");});
        $("#loeschen").click(function(){window.removeNode();});*/
    }
    
    
    
    /*
     * Creates a new text field property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newTextProperty = function(id){
        var obj = {};

        obj.get = function(){
            try {
                return document.getElementById(id).value;
            }
            catch(ex){}
        };
        
        obj.set = function(value){
            try {
                document.getElementById(id).value = value;
            }
            catch(ex){}
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
            try {
                return document.getElementById(id).value;
            }
            catch(ex){}
        };
        
        obj.set = function(value){
            try {
                document.getElementById(id).textContent = value;
            }
            catch(ex){}
        };
        
        return obj;
    };
    
    
    
    /*
     * This function removes the axis cross 
     * @returns (undefined)
     */
    this.removeAxis = function()
    {
    	
    	if(document.getElementById("axis"))
    	{
    		delete document.getElementById("axis").remove();
                document.getElementById("DeleteAxis").style.border="solid 1px gray";
    	}
    	else
    	{
	    	var t = document.createElement('Transform');
	        t.setAttribute('id', 'axis');
	        
	        var innen = document.createElement('inline');
	        innen.setAttribute('url', 'x3d/axis.x3d');	   
	        t.appendChild(innen);
	        
	        var onOff = document.getElementById('onOff');
	        onOff.appendChild(t);
                
                document.getElementById("DeleteAxis").style.border="solid 1px #fff";
    	}    	
    };
    
    
    
    /*
     * This function removes the orientation plane
     * @returns (undefined)
     */
    this.removePlane = function()
    {
    	var renderWert = document.getElementById("plane");
    	
    	if(renderWert.getAttribute("render", 0) === "true")
    	{
    		renderWert.setAttribute("render", "false");
                document.getElementById("DeletePlane").style.border="solid 1px gray";
    	}
    	
    	else
    	{
    		renderWert.setAttribute("render", "true");
                document.getElementById("DeletePlane").style.border="solid 1px #fff";
    	}
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
        divID.setAttribute("style", "width: 60px; height: 60px; margin: 5px; margin-left: 17px; border: solid 1px #fff; border-radius: 5px;");		

        divID.setAttribute("onmouseover", "this.style.cursor='pointer';");
        divID.onclick = function(){primitiveManager.addPrimitive(name.replace(new RegExp(' ', 'g'), ''));};

        var divIDinnen = document.createElement("div");
        divIDinnen.setAttribute("style", "color: #fff; margin-top: -40px; margin-bottom: 25px; margin-left: 8px;");
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


