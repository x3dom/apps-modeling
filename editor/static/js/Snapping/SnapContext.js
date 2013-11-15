/* Liste aller Dialogfenster */
var dialogList = [];

function SnapContext()
{	
	var fromTo = [];
	var objPointList = [];
	
	this.init = function(x, y)
	{
		objPointList = pointAttribute(snapping.getObjPointList());
		snapContext.addContextMenu(x, y);
	};

 
 	// Context fuer einen Element erstellen
    this.addContextMenu = function(x, y)
    {
    	var objectName = primitiveManager.getCurrentPrimitiveID();
    	var dialogName = objectName + "_dialog";
    	var innenDialogName = objectName + "_innenDialog";
    	
    	//Prueft ob bereits ein Dialog mit dem ID vorhanden ist
    	if($("#" + dialogName).length != 0) 
  		{
    		snapContext.hide();
    		removeMode("#" + dialogName);
		}
		
    	var divInnen = document.createElement("div");
    	divInnen.setAttribute("id", innenDialogName);
    	
    	var divAussen = document.createElement("div");
    	divAussen.setAttribute("id", dialogName);
    	
    	divAussen.appendChild(divInnen);
    	document.getElementById("dialog").appendChild(divAussen);
    	
    	var divContextName = objectName + "_context";
    	
    	
    	// Contextwindow erstellen
    	$("#" + dialogName).dialog({
    		width: 80,
    		minHeight: 120,
    		modal: false,
    		autoOpen: true,
    		resizable: false,

    		open: function (event, ui) 
    		{
    			$('.ui-dialog-titlebar').hide();
    			$("#" + dialogName).css('overflow', 'inherit');
    			$("#" + dialogName).css("border-radius", "5px");
				$("#" + dialogName).css('padding', '0px');
				$("#" + dialogName).css('margin', '0px');
				
				// Inhalt fuer die Context-Fenster wird erzeugt und angezeigt
				/**********************************************************************************/
				jQuery('<div></div>', {id: divContextName}).appendTo('#' + innenDialogName);
				var divInhalt = "<h3>Snappoints</h3><div><ul>";
				$('#' + divContextName).html(divInhalt);
				
				for(i = 0; i < objPointList.length; i++)
				{
					$('#' + divContextName).html(function() {
						divInhalt += "<li id='" + objPointList[i].id  + "__" + dialogName + "'>" + objPointList[i].id + "</li>";
						return divInhalt;
					});
				}
				divInhalt += "</ul></div>";
				/**********************************************************************************/				
				
				/**********************************************************************************/
				for(i = 0; i < objPointList.length; i++)
				{					
					$('#' + objPointList[i].id + "__" + dialogName).on('mouseover', function() 
				    {
				        $(this).css('cursor','pointer');
				    });
				    
				    // Hier ist zu beachten das zur Zeit der Ausfuerung die ObjPointList nicht mehr bekannt ist
				    // Deswegen muess hier aus dem this.id Objekt die Ursprungliche ID gepastellt werden
					$('#' + objPointList[i].id + "__" + dialogName).click(function() 
					{
						var objID = this.id.slice(0, this.id.search("__"));		
					
						if(fromTo.length == 0){ fromTo[0] = objID; }
						
						else if(fromTo.length == 1)
						{
							console.log("==1  " + objID);
							fromTo[1] =  objID;
							snapTo();
						}
						else if(fromTo.length == 2)
						{
							fromTo = [];
							fromTo[0] =  objID;
							console.log(">2  " + objID);
						}
				    });
				}				
				/**********************************************************************************/
				
				//Start accordion
				$("#" + divContextName).accordion({
					heightStyle: "content",
					collapsible: true,
					//active: false,
					autoHeight: false,
					clearStyle: true
				}).show();
				
				$("#" + divContextName).css('padding', '0px');
				$("#" + divContextName).css('margin', '0px');
				$(".ui-accordion-content").css('padding', '0px');
				$(".ui-accordion-content").css('margin', '0px');
				$(".ui-accordion-content").css('overflow', 'inherit');
			}
     	}).show();
        
        $("#" + dialogName).dialog( "option", "position", [x, y]);
        dialogList.push(dialogName); // Speichert alle Dialogfenster
    };
  	
  	
    /* Die Punkte bekommen Ihre Attribute */
	function pointAttribute(objPointList)
	{
		var objPoints = [];
		var i, temp, objID, Obj;
		
		for(i = 0; i < objPointList.length; i++)
		{
			temp = snapping.getPosition(objPointList[i]);
			var objID = objPointList[i].slice(0, objPointList[i].search("_"));
			var Obj = primitiveManager.getPrimitiveByID(objID);
						
			objPoints[i] = new Array();
			objPoints[i].id = objPointList[i];
			objPoints[i].objID = objID;
			objPoints[i].x = Obj.translation.x + temp.x;	//x, y, z Weltkoordinaten der Punkte
			objPoints[i].y = Obj.translation.y + temp.y;
			objPoints[i].z = Obj.translation.z + temp.z;
			objPoints[i].xL = temp.x; //xL, yL, zL Lokalle Position der Punkte im Objekt
			objPoints[i].yL = temp.y;
			objPoints[i].zL = temp.z;
			objPoints[i].rotationX = Obj.getRotationAngles.x;
			objPoints[i].rotationY = Obj.getRotationAngles.y;
			objPoints[i].rotationZ = Obj.getRotationAngles.z;
			objPoints[i].position = new x3dom.fields.SFVec3f(objPoints[i].x, objPoints[i].y, objPoints[i].z);
		}
		
		return objPoints;
	};

	
	/* Die Uebergebene Punkte werden verbundne */ 
	function snapTo()
    {    	
    	var i;
    	var objA = [];
    	var objB = [];
    	console.log("From: " + fromTo[0] + " to: " + fromTo[1]);
    	console.log("From: " + fromTo[0] + " to: " + fromTo[1]);
    	
    	//console.log(document.getElementById(objPointList[0].id.getAttribute('translation')));
    	
    	for(i = 0; i < objPointList.length; i++)
    	{
    		if(objPointList[i].id == fromTo[0]){ objA = objPointList[i]; }
    		if(objPointList[i].id == fromTo[1]){ objB = objPointList[i]; }
    	}

    	this.primitiveManager.highlightCurrentBoundingVolume(false);
    	
		var post = primitiveManager.getPrimitiveByID(objB.objID);
		var temp = primitiveManager.getPrimitiveByID(objA.objID);
		
		temp.rotationAngles.x = post.rotationAngles.x;
		temp.rotationAngles.y = post.rotationAngles.y;
		temp.rotationAngles.z = post.rotationAngles.z;
		
		x = objB.x + objB.xL;	//Welt und Lokalle Position werden addiert
		y = objB.y + objB.yL;
		z = objB.z + objB.zL;    		
		
		temp.setTranslation(x, y, z);
		snapContext.hide();
    };
	

	/*  	
    function snapTo(prim)
    {
    	var i;
    	var objA = [];
    	var objB = [];
    	console.log("From: " + fromTo[0] + " to: " + fromTo[1]);
    	
    	for(i = 0; i < objPointList.length; i++)
    	{
    		if(objPointList[i].id == fromTo[0]){ objA = objPointList[i]; }
    		if(objPointList[i].id == fromTo[1]){ objB = objPointList[i]; }
    	}
    	
    	var prim = primitiveManager.getPrimitiveByID(objA.objID);
    	
    	
    	//this.primitiveManager.highlightCurrentBoundingVolume(false);
		var post = primitiveManager.getPrimitiveByID(objB.objID);
		var temp = primitiveManager.getPrimitiveByID(objA.objID);
		
		console.log(post);
		
    	
		//From vecA to vecB
		var rotationMatrix = x3dom.fields.Quaternion.rotateFromTo(temp.rotationAngles, post.rotationAngles).toMatrix();
		
		//update globale rotation, translation and scaling
		var matTransNode = prim.getMatrixTransformNode();
		var oldTransformMat  =  x3dom.fields.SFMatrix4f.parse(matTransNode.getAttribute("matrix")).transpose();
		
		var newTransformMat = oldTransformMat.mult(rotationMatrix);
		
		var transVec = new x3dom.fields.SFVec3f(0, 0, 0);
		var scaleVec = new x3dom.fields.SFVec3f(1, 1, 1);
		var scaleRotQuat = new x3dom.fields.Quaternion(0, 0, 1, 0);
		var rotationQuat = new x3dom.fields.Quaternion(0, 0, 1, 0);
		newTransformMat.getTransform(transVec, rotationQuat, scaleVec, scaleRotQuat);
		
		prim.setTranslationAsVec(transVec);
		prim.setScaleAsVec(scaleVec);
		var angles = rotationQuat.toMatrix().getEulerAngles();
		var rad2Deg = 180.0 / Math.PI;
		
		//prim.setRotationAngles(angles[0] * rad2Deg, angles[1] * rad2Deg, angles[2] * rad2Deg);
			
		//update der world space-positionen der snapping points
		var transformedPoint = newTransformMat.multMatrixPnt(objA);
		
		//verschiebe objekt
		var additionalTranslation = post.rotationAngles.subtract(objA.position);
		
		//wende additionalTranslation an
		this.primitiveManager.highlightCurrentBoundingVolume(false);
		
		prim.setTranslation(transformedPoint.x, transformedPoint.y, transformedPoint.z);
    }
    */
    
    // Damit wird ein Dialogfenster versteckt
    this.hide = function()
   	{
   		$(".ui-dialog").hide();
   		
   		for(var i = 0; i < dialogList.length; i++)
   		{
   			removeNode(dialogList[i]);
   		}
   		
   	};
   	
   	// Wird von hide() verwendet
   	function removeNode(id)
   	{
   		var nodePoint = document.getElementById(id);
        if(nodePoint && nodePoint.parentNode)
    	    nodePoint.parentNode.removeChild(nodePoint);
   	}
   	
	this.getObjPointList = function()
	{
		return objPointList;
	};
}
