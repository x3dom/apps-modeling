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
    this.primitiveParameterMap = createParameterMap("PrimitiveParameterMap.xml");
    // color picker component
    var farbtasticPicker = null;
    // specifies whether we are in "group mode"
    // this means that no single primitive, but a group is being transformed etc.
    var groupMode = false;

    var that = this;


    /*
     * Indicates whether the group mode is currently active (i.e., if we currently handle a group or a single primitive)
     * @returns {boolean}
     */
    this.groupModeActive = function(){
        return groupMode;
    };



    /*
     * Indicates whether the group mode is currently active (i.e., if we currently handle a group or a single primitive)
     * @returns {null}
     */
    this.toggleGroupMode = function(val){
        groupMode = val;

        if (val){
            primitiveManager.enableTransformationUI();
            primitiveManager.updateTransformUIFromCurrentObject();
            primitiveManager.highlightCurrentBoundingVolume(true);

            ui.RBAccordion.disable(true);
        }
        else
        {
            ui.RBAccordion.disable(false);
        }
    };



    /*
     * Initializes the UIComponent
     * @returns {Null}
     */
    this.initialize = function(){ 
        this.initializeUI();
        primitiveManager.setUI(that);
    };



    /*
     * Clamps value on min and max if required
     * @param {string} min minimal range of value
     * @param {string} max maximum range of value
     * @param {string} value param that should be clamped
     * @returns (clamped value)
     */
    function clamp(min, max, value) {
        min = parseFloat(min);
        max = parseFloat(max);
        if (min !== null && min !== NaN && value < min)
            return min;
        else if (max !== null && max !== NaN && value > max)
            return max;

        return value;
    }



    /*
     * Initializes all components of the UI of the editor
     * @returns {Null}
     */
    this.initializeUI = function (){

        that.TBHand = that.newImageProperty("ButtonHand", true);
        that.TBTranslate = that.newImageProperty("ButtonVerschieben", true);
        that.TBScale = that.newImageProperty("ButtonSkalieren", true);
        that.TBRotate = that.newImageProperty("ButtonRotieren", true);
        that.TBGroup = that.newImageProperty("ButtonGroup", true);
        that.TBUngroup = that.newImageProperty("ButtonUngroup", true);
        that.TBSnapToGrid = that.newImageProperty("ButtonSnapToGrid", true);
        that.TBSnap = that.newImageProperty("SnapPoints", true);
        that.TBViewpoints = that.newComboBoxProperty("Viewpoints", true);
       
        that.BBPrimName = that.newTextProperty("primitiveName", true);
        that.BBDelete = that.newImageProperty("deletePrimitive", true);
        that.BBClone = that.newImageProperty("clonePrimitiveGroup", true);

        that.BBTransX = that.newSpinnerProperty("amountX");
        $("#amountX").spinner({
            step: 0.1,
            min: 0.0,
            stop:function(e,ui){
                var clampedValue = clamp(that.BBTransX.min,
                    that.BBTransX.max,
                    that.BBTransX.get());
                if (clampedValue > 0 || clampedValue < 0)
                    that.BBTransX.set(clampedValue);

                primitiveManager.updatePrimitiveTransformFromUI();
            }
        });

        that.BBTransY = that.newSpinnerProperty("amountY");
        $("#amountY").spinner({
            step: 0.1,
            min: 0.0,
            stop:function(e,ui){
                var clampedValue = clamp(that.BBTransY.min,
                    that.BBTransY.max,
                    that.BBTransY.get());
                if (clampedValue > 0 || clampedValue < 0)
                    that.BBTransY.set(clampedValue);

                primitiveManager.updatePrimitiveTransformFromUI();
            }
        });

        that.BBTransZ = that.newSpinnerProperty("amountZ");
        $("#amountZ").spinner({
            step: 0.1,
            min: 0.0,
            stop:function(e,ui){
                var clampedValue = clamp(that.BBTransZ.min,
                    that.BBTransZ.max,
                    that.BBTransZ.get());
                if (clampedValue > 0 || clampedValue < 0)
                    that.BBTransZ.set(clampedValue);

                primitiveManager.updatePrimitiveTransformFromUI();
            }
        });
        
        
        for (var prim in that.primitiveParameterMap){
            this.addLeftbarElement(that.primitiveParameterMap[prim].image,
                              that.primitiveParameterMap[prim].editorName);
        }

        // scrollbar for primitives of left bar   		
        $('#divs').slimScroll({
                height: '99%',
                size: '10px',
                color: '#FFFFFF',
                position: 'left'
        });

        $('#refPnts').slimScroll({
            height: '99%',
            size: '10px',
            color: '#FFFFFF',
            position: 'left'
        });
        
        
        $('#properties').slimScroll({
            height: '100%',
            size: '10px',
            color: '#FFFFFF',
            position: 'right'
        });
        
        // Inititalization of the treeview
        $("#tree").dynatree({
            checkbox: true,
            selectMode: 3,
            clickFolderMode: 1,
            fx: { height: "toggle", duration: 500 },
            onFocus: function(node) {
                node.scheduleAction("cancel");
                
            },
            onSelect: function(select, node) { 
                function recursiveSelection(tempNode){
                    if (tempNode.data.isFolder){
                        for (var i = 0; i < tempNode.childList.length; i++){
                            recursiveSelection(tempNode.childList[i]);
                        }
                    }
                    else {
                        primitiveManager.setPrimitiveVisibility(tempNode.data.key, tempNode.isSelected());
                        if (tempNode.isActive()){
                            if (tempNode.isSelected())
                                primitiveManager.highlightCurrentObject(true);
                        }
                    }
                }
                
                recursiveSelection(node);
                if (!node.data.isFolder)
                    primitiveManager.setPrimitiveVisibility(node.data.key, select);
            },
            onBlur: function(node) {
                node.scheduleAction("cancel");
            },
            onActivate: function(node){
                if (node.isSelected()) {
                    that.treeViewer.activate(node.data.key);
                    primitiveManager.selectObject(node.data.key);
                }
            }
        });
        
        
        $("#snapToGrid").switchButton({
            checked: false,
            width: 20,
            height: 13,
            button_width: 10,
            on_label: 'Snap to grid',
            off_label: 'Snap off'
            }).change(function(){
        });
        
        
        
        $('#treeview').slimScroll({
            height: '100%',
            size: '10px',
            color: '#FFFFFF',
            position: 'right'
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
                        that.setMaterial(primitiveManager.getCurrentObject().getMaterial());
                    }
                }
        });
        
        
        $("#accordion_left").accordion({
                heightStyle: "content",
                collapsible: false,
                active: false,
                icons: iconsAccordion,
                activate: function(event, ui) {
                    
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
                      $(selected).onchange = function() {
                          //
                      };
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

        $("#DeletePlane").tooltip();
        $("#DeleteAxis").tooltip();
    };
    
    
    
    /*
     * Creates an array with primitives an their parameters, including
     * a mapping between the x3dom names and editor names and a default value
     * @param {string} file path to map source file (XML)
     * @returns {Array}
     */
    function createParameterMap(file){
       var xhttp = new XMLHttpRequest();
       xhttp.open("GET", file, false);
       xhttp.send();
       
       var xmlDoc = xhttp.responseXML.childNodes[0];
       var primitives = xmlDoc.getElementsByTagName("Primitive");
       
       var primitiveParameterMap = [];
       for (var i = 0; i < primitives.length; i++){
            var currPrim = primitives[i];
            primitiveParameterMap[currPrim.getAttribute("editorName")] =
            { editorName: currPrim.getAttribute("editorName"),
              x3domName: currPrim.getAttribute("x3domName"),
              image: currPrim.getAttribute("image"),
              parameters : [] };

            var parameters = currPrim.getElementsByTagName("Parameter");
            for (var j = 0; j < parameters.length; j++){
                var currParam = parameters[j];
                primitiveParameterMap[currPrim.getAttribute("editorName")].parameters.push(
                { editorName: currParam.getAttribute("editorName"),
                  x3domName: currParam.getAttribute("x3domName"),
                  value: currParam.textContent,
                  min: currParam.getAttribute("min"),
                  max: currParam.getAttribute("max"),
                  type: (currParam.getAttribute("type") !== null) ? currParam.getAttribute("type") : "spinner",
                  render: (currParam.getAttribute("render") !== null) ? currParam.getAttribute("render") : "true",
                  step: (currParam.getAttribute("step") !== null) ? currParam.getAttribute("step") :
                                            (currParam.getAttribute("type") !== "angle") ? 0.1 : 1.0
                } );
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
            return $("#" + id).spinner("value");
        };
        
        obj.set = function(value){
            $("#" + id).spinner("value", value);
        };
        
        obj.disable = function(bool){
            $("#" + id).spinner( "option", "disabled", bool );
        };

        obj.step = function(step){
            if (typeof step === 'undefined')
            {
                return $("#" + id).spinner( "option", "step");
            }
            else
            {
                $("#" + id).spinner( "option", "step", step );
            }
        };
        
        return obj;
    };
    
    
    
    /*
     * Creates a new text field property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newTextProperty = function(id, toolTip){
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
        
        if (toolTip)
            $("#"+id).tooltip();
        
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
    this.newImageProperty = function(id, toolTip){
        
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
        
        if (toolTip)
            $("#"+id).tooltip();
        
        return obj;
    };
    
    
    
    /*
     * Creates a new combobox property with getter and setter of function
     * @param {id} identifier in the html document where the value should be get/set
     * @returns {property with getter and setter}
     */
    this.newComboBoxProperty = function(id, toolTip){
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
        
        if (toolTip)
            $("#"+id).tooltip();
        
        return obj;
    };
    
    

    /*
     * Toggeling fade function of the left toolbar
     */
    this.fadeLeft = function(){
       if (fadeSwitch[0] === 0){
           $("#Links").animate(
           {
               left: "-177px"
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
               right: "-190px"
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
       
    
    var statisticsTick = false;
    /*
     * Show or hide stats
     */
    this.showStatistik = function(htmlID)
    {
        statisticsTick = !statisticsTick;
        if (statisticsTick){
            document.getElementById(htmlID+"_tick").style.visibility = "visible";
        }
        else {
            document.getElementById(htmlID+"_tick").style.visibility = "hidden";
        }
        document.getElementById("x3d").runtime.statistics();
    };


    var infoTick = false;
    /*
     * Show or hide debug log
     */
    this.showInfo = function(htmlID)
    {
        infoTick = !infoTick;
        if (infoTick){
            document.getElementById(htmlID+"_tick").style.visibility = "visible";
        }
        else {
            document.getElementById(htmlID+"_tick").style.visibility = "hidden";
        }
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
         * Adds one primitive element to the left bar
         * @returns (undefined)
         */
        this.addLeftbarElement = function(img, name) {
            var divID = document.createElement("div");
            divID.setAttribute("id", name);

            divID.setAttribute('draggable', "true");
            divID.ondragstart = controller.drag;

            divID.innerHTML = "<img src='" + img + "' id='icon_" + name + "' width='100%' height='100%'>";
            divID.setAttribute("style",
                "float:left; width: 60px; height: 60px; margin: 5px; padding: 0px; border: solid 1px " +
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


            divID.onclick = function () {
                primitiveManager.addPrimitive(that.primitiveParameterMap[name].x3domName,
                    that.primitiveParameterMap[name].parameters);
            };

            var divIDinnen = document.createElement("div");
            divIDinnen.setAttribute("id", name + "_inner");
            divIDinnen.setAttribute("style", "color: " + highlightColor + "; margin-top: " +
                (name.length > 20 ? "-50" : "-40") + "px; text-align: center;");    // hack
            divIDinnen.innerHTML = name;

            divID.appendChild(divIDinnen);
            document.getElementById("divs").appendChild(divID);
        };


        /*
         * Clears all the properties on the right bar
         * @returns (undefined)
         */
        this.clearParameters = function () {
            var properties = document.getElementById("properties");
            for (var i = (properties.children.length - 1); i >= 0; i--) {
                properties.removeChild(properties.children[i]);
            }
        };


        /*
         * Creates all given parameters and adds it to the right bar
         * @param {x3dom geometry} geometry where the parameters should be set
         * @returns (undefined)
         */
        this.createParameters = function (parameters, prim) {
            for (var i = 0; i < parameters.length; i++) {
                this.addRightbarElement({param: parameters[i],
                                         id:    "property_" + i,
                                         primitive: prim});
            }
        };


        /*
         * Adds one parameter value to the right bar
         * @param {object} object includes editorName and x3domName of parameter and
         * the value that should be set
         * @returns (Null)
         */
        this.addRightbarElement = function(object) {
            if (object.param.render !== null && object.param.render === "false")
                return;

            var divID = document.createElement("div");
            divID.setAttribute("style", "float: left; margin-bottom: 10px; border-bottom: 1px solid gray; padding-bottom: 10px;");
            if (object.param.type === "bool")
                boolProperty();
            else if (object.param.type === "vec2")
                vecProperty(2);
            else if (object.param.type === "vec3")
                vecProperty(3);
            else
                normalProperty();


            /*
             * Clamps value on min and max if required
             * @param {string} min minimal range of value
             * @param {string} max maximum range of value
             * @param {string} value param that should be clamped
             * @returns (clamped value)
             */
            function clamp(min, max, value) {
                min = parseFloat(min);
                max = parseFloat(max);
                if (min !== null && value < min)
                    return min;
                else if (max !== null && value > max)
                    return max;

                return value;
            }


            function normalProperty() {
                var newLabel = document.createElement("label");
                newLabel.setAttribute("style", "float: left; width: 100%; margin-bottom: 5px;");
                newLabel.innerHTML = object.param.editorName;

                var newInput = document.createElement("input");
                newInput.setAttribute("style", "float: left; width: 100%;");
                newInput.id = object.id;
                newInput.value = object.param.value;

                divID.appendChild(newLabel);
                divID.appendChild(newInput);
                document.getElementById("properties").appendChild(divID);

                $("#" + object.id).spinner({
                    step: object.param.step,
                    min: object.param.min,
                    max: object.param.max,
                    stop: function (e, ui) {
                        if (object.param.type === "angle") {
                            object.primitive.setAttribute(object.param.x3domName,
                                clamp(object.param.min, object.param.max, document.getElementById(object.id).value) * Math.PI / 180);
                        }
                        else {
                            object.primitive.setAttribute(object.param.x3domName,
                                clamp(object.param.min, object.param.max, document.getElementById(object.id).value));
                        }

                        object.param.value = clamp(object.param.min, object.param.max, document.getElementById(object.id).value);
                        document.getElementById(object.id).value = object.param.value;
                        var ref = object.primitive.parentNode.parentNode.parentNode.id; // uahh
                        primitiveManager.highlightCurrentObject(true);
                    }
                });
            }


            function boolProperty() {
                var newLabel = document.createElement("label");
                newLabel.setAttribute("style", "float: left; width: 100%; margin-bottom: 5px;");
                newLabel.innerHTML = object.param.editorName;

                var newInput = document.createElement("input");
                newInput.setAttribute("style", "float: left; width: 100%;");
                newInput.id = object.id;
                newInput.value = object.param.value;

                divID.appendChild(newLabel);
                divID.appendChild(newInput);
                document.getElementById("properties").appendChild(divID);

                $("#" + object.id).switchButton({
                    checked: object.param.value,
                    width: 58,
                    height: 15,
                    button_width: 29,
                    on_label: 'true',
                    off_label: 'false'
                })
                    .change(function () {
                        object.primitive.setAttribute(object.param.x3domName,
                            document.getElementById(object.id).checked);
                        object.param.value = document.getElementById(object.id).checked;

                        // fake param HACK, field obviously doesn't exist
                        if (object.param.x3domName == "positive") {
                            var material = primitiveManager.getMaterialFor(object.primitive);
                            primitiveManager.highlightCurrentObject(false);

                            if (!object.param.value)
                                material.setAttribute("diffuseColor", "#E77F65");
                            else
                                material.setAttribute("diffuseColor", "#3F7EBD");
                            //farbtasticPicker.setColor(material.getAttribute("diffuseColor"));
                            console.log(material.getAttribute("diffuseColor"));
                        }
                    });
            }


            function vecProperty(vecSize) {
                var labels = ["X:", "Y:", "Z:"];

                var newLabel = document.createElement("label");
                newLabel.setAttribute("style", "float: left; margin-bottom: 5px; width: 100%;");
                newLabel.innerHTML = object.param.editorName;
                divID.appendChild(newLabel);

                for (var i = 0; i < vecSize; i++) {
                    var outerDiv = document.createElement("div");
                    outerDiv.setAttribute("style", "float: left; margin-bottom: 5px;");

                    var descLabel = document.createElement("label");
                    descLabel.setAttribute("style", "float: left; width: 25px;");
                    descLabel.innerHTML = labels[i];
                    divID.appendChild(descLabel);

                    var newInput = document.createElement("input");
                    newInput.setAttribute("style", "float: left; width: 80px;");
                    newInput.id = object.id + "_" + i;
                    newInput.value = object.param.value.split(",")[i];
                    outerDiv.appendChild(descLabel);
                    outerDiv.appendChild(newInput);
                    divID.appendChild(outerDiv);
                }

                document.getElementById("properties").appendChild(divID);

                for (var i = 0; i < vecSize; i++) {
                    $("#" + object.id + "_" + i).spinner({
                        step: object.param.step,
                        min: object.param.min,
                        max: object.param.max,
                        stop: function (e, ui) {
                            object.primitive.setAttribute(object.param.x3domName,
                                clamp(object.param.min, object.param.max, document.getElementById(object.id + "_0").value) + "," +
                                    clamp(object.param.min, object.param.max, document.getElementById(object.id + "_1").value) + "," +
                                    clamp(object.param.min, object.param.max, document.getElementById(object.id + "_2").value));
                            object.param.value = clamp(object.param.min, object.param.max, document.getElementById(object.id + "_0").value) + "," +
                                clamp(object.param.min, object.param.max, document.getElementById(object.id + "_1").value) + "," +
                                clamp(object.param.min, object.param.max, document.getElementById(object.id + "_2").value);

                            document.getElementById(object.id + "_0").value = clamp(object.param.min, object.param.max, document.getElementById(object.id + "_0").value);
                            document.getElementById(object.id + "_1").value = clamp(object.param.min, object.param.max, document.getElementById(object.id + "_1").value);
                            document.getElementById(object.id + "_2").value = clamp(object.param.min, object.param.max, document.getElementById(object.id + "_2").value);

                            var ref = object.primitive.parentNode.parentNode.parentNode.id; // uahh
                            primitiveManager.highlightCurrentObject(true);
                        }
                    });
                }
            }
        };


        /*
         * Sets all parameters of a material to the material editor on the right bar
         * @param {material} material includes diffuse, specular, emissive color,
         * shininess and transparency
         * @returns (Null)
         */
        this.setMaterial = function (material) {
            if ($("#accordeon-oben").accordion("option", "active") === 1) {
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


        this.treeViewer = {};


        this.treeViewer.addPrimitive = function (id, text) {
            // This is how we would add tree nodes programatically
            var rootNode = $("#tree").dynatree("getRoot");

            rootNode.addChild({
                title: text,
                key: id,
                //icon: "primitives.jpg",
                select: true,
                activate: true
            });
        };


        this.treeViewer.addGroup = function (id, text) {
            // This is how we would add tree nodes programatically
            var rootNode = $("#tree").dynatree("getRoot");
            var childNode = rootNode.addChild({
                title: text,
                key: id,
                isFolder: true,
                select: true,
                selectMode: 3,
                expand: true
            });
            rootNode.addChild(childNode);
        };


        this.treeViewer.moveExistableNodeToGroup = function (node, group) {
            node = that.treeViewer.getNode(node);
            group = that.treeViewer.getNode(group);
            var title = node.data.title;
            var id = node.data.key;
            var select = node.data.select;
            var icon = node.data.icon;
            that.treeViewer.removeNode(id);
            group.addChild({
                title: title,
                key: id,
                icon: icon,
                select: select,
                activate: true
            });
        };


        this.treeViewer.getNode = function (id) {
            return $("#tree").dynatree("getTree").getNodeByKey(id);
        };


        this.treeViewer.removeNode = function (id) {
            that.treeViewer.getNode(id).remove();
        };


        this.treeViewer.rename = function (id, name) {
            var node = that.treeViewer.getNode(id);
            node.data.title = name;
            node.render();
        };


        this.treeViewer.activate = function (id) {
            // Get the DynaTree object instance:
            var tree = $("#tree").dynatree("getTree");
            // Use it's class methods:
            tree.activateKey(id);
        };
}
