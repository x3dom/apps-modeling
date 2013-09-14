/*
 * The Snapping class regulates the central functionality
 */
function Snapping()
{
	var snapBool = false;
	var objPointList = [];
	var snapJ = new SnapJSON();
	
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


		// TODO: Only test !!!
		var pointList = snapJ.getJSON('./x3d/JsonFiles', 'Box', 'snapPoints');
		
		
	    if(elementList.length != null)
	    { 	
	    	for(var i = 0; i < elementList.length; i++)
	    	{
	    		//Set Snappoints
	    		for(var x = 0; x < pointList.length; x++)
		        {
		        	setPoint(pointList[x], elementList[i]);
		        }
		        
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
    	element.Update = function( myObj, postObj, myObjPoint, myPosition, postPosition,
                                   myPositionPoint, postPositionPoint )
    	{
			//Calculated distance to the elements
			//Each element draws a line on the selected item, 
			//the lines and the distance are always calculate and updated   			
			var distance = myPosition.subtract(postPosition).length();		
			
			
			if(distance != 0)
			{
				if(distance < 5.0)
				{
					setLine(myPosition, postPosition, myObj, postObj);
					snapTo(myObj, postObj, postPositionPoint, distance);
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
    function snapTo(myObj, postObj, position, distance)
    {
    	this.primitiveManager.highlightCurrentBoundingVolume(false);
    		
    	if(distance < 2.0)
    	{
    		myObj.setTranslationAsVec(position);
    		
    		primitiveManager.removeSnapNode(postObj.id + '_line');
    		primitiveManager.removeSnapNode(myObj.id + '_line');
    	}
    }
    
    
    /*
     * Draws a line between two elements
     */
    function setLine(myPosition, postPosition, myObj, postObj)
    {
    	var temp = myObj.id + '_line';
		var point1 = myPosition.x + ' ' + myPosition.y + ' ' + myPosition.z;
		var point2 = postPosition.x + ' ' + postPosition.y + ' ' + postPosition.z;
    
		if(document.getElementById(temp))
    	{
    		//Removes connection lines, otherwise they remain visible
    		primitiveManager.removeSnapNode(postObj.id + '_line');
    		primitiveManager.removeSnapNode(myObj.id + '_line');
    	}
    		
   		var lineTransform = document.createElement('Transform');
    	lineTransform.setAttribute('id', temp);
    	
    	var lineShape = document.createElement('Shape');
    	var lineAppearance = document.createElement('Appearance');
    	var lineMaterial = document.createElement('Material');
    	lineMaterial.setAttribute('emissiveColor', '1 1 0');
    	
    	var lineSet = document.createElement('IndexedLineSet');
    	var lineSetCoordinate = document.createElement('Coordinate');
    	lineSet.setAttribute('coordIndex', '0 0 1 -1');
    	lineSetCoordinate.setAttribute('point', point1 + ', ' + point2);
    	
    	lineAppearance.appendChild(lineMaterial);
    	lineShape.appendChild(lineAppearance);
    	lineSet.appendChild(lineSetCoordinate);
    	lineShape.appendChild(lineSet);
    	lineTransform.appendChild(lineShape);
    	
    	var lineSnap = document.getElementById('snapLines');
    	lineSnap.appendChild(lineTransform);
    }
    
    
    /*
     * Draws the points from the JSON file
     */
    function setPoint(pointPosition, myObjID)
    {
    	var position = pointPosition[0] + ' ' + pointPosition[1] + ' ' + pointPosition[2];
    	
    	var temp = myObjID + '_point_0';
    	var pointTransform = document.createElement('Transform');
    	pointTransform.setAttribute('id', temp);
    	pointTransform.setAttribute('translation', position);
    	
    	var pointShape = document.createElement('Shape');
    	var pointAppearance = document.createElement('Appearance');
    	var pointMaterial = document.createElement('Material');
    	pointMaterial.setAttribute('diffuseColor', '1 1 0');
    	
    	var pointSphere = document.createElement('Sphere');
    	pointSphere.setAttribute('radius', '0.03');
    	
    	pointAppearance.appendChild(pointMaterial);
    	pointShape.appendChild(pointAppearance);
    	pointShape.appendChild(pointSphere);
    	pointTransform.appendChild(pointShape);
    	
    	var objectTransform = primitiveManager.getPrimitiveByID(myObjID).getMatrixTransformNode();
    	objectTransform.appendChild(pointTransform);
    	
    	//Save Objectpoint in the Pointlist
    	objPointList[temp] = pointTransform;
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
