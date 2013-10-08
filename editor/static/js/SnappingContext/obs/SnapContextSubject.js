/*
 * Subject class for the Observer design pattern
 */
function SnapContextSubject()
{
	this.observers = new SnapContextArray();
}

// reports the event context to all Objects
SnapContextSubject.prototype.Report = function( )
{
	var count = this.observers.ArrayLength();
};


// Add new Observer Element
SnapContextSubject.prototype.AddObserver = function( observer )
{
	if( !observer.Update )
	{
		throw 'Wrong parameter';
	}
	
	// Observer added to Observerlist
	this.observers.SetArrayObject( observer );
};


// Remove Observer from Element-List
SnapContextSubject.prototype.RemoveObserver = function( observer )
{
	if( !observer.Update )
	{
		throw 'Wrong parameter';
	}
	
	this.observers.RemoveArrayObject( observer );
};
