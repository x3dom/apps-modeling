/*
 * 
 */
function SnapContext()
{	
	var snapJ = new SnapJSON();
	var createContextPoint = new CreateContextPoint();
	
	// Retrieves the information about the position of the Snappoints
	var pointListObj = snapJ.getJSON('./x3d/JsonFiles', 'Box');
	
	this.init = function()
	{
		snapContext.addContextMenu(x, y);
	};
    
    
    this.addContextMenu = function(x, y)
    {
		$(function() 
		{			
        	$("#dialog").dialog({
        		width: 120,
        		height: 80,
        		modal: false,
        		resizable: false,
            });
         	
         	$("#dialog").dialog( "option", "position", [x, y]);  
            
            //$('.ui-dialog-titlebar').hide();
            $('#dialog').css('overflow','hidden');
            $('#dialog').css("border-radius", "5px");
            
            $('#innenDialog').html('<li><div id="dialogSnap">Snap-To</div></li>');
            $('#innenDialog').mouseover(function(){this.style.cursor='pointer';});
            $('#innenDialog').click(function(){pointListShow();});
    	    
    	    /*
    	    $('#dialog').slimScroll({
		        size: '10px',
		        width: '120px',
		        height: '80px',
		        color: '#6E6E6E',
		        position: 'right',
		        alwaysVisible: true,
		        railVisible: true,
		        railColor: '#BDBDBD'
		    });
		    */
		});
    };
    
    
    function pointListShow()
    {
    	// List ob Elements on the Display
    	var elementList = primitiveManager.getIDList();
    	
	    if(elementList.length != null)
	    { 	
	    	for(var i = 0; i < elementList.length; i++)
	    	{
	    		//Set Point to Object
	    		createContextPoint.setPoint(pointListObj.point1.position, elementList[i]);
	    	}
	    }
    }
    
    
    /*
     * 
     */
    function snapTo(vecA, vecB)
    {
    	//1.rotiere objekt
		//berechne roationsmatrix, um von vecA zu vecB zu kommen (rotation)
		var rotationMatrix = x3dom.fields.Quaternion.rotateFromTo(vecA, vecB). toMatrix();
		
		//update globale rotation, translation, skalierung des objekts („prim“ ist ein „Primitive“)
		var matTransNode        = prim.getMatrixTransformNode();
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
		prim.setRotationAngles(angles[0] * rad2Deg, angles[1] * rad2Deg, angles[2] * rad2Deg);
		
		//update der world space-positionen der snapping points
		//(siehe mail “Punkte und Normalen eines Primitives transformieren“)
		var transformedPoint   = newTransformMat. multMatrixPnt();
		
		//2. verschiebe objekt
		//(otherTransformedPoint ist auch im world space, wurde bereits berechnet)
		var additionalTranslation = otherTransformedPoint.subtract(transformedPoint);
		
		//wende additionalTranslation an
    }
    
    
    /*
    // Name ist der Name von dem Punkt
    this.addContextMenuEntry = function(name) 
    {
	    var div = document.getElementById("innenDialog");
	    var that = this;
	
	    var divPrim = document.createElement("div");
	    divPrim.setAttribute("id", "ctx_" + name);
	    divPrim.setAttribute("class", "ContextMenuEntry");
	    divPrim.innerHTML = name;
	
	    div.appendChild(divPrim);
	
	    divPrim.onclick = function () { document.getElementById("contextMenu").style.display = "none"; };
	};
	*/
}
