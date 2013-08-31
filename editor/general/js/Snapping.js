function Snapping()
{
	var points;				/* save the JSON Points */
	var actualObject;		/* Object actual element */
	var actualObjectID;		/* ID actual object */
	
	
	// used in primitiveManager for passing through normal (TODO; where?)
	this.points = function()
	{
		return points;
	};
	
	this.init = function()
	{		
		var i, pfad = './x3d/JsonFiles/Box.json';
		// IDs of all elements in view (TODO: recreate on change)
		var objListID = primitiveManager.getIDList();
		actualObjectID = primitiveManager.getCurrentPrimitive().id;

		if(document.getElementById('snapPoint_' + actualObjectID))
		{
			for(i = 0; i < objListID.length; i++)
			{
				primitiveManager.removeSnapNode('snapPoint_' + objListID[i]);
                document.getElementById("SnapPoints").style.border="solid 1px gray";
                document.getElementById("SnapPoints").src = "images/magnet_off.png";
			}
		}
		else
		{
			/* add points */
			if(objListID.length > 1)
			{
				for(i = 0; i < objListID.length; i++)
				{
					loadJSON(objListID[i], pfad);
				}
                document.getElementById("SnapPoints").style.border="solid 1px #fff";
                document.getElementById("SnapPoints").src = "images/magnet_on.png";
			}
		}
	};
	
	
	/*
	 * Snap the Element
	 */
	this.snap = function(objListID, normalePoint)
	{	
		actualObject = primitiveManager.getCurrentPrimitive();
		actualObjectID = actualObject.id;

        var point1 = primitiveManager.getPosition(objListID[0]);
        var point2 = primitiveManager.getPosition(objListID[1]);

		var distance = point1.subtract(point2).length();
		
		// TODO; what exactly does this do??? And clean up this mess!
		// perhaps optimize the following by using x3dom.fields methods etc.
		var normale_x = normalePoint[0][0] * 2;
		var normale_y = normalePoint[0][1] * 2;
		var normale_z = normalePoint[0][2] * 2;

		if(actualObjectID == objListID[0])
		{
			if(distance < 2.0)
			{
                var pointPosition2_x = point2.x + normale_x;
                var pointPosition2_y = point2.y + normale_y;
                var pointPosition2_z = point2.z + normale_z;

				actualObject.setAttribute('translation', pointPosition2_x + ' ' + pointPosition2_y + ' ' + pointPosition2_z);
			}
		}
		else
		{
			if(distance < 2.0)
			{
                var pointPosition1_x = point1.x + normale_x;
                var pointPosition1_y = point1.y + normale_y;
                var pointPosition1_z = point1.z + normale_z;

				actualObject.setAttribute('translation', pointPosition1_x + ' ' + pointPosition1_y + ' ' + pointPosition1_z);
			}
		}
	};
	
	
	// Draws point
    function point(id, pfad, translation, rotation)
    {
    	var transform = document.createElement('Transform'); 
    	transform.setAttribute('id', 'snapPoint_' + id);
    	var element = document.getElementById('mt_' + id);
    	element.appendChild(transform);
    }
    
	function loadJSON(id, pfad)
    {
	    // json-string load
		var json = GetHttpText(pfad);
		
		// make a string from array
		var jsonObj = eval ('(' + json + ')');
		
		// the array can be accessed as follows points[0]
		points = jsonObj.snapPoints;		
		
		// Create point
		point(id, pfad, points[0].toString(), "0 0 1 0");
    }

	
	function GetHttpText(url) 
	{
		var vHTTPReq = new XMLHttpRequest();
	
		/// get content
		vHTTPReq.open("GET", url, false);
		vHTTPReq.send();
	
		return vHTTPReq.responseText;
	}
}
