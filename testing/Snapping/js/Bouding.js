/*
 * 
 */
function Bouding()
{
	var center;
	var radius;
	
	this.init = function()
	{
		var selectID = [];
		
		selectID = primitiveManager.getIDList();
		
		for(var i = 0; i < selectID.length; i++)
		{
			boundingPoint(selectID[i]);
		}
	};
	
	
    function boundingPoint(id)
    {
    	var transform = document.createElement('Transform');
    	var transform_S = document.createElement('Shape');
    	var transform_S_A = document.createElement('Appearance');
    	var transform_S_A_M = document.createElement('Material');
    	var transform_S_A_M_S = document.createElement('Sphere');
    	
    	transform_S_A_M_S.setAttribute('radius', '0.1');
    	transform_S_A_M.setAttribute('diffuseColor', '#3FFFFF');
    	transform.setAttribute('translation', '0 0 1.5');
    	transform.setAttribute('id', 'boundingPoint');
    	
    	transform_S_A.appendChild( transform_S_A_M );
    	transform_S.appendChild( transform_S_A_M_S );
    	transform_S.appendChild( transform_S_A );
    	transform.appendChild( transform_S );
    	
    	var element = document.getElementById(id);
    	element.appendChild(transform);
    	
    	loadJSON();
    };
    
    
	function loadJSON()
    {
	    // json-string laden
		var json = GetHttpText("./x3d/TestData/SimpleTube.json");
		
		// aus dem string ein Array bilden
		var jsonObj = JSON.parse(json);
		
		console.log(jsonObj);
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
