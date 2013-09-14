/*
 * Subject class for the Observer design pattern
 */
function SnapSubject()
{
	this.observers = new SnappingArray();
}

// reports the event context to all Objects
SnapSubject.prototype.Report = function( )
{
	var count = this.observers.ArrayLength();

	var myObj = this;
	var myObjPoint = snapping.getCurrentPrimitive();
	var myPosition = this.getTranslation();

	
	for(var i = 0; i < count; i++)
	{			
		var postObj = this.observers.GetArrayObject(i);
		var postObjPoint = this.observers.GetArrayObject(i) + '_point_0';
		
		//myPosition is the position of the other member from ObjectArray
		var postPosition = this.observers.GetArrayObject(i).getTranslation();
		var postPointP = snapping.getPosition(this.observers.GetArrayObject(i).getID() + '_point_0');						
		var postPositionPoint = postPointP.add(postPosition);
		
		
		//Position from Point from current Element
		var myPointP = snapping.getPosition(this.getID() + '_point_0');
		var myPositionPoint = myPointP.add(myPosition);
							
		
		this.observers.GetArrayObject(i).Update( myObj, postObj, myObjPoint, myPosition,
                                                 postPosition, myPositionPoint, postPositionPoint );
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
