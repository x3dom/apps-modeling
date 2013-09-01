/*
 * Inherits the properties and methods of an object on another
 */
function SnapInherits( base, extension )
{
	for( var property in base )
	{
        if (base.hasOwnProperty(property))
		{
			extension[property] = base[property];
		}
	}
}
