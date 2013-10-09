/*
 * 
 */
var vecA_ID = 0;		//id from Element
var vecA_pos = 0;		//position from Element
var pointA_ID = 0;		//id from Point
var pointA_pos = 0;		//position from Point
var vecB_ID = 0;		//id from Element
var vecB_pos = 0;		//position from Element
var pointB_ID = 0;		//id from Point
var pointB_pos = 0;		//position from Point
var currentVecA = 0;	//the right position in the world coordinate from Snappoint
var currentVecB = 0;	//the right position in the world coordinate from Snappoint

var contextObjList = []; //Save only 2 Objects
var objPointList = [];	 //Pointlist
var dialogList = [];	 //List all dialogs


function SnapContext()
{	
	var snapJ = new SnapJSON();
	var createContextPoint = new CreateContextPoint();
	objPointList = createContextPoint.getObjPointList();
	
	
	// Retrieves the information about the position of the Snappoints
	var pointListObj = snapJ.getJSON('./x3d/JsonFiles', 'Box');
	
	this.init = function(x, y)
	{
		snapContext.addContextMenu(x, y);
	};
    
    // hide the dialog
    this.hide = function()
   	{
   		$(".ui-dialog").hide();
   		
   		for(var i = 0; i < dialogList.length; i++)
   		{
   			removeNode(dialogList[i]);
   		}
   		
   	};
   	
   	// Remove all Dialog-window
   	function removeNode(id)
   	{
   		var nodePoint = document.getElementById(id);
        if(nodePoint && nodePoint.parentNode)
    	    nodePoint.parentNode.removeChild(nodePoint);
   	}
 
 	// Create Dialog to one Element
    this.addContextMenu = function(x, y)
    {   
    	var objectName = primitiveManager.getCurrentPrimitiveID();
    	var dialogName = objectName + "_dialog";
    	var innenDialogName = objectName + "_innenDialog";
    	
    	//Check if a window with that ID exists
    	//Fixed bug that an empty window context generates
    	if($("#" + dialogName).length != 0) 
  		{
  			console.log("bin hier!!!");
    		snapContext.hide();
    		//removeMode("#" + dialogName);
		}
   		
    	var divInnen = document.createElement("div");
    	divInnen.setAttribute("id", innenDialogName);
    	var divAussen = document.createElement("div");
    	divAussen.setAttribute("id", dialogName);
    	divAussen.appendChild(divInnen);
    	document.getElementById("dialog").appendChild(divAussen);
    	var divContextName = objectName + "_context";
    	
    			
		/*
    	var contextInnen = document.createElement("div");
    	divInnen.setAttribute("id", divName);
    	
    	var contextInnenH3 = document.createElement("h3");
    	contextInnenH3.innerHTML("" + objName + "");
    	
    	var contextInnenH3div = document.createElement("div");
    	contextInnenH3div.innerHTML("<p>Element_1</p>");
    	
    	contextInnenH3.appendChild(contextInnenH3div);
    	contextInnen.appendChild(contextInnenH3);
    	document.getElementById(dialogName).appendChild(contextInnen);
    	*/  
    	   	
    	//Create Contextwindow
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
				
				//Start Contextcontent
        		jQuery('<div/>', {
    				id: divContextName,
    				text: 'Snap to point'
				}).appendTo('#' + innenDialogName);
				
				//Test
				$("#" + divContextName).accordion({
					
				});
				
        		$('#' + innenDialogName).mouseover(function(){this.style.cursor='pointer';});
        		$('#' + divContextName).click(function(){pointListShow(objectName);}); 
        		
	    	    $('#' + innenDialogName).slimScroll({
			        size: '10px',
			        height: '95px',
			        color: '#7E7E7E',
			        position: 'right',
			        alwaysVisible: true,
			        railVisible: true,
			        railColor: '#BDBDBD'
			    });
			}
     	}).show();
        
        $("#" + dialogName).dialog( "option", "position", [x, y]);
        dialogList.push(dialogName); //Save all dialog-window
    };
  	
    
    function pointListShow(objectName)
    {
		if(vecB_pos == 0)
		{
			createContextPoint.setPoint(pointListObj.point1.position, objectName);
						
			contextObjList.push(objectName);
			
			vecB_ID = objectName;
			vecB_pos = primitiveManager.getPrimitiveByID(objectName).getTranslation();
			pointB_ID = objectName + '_point_0';
			pointB_pos = snapContext.getPosition(pointB_ID);
			currentVecB = vecB_pos.add(pointB_pos);
			
			console.log(currentVecB);
		}
		else
		{
			createContextPoint.setPoint(pointListObj.point2.position, objectName);
			
			contextObjList.push(objectName);
			
			vecA_ID = objectName;
			vecA_pos = primitiveManager.getCurrentPrimitive().getTranslation();
			pointA_ID = objectName + '_point_0';
			pointA_pos = snapContext.getPosition(pointA_ID); 
			currentVecA = vecA_pos.add(pointA_pos);
			
			console.log(currentVecA);
		}
		
		if(contextObjList.length == 2)
		{
			snapTo(currentVecA, currentVecB, primitiveManager.getPrimitiveByID(vecA_ID));
			snapContext.hide();
			contextObjList = [];	//Reset to null
			vecB_pos = 0;			//Reset to null
		}
    };
    
    
    /*
     * 
     */
    function snapTo(vecA, vecB, prim)
    {
		//From vecA to vecB
		var rotationMatrix = x3dom.fields.Quaternion.rotateFromTo(vecA, vecB).toMatrix();
		
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
		var transformedPoint = newTransformMat.multMatrixPnt(vecA);
		
		//verschiebe objekt
		var additionalTranslation = vecB.subtract(transformedPoint);
		
		//wende additionalTranslation an
		this.primitiveManager.highlightCurrentBoundingVolume(false);
		
		//prim.setTranslation(additionalTranslation.x, additionalTranslation.y, additionalTranslation.z);
		
    	this.primitiveManager.highlightCurrentBoundingVolume(false);
		var x = currentVecB.x + pointA_pos.x;
		var y = currentVecB.y + pointA_pos.y;
		var z = currentVecB.z + pointA_pos.z;
		prim.setTranslation(x, y, z);
    };
    
	
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
