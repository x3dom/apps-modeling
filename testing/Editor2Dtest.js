/*
 * 2D-Canvas Editor
 */
function Editor2D()
{
	var pen_col = "000000";
    var pen_size = 1;
        
    // window in xz-plane
    var minWin = {x: -1, y: -1},
        maxWin = {x:  1, y:  1};

    
    function calcWcToDc(canvas, x, y)
    {
        var dc = {x: 0, y: 0};

        var nx = (maxWin.x - minWin.x),
            ny = (maxWin.y - minWin.y);
        var sx = canvas.width / nx,
            sy = -canvas.height / ny;
        var tx = -minWin.x * canvas.width / nx,
            ty = canvas.height + minWin.y * canvas.height / ny;

        dc.x = sx * x + tx;
        dc.y = sy * y + ty;

        return dc;
    }
    

    function calcCcToWc(canvas, x, y)
    {
        var wc = {x: 0, y: 0};

        var nx = (maxWin.x - minWin.x),
            ny = (maxWin.y - minWin.y);
        var sx = canvas.width / nx,
            sy = -canvas.height / ny;
        var tx = -minWin.x * canvas.width / nx,
            ty = canvas.height + minWin.y * canvas.height / ny;

        wc.x = (x - tx) / sx;
        wc.y = (y - ty) / sy;

        return wc;
    }


    // little helpers for calculating window-viewport transformation
    this.setWindow = function(x0, y0, x1, y1)
    {
        if ( (x1 - x0 > 0) && (y1 - y0 > 0) )
        {
            minWin.x = x0;
            minWin.y = y0;
            maxWin.x = x1;
            maxWin.y = y1;
        }
        else
            console.log("Error, window size must be greater zero!");
    };
    

	this.clearImage = function(canvas)
    {
        // get the 2d drawing context
        var context = canvas.getContext("2d");

        context.fillStyle = 'rgb(255,255,255)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.lineCap = "round";
        context.lineWidth = pen_size;
        context.strokeStyle = pen_col;
    };


    this.drawCoordSys = function(canvas)
    {
        var context = canvas.getContext("2d");

        context.strokeStyle = '#f00';
        context.beginPath();

        var dc = calcWcToDc(canvas, minWin.x, 0);
        context.moveTo(dc.x, dc.y);
        dc = calcWcToDc(canvas, maxWin.x, 0);
        context.lineTo(dc.x, dc.y);
        context.stroke();

        dc = calcWcToDc(canvas, 0, minWin.y);
        context.moveTo(dc.x, dc.y);
        dc = calcWcToDc(canvas, 0, maxWin.y);
        context.lineTo(dc.x, dc.y);

        context.stroke();
        context.closePath();

        context.strokeStyle = pen_col;
    };


    // TODO: remove following code, just for testing draw a little sinus :)
    this.drawSinus = function(canvas)
    {
        var context = canvas.getContext("2d");

        var i = 0, N = canvas.width / 8;
        var dx = (maxWin.x - minWin.x) / N;
        var x = minWin.x, y = Math.sin(x);

        context.beginPath();
        context.strokeStyle = pen_col;

        dc = calcWcToDc(canvas, x, y);
        context.moveTo(dc.x, dc.y);

        while (++i <= N) {
            x += dx;
            y = Math.sin(x);

            dc = calcWcToDc(canvas, x, y);
            context.lineTo(dc.x, dc.y);
        }

        context.stroke();
        context.closePath();
    };
}
