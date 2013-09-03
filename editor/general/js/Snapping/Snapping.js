/*
 * 
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
		}
		else
		{
			snapBool = false;
		}
	
	};
	
	
	/*
	 * when snapping is active, the selected item position is always known and calculate the position the other
	 */
	this.startSnapping = function()
	{
		if(snapBool == true)
		{
        	currentPrimitive = primitiveManager.getCurrentPrimitive();
       		currentPrimitive.Report(primitiveManager.getCurrentPrimitiveID());
       	}
	};
	
	
    /*
     * Observers properties are added to any existing element
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
				
				
				//Added mouseevent
				//element.onmousedown = function(){ element.Report(primitiveManager.getCurrentPrimitiveID()); };
				
				
			 	//Updates the changed parameters
    	    	element.Update = function( myPosition, postPosition )
    	    	{
    	    		try
    	    		{
    	    			var distance = snapping.getDistance( myPosition, postPosition );
    	    			console.log(distance);
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
     * Calculated distance to the elements
     */
    this.getDistance = function( myPosition, postPosition )
    {
    	distance = ((postPosition.x - myPosition.x) * (postPosition.x - myPosition.x)) +
    			   ((postPosition.y - myPosition.y) * (postPosition.y - myPosition.y)) +
    			   ((postPosition.z - myPosition.z) * (postPosition.z - myPosition.z));
    	
    	result = Math.sqrt(distance);
    	return result;
    };
}
