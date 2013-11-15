/* */
function Json()
{
	var jsonListPointLine = [];
	
	/* Start funktion */
	this.init = function()
	{
		var jsonObjList = ["../static/components/CompA.json", "../static/components/CompB.json"];
		// Laden der json-List
    	for (i = 0; i < 2; ++i){ jsonListPointLine[i] = loadJSON(jsonObjList[i]); }
	};

	/* gib die Liste mit Punkte und Normale aus */
	this.getJsonList = function()
	{
		//console.log(jsonListPointLine);
		return jsonListPointLine;
	};
	
	function loadJSON(id)
    {
	    // Json-String laden und zurueckgeben
		var json = GetHttpText(id);	
		var jsonObj = eval ('(' + json + ')');
        if(jsonObj){return jsonObj; }

        return null;
    }

	
	function GetHttpText(url) 
	{
		var vHTTPReq = new XMLHttpRequest();	
		vHTTPReq.open("GET", url, false);
		vHTTPReq.send();
	
		return vHTTPReq.responseText;
	}
}
