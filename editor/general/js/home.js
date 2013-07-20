// Fuer die ID-Zuweisung
var shapeCounter = 0;

// fuer die Slider im Verschiebenfeld
var posX = 0;
var posY = 0;
var posZ = 0;


// Die Variable speicher die mit der Maus zuletzt ausgewaehlte ID eines Elements
var aktuelleID;


function addElement(element)
{	
	var IDname = "element_" + shapeCounter;
	shapeCounter++;
		
    var t = document.createElement('Transform');
    t.setAttribute("id", IDname);
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
    var b = document.createElement(element);
    s.appendChild(b);
        
    var ot = document.getElementById('root');
    ot.appendChild(t);
    
    /* Jedes Element bekommt ein eigenes ID, und ein eigenes eventListener */
    document.getElementById(IDname).addEventListener("click", function(){elementAttribute(IDname)}, true);
    
    /* Letzte erzeugtes Element bleibt ausgewaehlt */
   	aktuelleID = IDname;
   
    return false;
};



// Wenn auf ein Element geklickt wird speichern wir zu erst seine ID, 
//mit der ID koennen andere Funktionen auf das Element angewendet werden
function elementAttribute(IDname)
{
	aktuelleID = IDname;
	
	
	/* X Y Z Position vom Element Speichern jedes Mal beim klick */
	var pos = document.getElementById(aktuelleID).getAttribute("translation");
	translationOffset = x3dom.fields.SFVec3f.parse(pos);
	
	/*
	$(".slider1").slider({min: 0, max: 15, value:0, step: 0.001, slide: function(event, ui) {		
    	
    	//document.getElementById(".slider1").setAttribute('option', translationOffset);
    	
    	var koordinaten = $("#x-sliderV").slider('option', 'value') + " " + 
    					  $("#y-sliderV").slider('option', 'value') + " " + 
    					  $("#z-sliderV").slider('option', 'value');
            	          
        document.getElementById(aktuelleID).setAttribute("translation", koordinaten);
        
        // Textfelder aktualisieren
        $( "#amount-xV" ).val( $("#x-sliderV").slider('option', 'value') );
     	$( "#amount-yV" ).val( $("#y-sliderV").slider('option', 'value') );
     	$( "#amount-zV" ).val( $("#z-sliderV").slider('option', 'value') );
     }});
     */
};



// Remove die Nodeelemente mit Hilfe der ID    
function removeNode()
{
	var ot = document.getElementById(aktuelleID);
	
	for (var i = 0; i < ot.childNodes.length; i++) 
	{
		// check if we have a real X3DOM Node; not just e.g. a Text-tag
        if (ot.childNodes[i].nodeType === Node.ELEMENT_NODE) 
        {
        	ot.removeChild(ot.childNodes[i]);
  			break;
  		}
  	}
        
    return false;
};



// jQuery //

$(function()
{
	// Grundelemente mit Button-Klick einfuegen
	$("#Cylinder").click(function(){window.addElement("Cylinder");});
	$("#Sphere").click(function(){window.addElement("Sphere");});
	$("#Cone").click(function(){window.addElement("Cone");});
	$("#Box").click(function(){window.addElement("Box");});
	
	
	
	$("#loeschen").click(function(){window.removeNode();});
	$("#export").click(function(){});
	$("#import").click(function(){});
	
	
// Mit dem Button wird das Koordinatensystem aus- und eingeblendet
	$("#axisButton").click(function()
	{		
		
		var elem = document.getElementById("#axis");
		var state = elem.getAttribute("visibility");
		
		if(state == hidden)
		{ 
			$('#axisButton').css({'background-image':'url(./images/koordinatenSchwarz.png)'});
			document.getElementById("#axis").setAttribute("visibility", "visible");
		}
		else
		{
			$('#axisButton').css({'background-image':'url(./images/koordinatenFarbe.png)'});
			document.getElementById("#axis").setAttribute("visibility", "hidden");
		}
	});
	
	
	
/*** Das hier ist alles fuer das Accordeon-Menue ************************************************************/	
	
	/* Mit dem Button kann ich das Menue ein uns ausblenden um Platz auf dem Display zu haben */
	$("#menu-accordeon").click(function()
	{
		
		if($("#linke-leiste").css('visibility') == 'hidden')
		{ 	
			$("#menu-accordeon").html("Menü off");
			$("#linke-leiste").css('visibility', 'visible');
		}
		else
		{
			$("#menu-accordeon").html("Menü on");
			$("#linke-leiste").css('visibility', 'hidden');
		}
	});
		
	
	var iconsAccordion = 
	{
		header: "ui-icon-circle-arrow-e",
		activeHeader: "ui-icon-circle-arrow-s"
	};
				
	$("#accordeon-oben").accordion({
		heightStyle: "content",
		collapsible: true,
		active: false,
		icons: iconsAccordion
	});
/*************************************************************************************************************/	
	// Slider zum Verschieben //
	$(".slider1").slider({min: 0, max: 15, value:0, step: 0.001, slide: function(event, ui) {		
		
		posX = $("#x-sliderV").slider('option', 'value');
		posY = $("#y-sliderV").slider('option', 'value');
		posZ = $("#z-sliderV").slider('option', 'value');
    	
    	var koordinaten =   posX + " " + posY + " " + posZ;
            	          
        document.getElementById(aktuelleID).setAttribute("translation", koordinaten);
        
        // Textfelder aktualisieren
        $( "#amount-xV" ).val( posX );
     	$( "#amount-yV" ).val( posY );
     	$( "#amount-zV" ).val( posZ );
     }});

		
	// Slider zum Skalieren //
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
        $( "#amount-xD" ).val( $( "#x-sliderD" ).slider( "value" ) );
    }});
     
    $(".slider4").slider({min: 0, max: 360, value:0, step: 0.001, slide: function(event, ui) {
        
        var winkel = $("#y-sliderD").slider('option', 'value');
		var bogenmass = winkel * (3.14 / 180);
    	var koordinatenY = 0 + " " + winkel + " "  + 0 + " " + bogenmass;

        document.getElementById(aktuelleID).setAttribute("rotation", koordinatenY);
     	$( "#amount-yD" ).val( $( "#y-sliderD" ).slider( "value" ) );
    }});
     
    $(".slider5").slider({min: 0, max: 360, value:0, step: 0.001, slide: function(event, ui) {
        
		var winkel = $("#z-sliderD").slider('option', 'value');
		var bogenmass = winkel * (3.14 / 180);
    	var koordinatenZ = 0 + " " + 0 + " "  + winkel + " " + bogenmass;
    	
        document.getElementById(aktuelleID).setAttribute("rotation", koordinatenZ);
     	$( "#amount-zD" ).val( $( "#z-sliderD" ).slider( "value" ) );
    }});
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
});
