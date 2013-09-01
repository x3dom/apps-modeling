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
				element["onclick"] = new Function('element.Report(snapping.getParameter())');
				
				
		 		//Observer what makes Subject
				SnapInherits(snapObserver, element); 				
		        //Updates the changed parameters
    	    	element.Update = function( param ){ console.log(param); };
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
}
