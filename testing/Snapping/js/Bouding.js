/*
 * 
 */
function Bouding()
{
	var snapPoint;
	var JsonPoints = [];
	
	this.init = function()
	{
		var selectID = [];
		var pfad = './x3d/JsonFiles/Box.json';
		
		selectID = primitiveManager.getIDList();
		
		for(var i = 0; i < selectID.length; i++)
		{
			/*
			 * JSON gibt mir die Punktkoordinaten
			 * in jeder diese Koordinaten erzeuge ich
			 * mit boundingPoint eine Bindungskugel
			 */
			loadJSON(selectID[i], pfad);
		}
	};
	
	
    function boundingPoint(id, pfad, position)
    {    	
    	var transform = document.createElement('Transform');
    	var transform_S = document.createElement('Shape');
    	var transform_S_A = document.createElement('Appearance');
    	var transform_S_A_M = document.createElement('Material');    	
    	var transform_S_A_M_S = document.createElement('Sphere');
    	
    	transform_S_A_M_S.setAttribute('radius', '0.1');
    	transform_S_A_M.setAttribute('diffuseColor', '#3FFFFF');
    	transform.setAttribute('translation', position);
    	transform.setAttribute('id', 'boundingPoint');
    	
    	transform_S_A.appendChild( transform_S_A_M );
    	transform_S.appendChild( transform_S_A_M_S );
    	transform_S.appendChild( transform_S_A );
    	transform.appendChild( transform_S );
    	
    	var element = document.getElementById(id);
    	element.appendChild(transform);
    };
    
    
	function loadJSON(id, pfad)
    {
	    // json-string laden
		var json = GetHttpText(pfad);
		
		// aus dem string ein Array bilden
		var jsonObj = eval ('(' + json + ')');
		
		// die Arrays koennen dann wie folgt aufgerufen werden points[0]
		var points = jsonObj.snapPoints;		
		
		for(var i = 0; i < points.length; i++)
		{
			//Zeugen die bounding Points
			boundingPoint(id, pfad, points[i].toString());
			console.log(points[i].toString());	
		}
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
