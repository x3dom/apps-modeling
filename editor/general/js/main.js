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
function newDivImg(img, name)
{
    var divID = document.createElement("div");
    divID.setAttribute("id", name);
    divID.setAttribute("style", "background-image: url(" + img + "); width: 60px; height: 60px; margin: 5px; border: solid 1px #fff; border-radius: 5px;");

    divID.setAttribute("onmouseover", "this.style.cursor='pointer';");
    divID.onclick = function(){primitiveManager.addPrimitive(name.replace(new RegExp(' ', 'g'), ''));};

    var divIDinnen = document.createElement("div");
    divIDinnen.setAttribute("style", "color: #fff; margin: 24px; margin-left: 8px;");
    divIDinnen.innerHTML = name;			

    divID.appendChild(divIDinnen);
    document.getElementById("divs").appendChild(divID);
}




window.onload = function(){
    controller.Activate("hand");
    
    
    newDivImg("images/box.jpg", "Box");
    newDivImg("images/sphere.jpg", "Sphere");
    newDivImg("images/cone.jpg", "Cone");
    newDivImg("images/cylinder.jpg", "Cylinder");
    newDivImg("images/dish.jpg", "Dish");
    newDivImg("images/snout.jpg", "Snout");
    newDivImg("images/pyramid.jpg", "Pyramid");
    newDivImg("images/slopedcylinder.jpg", "Sloped Cylinder");
};




// TODO: Andres
function addParameter(object) 
{
	    
}

addParameter({name:"blablub", value: 2.0, id:"id_01"});
addParameter({name:"blablu3b", value: 1.0, id:"id_02"});
addParameter({name:"blab23lub", value: 3.0, id:"id_03"});



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
    
    $("#menu-accordeon").button();
    $("#loeschen").button();
    
    
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
            left: "-77px"
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
