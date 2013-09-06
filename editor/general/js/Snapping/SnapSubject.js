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
 		//post position is the position of the selected item
		var postPosition = primitiveManager.getPrimitiveByID(context).getTranslation();
		var myObj = primitiveManager.getCurrentObject();
		
		for(var i = 0; i < count; i++)
		{
			//myPosition is the position of the other member from ObjectArray
			var myPosition = primitiveManager.getPrimitiveByID(this.observers.GetArrayObject(i).id).getTranslation();
			this.observers.GetArrayObject(i).Update( myPosition, postPosition, myObj, this.observers.GetArrayObject(i) );
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
