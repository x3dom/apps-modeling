/*
 * JSON content of an object is output using the ID
 */
function SnapJSON()
{
	this.getJSON = function(pfad, objectID, propertie)
	{
		return loadJSON(pfad, objectID, propertie);	
	};
	
	/*
	 * The JSON function gets the path to the file and the name of the object, 
	 * and returns the values ​​that are queried in the third parameter
	 */
	function loadJSON(pfad, id, propertie)
    {
    	var snapPoints = [];
    	var normale = [];
    	
	    // json-string load
		var json = GetHttpText('/' + pfad + '/' + id + '.json');	
		var jsonObj = eval ('(' + json + ')');
		
			
		switch(propertie)
		{
			//Draw Snappoints
			case 'snapPoints':
				for(var i = 0; i < jsonObj.snapPoints.length; i++)
				{
					snapPoints.push(jsonObj.snapPoints[i]);
				}
				return snapPoints;
				break;
				
			//Draw Normale
			case 'normale':
				for(var i = 0; i < jsonObj.normale.length; i++)
				{
					normale.push(jsonObj.normale[i]);
				}
				return normale;
				break;
			
			default:
			{
				alert("Propertie no found");
			}
		}
		
		return -1;
    };

	
	function GetHttpText(url) 
	{
		var vHTTPReq = new XMLHttpRequest();
	
		/// get content
		vHTTPReq.open("GET", url, false);
		vHTTPReq.send();
	
		return vHTTPReq.responseText;
	};
}
