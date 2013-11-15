/*
 * Die Zentrale funktion um das Snapping zu kontrollieren
 */
function Snapping()
{
	var snapBool = -1;					// Sind die Elemente verbunden?
	
	//var createLine = new CreateLine();	// das Objekt um die Linien darzustellen
	
	var objPointList = [];				// Speicher die Liste der Snappoints
	var objPointListCounter = [];		// Speicher Liste der Vorhandene IDs der Objekte
	var objNormalList = [];				// Speichert eine Liste der Normale die erzeugt werden
	var objNormalListCounter = [];		// Speicher Liste der Vorhandene IDs der Objekte
	
	
	this.setSnapBool = function(value)
	{
		snapBool = value;
	};
	
	/* Punkte und Normale werden erzeugt und dargestellt */
	this.createPointNormale = function()
	{
		var createPointNormal = new CreatePointNormal();
		
		createPointNormal.init();
		objPointList = createPointNormal.objectPointList();
		objPointListCounter = createPointNormal.objectPointListCounter();
		objNormalList = createPointNormal.objNormalList();
		objNormalListCounter = createPointNormal.objectNormalListCounter();
	};
	
	/* Start funktion */
	this.init = function()
	{
		var temp = primitiveManager.getIDList();
		
		if(temp.length > 1 && snapBool > -1)
		{
	        if(snapBool == 0) { snapping.setSnapping(snapBool); console.log("Magnet"); }		//Magnet
	        else if(snapBool == 1) { snapping.setSnapping(snapBool); console.log("Magnet Context"); }	//Context
        }
        else 
		{
			console.log("Punkte Loeschen");
            primitiveManager.removeSnapNode(objPointList);
            primitiveManager.removeSnapNode(objNormalList);
        }
	};
	
	/* Wenn ein neues Element eingefuegt wird, bekommt dieses die Snapping funktionalitaet */
	this.newSnapObject = function(objID)
	{
		if(snapBool == true) { snapping.setSnapping(); }
	};
		
	
	/* Das Snapping wird gestartet */
	this.startSnapping = function()
	{
		if(snapBool == true)
		{
			//Aktuelles Element meldet die Aenderungen an Observer
        	var currentPrimitive = primitiveManager.getCurrentPrimitive();
        	currentPrimitive.Report(objPointList, objPointListCounter);
       	}
	};
	
	
	/* Punkte und Normale werden erzeugt, Snapping-Eigenschaften erzeugt */
    this.setSnapping = function(snapBool)
    {
    	if(snapBool == 1)
    	{
    		// Punkte und Normale erzeugen
    		snapping.createPointNormale();
    		return;
    	}
    	
    	// Punkte und Normale erzeugen
    	snapping.createPointNormale();
    	
    	// Liste der vorhandene Elemente
    	var elementList = primitiveManager.getIDList();
    	
		// Erzeuge die noetige Objekte
		var observer = new Observer();
		var subject = new Subject();
		
		
	    if(elementList.length != null)
	    { 	
	    	for(var i = 0; i < elementList.length; i++)
	    	{
		        //Das Objekt wird gesucht
	    		var element = primitiveManager.getPrimitiveByID(elementList[i]);
	    		//Das Objekt wird zum Subjekt
		        ReflectFunction(element, subject);
		        //Das Objekt wird zum Observer
				ReflectFunction(element, observer);
				//Das Objekt wird der Observerliste hinzugefuegt 
		        element.AddObserver(element);
				//Die Update-funktion des Observers wird aufgerufen
				elementUpdate(element);
			}
	    }
    };
    
    
    /* Update-Funktion des Observers aufrufen */
	function elementUpdate(element)
	{
		element.Update = function(myObj, postObjList, postPoints)
    	{
    		var i, j;
    		var distance;
    		
    		for(i = 0; i < myObj.myPoints.length; i++)
    		{
    			for(j = 0; j < postPoints.length; j++)
    			{
    				distance = myObj.myPoints[i].position.subtract(postPoints[j].position).length();
					if(distance < 7) { snapTo(myObj.myPoints[i], postPoints[j], distance); }
    			}
    		}
		};
	}
	
	/* Die Uebergebene Punkte werden verbundne */
	function snapTo(myObjPoint, postObjPoint, distance)
    {
    	this.primitiveManager.highlightCurrentBoundingVolume(false);
    		
    	if(distance < 4.0)
    	{
    		var post = primitiveManager.getPrimitiveByID(postObjPoint.objID);  		
    		var temp = primitiveManager.getPrimitiveByID(myObjPoint.objID);
			
			temp.rotationAngles.x = post.rotationAngles.x;
			temp.rotationAngles.y = post.rotationAngles.y;
			temp.rotationAngles.z = post.rotationAngles.z;
			
    		x = postObjPoint.x + postObjPoint.xL;	//Welt und Lokalle Position werden addiert
    		y = postObjPoint.y + postObjPoint.yL;
    		z = postObjPoint.z + postObjPoint.zL;    		
    		
    		temp.setTranslation(x, y, z);
    	}
    };
    
    this.getPrimitiveByID = function(id)
    {
        if (id && objPointList[id]) {
            return objPointList[id];
        }
        else {
            return null;
        }
    };
	
    this.getPosition = function(pointID)
    {  	
        return x3dom.fields.SFVec3f.parse(document.getElementById(pointID).getAttribute('translation'));
    };
    
	this.getObjPointList = function()
	{
		return objPointList;
	};
	
	this.getObjPointListCounter = function()
	{
		return objPointListCounter;
	};
	
	this.getObjNormalList = function()
	{
		return objNormalList();	
	};
	
	this.getObjNormalListCounter = function()
	{
		return objNormalListCounter;
	};
}
