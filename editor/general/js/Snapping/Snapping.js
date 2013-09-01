/*
 * 
 */
function Snapping()
{
	this.init = function()
	{
		setSnapping();
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
	    		console.log(elementList[i]);
	    		
	    		 		
	    		//Subject is observed
		        SnapInherits(snapSubject, element);
		        //Added onclick      
				element["onmousedown"] = new Function('element.Report(snapping.getParameter())');
				
								
		 		//Observer what makes Subject
				SnapInherits(snapObserver, element); 				
		        //Updates the changed parameters
    	    	element.Update = function( postPosition )
    	    	{
    	    		// TODO: Need ID of the element is updated in the background
    	    		var index = SnappingArray.GetIndexNumber(this.Object);
    	    		console.log(index);
    	    		
    	    		snapping.getDistance(postPosition, 1); 
    	    	};
		        //Added to Observer list 
		        element.AddObserver(element);
	    	}
	    }
    };
    
    /*
     * Each element calls this method when it is clicked, and is registered by the other elements
     */
    this.getParameter = function()
    {
    	return primitiveManager.getPosition( primitiveManager.getCurrentPrimitiveID() );
    };
    
    /*
     * Calculated distance to the elements
     */
    this.getDistance = function(postPosition, myPosition)
    {
    	distance = ((postPosition.x - myPosition.x) * (postPosition.x - myPosition.x)) +
    			   ((postPosition.y - myPosition.y) * (postPosition.y - myPosition.y)) +
    			   ((postPosition.z - myPosition.z) * (postPosition.z - myPosition.z));
    
    	if(distance == 0)
    	{
    		return 0;
    	}
    	
    	if(distance < 0)
    	{
    		distance = distance * (-1);
    	}
    	
    	result = Math.sqrt(distance);
    	
    	console.log(result);
    	return result;
    };
}
