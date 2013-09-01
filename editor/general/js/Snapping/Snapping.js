/*
 * 
 */
function Snapping()
{
	this.init = function()
	{
		setSnapping();
	};
	
    // Snapping temporary test
    function setSnapping()
    {
    	elementList = [];
    	elementList = primitiveManager.getIDList();
    	
    	var snapObserver = new SnapObserver();
    	var snapSubject = new SnapSubject();
    	
	    if(primitiveManager.getIDList().length != null)
	    {
	    	for(var i = 0; i < elementList.length; i++)
	    	{
	    		element = document.getElementById(elementList[i]);	
	    		
	    		console.log(elementList[i]);
	    		
		    	//Subject is observed
		        SnapInherits(snapSubject, element);       
				element["onclick"] = new Function("element.Report('elementList[i]')");
					 		
		 		//Observer what makes Subject
				SnapInherits(snapObserver, element);
		        element.Update = function( param )
		        {
		        	console.log(param);
		        };
		        
		        //Added to Observer list 
		        element.AddObserver(element);
	    	}
	    }
    };
}
