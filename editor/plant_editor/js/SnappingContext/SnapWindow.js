/*
 * 
 */
function SnapWindow()
{
	this.create = function()
	{
		snapWindow.addContextMenu(name);

		// context menu for creating primitives by clicking with right mouse button
	    $('.innerContextMenu').slimScroll({
	        height: '150px',
	        size: '10px',
	        color: '#6E6E6E',
	        position: 'right',
	        alwaysVisible: true,
	        railVisible: true,
	        railColor: '#BDBDBD'
	    });
	};
    
    this.addContextMenu = function() 
    {
        var div = document.getElementById("contextMenu");
        div.setAttribute("style", "width: 100px; height: 150px;border-radius: 10px; border: solid 3px black;");

        	
        var divPrim = document.createElement("div");
        divPrim.setAttribute("class", "innerContextMenu");
        divPrim.setAttribute("style", "color: white; width: 100px; height: 150px; background-color: #1C1C1C; border-radius: 7px;");

        div.appendChild(divPrim);

		
		divPrim.innerHTML = "<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" +
							"<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" +
							"<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" +
							"<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>" + "<b>a</b><br>";
		
		
        divPrim.onclick = function () {
            document.getElementById("contextMenu").style.display = "none";
        };
    };
}
