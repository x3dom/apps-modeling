/*
 * The UI object handles the getter and setter function for all GUI elements
 * @returns {UI}
 */
function UI(){
    
    
    
    /*
     * Creates a new text field property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newTextProperty = function(id){
        var obj = {};

        obj.get = function(){
            try {
                return document.getElementById(id).value;
            }
            catch(ex){}
        };
        
        obj.set = function(value){
            try {
                document.getElementById(id).value = value;
            }
            catch(ex){}
        };
        
        return obj;
    };
    
    
    
    
    /*
     * Creates a new label property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newLabelProperty = function(id){
        var obj = {};

        obj.get = function(){
            try {
                return document.getElementById(id).value;
            }
            catch(ex){}
        };
        
        obj.set = function(value){
            try {
                document.getElementById(id).textContent = value;
            }
            catch(ex){}
        };
        
        return obj;
    };
    
    
    
    this.BBPrimName = this.newTextProperty("primitiveName");
    this.BBTransX = this.newTextProperty("amountX");
    this.BBTransY = this.newTextProperty("amountY");
    this.BBTransZ = this.newTextProperty("amountZ");
    this.TransformMode = this.newLabelProperty("transformMode");
}


