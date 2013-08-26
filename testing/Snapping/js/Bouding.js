/*
 * 
 */
function Bouding()
{
	var center;
	var radius;
	
	this.init = function()
	{
		//var selectID = primitiveManager.getActualID();
		var selectID = primitiveManager.getActualPrimitive();
		
		if(document.getElementById('bounding'))
		{
			alert("Bounding vorhanden");
		}
		else
		{
			boundingPoint(selectID);	
		}
	};
	
	
    function boundingPoint(id)
    {
    	var transform = document.createElement('Transform');
    	var transform_S = document.createElement('Shape');
    	var transform_S_A = document.createElement('Appearance');
    	var transform_S_A_M = document.createElement('Material');
    	var transform_S_A_M_S = document.createElement('Sphere');
    	
    	transform_S_A_M_S.setAttribute('radius', '0.1');
    	transform_S_A_M.setAttribute('diffuseColor', '#3FFFFF');
    	transform.setAttribute('translation', '0 0 1.5');
    	transform.setAttribute('id', 'boundingPoint');
    	
    	transform_S_A.appendChild( transform_S_A_M );
    	transform_S.appendChild( transform_S_A_M_S );
    	transform_S.appendChild( transform_S_A );
    	transform.appendChild( transform_S );
    	
    	var element = document.getElementById(id);
    	element.appendChild(transform);
    }
}
