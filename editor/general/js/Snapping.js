function Snapping()
{	
	var pfad;				/* Json File from primitive */
	var points;				/* save the JSON Points */
	var actualObject;		/* Object actual element */
	var actualObjectID;		/* ID actual object */
	var objListID = [];		/* IDs all elements in view */
	
	
	/* wird in primitiveManager benutzt um die Normale */
	/* als Parameter zu uebergeben */
	this.points = function()
	{
		return points;
	};
	
	this.init = function()
	{		
		var pfad = './x3d/JsonFiles/Box.json';
		var objListID = primitiveManager.getIDList();
		actualObjectID = primitiveManager.getCurrentPrimitive ().id;
		
		if(document.getElementById('snapPoint_' + actualObjectID))
		{
			for(var i = 0; i < objListID.length; i++)
			{
				primitiveManager.removeSnapNode('snapPoint_' + objListID[i]);
			}
		}
		else
		{
			/* add points */
			for(var i = 0; i < objListID.length; i++)
			{
				loadJSON(objListID[i], pfad);
			}
		}
	};
	
	
	/*
	 * Snap the Element
	 */
	this.snap = function(objListID, normalePoint)
	{	
		actualObject = primitiveManager.getCurrentPrimitive();
		actualObjectID = primitiveManager.getCurrentPrimitive ().id;
		distance = pointsDistance(primitiveManager.getPosition(objListID[0]), primitiveManager.getPosition(objListID[1]));
		
		console.log("Abstand: " + distance);
		
		var normale_x = normalePoint[0][0] * 2;
		var normale_y = normalePoint[0][1];
		var normale_z = normalePoint[0][2];
		
		var pointPosition1_x = primitiveManager.getPosition(objListID[0]).x + normale_x.valueOf();
		var pointPosition1_y = primitiveManager.getPosition(objListID[0]).y + normale_y.valueOf();
		var pointPosition1_z = primitiveManager.getPosition(objListID[0]).z + normale_z.valueOf();
		
		var pointPosition2_x = primitiveManager.getPosition(objListID[1]).x + normale_x.valueOf();
		var pointPosition2_y = primitiveManager.getPosition(objListID[1]).y + normale_y.valueOf();
		var pointPosition2_z = primitiveManager.getPosition(objListID[1]).z + normale_z.valueOf();
		
		/*
		 * Check which item is selected and compared to the other element
		 */	
		 
		if(actualObjectID == objListID[0])
		{
			if(distance < 2.0)
			{
				actualObject.setAttribute('translation', '' + pointPosition2_x.toFixed(3) + pointPosition2_y.toFixed(3) + pointPosition2_z.toFixed(3) + '');
				distance = pointsDistance(primitiveManager.getPosition(objListID[0]), primitiveManager.getPosition(objListID[1]));
				console.log("Point1: " + primitiveManager.getPosition(objListID[0]));
				console.log("Point2: " + primitiveManager.getPosition(objListID[1]));
			}
		}
		else
		{
			if(distance < 2.0)
			{
				actualObject.setAttribute('translation', '' + pointPosition1_x.toFixed(3) + pointPosition1_y.toFixed(3) + pointPosition1_z.toFixed(3) + '');
				distance = pointsDistance(primitiveManager.getPosition(objListID[0]), primitiveManager.getPosition(objListID[1]));
				console.log("Point1: " + primitiveManager.getPosition(objListID[0]));
				console.log("Point1: " + primitiveManager.getPosition(objListID[1]));
			}
		}
	};
	
	
	/*
	 * calculate distance
	 * @return distance between two points
	 */
	function pointsDistance(point1, point2)
	{
		var distance;
			
		distanceTemp = ((point1.x - point2.x) * (point1.x - point2.x)) +
					   ((point1.y - point2.y) * (point1.y - point2.y)) + 
					   ((point1.z - point2.z) * (point1.z - point2.z));
					   
		if (distanceTemp < 0) { distance = distanceTemp * -1;};
		distance = Math.sqrt(distanceTemp);
		
		return distance.toFixed(3);
	};
	
	
	/* Draws point */
    function point(id, pfad, translation)
    {    	
    	var transform = document.createElement('Transform');
    	var transform_S = document.createElement('Shape');
    	var transform_S_A = document.createElement('Appearance');
    	var transform_S_A_M = document.createElement('Material');    	
    	var transform_S_A_M_S = document.createElement('Sphere');
    	
    	transform_S_A_M_S.setAttribute('radius', '0.025');
    	transform_S_A_M.setAttribute('diffuseColor', '#000000');
    	transform.setAttribute('translation', translation);
    	transform.setAttribute('id', 'snapPoint_' + id);
    	
    	transform_S_A.appendChild( transform_S_A_M );
    	transform_S.appendChild( transform_S_A_M_S );
    	transform_S.appendChild( transform_S_A );
    	transform.appendChild( transform_S );
    	
    	var element = document.getElementById('mt_' + id);
    	element.appendChild(transform);
    };
    
	function loadJSON(id, pfad)
    {
	    // json-string load
		var json = GetHttpText(pfad);
		
		// make a string from array
		var jsonObj = eval ('(' + json + ')');
		
		// the array can be accessed as follows points[0]
		points = jsonObj.snapPoints;		
		
		// Create point
		point(id, pfad, points[0].toString());
    };

	
	function GetHttpText(url) 
	{
		if (window.XMLHttpRequest) 
		{
			vHTTPReq = new XMLHttpRequest();
		}
		else 
		{
			vHTTPReq = new ActiveXObject("Microsoft.XMLHTTP"); // IE 5 / 6
		}
	
		/// get content
		vHTTPReq.open("GET", url, false);
		vHTTPReq.send();
	
		return vHTTPReq.responseText;
	};
}
