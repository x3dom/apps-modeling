/*
 * 
 * @returns {Editor2D}
 */
Editor2D = function (width, height) {

	var that = this;

	this.mode = 'CREATE';
	this.mouseButton = 'NONE';
	
	this.width = (width !== undefined) ? width : 600;
	this.height = (height !== undefined) ? height : 400;
	this.gridSize = 30;
	this.centerX = this.width / 2;
	this.centerY = this.height / 2;
	this.clickPosX = 0;
	this.clickPosY = 0;
	this.mousePosX = 0;
	this.mousePosY = 0;
	this.pointList = [];
	
	/*
     * Inititialize the full 2D-Editor  
     */
	this.init = function ()
	{
		//Create Overlay
		this.overlay = this.createOverlay();
		
		//Create Editor 
		this.editor = this.createEditor();
		
		//Create Controls
		this.controls = this.createControls();
		
		//Create Canvas
		this.canvas = this.createCanvas();
		
		//Create Context
		this.context = this.canvas.getContext("2d");
	
		//Deactivate context smoothing
		this.context.mozImageSmoothingEnabled = false;
		this.context.webkitImageSmoothingEnabled = false;
		
		//Append canvas to editor
		this.editor.appendChild(this.canvas);
		
		//Append overlay to body
		this.editor.appendChild(this.controls);
		
		//Append editor to overlay
		this.overlay.appendChild(this.editor);
		
		//Append overlay to body	
		document.body.appendChild(this.overlay);
		
		
		/* Close 2D Editor with ESC *******************************/
		var closeEditor = document.getElementById('divOverlay');

		$(document).on( 'keydown', function ( e ) {
		    if ( e.keyCode === 27 ) 
		    { // ESC-Taste
		    	
		    	if(closeEditor.parentNode != null)
		    	{
		    		closeEditor.parentNode.removeChild(closeEditor);
		    	}
	        }
		});
		/**********************************************************/
		
		
		this.addPoint();
	};
	
	
	/*
	 * Create the control-elements
	 */
	this.createControls = function()
	{
		//Create div-element
		var controls = document.createElement('div');
		controls.innerHTML = "<label>X Value: </label><input id='labelValueX'/>" + 
						 		"<label style='margin-left: 10px;'>Z Value: </label><input id='labelValueZ'/>" +
						 		"<button id='buttonCreateShape'>Create Shape</button>" +
						 	 "</div>";

		$("#labelValueX").spinner({
	    stop:function(e,ui){
	        	
	    	}
		});
    	
        $("#labelValueZ").spinner({
        	stop:function(e,ui){
            	
        	}
    	});
    	
    	$("#buttonCreateShape").button()
			.click(function( event ) {
				event.preventDefault();
		});
		
		//Set styles
		controls.style.width = this.width;
		controls.style.top = '25px';
		controls.style.height = '40px';
		controls.style.position = 'relative';
		controls.style.backgroundColor = 'rgb(60, 60, 60)';
		controls.style.borderRadius = '7px 7px 7px 7px';
		controls.style.boxShadow = '5px 5px 5px #333';
		controls.style.border = '2px solid #CCC';
				
		//Return element
		return controls;
	}
	
	
	/*
     * Create a full-screen overlay div-container 
     * @returns {div}
     */
	this.createOverlay = function ()
	{
		//Create div-element
		var overlay = document.createElement('div');
		overlay.setAttribute('id','divOverlay');
		
		//Set styles
		overlay.style.position = 'fixed';
		overlay.style.top = '0px';
		overlay.style.left = '0px';
		overlay.style.margin = '0px';
		overlay.style.padding = '0px';
		overlay.style.width = '100%';
		overlay.style.height = '100%';
		overlay.style.zIndex = '1000000000000000';
		overlay.style.backgroundColor = 'rgba(90, 90, 90, 0.75)';
		overlay.style.display = 'none';
				
		//Return element
		return overlay;
	};
	
	/*
     * Create an on screen centered div-container for the editor
     * @returns {div}
     */
	this.createEditor = function ()
	{
		//Create div-element
		var editor = document.createElement('div');
		
		//Set styles
		editor.style.width = this.width + 30 + 'px';
		editor.style.height = this.height + 30 + 'px';
		editor.style.position = 'relative';
		editor.style.top = '50%';
		editor.style.left = '50%';
		editor.style.margin = -(this.height + 30)/1.75 + 'px 0px 0px ' + -(this.width + 30)/2 + 'px';
		editor.style.backgroundColor = 'rgb(60, 60, 60)';
		editor.style.borderRadius = '15px';
		editor.style.boxShadow = '5px 5px 5px #333';		
		
		//Return element
		return editor;
	};
	
	
	/*
     * Create a canvas element for drawing and attach different 
	 * mouse event listener for interaction 
     * @returns {canvas}
     */
	this.createCanvas = function ()
	{
		//Create canvas-element
		var canvas = document.createElement('canvas');
		
		//Set styles
		canvas.width = this.width;
		canvas.height = this.height;
		canvas.style.margin = '15px 0px 0px 15px';
		canvas.style.padding = '0px';
		canvas.style.border = '2px solid #CCC';
		canvas.style.borderRadius = '10px';
		canvas.style.cursor = 'crosshair';
		canvas.style.zIndex = '1000000000000000';
		
		//Add mousewheel handler (Chrome, Safari, Opera)
		canvas.addEventListener("mousewheel", this.mouseWheelListener);
		
		//Add mousewheel handler (Firefox)
		canvas.addEventListener("DOMMouseScroll", this.mouseWheelListener);
		
		//Add mouseup listener
		canvas.addEventListener('mouseup', this.mouseUpListener);
		
		//Add mousedown listener
		canvas.addEventListener('mousedown', this.mouseDownListener);
		
		//Add mousemove listener
		canvas.addEventListener('mousemove', this.mouseMoveListener);
		
		//Add contextmenu listener
		canvas.addEventListener('contextmenu', this.contextMenuListener, false);
		
		
		
		return canvas;
	};
	
	
	/*
     * Handle the 'mouseup'-event
	 * @param {event} the fired mouse-event
     */
	this.mouseUpListener = function (evt)
	{
		that.mouseButton = 'NONE';
		that.canvas.style.cursor = 'crosshair';
	};
	
	/*
     * Handle the 'mousedown'-event
	 * @param {event} the fired mouse-event
     */
	this.mouseDownListener = function (evt)
	{
		//Update mouse position
		that.updateMousePos(evt)
		
		//Handle different mouse buttons
		switch (evt.which) 
		{
			case 1: 
				that.mouseButton = 'LEFT';
				that.clickPosX = that.mousePosX;
				that.clickPosY = that.mousePosY;  
				that.canvas.style.cursor = 'haircross';
				if (that.checkForClosing())
				{
					that.closePath();
				}
				else
				{
					that.addPoint();
				}	 
			break;
			case 2: 
				that.mouseButton = 'MIDDLE';
				that.clickPosX = that.mousePosX;
				that.clickPosY = that.mousePosY;
				that.canvas.style.cursor = 'move'; 
			break;
			case 3: 
				that.mouseButton = 'RIGHT';
				that.clickPosX = that.mousePosX;
				that.clickPosY = that.mousePosY; 
				that.canvas.style.cursor = 'pointer';
				that.endCreation();
			break;
		}
	};
	
	/*
     * Handle the 'mousemove'-event
	 * @param {event} the fired mouse-event
     */
	this.mouseMoveListener = function (evt)
	{
		//Update mouse position
		that.updateMousePos(evt)
		
		//Handle different mouse buttons
		switch (that.mouseButton) {
			case 'LEFT': 
				break;
			case 'MIDDLE': 
				that.centerX -= that.clickPosX - that.mousePosX;
				that.centerY -= that.clickPosY - that.mousePosY;
				break;
			case 'RIGHT': 
				break;				
		}
		
		if (that.mode == 'CREATE') 
		{
			if (that.checkForClosing())
			{
				that.pointList[that.pointList.length-1].x = that.pointList[0].x;
				that.pointList[that.pointList.length-1].y = that.pointList[0].y;
			}
			else
			{
				that.pointList[that.pointList.length-1].x = that.mousePosX;
				that.pointList[that.pointList.length-1].y = that.mousePosY;
			}
		}
		
		that.draw();
	};
	
	/*
     * Handle the 'mousewheel'-event
	 * @param {event} the fired mouse-event
     */
	this.mouseWheelListener = function (evt)
	{
		//Update mouse position
		that.updateMousePos(evt)
		
		//Check for up- or down-scroll
		if (evt.wheelDelta > 0 || evt.detail > 0) 
		{
			//If allowed increment grid size and redraw it
			if (that.gridSize < 100) 
			{
				that.gridSize += 5;
				that.draw();
			}
		} 
		else 
		{
			//If allowed decrement grid size and redraw it
			if (that.gridSize > 10) 
			{
				that.gridSize -= 5;
				that.draw();
			}
		}
	};
	
	/*
     * Handle 'contextmenu'-event
	 * Disables the default contextmenu
	 * @param {event} the fired mouse-event
     */
	this.contextMenuListener = function (evt)
	{
		evt.preventDefault();
		return false;
	};
	
	/*
     * Updates the actual saved mouse position
	 * @param {event} the fired mouse-event
     */
	this.updateMousePos = function (evt) 
	{
		var rect = that.canvas.getBoundingClientRect();
		that.mousePosX = (evt.clientX - rect.left - this.centerX - 2) / that.gridSize;
		that.mousePosY = (evt.clientY - rect.top - this.centerY - 2.5) / that.gridSize;	
	};
	
	/*
     * 
     */
	this.endCreation = function()
	{
		//Loop over all points
		if (this.mode == 'CREATE' && this.pointList.length > 3)
		{
			//Switch to edit-mode
			this.mode = 'EDIT';
			
			//Delete last point
			this.pointList.pop();
		}
	};
	
	/*
     * @return {boolean} 
     */
	this.checkForClosing = function()
	{
		//Loop over all points
		if (this.mode == 'CREATE' && this.pointList.length > 3)
		{
			var distance = Math.pow(this.pointList[0].x - this.mousePosX, 2) + Math.pow(this.pointList[0].y - this.mousePosY, 2);
    		return (distance <= 0.25);
		}
	};
	
	/*
     * 
     */
	this.closePath = function()
	{
		//Check if allowed to close the path
		if (this.mode == 'CREATE' && this.pointList.length > 3)
		{
			//Switch to 'EDIT'-mode
			this.mode = 'EDIT';
			
			//Unselect all points
			this.unselectPoints();
		}
	};
	
	/*
     * 
     */
	this.unselectPoints = function()
	{
		//Loop over all points
		for (var p=0; p<this.pointList.length; p++)
		{
			this.pointList[p].selected = false;
		}
	};
	
	/*
     * Create a new point at actual mouse position
     */
	this.addPoint = function()
	{
		//Check if mode is CREATE
		if (this.mode == 'CREATE')
		{
			//First unselect all Points
			this.unselectPoints();
			
			//Create new Point
			var point = {};
			
			//Set Point properties
			point.x = this.mousePosX;
			point.y = this.mousePosY;
			point.selected = true;
			point.type = 0;	
			
			//Add point to list
			this.pointList.push(point);
		}
	};
	
	/*
     * Clear the canvas and draw the grid, points and lines
     */
	this.draw = function()
	{
		//Clear the canvas before next draw
		this.context.clearRect(0, 0, this.width, this.height);
		
		//Draw the grid
		this.drawGrid();
		
		//Draw the lines
		this.drawLines();
		
		//Draw the points
		this.drawPoints();
	};
	
	/*
     * Draw the whole grid
     */
	this.drawGrid = function () 
	{	
		//Start new path for grid lines
		this.context.beginPath();
		
		//Set line width and color
		this.context.lineWidth = 1;
		this.context.strokeStyle = '#777';

		//Create vertical lines right from centerpoint
		for (var x = this.centerX + this.gridSize; x <= this.width; x += this.gridSize) {
			this.context.moveTo(x, 0);
			this.context.lineTo(x, this.height);
		}
		
		//Create vertical lines left from centerpoint
		for (x = this.centerX - this.gridSize; x >= 0; x -= this.gridSize) {
			this.context.moveTo(x, 0);
			this.context.lineTo(x, this.height);
		}
		
		//Create horizontal lines top from centerpoint
		for (var y = this.centerY + this.gridSize; y <= this.height; y += this.gridSize) {
			this.context.moveTo(0, y);
			this.context.lineTo(this.width, y);
		}
		
		//Create horizontal lines bottom from centerpoint
		for (var y = this.centerY - this.gridSize; y >= 0; y -= this.gridSize) {
			this.context.moveTo(0, y);
			this.context.lineTo(this.width, y);
		}
		
		//Draw it!
		this.context.stroke();
		
		//Start new path for center lines
		this.context.beginPath();
		
		//Set line width and color
		this.context.lineWidth = 2;
		this.context.strokeStyle = '#CCC';
		
		//Create vertical center line
		this.context.moveTo(this.centerX, 0);
		this.context.lineTo(this.centerX, this.height);
		
		//Create horizontal center line
		this.context.moveTo(0, this.centerY);
		this.context.lineTo(this.width, this.centerY);
		
		//Draw it!
		this.context.stroke();
	};
	
	/*
     * Draw the lines and curves between the points
     */
	this.drawLines = function()
	{
		//Loop over all points
		for (var p=1; p<this.pointList.length; p++)
		{
			//Start new path for every line
			this.context.beginPath();
			
			//Set line width and color
			this.context.lineWidth = 2;
			this.context.strokeStyle = '#CCC';
			
			//Create line between the actual and the previous point
			this.context.moveTo(this.pointList[p-1].x * this.gridSize + this.centerX, this.pointList[p-1].y * this.gridSize + this.centerY);
			this.context.lineTo(this.pointList[p].x * this.gridSize + this.centerX, this.pointList[p].y * this.gridSize + this.centerY);
			
			//Draw it!
			this.context.stroke();
		}
	};
	
	/*
     * Draw the points
     */
	this.drawPoints = function () 
	{
		//Loop over all points
		for (var p=0; p<this.pointList.length; p++)
		{			
			//Start new path for every point
			this.context.beginPath();
			
			//Set point color
			this.context.fillStyle = (this.pointList[p].selected) ? '#dd3500' : '#2956a8';
			
			//Create actual point
			this.context.arc(this.pointList[p].x * this.gridSize + this.centerX, this.pointList[p].y * this.gridSize + this.centerY, this.gridSize/4, 0, Math.PI*2, false); 
			
			//Close the path
			this.context.closePath();
			
			//Draw it!
			this.context.fill();
		}
	};
	
	//Finaly initialize the 2D-Editor
	this.init();	
};

/*
* TODO
*/
Editor2D.prototype.hide = function () 
{
	this.overlay.style.display = 'none';
};

/*
* TODO
*/
Editor2D.prototype.show = function () 
{
	this.draw();
	this.overlay.style.display = 'block';
};

