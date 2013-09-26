/*
 * 
 */
function SnapWindow()
{
	this.create = function()
	{
		snapWindow.addContextMenu();
	};
    
    
    this.addContextMenu = function()
    {
		$(function() 
		{
        	$("#dialog").dialog({
        		width: '120px',
        		height: '80px',
        		modal: false,
        		resizable: false,
        		show: { effect: "blind", uration: 500 },
                hide: { effect: "explode", duration: 500 },
                
             	buttons: 
             	{
					Ok: function()
					{
						$( this ).dialog( "close" );
					}
				}              
            });
            
            $('.ui-dialog-titlebar').hide();
            $('#dialog').css('overflow','hidden');
            $('#dialog').css("border-radius", "5px");
            $('#dialog').html('<li><div id="dialogSnap">Snap-To</div></li>');
    
            $('#dialogSnap').mouseover(function(){this.style.cursor='pointer';});
            $('#dialogSnap').click(function(){pointListShow();});
    	    
    	    
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
		});
    };
    
    
    function pointListShow()
    {
    	$("#dialogSnap").html('<div id="pointLink">Snap Point</div>');
    }
}
