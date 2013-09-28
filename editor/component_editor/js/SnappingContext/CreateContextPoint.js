/*
 * 
 */
function CreateContextPoint()
{
	var objPointList = [];
	
	/*
	 * Returns the list of points
	 */
	this.getObjPointList = function()
	{
		return objPointList;
	};
	
    
    /*
     * Draws the points from the JSON file
     */
    this.setPoint = function(pointPosition, myObjID)
    {
    	var position = pointPosition[0] + ' ' + pointPosition[1] + ' ' + pointPosition[2];
    	
    	var temp = myObjID + '_point_0';
    	var pointTransform = document.createElement('Transform');
    	pointTransform.setAttribute('id', temp);
    	pointTransform.setAttribute('translation', position);
    	pointTransform.setAttribute('scale', '1 1 1');
    	
    	var pointShape = document.createElement('Shape');
    	var pointAppearance = document.createElement('Appearance');
    	var pointMaterial = document.createElement('Material');
    	pointMaterial.setAttribute('diffuseColor', '1 1 0');
    	
    	var pointSphere = document.createElement('Sphere');
    	pointSphere.setAttribute('radius', '0.03');
    	
    	pointAppearance.appendChild(pointMaterial);
    	pointShape.appendChild(pointAppearance);
    	pointShape.appendChild(pointSphere);
    	pointTransform.appendChild(pointShape);
    	
    	var objectTransform = primitiveManager.getPrimitiveByID(myObjID).getMatrixTransformNode();
    	objectTransform.appendChild(pointTransform);
    	
    	//Save Objectpoint in the Pointlist
    	objPointList[temp] = pointTransform;
    }; 
}
