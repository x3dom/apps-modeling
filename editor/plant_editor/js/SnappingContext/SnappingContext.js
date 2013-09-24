/*
 * 
 */
function SnappingContext()
{
	this.init = function()
	{
		// context menu for creating primitives by clicking with right mouse button
        $('#innerContextMenu').slimScroll({
            height: '160px',
            size: '10px',
            color: '#FFF',
            position: 'right',
            alwaysVisible: true,
            railVisible: true,
            railColor: '#AAA'
        });
	};
	
	
}
