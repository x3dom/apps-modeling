/*
 * The UI object handles the getter and setter function for all GUI elements
 * @returns {UI}
 */
function UI(primitiveManager){
    
    
    this.initialize = function(){ 
        initializeUI();
        primitiveManager.setUI(that);
    };
    
    
    
    function initializeUI(){
        that.BBPrimName = that.newTextProperty("primitiveName");
        
        that.BBTransX = that.newTextProperty("amountX");
        $("#amountX").spinner({
            stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
        
        that.BBTransY = that.newTextProperty("amountY");
        $("#amountY").spinner({         
            stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
        
        that.BBTransZ = that.newTextProperty("amountZ");
        $("#amountZ").spinner({         
            stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
        
        that.TransformMode = that.newLabelProperty("transformMode");
    }
    
    
    
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
   

    
    // Starts initialization of all ui components
    var that = this;
}


