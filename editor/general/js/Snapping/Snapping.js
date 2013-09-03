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
    	    			var distance = myPosition.subtract(postPosition).length();
    	    			
    	    			if(distance != 0)
    	    			{
    	    				/*
    	    				var point1 = myPosition.x + ' ' + myPosition.y + ' ' + myPosition.z;
	    	    			var point2 = postPosition.x + ' ' + postPosition.y + ' ' + postPosition.z;
	    	    			setLine( point1, point2 );
	    	    			*/
	    	    			
    	    				console.log(myObj.id + " zu " + postObj.id + " : " + distance);
	    	    			snapTo(myObj, postObj, distance);
	    	    		}
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
     * 
     */
    function snapTo(myObj, postObj, distance)
    {
    	if(distance < 2.0)
    	{
    		myObj.setAttribute('translation', postObj.getAttribute('translation'));
    		console.log('Object is snapping');
    	}
    };
    
    
    /*
     * Draws a line between two elements
     */
    function setLine(point1, point2)
    {    	   	
    	var lineTransform = document.createElement('Transform');
    	lineTransform.setAttribute('id', 'pointLine');
    	
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
    	
    	var lineSnap = document.getElementById('root');
    	lineSnap.appendChild(lineTransform);
    };
    
    
    /*
     * Draws the points from the JSON file
     */
    function setPoint(point1, point2)
    {    	   	
    	var pointTransform = document.createElement('Transform');
    	pointTransform.setAttribute('id', 'pointsJSON');
    	
    	var pointShape = document.createElement('Shape');
    	var pointAppearance = document.createElement('Appearance');
    	var pointMaterial = document.createElement('Material');
    	lineMaterial.setAttribute('emissiveColor', '1 1 0');
    	
    	var pointSet = document.createElement('LineSet');
    	var pointSetCoordinate = document.createElement('Coordinate');
    	pointSetCoordinate.setAttribute('Point', point1 + ', ' + point2);
    	
    	pointAppearance.appendChild(pointMaterial);
    	pointShape.appendChild(pointAppearance);
    	pointSet.appendChild(pointSetCoordinate);
    	pointShape.appendChild(pointSet);
    	pointTransform.appendChild(pointShape);
    	
    	var pointSnap = document.getElementById('cpnt_matrixTransform');
    	pointSnap.appendChild(pointTransform);
    };
}
