/*
 * 
 */
function SnapContext()
{
	vecA_ID = 0;
	vecA_pos = 0;
	pointA_ID = 0;
	pointA_pos = 0;

	var snapJ = new SnapJSON();
	var createContextPoint = new CreateContextPoint();
	var objPointList = createContextPoint.getObjPointList();
	
	
	// Retrieves the information about the position of the Snappoints
	var pointListObj = snapJ.getJSON('./x3d/JsonFiles', 'Box');
	
	this.init = function()
	{
		snapContext.addContextMenu(x, y);
	};
    
    
    this.addContextMenu = function(x, y)
    {   
    	$("#dialog").dialog({
    		width: 80,
    		minHeight: 120,
    		modal: false,
    		autoOpen: true,
    		resizable: false,
    		open: function (event, ui) 
    		{
    			//$('.ui-dialog-titlebar').hide();
    			$('#dialog').css('overflow', 'inherit');
    			$('#dialog').css("border-radius", "5px");
    			
				$('#innenDialog').html('<li><div id="divContext">Snap-To</div></li>');
        		$('#innenDialog').mouseover(function(){this.style.cursor='pointer';});
        		$('#divContext').click(function(){pointListShow();});
        		
        		$('.ui-widget-overlay').click (function () {
    				$('#dialog').dialog('close');
				});
        			
	    	    $('#innenDialog').slimScroll({
			        size: '10px',
			        height: '95px',
			        color: '#7E7E7E',
			        position: 'right',
			        alwaysVisible: true,
			        railVisible: true,
			        railColor: '#BDBDBD'
			    });
			}
        });
        
        $("#dialog").dialog( "option", "position", [x, y]);
    };
    
    
    function pointListShow()
    {	    
    	// List ob Elements on the Display
    	// var elementList = primitiveManager.getIDList();

		if(vecA_pos == 0)
		{
			createContextPoint.setPoint(pointListObj.point1.position, primitiveManager.getCurrentPrimitiveID()); 
			
			vecA_ID = primitiveManager.getCurrentPrimitiveID();
			vecA_pos = primitiveManager.getCurrentPrimitive().getTranslation();
			
			pointA_ID = primitiveManager.getCurrentPrimitiveID() + '_point_0';
			pointA_pos = snapContext.getPosition(pointA_ID); 
			
			console.log(vecA_ID);
			console.log(vecA_pos);
			console.log(pointA_ID);
			console.log(pointA_pos);
		}
		else
		{
			createContextPoint.setPoint(pointListObj.point1.position, primitiveManager.getCurrentPrimitiveID()); 
			
			vecB_ID = primitiveManager.getCurrentPrimitiveID();
			vecB_pos = primitiveManager.getCurrentPrimitive().getTranslation();
			
			pointB_ID = primitiveManager.getCurrentPrimitiveID() + '_point_0';
			pointB_pos = snapContext.getPosition(pointB_ID); 
			
			console.log(vecB_ID);
			console.log(vecB_pos);
			console.log(pointB_ID);
			console.log(pointB_pos);
		}
		
		/*
		if(vecA != 0 && vecB != 0)
		{
			//console.log();
			//console.log();
			//snapTo(vecA, vecB);
		}
		*/
    };
    
    
    /*
     * 
     */
    function snapTo(vecA, vecB)
    {
    	//1.rotiere objekt
		//berechne roationsmatrix, um von vecA zu vecB zu kommen (rotation)
		var rotationMatrix = x3dom.fields.Quaternion.rotateFromTo(vecA, vecB).toMatrix();
		
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
    };
    
    
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
	
		/* */
	this.getIDList = function()
	{
        var pointObjID = [];
        for (var key in objPointList){
            pointObjID.push(key);
        }
        
        return pointObjID;
	};
	
	/* */
    this.getPrimitiveByID = function(id){
        if (id && objPointList[id]) {
            return objPointList[id];
        }
        else {
            return null;
        }
    };
	
	/* */
    this.getCurrentPrimitiveID = function(){
        return primitiveManager.getCurrentPrimitiveID() + '_point_0';
    };
    
	/* */
    this.getCurrentPrimitive = function(){
    	return snapping.getPrimitiveByID(primitiveManager.getCurrentPrimitiveID() + '_point_0'); 
    };
    
	/* */
    this.getPosition = function(pointID){
        return x3dom.fields.SFVec3f.parse(objPointList[pointID].getAttribute("translation"));
    };
}
