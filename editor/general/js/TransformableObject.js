matrixToString = function(mat){
    return mat.toGL().toString();
};

/*
 * Base class for everything that is transformed inside the editor.
 * Concretely speaking: Primitives and Groups.
 */
var idCounter = 0;

function TransformableObject(){
};



TransformableObject.prototype.init = function(){
    this.id   = "o"       + idCounter;
    this.name = "object_" + idCounter++;

    this.matrixTransformNode = document.createElement('MatrixTransform');
    this.matrixTransformNode.setAttribute("matrix", matrixToString(x3dom.fields.SFMatrix4f.identity()));

    //transformation values
    this.translation    = new x3dom.fields.SFVec3f(0, 0, 0);
    this.rotationAngles = new x3dom.fields.SFVec3f(0, 0, 0);
    this.scale          = new x3dom.fields.SFVec3f(1, 1, 1);
};



/*
 * Returns the ID of the object. The id is unique for each primitive.
 */
TransformableObject.prototype.getID = function(){
    return this.id;
};



/*
 * Returns the name of this object. Multiple primitives may have the same name.
 */
TransformableObject.prototype.getName = function(){
    return this.name;
};



/*
 * Sets the name of this object. Multiple primitives may have the same name.
 */
TransformableObject.prototype.setName = function(name){
   this.name = name;
};



/*
 * Returns the DOM Node of this group's matrix transform.
 * @returns {DOMNode}
 */
TransformableObject.prototype.getMatrixTransformNode = function(){
    return this.matrixTransformNode;
};



TransformableObject.prototype.setRotationAngles = function(x, y, z){
    this.rotationAngles.x = x;
    this.rotationAngles.y = y;
    this.rotationAngles.z = z;

    this.updateMatrixTransform();
};



TransformableObject.prototype.setRotationAnglesAsVec = function(v){
    this.rotationAngles.x = v.x;
    this.rotationAngles.y = v.y;
    this.rotationAngles.z = v.z;

    this.updateMatrixTransform();
};



TransformableObject.prototype.setTranslation = function(x, y, z){
    this.translation.x = x;
    this.translation.y = y;
    this.translation.z = z;

    this.updateMatrixTransform();
};



TransformableObject.prototype.setTranslationAsVec = function(v){
    this.translation = x3dom.fields.SFVec3f.copy(v);

    this.updateMatrixTransform();
};



TransformableObject.prototype.setScale = function(x, y, z){
    this.scale.x = x;
    this.scale.y = y;
    this.scale.z = z;

    this.updateMatrixTransform();
};



TransformableObject.prototype.setScaleAsVec = function(v){
    this.scale = x3dom.fields.SFVec3f.copy(v);

    this.updateMatrixTransform();
};



TransformableObject.prototype.getTranslation = function(){
    return this.translation;
};



TransformableObject.prototype.getRotationAngles = function(){
    return this.rotationAngles;
};



TransformableObject.prototype.getScale = function(){
    return this.scale;
};



TransformableObject.prototype.updateMatrixTransform = function(){
    var deg2Rad = Math.PI / 180.0;

    var matTr = x3dom.fields.SFMatrix4f.translation(this.translation);

    var matRX = x3dom.fields.SFMatrix4f.rotationX(this.rotationAngles.x  * deg2Rad);
    var matRY = x3dom.fields.SFMatrix4f.rotationY(this.rotationAngles.y  * deg2Rad);
    var matRZ = x3dom.fields.SFMatrix4f.rotationZ(this.rotationAngles.z  * deg2Rad);

    var matSc = x3dom.fields.SFMatrix4f.scale(this.scale);

    var transformMat = matTr;
    transformMat     = transformMat.mult(matRX.mult(matRY).mult(matRZ));
    transformMat     = transformMat.mult(matSc);

    this.matrixTransformNode.setAttribute("matrix", matrixToString(transformMat));
};
