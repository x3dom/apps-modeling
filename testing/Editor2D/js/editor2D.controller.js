// JavaScript Document

function editor2D_Open()
{
	$('#Editor2D-Canvas').editor2D('clear');
	$('#Editor2D-Overlay').css('display', 'block');
}

function editor2D_Close()
{
	$('#Editor2D-Overlay').css('display', 'none');
}

function editor2D_New()
{
	$('#Editor2D-Canvas').editor2D('clear');
}

function editor2D_Reset()
{
	$('#Editor2D-Canvas').editor2D('resetView');
}

function editor2D_Mode(mode)
{
	editor2D_ResetIcons();
	
	switch (mode)
	{
		case 0:
			$('#Editor2D-Icon-Pen').removeClass('Editor2D-Icon-Pen').addClass('Editor2D-Icon-Pen-Active');
			$('#Editor2D-Canvas').editor2D('changeMode', 0);
		break;
		case 1:
			$('#Editor2D-Icon-Pointer').removeClass('Editor2D-Icon-Pointer').addClass('Editor2D-Icon-Pointer-Active');
			$('#Editor2D-Canvas').editor2D('changeMode', 1);
		break
		case 2:
			$('#Editor2D-Icon-Eraser').removeClass('Editor2D-Icon-Eraser').addClass('Editor2D-Icon-Eraser-Active');
			$('#Editor2D-Canvas').editor2D('changeMode', 2);
		break;
		case 3:
			$('#Editor2D-Icon-Move').removeClass('Editor2D-Icon-Move').addClass('Editor2D-Icon-Move-Active');
			$('#Editor2D-Canvas').editor2D('changeMode', 3);
		break;
		case 4:
			$('#Editor2D-Icon-Zoom').removeClass('Editor2D-Icon-Zoom').addClass('Editor2D-Icon-Zoom-Active');
			$('#Editor2D-Canvas').editor2D('changeMode', 4);
		break;
	}
}

function editor2D_ResetIcons()
{
	$('#Editor2D-Icon-Pen').removeClass('Editor2D-Icon-Pen-Active').addClass('Editor2D-Icon-Pen');
	$('#Editor2D-Icon-Pointer').removeClass('Editor2D-Icon-Pointer-Active').addClass('Editor2D-Icon-Pointer');
	$('#Editor2D-Icon-Eraser').removeClass('Editor2D-Icon-Eraser-Active').addClass('Editor2D-Icon-Eraser');
	$('#Editor2D-Icon-Move').removeClass('Editor2D-Icon-Move-Active').addClass('Editor2D-Icon-Move');
	$('#Editor2D-Icon-Zoom').removeClass('Editor2D-Icon-Zoom-Active').addClass('Editor2D-Icon-Zoom');
}