/*
 * The UI object handles the getter and setter function for all GUI elements
 * @returns {UI}
 */
function UI(primitiveManager){
    
    // Variables that handle the toggle behaviour of the toolbars
    var fadeSwitch = [0, 0];
    // default color of all ui elements
    var defColor = "gray";
    // highlight color of all ui elements
    var highlightColor = "#fff";
    // primitive parameter map to synchronize names between editor and x3dom
    var primitiveParameterMap = createParameterMap("PrimitiveParameterMap.xml");
    // color picker component
    var farbtasticPicker = null;
    // primitive type for 2D-Editor
    var primitivType = null;

    
    
    
    /*
     * Initializes the UIComponent
     * @returns {Null}
     */
    this.initialize = function(){ 
        initializeUI();
        primitiveManager.setUI(that);
    };
    
    
    
    /*
     * Initializes all components of the UI of the editor
     * @returns {Null}
     */
    function initializeUI(){

        that.TBHand = that.newImageProperty("ButtonHand");
        that.TBTranslate = that.newImageProperty("ButtonVerschieben");
        that.TBScale = that.newImageProperty("ButtonSkalieren");
        that.TBRotate = that.newImageProperty("ButtonRotieren");
        that.TBPrimitiveList = that.newComboBoxProperty("primitiveList");
        that.TBViewpoints = that.newComboBoxProperty("Views");
       
        that.BBPrimName = that.newTextProperty("primitiveName");
        that.BBDelete = that.newImageProperty("deletePrimitive");
        that.BBTransX = that.newSpinnerProperty("amountX");

        $("#amountX").spinner({
            step: 0.1,
            stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
        
        that.BBTransY = that.newSpinnerProperty("amountY");
        $("#amountY").spinner({
            step: 0.1,
            stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
        
        that.BBTransZ = that.newSpinnerProperty("amountZ");
        $("#amountZ").spinner({
            step: 0.1,
            stop:function(e,ui){
                primitiveManager.setTransformationValuesToPrimitive();
            }
        });
        
        that.BBTransformMode = that.newLabelProperty("transformMode");
        
        for (var prim in primitiveParameterMap){
            addLeftbarElement(primitiveParameterMap[prim].image, 
                              primitiveParameterMap[prim].editorName);
        }

        // scrollbar for primitives of left bar   		
        $('#divs').slimScroll({
                height: '99%',
                size: '10px',
                color: '#FFFFFF',
                position: 'left'
        });

        // symbols of accordion on right bar
        var iconsAccordion = 
        {
                header: "ui-icon-circle-arrow-e",
                activeHeader: "ui-icon-circle-arrow-s"
        };

        // creation of the accordion on the right bar
        that.RBAccordion = $("#accordeon-oben");

        that.RBAccordion.accordion({
                heightStyle: "content",
                collapsible: false,
                active: false,
                icons: iconsAccordion,
                activate: function(event, ui) {
                    if (ui.newHeader.text() === "Material Editor"){
                        document.getElementById("diffuse").focus();
                        that.setMaterial(primitiveManager.getActualPrimitive().Material);
                    }
                }
        });

        that.RBAccordion.disable = function(bool){
            $("#accordeon-oben").accordion("option", { disabled: bool });
        };
        
        farbtasticPicker = $.farbtastic('#picker');
        var p = $('#picker').css('opacity', 1.0);
        var selected;
        $('.colorwell')
            .each(function () { farbtasticPicker.linkTo(this); $(this).css('opacity', 1.0); })
            .focus(function() {
                    if (selected) {
                      $(selected).css('opacity', 1.0).removeClass('colorwell-selected');
                      $(selected).onchange = function() { alert("HUHU"); };
                    }
                    farbtasticPicker.linkTo(this);
                    p.css('opacity', 1);
                    $(selected = this).css('opacity', 1).addClass('colorwell-selected');
            });
            
        $("#transparency").spinner({
            min: 0.0,
            max: 1.0, 
            step: 0.1,
            stop:function(e,ui){
                primitiveManager.changePrimitiveMaterial("transparency");
            }
        });
        
        $("#shininess").spinner({
            min: 0.0,
            max: 1.0,
            step: 0.1,
            stop:function(e,ui){
                primitiveManager.changePrimitiveMaterial("shininess");
            }
        });

        //Initialize 2D-Editor
        $('#Editor2D-Canvas').editor2D();
        $('#Editor2D-Canvas').on('modechanged', function(evt) {
            that.editor2D_mode(evt.originalEvent.detail.mode);
        });
    }
    
    
    
    /*
     * Creates an array with primitives an their parameters, including
     * a mapping between the x3dom names and editor names and a default value
     * @param {string} file path to map source file (XML)
     * @returns {Array}
     */
    function createParameterMap(file){
        var xhttp;
        
        if (window.XMLHttpRequest){
            xhttp=new XMLHttpRequest();
        }
        else {
            xhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.open("GET", file, false);
        xhttp.send();
       
       var xmlDoc = xhttp.responseXML.childNodes[0];
       var primitives = xmlDoc.getElementsByTagName("Primitive");
       
       var primitiveParameterMap = [];
       for (var i = 0; i < primitives.length; i++){
            primitiveParameterMap[primitives[i].getAttribute("editorName")] =
                 { editorName: primitives[i].getAttribute("editorName"),
                   x3domName: primitives[i].getAttribute("x3domName"),
                   image: primitives[i].getAttribute("image"),
                   parameters : [] };

            var parameters = primitives[i].getElementsByTagName("Parameter");
            for (var j = 0; j < parameters.length; j++){
                primitiveParameterMap[primitives[i].getAttribute("editorName")].parameters.push(
                    { editorName: parameters[j].getAttribute("editorName"),
                      x3domName: parameters[j].getAttribute("x3domName"),
                      value: parameters[j].textContent } );
            }
       }
       
       return primitiveParameterMap;
    }
    
    
    
    /*
     * Creates a new text field property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newSpinnerProperty = function(id){
        var obj = {};

        obj.get = function(){
            return document.getElementById(id).value;
        };
        
        obj.set = function(value){
            document.getElementById(id).value = value;
        };
        
        obj.disable = function(bool){
            $("#" + id).spinner( "option", "disabled", bool );
        };
        
        return obj;
    };
    
    
    
    /*
     * Creates a new text field property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newTextProperty = function(id){
        var obj = {};

        obj.get = function(){
            return document.getElementById(id).value;
        };
        
        obj.set = function(value){
            document.getElementById(id).value = value;
        };
        
        obj.disable = function(bool){
            if (bool) document.getElementById(id).style.opacity="0.5";
            else document.getElementById(id).style.opacity="1.0";
            document.getElementById(id).disabled = bool;
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
            return document.getElementById(id).textContent;
        };
        
        obj.set = function(value){
            document.getElementById(id).textContent = value;
        };
        
        return obj;
    };
    
    
    
    /*
     * Creates a new image property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newImageProperty = function(id){
        var obj = {};

        obj.get = function(){
            return document.getElementById(id).value;
        };
        
        obj.set = function(value){
            document.getElementById(id).textContent = value;
        };
        
        obj.highlight = function(){
            document.getElementById(id).style.border = "solid 1px " + highlightColor;
        };
        
        obj.dehighlight = function(){
            document.getElementById(id).style.border = "solid 1px " + defColor;
        };
        
        obj.disable = function(bool){
            if (bool) document.getElementById(id).style.opacity="0.5";
            else document.getElementById(id).style.opacity="1.0";
            document.getElementById(id).disabled = bool;
        };
        
        return obj;
    };
    
    
    
    /*
     * Creates a new combobox property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newComboBoxProperty = function(id){
        var obj = {};

        obj.get = function(index){
            return document.getElementById(id)[index];
        };
        
        obj.set = function(index, value){
            document.getElementById(id)[index].text = value;
        };
        
        obj.disable = function(bool){
            if (bool) document.getElementById(id).style.opacity="0.5";
            else document.getElementById(id).style.opacity="1.0";
            document.getElementById(id).disabled = bool;
        };
        
        obj.idMap = function(index){
            return document.getElementById(id)[index].Primitive.IDMap;
        };
        
        obj.selectedIndex = function(){
            return document.getElementById(id).selectedIndex;
        };
        
        obj.selectIndex = function(index){
            document.getElementById(id).selectedIndex = index;
        };
        
        obj.add = function(option){
            document.getElementById(id).add(option,null);
        };
        
        obj.remove = function(index){
            document.getElementById(id).remove(index);
        };
        
        return obj;
    };
    
    

    /*
     * Toggeling fade function of the left toolbar
     */
    this.fadeLeft = function(){
       if (fadeSwitch[0] === 0){
           $("#Links").animate(
           {
               left: "-87px"
           }, 250);
           fadeSwitch[0]++;
       }
       else {
           $("#Links").animate(
           {
               left: "0px"
           }, 250);
           fadeSwitch[0]--;
       }
    };


   /*
    * Toggeling fade function of the right toolbar
    */
   this.fadeRight = function(){
       if (fadeSwitch[1] === 0){
           $("#Rechts").animate(
           {
               right: "-170px"
           }, 250);
           fadeSwitch[1]++;
       }
       else {
           $("#Rechts").animate(
           {
               right: "0px"
           }, 250);
           fadeSwitch[1]--;
       }
    }; 
       
    
    /*
     * Show or hide stats
     */
    this.showStatistik = function()
    {
	    document.getElementById("x3d").runtime.statistics();
    };
    
    
    /*
     * Show or hide debug log
     */
    this.showInfo = function()
    {
    	document.getElementById("x3d").runtime.debug();
    };


    /*
     * switch between tri, line, pnt mode
     */
    this.togglePoints = function(elem)
    {
        var showPnts = document.getElementById('x3d').runtime.togglePoints(true);
        elem.innerHTML = (showPnts == 0) ? "Points" : ((showPnts == 1) ? "Lines": "Faces");
    };

    
    
	/*  
     * Show the 2D-Editor
     */
    this.editor2D_show = function()
    {
        $('#Editor2D-Canvas').editor2D('clear');
        $('#Editor2D-Overlay').css('display', 'block');
	};

    /*
     * Hide the 2D-Editor
     */
    this.editor2D_hide = function()
    {
        $('#Editor2D-Overlay').css('display', 'none');
    };

    /*
     * Create new drawing area
     */
    this.editor2D_new = function()
    {
        $('#Editor2D-Canvas').editor2D('clear');
    }

    /*
     * Reset 2D-Editor view
     */
    this.editor2D_reset = function()
    {
        $('#Editor2D-Canvas').editor2D('resetView');
    }

    /*
     * Handle 2D-Editors 'modechanged' event
     */
    this.editor2D_onModeChanged = function()
    {
        $('#Editor2D-Overlay').css('display', 'none');
    };

    /*
     * Change 2D-Editors mode
     */
    this.editor2D_mode = function(mode)
    {
        this.editor2D_resetIcons();

        switch (mode)
        {
            case 0:
                $('#Editor2D-Icon-Pen').removeClass('Editor2D-Icon-Pen').addClass('Editor2D-Icon-Pen-Active');
                $('#Editor2D-Canvas').editor2D('changeMode', 0);
                break;
            case 1:
                $('#Editor2D-Icon-Pointer').removeClass('Editor2D-Icon-Pointer').addClass('Editor2D-Icon-Pointer-Active');
                $('#Editor2D-Canvas').editor2D('changeMode', 1);
                break
            case 2:
                $('#Editor2D-Icon-Eraser').removeClass('Editor2D-Icon-Eraser').addClass('Editor2D-Icon-Eraser-Active');
                $('#Editor2D-Canvas').editor2D('changeMode', 2);
                break;
            case 3:
                $('#Editor2D-Icon-Move').removeClass('Editor2D-Icon-Move').addClass('Editor2D-Icon-Move-Active');
                $('#Editor2D-Canvas').editor2D('changeMode', 3);
                break;
            case 4:
                $('#Editor2D-Icon-Zoom').removeClass('Editor2D-Icon-Zoom').addClass('Editor2D-Icon-Zoom-Active');
                $('#Editor2D-Canvas').editor2D('changeMode', 4);
                break;
        }
    };

    /*
     * Handle 2D-Editors 'modechanged' event
     */
    this.editor2D_create = function()
    {
        //Hide editor
        this.editor2D_hide();

        //Get points
        var points = $('#Editor2D-Canvas').editor2D('samplePoints');

        console.log(points.toString());

        primitiveParameterMap[primitivType].parameters.push({
            editorName: "-",
            x3domName: "crossSection",
            value: points.toString()
        });

        primitiveManager.addPrimitive(primitiveParameterMap[primitivType].x3domName,
            primitiveParameterMap[primitivType].parameters);
    };


    /*
     * Reset all 2D-Editor icon states
     */
    this.editor2D_resetIcons = function()
    {
        $('#Editor2D-Icon-Pen').removeClass('Editor2D-Icon-Pen-Active').addClass('Editor2D-Icon-Pen');
        $('#Editor2D-Icon-Pointer').removeClass('Editor2D-Icon-Pointer-Active').addClass('Editor2D-Icon-Pointer');
        $('#Editor2D-Icon-Eraser').removeClass('Editor2D-Icon-Eraser-Active').addClass('Editor2D-Icon-Eraser');
        $('#Editor2D-Icon-Move').removeClass('Editor2D-Icon-Move-Active').addClass('Editor2D-Icon-Move');
        $('#Editor2D-Icon-Zoom').removeClass('Editor2D-Icon-Zoom-Active').addClass('Editor2D-Icon-Zoom');
    };

    /*
     * Adds one primitive element to the left bar 
     * @returns (undefined)
     */
    function addLeftbarElement(img, name)
    {
        var divID = document.createElement("div");
        divID.setAttribute("id", name);
        divID.innerHTML = "<img src='"+img+"' width='100%' height='100%'>";
        divID.setAttribute("style",
            "width: 60px; height: 60px; margin: 5px; margin-left: 17px; border: solid 1px " +
                defColor + "; border-radius: 5px;");

        divID.setAttribute("onmouseover",
            "this.style.cursor='pointer'; this.style.border = 'solid 1px " + highlightColor +
                "'; document.getElementById('" + name + "_inner').style.color = '" + highlightColor + "';");
        divID.setAttribute("onmouseout",
            "this.style.cursor='pointer'; this.style.border = 'solid 1px " + defColor +
                "'; document.getElementById('" + name + "_inner').style.color = '" + highlightColor + "';");
        divID.setAttribute("onmouseleave",
            "this.style.cursor='pointer'; this.style.border = 'solid 1px " + defColor +
                "'; document.getElementById('" + name + "_inner').style.color = '" + highlightColor + "';");
        
        if (name == "Extrusion" || name == "Solid of Revolution")
        {
            divID.onclick = function() {
                that.editor2D_show();

                primitivType = name;
                // TODO; return somehow all required parameters for creation
                // (depending if Extrusion or SolidOfRevolution was clicked)
                // for now, just create a default object to test everything.
                //primitiveManager.addPrimitive(primitiveParameterMap[name].x3domName,
                                              //primitiveParameterMap[name].parameters);
            };
     	}
        else
        {
            divID.onclick = function() {
                primitiveManager.addPrimitive(primitiveParameterMap[name].x3domName, 
                                              primitiveParameterMap[name].parameters);};
        }

        var divIDinnen = document.createElement("div");
        divIDinnen.setAttribute("id", name+"_inner");
        divIDinnen.setAttribute("style", "color: " + highlightColor +
            "; margin-top: -40px; text-align: center;");
        divIDinnen.innerHTML = name;			

        divID.appendChild(divIDinnen);
        document.getElementById("divs").appendChild(divID);
    }


    
    /*
     * Clears all the properties on the right bar
     * @returns (undefined)
     */
    this.clearParameters = function(){
        var properties = document.getElementById("properties");
        for (var i = (properties.children.length - 1); i >= 0 ; i--){
            properties.removeChild(properties.children[i]);
        }
    };
    
    
    
    /*
     * Creates all given parameters and adds it to the right bar
     * @param {x3dom geometry} geometry where the parameters should be set
     * @returns (undefined)
     */
    this.createParameters = function(parameters){
        for (var i = 0; i < parameters.length; i++){
            addRightbarElement({param: parameters[i], id: "property_" + i, primitive: parameters.Primitive});
        }
    };
    



    /*
     * Adds one parameter value to the right bar
     * TODO: only works for SFFloat
     * @param {object} object includes editorName and x3domName of parameter and
     * the value that should be set 
     * @returns (Null)
     */
    function addRightbarElement(object)
    {
        // THINKABOUTME: better add 'editable' flag
        if (object.param.editorName == "-")
            return;

        var divID = document.createElement("div");	
        divID.setAttribute("style", "margin-top: 10px;");

        var newLabel = document.createElement("label");
        newLabel.for = object.id;
        newLabel.innerHTML = object.param.editorName;

        var newInput = document.createElement("input");
        newInput.setAttribute("style", "width: 112px;");
        newInput.id = object.id;
        newInput.value= object.param.value;

        divID.appendChild(newLabel);
        divID.appendChild(newInput);
        document.getElementById("properties").appendChild(divID);

        $("#"+object.id).spinner({
            step: 0.1,
            stop:function(e,ui) {
                object.primitive.setAttribute(object.param.x3domName,
                                              document.getElementById(object.id).value);
                object.param.value = document.getElementById(object.id).value;

                var ref = object.primitive.parentNode.parentNode.parentNode.id; // uahh
                primitiveManager.highlight(ref, true);
            }
        });
    }
    
    
    
    /*
     * Sets all parameters of a material to the material editor on the right bar
     * @param {material} material includes diffuse, specular, emissive color, 
     * shininess and transparency
     * @returns (Null)
     */
    this.setMaterial = function(material){
        if ($("#accordeon-oben").accordion("option", "active") === 1){
            var colorfield = document.getElementById("diffuse");
            var color = material.getAttribute("diffuseColor");
            colorfield.focus();
            farbtasticPicker.setColor(color);

            colorfield = document.getElementById("specular");
            color = material.getAttribute("specularColor");
            colorfield.focus();
            farbtasticPicker.setColor(color);

            colorfield = document.getElementById("emissive");
            color = material.getAttribute("emissiveColor");
            colorfield.focus();
            farbtasticPicker.setColor(color);

            document.getElementById("transparency").value = material.getAttribute("transparency");
            document.getElementById("shininess").value = material.getAttribute("shininess");

            document.getElementById("diffuse").focus();
        }
    };
   

    
    // Starts initialization of all ui components
    var that = this;
}
