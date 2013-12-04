/*
 * Die Zentrale funktion um das Snapping zu kontrollieren
 */
function Snapping()
{
	var snapBool = false;
	var varCount = 0;					// Wie viele Elemente
	var objPointList = [];				// Speicher die Liste der Snappoints
	var objPointListCounter = [];		// Speicher Liste der Vorhandene IDs der Objekte
	var objNormalList = [];				// Speichert eine Liste der Normale die erzeugt werden
	var objNormalListCounter = [];		// Speicher Liste der Vorhandene IDs der Objekte
	
	
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
	
	
	/*
	 * Starts the ability to snapping
	 */
	this.init = function()
	{
        if(snapBool == false)
        {
            snapBool = true;
            snapping.setSnapping();
        }
        else
        {
            snapBool = false;

            //remove existing lines and Points
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
    this.setSnapping = function(temp)
    {
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
					if(distance < 7) { snapTo(myObj, myObj.myPoints[i], postPoints[j], distance); }
    			}
    		}
		};
	}
	
	
	/* Die Uebergebene Punkte werden verbundne */
	function snapTo(myObj, myObjPoint, postObjPoint, distance)
    {    	
    	this.primitiveManager.highlightCurrentBoundingVolume(false);
    	
    	if(distance < 4.0)
    	{
    		var post = primitiveManager.getPrimitiveByID(postObjPoint.objID);
			
			//xt = postObjPoint.x + postObjPoint.xL;	//Welt und Lokalle Position werden addiert
    		//yt = postObjPoint.y + postObjPoint.yL;
    		//zt = postObjPoint.z + postObjPoint.zL; 
			//myObj.setTranslation(xt, yt, zt);
			
			/*Translation auf das Element*/
			//x = post.translation.x;
    		//y = post.translation.y;
    		//z = post.translation.z;
    		
    		x = postObjPoint.xL;
    		y = postObjPoint.yL;
    		z = postObjPoint.zL;
			
			myObj.setTranslation(x, y, z);
    		
			//Rotation anwenden
			myObj.rotationAngles.x = post.rotationAngles.x;
			myObj.rotationAngles.y = post.rotationAngles.y;
			myObj.rotationAngles.z = post.rotationAngles.z;
			myObj.updateMatrixTransform();
			
			xb = postObjPoint.tx;
    		yb = postObjPoint.ty;
    		zb = postObjPoint.tz;
    		
    		myObj.setTranslation(xb, yb, zb);
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
