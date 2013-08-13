// PrimitiveManager handles the adding of new primitives and their behaviour
var primitiveManager = new PrimitiveManager();
// UI handles all the access to all gui elements
var ui = new UI(primitiveManager);
// Controller that handles the activation of the transformation modes
var controller = new Controller();
// Variable that defines the handling mode
var HANDLING_MODE = "translation";



window.onload = function(){
    controller.Activate("hand");
    ui.initialize(); 
};



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
		
		var vPlane = document.getElementById("planeId");
		vPlane.setAttribute("rotation", "1 0 0 1.571");
	}
	else if(point == "front")
	{
		var vPoint = document.getElementById("viewPoint");
		vPoint.setAttribute("position", "0 0 30");
		vPoint.setAttribute("orientation", "0 0 0 0");
		
		var vPlane = document.getElementById("planeId");
		vPlane.setAttribute("rotation", "1 0 0 0");
	}
	else if(point == "back")
	{
		var vPoint = document.getElementById("viewPoint");
		vPoint.setAttribute("position", "0 0 -30");
		vPoint.setAttribute("orientation", "0 1 0 3.142");
		
		var vPlane = document.getElementById("planeId");
		vPlane.setAttribute("rotation", "1 0 0 0");
	}
	else if(point == "right")
	{
		var vPoint = document.getElementById("viewPoint");
		vPoint.setAttribute("position", "30 0 0");
		vPoint.setAttribute("orientation", "0 1 0 1.571");
		
		var vPlane = document.getElementById("planeId");
		vPlane.setAttribute("rotation", "0 1 0 1.571");
	}
	else if(point == "left")
	{
		var vPoint = document.getElementById("viewPoint");
		vPoint.setAttribute("position", "-30 0 0");
		vPoint.setAttribute("orientation", "0 1 0 -1.571");
		
		var vPlane = document.getElementById("planeId");
		vPlane.setAttribute("rotation", "0 1 0 1.571");
	}
	else if(point == "top")
	{
		var vPoint = document.getElementById("viewPoint");
		vPoint.setAttribute("position", "0 30 0");
		vPoint.setAttribute("orientation", "1 0 0 -1.571");
		
		var vPlane = document.getElementById("planeId");
		vPlane.setAttribute("rotation", "1 0 0 1.571");
	}
	else if(point == "bottom")
	{		
		var vPoint = document.getElementById("viewPoint");
		vPoint.setAttribute("position", "0 -30 0");
		vPoint.setAttribute("orientation", "1 0 0 1.571");
		
		var vPlane = document.getElementById("planeId");
		vPlane.setAttribute("rotation", "1 0 0 1.571");
	}		
}
