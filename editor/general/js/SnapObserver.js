function SnapObserver()
{
	var observer =
	{
		List: {
			ListID: []
		},
		
		subscribe: function(fnID, type)
		{
			type = type || 'ListID';
			
			if(typeof this.List[type] === 'undefined')
			{
				this.List[type] = [];	
			}
			
			this.List[type].push(fnID);
		},
		
		unsubscribe: function(fnID, type)
		{
			var subType = type || 'ListID',
				List = this.List[subType],
				max = List.length,
				i;
			
			for(i = 0; i < max; i+=1)
			{
				if(List[i] === fnID)
				{
					List.splice(i, 1);
				}
			}
		},
		
		publish: function(fn, type)
		{
			
		}
	};
}
