/* */
function CreatePointNormal()
{
	var oldObjPoint = 0;
	var oldObjNormal = 0;
	var jsonList;										// Speichert die Liste mit Punkte und Normale
	var elementList = primitiveManager.getIDList();		// Holle die ID-Liste der vorhandene Objekte
	var primitiveTypList = [];							// Holle die TYP-Liste der vorhandene Objekte
	
	var objPointList = [];								// Speichert eine Liste der Punkte die erzeugt werden
	var objPointListCounter = [];						// speichert die Liste der IDs der vorhandene Objekte
	var pointCounter = 0;								// Zaehlt die Anzahl an Punkte die erzeugt werden
	
	var objNormalList = [];								// Speichert eine Liste der Normale die erzeugt werden
	var objNormalListCounter = [];						// Die Anzahl an por Objekt vorhandenen Normale wir hier gespeichert
	var normalCounter = 0;								// Zaehlt die Anzahl an Normale die erzeugt werden

	
	/* Start function */
	this.init = function()
	{
		var json = new Json();
		
		json.init();
		jsonList = json.getJsonList();
		primitiveTypList = primitiveManager.getPrimitiveTypList();
		
		
		/* Die Liste der Elemente wird durgelaufen und die Liste der Punkte auch */
		/* Dann werden die Punkte an den Elemente gesetzt */
		/* Wenn neue Elemente zu der Liste kommen muss man das hier auch aendern */
		if(elementList.length != null)
	    {
	    	for(var i = 0; i < elementList.length; i++)
	    	{
				if(primitiveTypList[i].indexOf('Tube') != -1)
				{
	    			for(var k = 0; k < jsonList[1].list.length; k++)
	    			{
						createPoint(jsonList[1].list[k].point.position, elementList[i]);	//Punkt darstellen
						createNomal(jsonList[1].list[k].point.position, jsonList[1].list[k].point.normal, elementList[i]);	//Linie darstellen
	    			}		
				}
				
				
				if(primitiveTypList[i].indexOf('Tank') != -1)
				{
	    			for(var k = 0; k < jsonList[0].list.length; k++)
	    			{
						createPoint(jsonList[0].list[k].point.position, elementList[i]);	//Punkt darstellen
						createNomal(jsonList[0].list[k].point.position, jsonList[0].list[k].point.normal, elementList[i]);	//Linie darstellen
	    			}
				}
			}
		}
	};
		
	
	/* Erzeugt Snappoint */
    function createPoint(pointPosition, myObjID)
    {	
    	if(pointCounter == 0)
    	{
    		oldObjPoint = myObjID;
    	}
    	else
    	{
    		if(oldObjPoint != myObjID)
    		{
    			pointCounter = 0;
    			oldObjPoint = myObjID;	
    		}
    	}
    	
    	
    	var position = pointPosition[0] + ' ' + pointPosition[1] + ' ' + pointPosition[2];
    	
    	//var temp = myObjID + '_point';
    	var temp = myObjID + '_point_' + pointCounter;
    	var pointTransform = document.createElement('Transform');
    	pointTransform.setAttribute('id', temp);
    	pointTransform.setAttribute('translation', position);
    	pointTransform.setAttribute('scale', '1 1 1');
    	
    	var pointShape = document.createElement('Shape');
    	var pointAppearance = document.createElement('Appearance');
    	var pointMaterial = document.createElement('Material');
    	pointMaterial.setAttribute('diffuseColor', '1 1 0');
    	
    	var pointSphere = document.createElement('Sphere');
    	pointSphere.setAttribute('radius', '0.07');
    	
    	pointAppearance.appendChild(pointMaterial);
    	pointShape.appendChild(pointAppearance);
    	pointShape.appendChild(pointSphere);
    	pointTransform.appendChild(pointShape);
    	
    	var objectTransform = primitiveManager.getPrimitiveByID(myObjID).getMatrixTransformNode();
    	objectTransform.appendChild(pointTransform);
    	
    	objPointListCounter[myObjID] = pointCounter;	// Zu jedem Objekt wird registriert wie viele Punkte er hat, wird immer ueberschrieben
    	objPointList[temp] = pointTransform;			// Jeder Punkt hat eine eindeutige ID
		pointCounter++;									// Wie viele Punkte Pro Objekt
    };
	
	
	/* Erzeugt Normal, mit Anfang und Endpunkt */
	function createNomal(pointA, pointE, myObjID)
	{
    	if(normalCounter == 0)
    	{
    		oldObjNormal = myObjID;
    	}
    	else
    	{
    		if(oldObjNormal != myObjID)
    		{
    			normalCounter = 0;
    			oldObjNormal = myObjID;	
    		}
    	}
    	
		//var temp = myObjID + '_normal';
    	var temp = myObjID + '_normal_' + normalCounter;
    
   		var lineTransform = document.createElement('Transform');
    	lineTransform.setAttribute('id', temp);
    	
    	var lineShape = document.createElement('Shape');
    	var lineAppearance = document.createElement('Appearance');
    	var lineMaterial = document.createElement('Material');
    	lineMaterial.setAttribute('diffuseColor', '1 1 0');
    	
    	var lineSet = document.createElement('IndexedLineSet');
    	var lineSetCoordinate = document.createElement('Coordinate');
    	lineSet.setAttribute('coordIndex', '0 0 1 -1');
    	lineSetCoordinate.setAttribute('point', pointA + ', ' + pointE);
    	
    	lineAppearance.appendChild(lineMaterial);
    	lineShape.appendChild(lineAppearance);
    	lineSet.appendChild(lineSetCoordinate);
    	lineShape.appendChild(lineSet);
    	lineTransform.appendChild(lineShape);
    	
    	var objectTransform = primitiveManager.getPrimitiveByID(myObjID).getMatrixTransformNode();
    	objectTransform.appendChild(lineTransform);
    	
    	objNormalListCounter[myObjID] = normalCounter;	// speichert die Liste der IDs der vorhandene Objekte
    	objNormalList[temp] = lineTransform;			// Jeder Punkt hat eine eindeutige ID
    	normalCounter++;								// Wie viele Normale Pro Objekt
	}
	
	
	this.objectPointList = function() 
	{
        var pointObjID = [];
        for (var key in objPointList){
            pointObjID.push(key);
        }
        
        return pointObjID; 
	};
	this.objectPointListCounter = function() 
	{
		var pointObjID = [];
        for (var key in objPointListCounter){
            pointObjID.push(key);
        }
        
        return pointObjID;
	};
	this.objNormalList = function() 
	{
		var pointObjID = [];
        for (var key in objNormalList){
            pointObjID.push(key);
        }
        
        return pointObjID;
	};
	this.objectNormalListCounter = function() 
	{
		var pointObjID = [];
        for (var key in objNormalListCounter){
            pointObjID.push(key);
        }
        
        return pointObjID;
	};
}
