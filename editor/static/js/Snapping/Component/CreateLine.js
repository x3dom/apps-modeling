/* */
function CreateLine()
{
    /*
     * Draws a line between two elements
     */
    this.setLine = function(myObj, postObj)
    {
    	var temp = postObj.id + '_line';
		var point1 = myObj.position;
		var point2 = postObj.position;
       		
   		var lineTransform = document.createElement('Transform');
    	lineTransform.setAttribute('id', temp);
    	
    	var lineShape = document.createElement('Shape');
    	var lineAppearance = document.createElement('Appearance');
    	var lineMaterial = document.createElement('Material');
    	lineMaterial.setAttribute('emissiveColor', '1 1 0');
    	
    	var lineSet = document.createElement('IndexedLineSet');
    	var lineSetCoordinate = document.createElement('Coordinate');
    	lineSet.setAttribute('coordIndex', '0 0 1 -1');
    	lineSetCoordinate.setAttribute('point', point1 + ', ' + point2);
    	
    	lineAppearance.appendChild(lineMaterial);
    	lineShape.appendChild(lineAppearance);
    	lineSet.appendChild(lineSetCoordinate);
    	lineShape.appendChild(lineSet);
    	lineTransform.appendChild(lineShape);
    	
    	var lineSnap = document.getElementById('snapLines');
    	lineSnap.appendChild(lineTransform);
    };
}
