/*
 * In der Liste werden die Observer gespeichert, mit Hilfsfunktionen
 */
function ObjList() { this.snapArray = []; }

/* Gibt die Array-Laenge aus */
ObjList.prototype.ArrayLength = function() { return this.snapArray.length; };

/* Setzt die Arrayliste leer */
ObjList.prototype.ClearArray = function() { this.snapArray = []; };

/* Gibt an welcher Index ein Objekt in der Liste hat */
ObjList.prototype.GetIndexNumber = function( object ) { return this.snapArray.indexOf( object ); };

/* Gibt das Objekt zurueck das sich an der Indexnummer befindet */
ObjList.prototype.GetArrayObject = function( index )
{
	if( index > -1 && index < this.snapArray.length )
	{
		return this.snapArray[ index ];
	}
    return null;
};

/* Fuegt ein neues Element der Liste hinzu */
ObjList.prototype.SetArrayObject = function( object )
{	
	return this.snapArray.push( object );
};

/* Entfernt ein Element der Liste */
ObjList.prototype.RemoveArrayObject = function ( object )
{
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
