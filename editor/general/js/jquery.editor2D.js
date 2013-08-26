(function($){
	
	function Editor2D (canvas, options) 
	{
		var that = this;
		
		this.init = function ()
		{
			this.options = $.extend( {}, $.fn.editor2D.defaults, options );
			
			this.modes = {
				CREATE: 0,
				EDIT: 1,
				ERASE: 2,
				MOVE : 3,
				ZOOM : 4
			};
			
			this.cursors = {
				pen: 'url(images/Editor2D-Pen.png), auto',
				pointer: 'url(images/Editor2D-Pointer.png), auto',
				eraser: 'url(images/Editor2D-Eraser.png), auto',
				hand: 'url(images/Editor2D-Hand.png), auto',
				zoom: 'url(images/Editor2D-Zoom.png), auto'
			};
			
			this.width = this.options.width;
			this.height = this.options.height;
			this.gridSize = this.options.gridSize;
			
			this.mode = this.modes.CREATE;
			this.mouseButton = 'NONE';
			this.key = null;
			this.cursor = this.cursors.pen;
			
			this.centerX = this.width / 2;
			this.centerY = this.height / 2;
			this.clickPosX = 0;
			this.clickPosY = 0;
			this.mousePosX = 0;
			this.mousePosY = 0;
			this.actPoint = null;
			this.actOver = null;
			this.closed = false;
			this.snapToGrid = true;
			this.points = [];
			
			this.canvas = canvas;
			this.canvas.setAttribute('tabindex', '1');
			this.canvas.width = this.options.width;
			this.canvas.height = this.options.height;
			
			//Add mousewheel handler (Chrome, Safari, Opera)
			this.canvas.addEventListener('mousewheel', this.mouseWheelListener);
			
			//Add mousewheel handler (Firefox)
			this.canvas.addEventListener('DOMMouseScroll', this.mouseWheelListener);
			
			//Add mouseup listener
			this.canvas.addEventListener('mouseup', this.mouseUpListener);
			
			//Add mousedown listener
			this.canvas.addEventListener('mousedown', this.mouseDownListener);
			
			//Add mousemove listener
			this.canvas.addEventListener('mousemove', this.mouseMoveListener);
			
			//Add mouseout listener
			this.canvas.addEventListener('mouseover', this.mouseOverListener, false);
			
			//Add mouseout listener
			this.canvas.addEventListener('mouseout', this.mouseOutListener, false);		
			
			//Add keydown listener
			this.canvas.addEventListener('keydown', this.keyDownListener);
			
			//Add keyup listener
			this.canvas.addEventListener('keyup', this.keyUpListener);
			
			//Add contextmenu listener
			this.canvas.addEventListener('contextmenu', this.contextMenuListener, false);
			
			//Get the 2D-context
			this.context = this.canvas.getContext('2d');
			
			//Initial draw
			this.draw();
		};
		
		/*
		 * Handle the 'mouseup'-event
		 * @param {event} the fired mouse-event
		 */
		this.mouseUpListener = function (evt)
		{
			that.mouseButton = 'NONE';
			that.canvas.style.cursor = that.cursor;
			
			switch (evt.which) 
			{
				case 1: //LEFT
					if (that.mode == that.modes.CREATE)
					{
						if (that.checkForClosing())
						{
							that.closePath();
						}
						else
						{
							that.addPoint();
						}
					}
				break;
				case 2: //MIDDLE
				break;
				case 3: //RIGHT
				break;
			}
			
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
					that.canvas.style.cursor = that.cursor;
					if (that.mode == that.modes.EDIT)
					{
						that.selectPoint();	
					}
				break;
				case 2: 
					that.mouseButton = 'MIDDLE';
					that.clickPosX = that.mousePosX;
					that.clickPosY = that.mousePosY;
					that.canvas.style.cursor = that.cursors.hand; 
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
			that.updateMousePos(evt);
			
			if (that.snapToGrid == true)
			{
				that.mousePosX = (Math.abs(that.mousePosX) < 0.15) ? 0 : that.mousePosX;
				that.mousePosY = (Math.abs(that.mousePosY) < 0.15) ? 0 : that.mousePosY;  
			}
			
			//Handle different mouse buttons
			switch (that.mouseButton) {
				case 'LEFT':
					if (that.mode == that.modes.CREATE) 
					{
						that.updateControlPoint();
					}
					else if (that.mode == that.modes.EDIT)
					{
						if (that.actPoint != null) {
							that.actPoint.translate(that.mousePosX, that.mousePosY);
						}
					}
					break;
				case 'MIDDLE': 
					that.centerX -= that.clickPosX - that.mousePosX;
					that.centerY -= that.clickPosY - that.mousePosY;
					break;
				case 'RIGHT': 
					break;
				case 'NONE':
					if (that.mode == that.modes.CREATE) 
					{
						if (that.checkForClosing())
						{
							that.points[that.points.length-1].translate(that.points[0].x, that.points[0].y);
						}
						else
						{
							that.actPoint.translate(that.mousePosX, that.mousePosY);
						}
					}
					else if (that.mode == that.modes.EDIT) 
					{
						that.checkOverOut();
					}
					break;				
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
				if (that.gridSize < that.options.gridMax) 
				{
					that.gridSize += that.options.gridStep;
					that.draw();
				}
			} 
			else 
			{
				//If allowed decrement grid size and redraw it
				if (that.gridSize > that.options.gridMin) 
				{
					that.gridSize -= that.options.gridStep;
					that.draw();
				}
			}
		};
		
		/*
		 * Handle 'mouseover'-event
		 * @param {event} the fired mouse-event
		 */
		this.mouseOverListener = function (evt) 
		{
			if (that.mode == that.modes.CREATE)
			{
				that.addPoint();
				that.draw();
			}
		}
		
		/*
		 * Handle 'mouseout'-event
		 * @param {event} the fired mouse-event
		 */
		this.mouseOutListener = function (evt) 
		{	
			if (that.mode == that.modes.CREATE)
			{
				that.points.pop();
				that.draw();
			}
		};
		
		/*
		 * Handle 'keydown'-event
		 * @param {event} the fired keyboard-event
		 */
		this.keyDownListener = function (evt)
		{
			that.key = evt.keyCode;
		};
		
		/*
		 * Handle 'keyup'-event
		 * @param {event} the fired keyboard-event
		 */
		this.keyUpListener = function (evt)
		{
			that.key = null;
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
		 * 
		 * @param {mode} 
		 */
		this.changeMode = function (mode) 
		{
			if (this.mode != mode)
			{
				this.mode = mode;
				switch (mode)
				{
					case this.modes.CREATE:
						this.cursor = this.cursors.pen;
						this.canvas.style.cursor = this.cursor;
						this.actPoint = null;
						this.actOver = null;
						break;
					case this.modes.EDIT:
						this.cursor = this.cursors.pointer;
						this.canvas.style.cursor = this.cursor;
						this.actPoint = null;
						this.actOver = null;
						break;
					case this.modes.ERASE:
						this.cursor = this.cursors.eraser;
						this.canvas.style.cursor = this.cursor;
						this.actPoint = null;
						this.actOver = null;
						break;	
					case this.modes.MOVE:
						this.cursor = this.cursors.hand;
						this.canvas.style.cursor = this.cursor;
						this.actPoint = null;
						this.actOver = null;
						break;
					case this.modes.ZOOM:
						this.cursor = this.cursors.zoom;
						this.canvas.style.cursor = this.cursor;
						this.actPoint = null;
						this.actOver = null;
						break;
				}
				
				this.canvas.dispatchEvent(new CustomEvent('modechanged', {bubbles: false, cancelable: true, detail: {mode: this.mode}}));
			}
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
			if (this.mode == this.modes.CREATE && this.points.length > 3)
			{
				//Switch to edit-mode
				this.mode = this.modes.EDIT;
				
				//Delete last point
				this.points.pop();
			}
		};
		
		/*
		 * @return {boolean} 
		 */
		this.checkForClosing = function()
		{
			//Loop over all points
			if (this.mode == this.modes.CREATE && this.points.length > 3)
			{
				var distance = Math.pow(this.points[0].x - this.mousePosX, 2) + Math.pow(this.points[0].y - this.mousePosY, 2);
				return (distance <= 0.25);
			}
		};
		
		/*
		 * @return {boolean} 
		 */
		this.selectPoint = function()
		{
			this.unselectPoints();
			if (this.actOver !== null)
			{
				this.actOver.selected = true;
				this.actPoint = this.actOver;
			} else {
				this.actPoint = null;
			}
		};
		
		/*
		 * @return {boolean} 
		 */
		this.checkOverOut = function()
		{
			for (var p=0; p<this.points.length; p++)
			{
				var distance = Math.pow(this.points[p].x - this.mousePosX, 2) + Math.pow(this.points[p].y - this.mousePosY, 2);
				if (distance <= 0.05)
				{
					this.points[p].over = true;
					this.actOver = this.points[p];
					return;
				}
				else
				{
					this.points[p].over = false;
					this.actOver = null;
				}
				
				for (var c=0; c<this.points[p].control.length; c++)
				{
					var distance = Math.pow(this.points[p].control[c].x - this.mousePosX, 2) + Math.pow(this.points[p].control[c].y - this.mousePosY, 2);
					if (distance <= 0.02)
					{
						this.points[p].control[c].over = true;
						this.actOver = this.points[p].control[c];
						return;
					}
					else
					{
						this.points[p].control[c].over = false;
						this.actOver = null;
					}
				}
			}
		};
		
		/*
		 * 
		 */
		this.closePath = function()
		{
			//Check if allowed to close the path
			if (this.mode == this.modes.CREATE && this.points.length > 3)
			{
				//Switch to that.modes.EDIT-mode
				this.changeMode(this.modes.EDIT);
				
				//Unselect all points
				this.unselectPoints();
				
				this.closed = true;
				
				this.points.pop();
			}
		};
		
		/*
		 * 
		 */
		this.unselectPoints = function()
		{
			//Loop over all points
			for (var p=0; p<this.points.length; p++)
			{
				this.points[p].selected = false;
				
				for (var c=0; c<this.points[p].control.length; c++)
				{
					this.points[p].control[c].selected = false;
				}
			}
		};
		
		/*
		 * 
		 */
		this.updateControlPoint = function()
		{
			var dirVecX = this.mousePosX - this.actPoint.x;
			var dirVecY = this.mousePosY - this.actPoint.y;
			
			if (Math.abs(dirVecX > 0.1) || Math.abs(dirVecY) > 0.1)
			{
				if (this.actPoint.control.length == 0) 
				{
					var controlPt1 = {x: 0, y: 0, over: false, selected: false, parent: this.actPoint, lock: true};
					var controlPt2 = {x: 0, y: 0, over: false, selected: false, parent: this.actPoint, lock: true};
					
					controlPt1.translate = this.translateControlPoint;
					controlPt2.translate = this.translateControlPoint;
					
					//Cross reference
					controlPt1.opposite = controlPt2;
					controlPt2.opposite = controlPt1;
					
					//Add it
					this.actPoint.control.push(controlPt1);
					this.actPoint.control.push(controlPt2);
				}
				
				this.actPoint.control[0].x = this.actPoint.x + dirVecX;
				this.actPoint.control[0].y = this.actPoint.y + dirVecY;
				
				this.actPoint.control[1].x = this.actPoint.x - dirVecX;
				this.actPoint.control[1].y = this.actPoint.y - dirVecY;
			}
		};
		
		
		/*
		 * Create a new point at actual mouse position
		 */
		this.translateControlPoint = function(x, y)
		{
			if (that.key == 18 || !that.actPoint.lock) //ALT
			{
				that.actPoint.x = x;
				that.actPoint.y = y;
				that.actPoint.lock = false
				that.actPoint.opposite.lock = false
			}
			else
			{
				var dirXOpp = that.actPoint.opposite.x - that.actPoint.opposite.parent.x;
				var dirYOpp = that.actPoint.opposite.y - that.actPoint.opposite.parent.y;
				
				var lengthOpp = Math.sqrt(Math.pow(dirXOpp, 2) + Math.pow(dirYOpp, 2));
				
				that.actPoint.x = x;
				that.actPoint.y = y;
				
				var dirX = that.actPoint.x - that.actPoint.parent.x;
				var dirY = that.actPoint.y - that.actPoint.parent.y;
				
				var length = Math.sqrt(Math.pow(dirX, 2) + Math.pow(dirY, 2));
				
				var norX = dirX / length;
				var norY = dirY / length;
				
				that.actPoint.opposite.x = that.actPoint.opposite.parent.x - norX * lengthOpp;
				that.actPoint.opposite.y = that.actPoint.opposite.parent.y - norY * lengthOpp;
			}
		};
		
		/*
		 * Create a new point at actual mouse position
		 */
		this.addPoint = function()
		{
			//Check if mode is CREATE
			if (this.mode == this.modes.CREATE)
			{
				//First unselect all Points
				this.unselectPoints();
				
				//Create new Point
				var point = {};
				
				//Set Point properties
				point.x = this.mousePosX;
				point.y = this.mousePosY;
				point.control = [];
				point.over = false;
				point.selected = true;
				point.translate = function (x, y) {
					
					if(this.control.length != 0) {
						var dirX = [(this.control[0].x - this.x), (this.control[1].x - this.x)];
						var dirY = [(this.control[0].y - this.y), (this.control[1].y - this.y)];
					}
					
					this.x = x;
					this.y = y;
					
					for (var c=0; c<this.control.length; c++)
					{	
						this.control[c].x = this.x + dirX[c];
						this.control[c].y = this.y + dirY[c];
					}
				};
				
				//Add point to list
				this.points.push(point);
				
				//Set actual point
				this.actPoint = point;
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
			
			//Draw conrol lines
			this.drawControlLines();
			
			//Draw the points
			this.drawPoints();
			
			this.drawControlPoints();
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
			this.context.strokeStyle = this.options.gridColor;
			
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
			for (var p=1; p<this.points.length; p++)
			{
				this.drawLine(p-1, p);
			}
			
			if (this.closed)
			{
				this.drawLine(this.points.length-1, 0);
			}
		};
		
		/*
		 * Draw a single line or curve between two points
		 */
		this.drawLine = function(p1, p2)
		{
			//Start new path for every line
			this.context.beginPath();
			
			//Set line width and color
			this.context.lineWidth = 1;
			this.context.strokeStyle = this.options.lineColor;
			
			var startPointX = this.points[p1].x * this.gridSize + this.centerX;
			var startPointY = this.points[p1].y * this.gridSize + this.centerY;
			
			var endPointX = this.points[p2].x * this.gridSize + this.centerX;
			var endPointY = this.points[p2].y * this.gridSize + this.centerY;
			
			if (this.points[p1].control.length != 0)
			{
				var controlPointX_1 = this.points[p1].control[0].x * this.gridSize + this.centerX;
				var controlPointY_1 = this.points[p1].control[0].y * this.gridSize + this.centerY;
			} 
			else
			{
				var controlPointX_1 = startPointX;
				var controlPointY_1 = startPointY;
			}
			
			if (this.points[p2].control.length != 0)
			{
				var controlPointX_2 = this.points[p2].control[1].x * this.gridSize + this.centerX;
				var controlPointY_2 = this.points[p2].control[1].y * this.gridSize + this.centerY;
			} 
			else
			{
				var controlPointX_2 = endPointX;
				var controlPointY_2 = endPointY;
			}
			
			this.context.moveTo(startPointX, startPointY);
			this.context.bezierCurveTo(controlPointX_1, controlPointY_1, controlPointX_2, controlPointY_2, endPointX, endPointY);
			
			//Draw it!
			this.context.stroke();
		};
		
		/*
		 * Draw the points
		 */
		this.drawPoints = function () 
		{
			//Loop over all points
			for (var p=0; p<this.points.length; p++)
			{			
				//Start new path for every point
				this.context.beginPath();
				
				//Set point color
				this.context.fillStyle = (this.points[p].selected) ? this.options.selectColor : this.options.pointColor;
				
				//Create actual point
				//this.context.arc(this.points[p].x * this.gridSize + this.centerX, this.points[p].y * this.gridSize + this.centerY, this.gridSize/4, 0, Math.PI*2, false); 
				this.context.rect(this.points[p].x * this.gridSize + this.centerX - this.gridSize/8, 
								  this.points[p].y * this.gridSize + this.centerY - this.gridSize/8, 
								  this.gridSize/4, 
								  this.gridSize/4);
				
				//Close the path
				this.context.closePath();
				
				//Draw it!
				this.context.fill();
				
				if (this.points[p].over)
				{
					//Start new path for every point
					this.context.beginPath();
					
					//Set line width and color
					this.context.lineWidth = 1;
					this.context.strokeStyle = '#CCC';
					
					//Create actual point
					this.context.arc(this.points[p].x * this.gridSize + this.centerX, this.points[p].y * this.gridSize + this.centerY, this.gridSize/3, 0, Math.PI*2, false); 
				
					//Close the path
					this.context.closePath();
				
					//Draw it!
					this.context.stroke();
				}
			}
		};
		
		/*
		 * Draw the points
		 */
		this.drawControlPoints = function () 
		{
			//Loop over all points
			for (var p=0; p<this.points.length; p++)
			{	
				for (c=0; c<this.points[p].control.length; c++)
				{		
					//Start new path for every point
					this.context.beginPath();
					
					//Set point color
					this.context.fillStyle = (this.points[p].control[c].selected) ? this.options.selectColor : this.options.handleColor;
					
					//Create actual point
					this.context.arc(this.points[p].control[c].x * this.gridSize + this.centerX, this.points[p].control[c].y * this.gridSize + this.centerY, this.gridSize/8, 0, Math.PI*2, false); 
					
					//Close the path
					this.context.closePath();
					
					//Draw it!
					this.context.fill();
					
					if (this.points[p].control[c].over)
					{
						//Start new path for every point
						this.context.beginPath();
						
						//Set line width and color
						this.context.lineWidth = 1;
						this.context.strokeStyle = '#CCC';
						
						//Create actual point
						this.context.arc(this.points[p].control[c].x * this.gridSize + this.centerX, this.points[p].control[c].y * this.gridSize + this.centerY, this.gridSize/4, 0, Math.PI*2, false); 
					
						//Close the path
						this.context.closePath();
					
						//Draw it!
						this.context.stroke();
					}
				}
			}
		};
		
		/*
		 * Draw the control lines
		 */
		this.drawControlLines = function () 
		{
			//Loop over all points
			for (var p=0; p<this.points.length; p++)
			{	
				for (c=0; c<this.points[p].control.length; c++)
				{
					//Start new path for every line
					this.context.beginPath();
					
					//Set line width and color
					this.context.lineWidth = 1;
					this.context.strokeStyle = this.options.lineColor;
					
					//Create line between the actual and the previous point
					this.context.moveTo(this.points[p].x * this.gridSize + this.centerX, this.points[p].y * this.gridSize + this.centerY);
					this.context.lineTo(this.points[p].control[c].x * this.gridSize + this.centerX, this.points[p].control[c].y * this.gridSize + this.centerY);
					
					//Draw it!
					this.context.stroke();
				}
			}
		};
		
		this.samplePoints = function()
		{
            var points = [];
            var point, p0, p1, p2, p3;

            for (var p=0; p<this.points.length; p++)
			{
                var act = (p != this.points.length) ? p : 0;
                var next = (p+1 != this.points.length) ? p+1 : 0;

                console.log("act: " + act + " next: " + next);

				if (this.points[act].control.length == 0 && this.points[next].control.length == 0)
				{
                    points.push(this.points[act].x, this.points[act].y);
				}
				else if (this.points[act].control.length != 0 && this.points[next].control.length == 0)
				{
                    p0 = new x3dom.fields.SFVec2f(this.points[act].x, this.points[act].y);
                    p1 = new x3dom.fields.SFVec2f(this.points[act].control[0].x, this.points[act].control[0].y);
                    p2 = new x3dom.fields.SFVec2f(this.points[next].x, this.points[next].y);
                    p3 = new x3dom.fields.SFVec2f(this.points[next].x, this.points[next].y);

                    for (var t=0; t<1.0-1/32; t+=1/32)
                    {
                        point = this.calBezierPoints(t, p0, p1, p2, p3);
                        points.push(point.x, point.y);
                    }
				}
                else if (this.points[act].control.length == 0 && this.points[next].control.length != 0)
                {
                    p0 = new x3dom.fields.SFVec2f(this.points[act].x, this.points[act].y);
                    p1 = new x3dom.fields.SFVec2f(this.points[act].x, this.points[act].y);
                    p2 = new x3dom.fields.SFVec2f(this.points[next].control[1].x, this.points[next].control[1].y);
                    p3 = new x3dom.fields.SFVec2f(this.points[next].x, this.points[next].y);

                    for (var t=0; t<1.0-1/32; t+=1/32)
                    {
                        point = this.calBezierPoints(t, p0, p1, p2, p3);
                        points.push(point.x, point.y);
                    }
                }
                else
                {
                    p0 = new x3dom.fields.SFVec2f(this.points[act].x, this.points[act].y);
                    p1 = new x3dom.fields.SFVec2f(this.points[act].control[0].x, this.points[act].control[0].y);
                    p2 = new x3dom.fields.SFVec2f(this.points[next].control[1].x, this.points[next].control[1].y);
                    p3 = new x3dom.fields.SFVec2f(this.points[next].x, this.points[next].y);

                    for (var t=0; t<1.0-1/32; t+=1/32)
                    {
                        point = this.calBezierPoints(t, p0, p1, p2, p3);
                        points.push(point.x, point.y);
                    }
                }
			}

            if (this.closed)
            {
                points.push(this.points[0].x, this.points[0].y);
            }

            return points;
		};
		
		this.calBezierPoints = function(t, p0, p1, p2, p3)
		{
			var u = 1-t;
  			var tt = t*t;
  			var uu = u*u;
  			var uuu = uu * u;
  			var ttt = tt * t;
 
  			p = p0.multiply(uuu);
  			p = p.add(p1.multiply(3 * uu * t)); 
  			p = p.add(p2.multiply(3 * u * tt));
  			p = p.add(p3.multiply(ttt));
			
			return p;
		};
		
		
		//Finaly initialize the editor
		this.init();
    };
	
	Editor2D.prototype = {
		clear: function() 
		{
			this.points = [];
			this.centerX = this.width/2;
			this.centerY = this.height/2;
			this.gridSize = 30;
			this.closed = false;
			this.changeMode(this.modes.CREATE);
			this.draw();
		},
		
		resetView: function() 
		{
			this.centerX = this.width/2;
			this.centerY = this.height/2;
			this.gridSize = 30;
			this.draw();
		},

        getPoints: function()
        {
            return this.points;
        }
	};

    $.fn.editor2D = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'Editor2D')) {
                    $.data(this, 'Editor2D', new Editor2D(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn.editor2D.getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'Editor2D');
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'Editor2D');
                    if (instance instanceof Editor2D && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                });
            }
        }
    };
	
	// Plugin defaults – added as a property on our plugin function.
	$.fn.editor2D.defaults = {
    	width: 600,
    	height: 400,
		gridSize: 30,
		gridMin: 10,
		gridMax: 100,
		gridStep: 5,
		gridColor: '#CCC',
		lineColor: '#00A8FF',
		handleColor: '#00A8FF',
		pointColor: '#00A8FF',
		selectColor: '#FFF'
	};

    $.fn.editor2D.getters = ['samplePoints'];
	

	
})(jQuery);