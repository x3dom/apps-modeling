/*
 * The Snapping class regulates the central functionality
 */
function Snapping()
{
	var snapBool = false;
	var snapJ = new SnapJSON();
	
	/*
	 * Starts the ability to snapping
	 */
	this.init = function()
	{
		if(snapBool == false)
		{
			snapBool = true;
			snapping.setSnapping();	        
			
			document.getElementById("SnapPoints").style.border="solid 1px #fff";
            document.getElementById("SnapPoints").src = "./images/magnet_on.png";
		}
		else
		{
			snapBool = false;
			
			document.getElementById("SnapPoints").style.border="solid 1px gray";
            document.getElementById("SnapPoints").src = "./images/magnet_off.png";
            
            //remove existing lines and Points
            elementList = primitiveManager.getIDList();
            for(var i = 0; i < elementList.length; i++)
            {
            	primitiveManager.removeSnapNode(elementList[i] + '_line');
            	primitiveManager.removeSnapNode(elementList[i] + '_point');
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
        	currentPrimitive = primitiveManager.getCurrentPrimitive();
       		currentPrimitive.Report(primitiveManager.getCurrentPrimitiveID());
       	}
	};
	
	
    /*
     * Observers properties are added to any existing element
     * Here is the calculation of the distance between two elements
     */
    this.setSnapping = function()
    {
    	elementList = [];
    	elementList = primitiveManager.getIDList();
    	
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
		        
	    		element = document.getElementById(elementList[i]);
	    		
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
    	element.Update = function( myPosition, postPosition, myObj, postObj )
    	{
    		try
    		{
    			//Calculated distance to the elements
    			//Each element draws a line on the selected item, 
    			//the lines and the distance are always calculate and updated
    			var distance = myPosition.subtract(postPosition).length();
    			if(distance != 0)
    			{
    				if(distance < 5.0)
    				{
    					setLine(myPosition, postPosition, postObj);
    					snapTo(myObj, postObj, distance);
    				}
					else
					{
						//Removes connection lines, otherwise they remain visible
						primitiveManager.removeSnapNode(postObj.id + '_line');
		            	primitiveManager.removeSnapNode(myObj.id + '_line');			          					            
		            }
    			}
    		}
    		catch(event)
    		{
    			console.log(event);
    		}
    	};
	};
	
	
    /*
     * Connects two points
     * Removes connection lines, otherwise they remain visible
     */
    function snapTo(myObj, postObj, distance)
    {    		
    	if(distance < 2.0)
    	{
    		myObj.setAttribute('translation', postObj.getAttribute('translation'));
    		primitiveManager.removeSnapNode(postObj.id + '_line');
    		primitiveManager.removeSnapNode(myObj.id + '_line');
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
    		//Removes connection lines, otherwise they remain visible
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
    function setPoint(pointPosition, myObj)
    {
    	temp = myObj + '_point';
    	var pointTransform = document.createElement('Transform');
    	pointTransform.setAttribute('id', temp);
    	
    	var pointShape = document.createElement('Shape');
    	var pointAppearance = document.createElement('Appearance');
    	var pointMaterial = document.createElement('Material');
    	pointMaterial.setAttribute('diffuseColor', '1 1 0');
    	
    	//var pointSet = document.createElement('LineSet');
    	var pointSphere = document.createElement('Sphere');
    	pointSphere.setAttribute('radius', '0.05');
    	
    	//var pointSetCoordinate = document.createElement('Coordinate');
    	//pointSetCoordinate.setAttribute('Point', pointPosition);
    	
    	pointAppearance.appendChild(pointMaterial);
    	pointShape.appendChild(pointAppearance);
    	
    	//pointSet.appendChild(pointSetCoordinate);
    	
    	pointShape.appendChild(pointSphere);
    	pointTransform.appendChild(pointShape);
    	
    	var pointSnap = document.getElementById(myObj);
    	pointSnap.appendChild(pointTransform);
    };
}
