var SnappingVar = 0;
var xA, yA, zA;

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
        	SnappingVar = 1;
            snapBool = true;
            snapping.setSnapping();
        }
        else
        {
        	SnappingVar = 0;
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
		
		
	    if(elementList.length != null && elementList.length > 1)
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
					if(distance < 7 && SnappingVar == 1) { snapTo(myObj, myObj.myPoints[i], postPoints[j], distance); }
    			}
    		}
		};
	}
	
	function matrixTransform(xM, yM, zM, x, y, z)
	{
		xA = (1 * x) + (0 * y) + (0 * z) + (1 * xM);
		yA = (0 * x) + (1 * y) + (0 * z) + (1 * yM);
		zA = (0 * x) + (0 * y) + (1 * z) + (1 * zM);
	}
	
	/* Die Uebergebene Punkte werden verbundne */
	function snapTo(myObj, myObjPoint, postObjPoint, distance)
    {    	
    	this.primitiveManager.highlightCurrentBoundingVolume(false);
    	
    	
    	if(distance < 4.0)
    	{
    		
    		var postLokalPos = snapping.getPosition(postObjPoint.id);
    		var post = primitiveManager.getPrimitiveByID(postObjPoint.objID);	
			
			myObj.setTranslation(postObjPoint.position.x + postLokalPos.x,
				                 postObjPoint.position.y + postLokalPos.y,
				                 postObjPoint.position.z + postLokalPos.z);
				                 
			myObj.rotationAngles.x = post.rotationAngles.x;
			myObj.rotationAngles.y = post.rotationAngles.y;
			myObj.rotationAngles.z = post.rotationAngles.z;

				                 
			//myObj.updateMatrixTransform();	
    	}
    	
    	/*
    	if(distance < 4.0)
    	{
    		var x, y, z;
    		var post = primitiveManager.getPrimitiveByID(postObjPoint.objID);

			//Rotation anwenden
			myObj.rotationAngles.x = post.rotationAngles.x;
			myObj.rotationAngles.y = post.rotationAngles.y;
			myObj.rotationAngles.z = post.rotationAngles.z;
			myObj.updateMatrixTransform();

			x = primitiveManager.getPrimitiveByID(postObjPoint.objID);
			console.log(x);
			/*
			if(postObjPoint.id == x.myPoints[0].id)
			{
				console.log("Punkt 1 " + x.myPoints[0].x);
				myObj.translation.x = x.myPoints[0].x;
				myObj.translation.y = x.myPoints[0].y;
				myObj.translation.z = x.myPoints[0].z;
			}
			else if(postObjPoint.id == x.myPoints[1].id)
			{
				console.log("Punkt 2 " + x.myPoints[1].x);
				myObj.translation.x = x.myPoints[1].x;
				myObj.translation.y = x.myPoints[1].y;
				myObj.translation.z = x.myPoints[1].z;
			}
			*/
			//var trans = new x3dom.fields.SFVec3f(x, y, z);

			//myObj.translation.x = postObjPoint.position.x;
			//myObj.translation.y = postObjPoint.position.y;
			//myObj.translation.z = postObjPoint.position.z;
    	
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
    	var temp;
    	var createPointNormal = new CreatePointNormal();
    	temp = createPointNormal.getPointComponent(pointID);
    	
    	return x3dom.fields.SFVec3f.parse(temp.getAttribute("translation"));
        //return x3dom.fields.SFVec3f.parse(document.getElementById(pointID).getAttribute('translation'));
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
