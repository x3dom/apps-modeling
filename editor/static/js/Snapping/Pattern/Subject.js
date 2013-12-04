/*
 * Jedes Objekt ist auch ein Subjekt/Observer
 */
function Subject()
{
	this.observers = new ObjList();
}

/* Die Evente werden an alle Objekte bekannt gegeben */
Subject.prototype.Report = function(objPointList, objPointListCounter)
{
	var i, j, k;
	var temp;
	var temp2;
	
	var myObj = this;				// Aktuell ausgewaehltes Objekt
	var myPoints = [];				// Punkte des aktuellen Objekts mit Parameter
	var myPointsTemp = [];			// Temp-Variable fuer Berechnungen
	
	var postObjList = [];			// Liste ALLER anderen Objekte
	var postPoints = [];			// Liste alle anderen Punkte der anderen Objekte
	var postPointsTemp = [];		// Temp-Variable fuer Berechnungen
	
	
	/**************************************************************************************/
	for(i = 0, j = 0, k = 0; i < objPointList.length; i++)
	{
		if(objPointList[i].search(myObj.id) == -1) { postPointsTemp[k] = objPointList[i]; k++; }
		else{ myPointsTemp[j] = objPointList[i]; j++; }
	}
	
	for(i = 0, j = 0; i < objPointListCounter.length; i++)
	{
		if(objPointListCounter[i] !== myObj.id) 
		{ 
			postObjList[j] = primitiveManager.getPrimitiveByID(objPointListCounter[i]);
			j++; 
		}
	}
	/**************************************************************************************/
	
	/**************************************************************************************/
	for(i = 0; i < myPointsTemp.length; i++)
	{
		var objID = myPointsTemp[i].slice(0, myPointsTemp[i].search("_"));
		temp = snapping.getPosition(myPointsTemp[i]);
		
		myPoints[i] = new Array();
		myPoints[i].id = myPointsTemp[i];
		myPoints[i].objID = objID;
		myPoints[i].x = myObj.translation.x + temp.x;
		myPoints[i].y = myObj.translation.y + temp.y;
		myPoints[i].z = myObj.translation.z + temp.z;
		myPoints[i].xL = temp.x; //xL, yL, zL Lokalle Position der Punkte im Objekt
		myPoints[i].yL = temp.y;
		myPoints[i].zL = temp.z;
		myPoints[i].position = new x3dom.fields.SFVec3f(myPoints[i].x, myPoints[i].y, myPoints[i].z);
	}
	myObj.myPoints = new Array();		// Im Objekt wird ein neues Parameter erzeugt
	myObj.myPoints = myPoints;			// und dort werden die Points und seine Parameter gespeichert
	/**************************************************************************************/
		
	/**************************************************************************************/
	for(i = 0; i < postPointsTemp.length; i++)
	{
		for(j = 0; j < postObjList.length; j++)
		{
			if(postPointsTemp[i].indexOf(postObjList[j].id) != -1)
			{
				var objID = postPointsTemp[i].slice(0, postPointsTemp[i].search("_"));
				var post = primitiveManager.getPrimitiveByID(objID);
				
				temp2 = snapping.getPosition(postPointsTemp[i]);
				
				postPoints[i] = new Array();
				postPoints[i].id = postPointsTemp[i];
				postPoints[i].objID = objID;
				postPoints[i].tx = postObjList[j].translation.x; //Position der Objekt wo sich der PUnkt befindet
				postPoints[i].ty = postObjList[j].translation.y;
				postPoints[i].tz = postObjList[j].translation.z;
				postPoints[i].xL = temp2.x; //xL, yL, zL Lokalle Position der Punkte im Objekt
				postPoints[i].yL = temp2.y;
				postPoints[i].zL = temp2.z;
				postPoints[i].x = postObjList[j].translation.x + temp2.x;
				postPoints[i].y = postObjList[j].translation.y + temp2.y;
				postPoints[i].z = postObjList[j].translation.z + temp2.z;
				postPoints[i].position = new x3dom.fields.SFVec3f(postPoints[i].x, postPoints[i].y, postPoints[i].z);
			}
		}
	}
	/**************************************************************************************/
	
	var count = this.observers.ArrayLength();
	for(var i = 0; i < count; i++) { this.observers.GetArrayObject(i).Update(myObj, postObjList, postPoints); }
};


/* Fuege ein neuer Observerelement zu der Liste */
Subject.prototype.AddObserver = function( observer )
{
	if( !observer.Update ){ throw 'Wrong parameter'; }
	this.observers.SetArrayObject( observer );
};


/* Entfert Observer aus der Beobachter Liste */
Subject.prototype.RemoveObserver = function( observer )
{
	if( !observer.Update )
	{
		throw 'Wrong parameter';
	}
	
	this.observers.RemoveArrayObject( observer );
};
