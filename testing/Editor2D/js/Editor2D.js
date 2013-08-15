$(function() {
 
 //Create Overlay
 document    

});

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
	this.pointList = [{x: 0, y: 2}, {x: 2, y: 2}, {x: 3, y: 0}];

	var mouseWheelEvent = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";

	//Create Overlay
 	this.overlay = document.createElement('div');
	this.overlay.style.position = 'fixed';
	this.overlay.style.top = '0px';
	this.overlay.style.left = '0px';
	this.overlay.style.margin = '0px';
	this.overlay.style.padding = '0px';
	this.overlay.style.width = '100%';
	this.overlay.style.height = '100%';
	this.overlay.style.zIndex = '9999';
	this.overlay.style.backgroundColor = 'rgba(90, 90, 90, 0.75)';
	this.overlay.style.display = 'none';
	
	//Create Editor Container 
	this.editor = document.createElement('div');
	this.editor.style.width = this.width + 30 + 'px';
	this.editor.style.height = this.height + 30 + 'px';
	this.editor.style.position = 'relative';
	this.editor.style.top = '50%';
	this.editor.style.left = '50%';
	this.editor.style.margin = -(this.height + 30)/2 + 'px 0px 0px ' + -(this.width + 30)/2 + 'px';
	this.editor.style.backgroundColor = 'rgb(60, 60, 60)';
	this.editor.style.borderRadius = '15px';
	this.editor.style.boxShadow = '5px 5px 5px #333';
	
	//Create Canvas
	this.canvas = document.createElement('canvas');
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.canvas.style.margin = '15px 0px 0px 15px';
	this.canvas.style.border = '2px solid #CCC';
	this.canvas.style.borderRadius = '10px';
	this.canvas.style.cursor = 'crosshair';
	this.canvas.addEventListener(mouseWheelEvent, function (evt) {
		//Update mouse position
		that.getMousePos(evt)
		
		if (evt.wheelDelta > 0 || evt.detail > 0) {
			if (that.gridSize < 100) {
				that.gridSize += 5;
				that.draw();
			}
		} else {
			if (that.gridSize > 10) {
				that.gridSize -= 5;
				that.draw();
			}
		}
	});
	this.canvas.addEventListener('mousedown', function (evt) {
		//Update mouse position
		that.getMousePos(evt)
		
		switch (evt.which) {
			case 1: 
				that.mouseButton = 'LEFT';
				that.clickPosX = that.mousePosX;
				that.clickPosY = that.mousePosY;  
				that.canvas.style.cursor = 'haircross'; 
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
				that.canvas.style.cursor = 'haircross'; 
				break;
		}
	});
	this.canvas.addEventListener('mouseup', function (evt) {
		that.mouseButton = 'NONE';
		that.canvas.style.cursor = 'crosshair';
	});
	this.canvas.addEventListener('mousemove', function (evt) {
		//Update mouse position
		that.getMousePos(evt)
		
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
			that.pointList[that.pointList.length-1].x = that.mousePosX;
			that.pointList[that.pointList.length-1].y = that.mousePosY;
		}
		
		that.draw();
	});
	
	//Append Elements
	this.editor.appendChild(this.canvas);
	this.overlay.appendChild(this.editor);	
	document.body.appendChild(this.overlay);
		
	//Create Context
	this.context = this.canvas.getContext("2d");
	
	this.context.mozImageSmoothingEnabled = false;
	this.context.webkitImageSmoothingEnabled = false;
	
	this.getMousePos = function(evt) {
		var rect = that.canvas.getBoundingClientRect();
		that.mousePosX = (evt.clientX - rect.left - this.centerX - 2) / that.gridSize;
		that.mousePosY = (evt.clientY - rect.top - this.centerY - 2.5) / that.gridSize;	
	};
	
	this.drawGrid = function () 
	{	
		this.context.beginPath();

		for (var x = this.centerX + this.gridSize; x <= this.width; x += this.gridSize) {
			this.context.moveTo(x, 0);
			this.context.lineTo(x, this.height);
		}
		
		for (x = this.centerX - this.gridSize; x >= 0; x -= this.gridSize) {
			this.context.moveTo(x, 0);
			this.context.lineTo(x, this.height);
		}
		
		for (var y = this.centerY + this.gridSize; y <= this.height; y += this.gridSize) {
			this.context.moveTo(0, y);
			this.context.lineTo(this.width, y);
		}
		
		for (var y = this.centerY - this.gridSize; y >= 0; y -= this.gridSize) {
			this.context.moveTo(0, y);
			this.context.lineTo(this.width, y);
		}
		
		this.context.lineWidth = 1;
		this.context.strokeStyle = '#777';
		this.context.stroke();
		
		this.context.beginPath();
		this.context.moveTo(this.centerX, 0);
		this.context.lineTo(this.centerX, this.height);
		
		this.context.moveTo(0, this.centerY);
		this.context.lineTo(this.width, this.centerY);
		
		this.context.lineWidth = 2;
		this.context.strokeStyle = '#CCC';
		this.context.stroke();
	};
	
	this.drawLines = function()
	{
		for (var p=1; p<this.pointList.length; p++)
		{
			this.context.beginPath();
			this.context.moveTo(this.pointList[p-1].x * this.gridSize + this.centerX, this.pointList[p-1].y * this.gridSize + this.centerY);
			this.context.lineTo(this.pointList[p].x * this.gridSize + this.centerX, this.pointList[p].y * this.gridSize + this.centerY);
			this.context.lineWidth = 2;
			this.context.strokeStyle = '#CCC';
			this.context.stroke();
		}
	};
	
	this.drawPoints = function () 
	{
		for (var p=0; p<this.pointList.length; p++)
		{
			this.context.beginPath();
			this.context.arc(this.pointList[p].x * this.gridSize + this.centerX, this.pointList[p].y * this.gridSize + this.centerY, this.gridSize/4, 0, Math.PI*2, false); 
			this.context.closePath();
			this.context.fillStyle = '#2956a8';
			this.context.fill();
		}
	}
	
	this.draw = function()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.drawGrid();
		this.drawLines();
		this.drawPoints();
	}
	
	this.draw();
}

Editor2D.prototype.show = function () {
	
	this.overlay.style.display = 'block';
}

Editor2D.prototype.hide = function () {
	this.overlay.style.display = 'none';
}

Editor2D.prototype.show = function () {
	this.overlay.style.display = 'block';
}

