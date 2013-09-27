/*
 * The Snapping class regulates the central functionality
 */
function Snapping()
{
	var snapBool = false;
	var snapJ = new SnapJSON();
	var createLine = new CreateLine();
	var snapPointCreate = new SnapPointCreate();
	var objPointList = snapPointCreate.getObjPointList();
	
	/*
	 * Starts the ability to snapping
	 */
	this.init = function()
	{
        var snapPoints = document.getElementById("SnapPoints");

        if(snapBool == false)
        {
            snapBool = true;
            snapping.setSnapping();

            snapPoints.style.border="solid 1px #fff";
            snapPoints.src = "./images/magnet_on.png";
        }
        else
        {
            snapBool = false;

            snapPoints.style.border="solid 1px gray";
            snapPoints.src = "./images/magnet_off.png";

            //remove existing lines and Points
            var elementList = primitiveManager.getIDList();

            for(var i = 0; i < elementList.length; i++)
            {
                primitiveManager.removeSnapNode(elementList[i] + '_line');
                primitiveManager.removeSnapNode(elementList[i] + '_point_0');
            }
        }
	};
		
	
	/*
	 * when a new item to the list comes after the snapping are start
	 * snapping is added to the new object
	 */
	this.newSnapObject = function(objID)
	{
		if(snapBool == true)
		{
			snapping.setSnapping();
		}
	};
		
	
	/*
	 * when snapping is active, the selected item position is always known and calculate the position the other
	 */
	this.startSnapping = function()
	{
		if(snapBool == true)
		{
			//Current Item reports its changes to the observer
        	var currentPrimitive = primitiveManager.getCurrentPrimitive();
       		currentPrimitive.Report();
       	}
	};
	
	
    /*
     * Observers properties are added to any existing element
     * Here is the calculation of the distance between two elements
     */
    this.setSnapping = function()
    {
    	var elementList = primitiveManager.getIDList();
    	
		// Observer-Objects
		var snapObserver = new SnapObserver();
		var snapSubject = new SnapSubject();


		// Retrieves the information about the position of the Snappoints
		var pointListObj = snapJ.getJSON('./x3d/JsonFiles', 'Box');
		
		
	    if(elementList.length != null)
	    { 	
	    	for(var i = 0; i < elementList.length; i++)
	    	{
	    		//Set Point to Object
	    		snapPointCreate.setPoint(pointListObj.point1.position, elementList[i]);
		        //Search Object
	    		var element = primitiveManager.getPrimitiveByID(elementList[i]);
	    		//Subject is observed
		        SnapInherits(snapSubject, element);
		        //Observer what makes Subject
				SnapInherits(snapObserver, element);
				//Added to Observer list 
		        element.AddObserver(element);
				//Call the update function of the observer
				elementUpdate(element);
			}
	    }
    };
    
    
    /*
     * Call the update function of the observer
     */
	function elementUpdate(element)
	{
	 	//Updates the changed parameters
    	element.Update = function( myObj, postObj, myObjPoint, postObjPoint, myPosition, postPosition,
                                   myPositionPoint, postPositionPoint )
    	{
			//Calculated distance to the elements
			//Each element draws a line on the selected item, 
			//the lines and the distance are always calculate and updated   			
			var distance = myPosition.subtract(postPosition).length();		
			
			//console.log(distance);
			//console.log(distancePoint);
			
			if(distance != 0)
			{
				if(distance < 4.0)
				{
					createLine.setLine(myPosition, postPosition, myObj, postObj);
					snapTo(myObj, postObj, myObjPoint, postObjPoint, myPosition, postPosition,
                           myPositionPoint, postPositionPoint, distance);
				}
				else
				{
					//Removes connection lines, otherwise they remain visible
					primitiveManager.removeSnapNode(postObj.id + '_line');
	            	primitiveManager.removeSnapNode(myObj.id + '_line');			          					            
	            }
			}
    	};
	}
	
	
    /*
     * Connects two points
     * Removes connection lines, otherwise they remain visible
     */
    function snapTo(myObj, postObj, myObjPoint, postObjPoint, myPosition, postPosition,
                    myPositionPoint, postPositionPoint, distance)
    {
    	this.primitiveManager.highlightCurrentBoundingVolume(false);
    		
    	if(distance < 2.0)
    	{
    		//This is the position of the point in the element, and is added 
    		//to the global position. This point is the connecting point.
    		var postPointTempPosition = snapping.getPosition(postObjPoint.id);
   
    		//The new position is then passed to the right place    							    		
    		myObj.setTranslation(postPositionPoint.x + postPointTempPosition.x,
    			                 postPositionPoint.y + postPointTempPosition.y,
    			                 postPositionPoint.z + postPointTempPosition.z);
    		
    		primitiveManager.removeSnapNode(postObj.id + '_line');
    		primitiveManager.removeSnapNode(myObj.id + '_line');
    	}
    }
    
    
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
