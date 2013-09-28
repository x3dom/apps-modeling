/*
 * 
 */
function SnapContext()
{	
	var snapJ = new SnapJSON();
	var createContextPoint = new CreateContextPoint();
	
	// Retrieves the information about the position of the Snappoints
	var pointListObj = snapJ.getJSON('./x3d/JsonFiles', 'Box');
	
	this.init = function()
	{
		snapContext.addContextMenu(x, y);
	};
    
    
    this.addContextMenu = function(x, y)
    {
		$(function() 
		{			
        	$("#dialog").dialog({
        		width: 120,
        		height: 80,
        		modal: false,
        		resizable: false,
            });
         	
         	$("#dialog").dialog( "option", "position", [x, y]);  
            
            //$('.ui-dialog-titlebar').hide();
            $('#dialog').css('overflow','hidden');
            $('#dialog').css("border-radius", "5px");
            
            $('#innenDialog').html('<li><div id="dialogSnap">Snap-To</div></li>');
            $('#innenDialog').mouseover(function(){this.style.cursor='pointer';});
            $('#innenDialog').click(function(){pointListShow();});
    	    
    	    /*
    	    $('#dialog').slimScroll({
		        size: '10px',
		        width: '120px',
		        height: '80px',
		        color: '#6E6E6E',
		        position: 'right',
		        alwaysVisible: true,
		        railVisible: true,
		        railColor: '#BDBDBD'
		    });
		    */
		});
    };
    
    
    function pointListShow()
    {
    	// List ob Elements on the Display
    	var elementList = primitiveManager.getIDList();
    	
	    if(elementList.length != null)
	    { 	
	    	for(var i = 0; i < elementList.length; i++)
	    	{
	    		//Set Point to Object
	    		createContextPoint.setPoint(pointListObj.point1.position, elementList[i]);
	    	}
	    }
    }
    
    
    /*
    // Name ist der Name von dem Punkt
    this.addContextMenuEntry = function(name) 
    {
	    var div = document.getElementById("innenDialog");
	    var that = this;
	
	    var divPrim = document.createElement("div");
	    divPrim.setAttribute("id", "ctx_" + name);
	    divPrim.setAttribute("class", "ContextMenuEntry");
	    divPrim.innerHTML = name;
	
	    div.appendChild(divPrim);
	
	    divPrim.onclick = function () { document.getElementById("contextMenu").style.display = "none"; };
	};
	*/
}
