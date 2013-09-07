/*
 * Subject class for the Observer design pattern
 */
function SnapSubject()
{
	this.observers = new SnappingArray();
}

// reports the event context to all Objects
SnapSubject.prototype.Report = function( context )
{
	var count = this.observers.ArrayLength();
 	
 	try
 	{
 		var myObj = primitiveManager.getCurrentPrimitive();
 		var myObjPoint = snapping.getCurrentPrimitive();
 		var myPosition = primitiveManager.getPosition(context);
 	
 		
		for(var i = 0; i < count; i++)
		{
			postObj = this.observers.GetArrayObject(i);
			postObjPoint = this.observers.GetArrayObject(i) + '_point_0';
			
			//myPosition is the position of the other member from ObjectArray
			var postPosition = primitiveManager.getPosition(this.observers.GetArrayObject(i).id);
			var postPointP = snapping.getPosition(this.observers.GetArrayObject(i).id + '_point_0');						
			var postPositionPoint = postPointP.add(postPosition);
			
			
			//Position from Point from current Element
			var myPointP = snapping.getPosition(context + '_point_0');
			var myPositionPoint = myPointP.add(myPosition);
								
			
			this.observers.GetArrayObject(i).Update( myObj, postObj, myObjPoint, myPosition, postPosition, myPositionPoint, postPositionPoint );
		}	
 	}
 	catch(event)
 	{
 		console.log(event);
 	}
};


// Add new Observer Element
SnapSubject.prototype.AddObserver = function( observer )
{
	if( !observer.Update )
	{
		throw 'Wrong parameter';
	}
	
	// Observer added to Observerlist
	this.observers.SetArrayObject( observer );
};


// Remove Observer from Element-List
SnapSubject.prototype.RemoveObserver = function( observer )
{
	if( !observer.Update )
	{
		throw 'Wrong parameter';
	}
	
	this.observers.RemoveArrayObject( observer );
};
