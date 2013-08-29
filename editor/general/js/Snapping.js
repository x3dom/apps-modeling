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
                                document.getElementById("SnapPoints").style.border="solid 1px gray";
                                document.getElementById("SnapPoints").src = "images/magnet_off.png";
			}
		}
		else
		{
			/* add points */
			if(objListID.length > 1)
			{
				for(var i = 0; i < objListID.length; i++)
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
		actualObjectID = primitiveManager.getCurrentPrimitive ().id;
		distance = pointsDistance(primitiveManager.getPosition(objListID[0]), primitiveManager.getPosition(objListID[1]));
		
		//console.log("Abstand: " + distance);
		
		var normale_x = normalePoint[0][0] * 2;
		var normale_y = normalePoint[0][1] * 2;
		var normale_z = normalePoint[0][2] * 2;
		
		var pointPosition1_x = primitiveManager.getPosition(objListID[0]).x + normale_x.valueOf();
		var pointPosition1_y = primitiveManager.getPosition(objListID[0]).y + normale_y.valueOf();
		var pointPosition1_z = primitiveManager.getPosition(objListID[0]).z + normale_z.valueOf();
		
		var pointPosition2_x = primitiveManager.getPosition(objListID[1]).x + normale_x.valueOf();
		var pointPosition2_y = primitiveManager.getPosition(objListID[1]).y + normale_y.valueOf();
		var pointPosition2_z = primitiveManager.getPosition(objListID[1]).z + normale_z.valueOf();
		
		 
		if(actualObjectID == objListID[0])
		{
			if(distance < 2.0)
			{
				actualObject.setAttribute('translation', '' + pointPosition2_x + ' ' + pointPosition2_y + ' ' + pointPosition2_z + '');
				
				/*
				distance = pointsDistance(primitiveManager.getPosition(objListID[0]), primitiveManager.getPosition(objListID[1]));
				console.log("Point1: " + primitiveManager.getPosition(objListID[0]));
				console.log("Point2: " + primitiveManager.getPosition(objListID[1]));
				*/
			}
		}
		else
		{
			if(distance < 2.0)
			{
				actualObject.setAttribute('translation', '' + pointPosition1_x + ' ' + pointPosition1_y + ' ' + pointPosition1_z + '');
				
				/*
				distance = pointsDistance(primitiveManager.getPosition(objListID[0]), primitiveManager.getPosition(objListID[1]));
				console.log("Point1: " + primitiveManager.getPosition(objListID[0]));
				console.log("Point2: " + primitiveManager.getPosition(objListID[1]));
				*/
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
    function point(id, pfad, translation, rotation)
    {   
    	var transform = document.createElement('Transform'); 
    	transform.setAttribute('id', 'snapPoint_' + id);
    	var element = document.getElementById('mt_' + id);
    	element.appendChild(transform);	
    	/*
    	var transform = document.createElement('Transform');
		var transform_Appearance = document.createElement('Appearance');
		var transform_Material = document.createElement('Material');    	
		transform_Material.setAttribute('diffuseColor', '#000000');    	
    	
    	
    	var transformSphere = document.createElement('Transform');
    	var ShapeSphere = document.createElement('Shape');
	    var Sphere = document.createElement('Sphere');
	    Sphere.setAttribute('radius', '0.025');
	    	
    	var transformCylinder = document.createElement('Transform');
    	var ShapeCylinder = document.createElement('Shape');
    	var Cylinder = document.createElement('Cylinder');
    	transformCylinder.setAttribute('translation', '2 0 0');
    	transformCylinder.setAttribute('rotation', '1 0 0 -1.57079');
    	Cylinder.setAttribute('radius', '0.005');
    	Cylinder.setAttribute('height', '0.5');
    	
    	var transformCone = document.createElement('Transform');
    	var ShapeCone = document.createElement('Shape');
    	var Cone = document.createElement('Cone');
    	transformCone.setAttribute('translation', '0.5 0 0');
    	transformCone.setAttribute('rotation', '1 0 0 -1.57079');
    	Cone.setAttribute('height', '0.07');
    	Cone.setAttribute('bottomRadius', '0.05');
   	
    
    	transform_Appearance.appendChild( transform_Material );
    	
    	ShapeSphere.appendChild( transform_Appearance );
    	ShapeCylinder.appendChild( transform_Appearance );
    	ShapeCone.appendChild( transform_Appearance );
    	
    	ShapeSphere.appendChild( Sphere );
    	ShapeCylinder.appendChild( Cylinder );
    	ShapeCone.appendChild( Cone );
    	
    	transform.appendChild( ShapeSphere );
    	transform.appendChild( ShapeCylinder );
    	transform.appendChild( ShapeCone );
    	
    	transform.setAttribute('translation', translation);
    	transform.setAttribute('id', 'snapPoint_' + id);
    	
    	
    	var element = document.getElementById('mt_' + id);
    	element.appendChild(transform);
    	*/
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
