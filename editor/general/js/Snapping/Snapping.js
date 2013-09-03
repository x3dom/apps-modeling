/*
 * The Snapping class regulates the central functionality
 */
function Snapping()
{
	var snapBool = false;
	/*
	 * Starts the ability to snapping
	 */
	this.init = function()
	{
		if(snapBool == false)
		{
			snapBool = true;
			setSnapping();
			
			document.getElementById("SnapPoints").style.border="solid 1px #fff";
            document.getElementById("SnapPoints").src = "./images/magnet_on.png";
		}
		else
		{
			snapBool = false;
			
			document.getElementById("SnapPoints").style.border="solid 1px gray";
            document.getElementById("SnapPoints").src = "./images/magnet_off.png";
            
            //remove existing lines
            elementList = primitiveManager.getIDList();
            for(var i = 0; i < elementList.length; i++)
            {
            	primitiveManager.removeSnapNode(elementList[i] + '_line');
            }
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
        	currentPrimitive = primitiveManager.getCurrentPrimitive();
       		currentPrimitive.Report(primitiveManager.getCurrentPrimitiveID());
       	}
	};
	
	
    /*
     * Observers properties are added to any existing element
     * Here is the calculation of the distance between two elements
     */
    function setSnapping()
    {
    	elementList = [];
    	elementList = primitiveManager.getIDList();
    	
    	// Observer-Objects
    	var snapObserver = new SnapObserver();
    	var snapSubject = new SnapSubject();
    	
	    if(elementList.length != null)
	    {	    	
	    	for(var i = 0; i < elementList.length; i++)
	    	{
	    		element = document.getElementById(elementList[i]);
	    		 		
	    		//Subject is observed
		        SnapInherits(snapSubject, element);
		        //Observer what makes Subject
				SnapInherits(snapObserver, element);
				//Added to Observer list 
		        element.AddObserver(element);
								
				
			 	//Updates the changed parameters
    	    	element.Update = function( myPosition, postPosition, myObj, postObj )
    	    	{
    	    		try
    	    		{
    	    			//Calculated distance to the elements
    	    			//Each element draws a line on the selected item, 
    	    			//the lines and the distance are always calculate and updated
    	    			var distance = myPosition.subtract(postPosition).length();
    	    			if(distance != 0){ snapTo(myObj, postObj, distance); }
    	    			setLine(myPosition, postPosition, postObj);
    	    		}
    	    		catch(event)
    	    		{
    	    			console.log(event);
    	    		}
    	    	};
	    	}
	    }
    };
    
    
    /*
     * Connects two points
     */
    function snapTo(myObj, postObj, distance)
    {    		
    	if(distance < 2.0)
    	{
    		myObj.setAttribute('translation', postObj.getAttribute('translation'));
    	}
    };
    
    
    /*
     * Draws a line between two elements
     */
    function setLine(myPosition, postPosition, postObj)
    {
    	temp = postObj.id + '_line';
		var point1 = myPosition.x + ' ' + myPosition.y + ' ' + myPosition.z;
		var point2 = postPosition.x + ' ' + postPosition.y + ' ' + postPosition.z;
    
		if(document.getElementById(temp))
    	{
    		primitiveManager.removeSnapNode(temp);
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
    	lineSetCoordinate.setAttribute('Point', point1 + ', ' + point2);
    	
    	lineAppearance.appendChild(lineMaterial);
    	lineShape.appendChild(lineAppearance);
    	lineSet.appendChild(lineSetCoordinate);
    	lineShape.appendChild(lineSet);
    	lineTransform.appendChild(lineShape);
    	
    	var lineSnap = document.getElementById('snapLines');
    	lineSnap.appendChild(lineTransform);
    	
    };
    
    
    /*
     * Draws the points from the JSON file
     */
    function setPoint(pointPosition, objectName)
    {    	   	
    	var pointTransform = document.createElement('Transform');
    	pointTransform.setAttribute('id', 'pointsJSON');
    	
    	var pointShape = document.createElement('Shape');
    	var pointAppearance = document.createElement('Appearance');
    	var pointMaterial = document.createElement('Material');
    	lineMaterial.setAttribute('emissiveColor', '1 1 0');
    	
    	var pointSet = document.createElement('LineSet');
    	var pointSetCoordinate = document.createElement('Coordinate');
    	pointSetCoordinate.setAttribute('Point', pointPosition);
    	
    	pointAppearance.appendChild(pointMaterial);
    	pointShape.appendChild(pointAppearance);
    	pointSet.appendChild(pointSetCoordinate);
    	pointShape.appendChild(pointSet);
    	pointTransform.appendChild(pointShape);
    	
    	var pointSnap = document.getElementById('snapPoints');
    	pointSnap.appendChild(pointTransform);
    };
}
