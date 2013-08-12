// PrimitiveManager handles the adding of new primitives and their behaviour
var primitiveManager = new PrimitiveManager();
// Controller that handles the activation of the transformation modes
var controller = new Controller();
// Variable that defines the handling mode
var HANDLING_MODE = "translation";
// Variables that handle the toggle behaviour of the toolbars
var fadeSwitch = [0, 0];




/*
 * Damit werden neue Buttonelemente in der Linke Leite erzeugt
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
 * Damit werden in der rechte Leiste die Parameterelemente angelegt
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



window.onload = function(){
    controller.Activate("hand");
    
    /* Damit wird die Rechte Leiste getestet */
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
};


function someDiv()
{
   if (document.getElementById('fix')) {
      document.getElementById('fix').innerHTML = "Hier ist das Element";
      document.getElementById('fix').style.color = "green";
   } else {
      alert('Fehler: Kein Element mit der ID fix gefunden!');
   }
}


/*
 * Set Viewpoint
 */
function setViewpoint(point)
{	
	if(point == "none")
	{
		var vPoint = document.getElementById("viewPoint");
		vPoint.setAttribute("position", "9.89187 11.41910 20.11090");
		vPoint.setAttribute("orientation", "-0.69262 0.71082 0.12256 0.61209");
	}
	else if(point == "front")
	{
		var vPoint = document.getElementById("viewPoint");
		vPoint.setAttribute("position", "0 0 30");
		vPoint.setAttribute("orientation", "0 0 0 0");
	}
	else if(point == "back")
	{
		var vPoint = document.getElementById("viewPoint");
		vPoint.setAttribute("position", "0 0 -30");
		vPoint.setAttribute("orientation", "0 1 0 3.142");
	}
	else if(point == "right")
	{
		var vPoint = document.getElementById("viewPoint");
		vPoint.setAttribute("position", "30 0 0");
		vPoint.setAttribute("orientation", "0 1 0 1.571");
	}
	else if(point == "left")
	{
		var vPoint = document.getElementById("viewPoint");
		vPoint.setAttribute("position", "-30 0 0");
		vPoint.setAttribute("orientation", "0 1 0 -1.571");
	}
	else if(point == "top")
	{
		var vPoint = document.getElementById("viewPoint");
		vPoint.setAttribute("position", "0 30 0");
		vPoint.setAttribute("orientation", "1 0 0 -1.571");
		
	}
	else if(point == "bottom")
	{		
		var vPoint = document.getElementById("viewPoint");
		vPoint.setAttribute("position", "0 -30 0");
		vPoint.setAttribute("orientation", "1 0 0 1.571");
	}		
}


/*
 * Initialization of all JQuery elements
 */
$(function()
{	
    // Grundelemente mit Button-Klick einfuegen
    $("#Cylinder").click(function(){primitiveManager.addPrimitive("Cylinder");});
    $("#Sphere").click(function(){primitiveManager.addPrimitive("Sphere");});
    $("#Cone").click(function(){primitiveManager.addPrimitive("Cone");});
    $("#Box").click(function(){primitiveManager.addPrimitive("Box");});
    $("#Dish").click(function(){primitiveManager.addPrimitive("Dish");});
    $("#Snout").click(function(){primitiveManager.addPrimitive("Snout");});
    $("#Pyramid").click(function(){primitiveManager.addPrimitive("Pyramid");});
    $("#SlopedCylinder").click(function(){primitiveManager.addPrimitive("SlopeBottomCylinder");});
    $("#loeschen").click(function(){window.removeNode();});
    
    $("#amount-x").spinner({
        stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
    $("#amount-y").spinner({         
        stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
    $("#amount-z").spinner({         
        stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
	
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
    
});



/*
 * Toggeling fade function of the left toolbar
 */
function fadeLeft(){
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
}



/*
 * Toggeling fade function of the right toolbar
 */
function fadeRight(){
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
} 
