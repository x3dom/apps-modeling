/*
 * 
 */

/* set und get der Position der Elemente
ui.BBTransX.set(pos.x.toFixed(3));
ui.BBTransY.set(pos.y.toFixed(3));
ui.BBTransZ.set(pos.z.toFixed(3));

ui.BBTransX.get();
ui.BBTransY.get();
ui.BBTransZ.get();   
*/
	
function Snapping()
{	
	var pfad;				/* Json File from primitive */
	var point1;				/* Element1 */
	var point2;				/* Element2 */
	var actualObject;		/* Object actual element */
	var actualObjectID;		/* ID actual object */
	var objListID = [];		/* IDs all elements in view */
	
	
	/*
	 * 
	 */
	this.init = function()
	{		
		var pfad = './x3d/JsonFiles/Box.json';
		var objListID = primitiveManager.getIDList();
		
			
		/* remove axis */		
		if(document.getElementById('snapPoint'))
		{
			alert("hier");
			primitiveManager.removeSnapNode();
		}		
		
		else
		{			
			/* add points */
			for(var i = 0; i < objListID.length; i++)
			{
				loadJSON(objListID[i], pfad);
			}
			
			point1 = primitiveManager.getPosition(objListID[0]);
			point2 = primitiveManager.getPosition(objListID[1]);
			
			snapping.snap();
		}
	};
	
	
	/*
	 * 
	 */
	this.snap = function()
	{
		distance = pointsDistance(point1, point2);
		actualObject = primitiveManager.getCurrentPrimitive();
		actualObjectID = primitiveManager.getCurrentPrimitive ().id;
		
		console.log("Abstand davor: " + distance);

		/*
		 * Check which item is selected and compared to the other element
		 */		
		if(actualObjectID == objListID[0])
		{
			if(distance < 2)
			{
				actualObject.setAttribute('translation', '' + point2.x + point2.y + point2.z + '');
				distance = pointsDistance(point1, point2);
				console.log("IF-Abstand: " + distance);
			}
		}
		else
		{
			if(distance < 2)
			{
				actualObject.setAttribute('translation', '' + point1.x + point1.y + point1.z + '');
				distance = pointsDistance(point1, point2);
				console.log("ELSE-Abstand: " + distance);
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
		
		return distance;
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
    	transform.setAttribute('class', 'snapPoint_' + id);
    	
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
		var points = jsonObj.snapPoints;		
		
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
