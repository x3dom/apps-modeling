/*
 * JSON content of an object is output using the ID
 */
function SnapJSON()
{
	this.getJSON = function(pfad, objectID)
	{
		return loadJSON(pfad, objectID);	
	};
	
	/*
	 * The JSON function gets the path to the file and the name of the object, 
	 * and returns the values ​​that are queried in the third parameter
	 */
	function loadJSON(pfad, objectID)
    {
    	var snapPoints = [];
    	var normale = [];
    	
	    // json-string load
		var json = GetHttpText( pfad + '/' + objectID + '.json');	
		var jsonObj = eval ('(' + json + ')');
		
		if(jsonObj != undefined)
		{	
			//console.log(jsonObj);
			return jsonObj;
		}
		
		return -1;
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
