/*
 * This array function has methods to edit the properties of the logs in the list.
 */
function SnappingArray()
{
	// Object List, first empty
	this.snapArray = [];
}

// Specifies the length of the list
SnappingArray.prototype.ArrayLength = function()
{
	return this.snapArray.length;
};

// Array is emptied
SnappingArray.prototype.ClearArray = function()
{
	// Set empty
	this.snapArray = [];	
};

// Returns the index number of an object
SnappingArray.prototype.GetIndexNumber = function( object )
{
	return this.snapArray.indexOf( object );
};

// Give object from the index point
SnappingArray.prototype.GetArrayObject = function( index )
{
	if( index > -1 && index < this.snapArray.length )
	{
		return this.snapArray[ index ];
	}
    return null;
};

// This object will be added to the list
SnappingArray.prototype.SetArrayObject = function( object )
{	
	return this.snapArray.push( object );
};

// This object will be removed from the list
SnappingArray.prototype.RemoveArrayObject = function ( object )
{
	// Indicates where the object is
	var index = this.GetIndexNumber( object );

	var list_count = this.snapArray.length;
	
	if(list_count > 0 && index > -1 && index < this.snapArray.length )
	{
		switch( index )
		{
			case 0:
				this.snapArray.shift();
				break;
			
			case list_count - 1:
				this.snapArray.pop();
				break;
			
			default:
				this.snapArray.splice(index, 1);
				break;	
		}
	}
};
