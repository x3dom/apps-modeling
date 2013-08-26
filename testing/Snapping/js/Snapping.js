/*
 * 
 */
function Snapping()
{	
	var observer =
	{
		angList: {
			observerList: []
		},
		
		subscribe: function(fn, type)
		{
			type = type || 'observerList';
			
			if(typeof this.angList[type] === 'undefined')
			{
				this.angList[type] = [];	
			}
			
			this.angList[type].push(fn);
		},
		
		unsubscribe: function(fn, type)
		{
			var subType = type || 'observerList',
				angList = this.angList[subType],
				max = angList.length,
				i;
			
			for(i = 0; i < max; i+=1)
			{
				if(angList[i] === fn)
				{
					angList.splice(i, 1);
				}
			}
		},
		
		publish: function(fn, type)
		{
			
		}
	};
	
	this.init = function()
	{
		alert("Snapping");
	};
}
