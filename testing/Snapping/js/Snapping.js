function Snapping()
{
	/* Erzeugt Testobjekt */
    this.testObject = function()
    {
        var divID = document.createElement('div');
        divID.setAttribute('id', 'test3D');
       	divID.innerHTML = '<inline url="x3d/TestData/SimpleTube.x3d"></inline>';
       	document.getElementById('root').appendChild(divID);
    };
}
