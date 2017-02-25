({
    CSL2Array: function (CSL) {
        try {
            var outputArray = CSL.split(",");
            for (var i = 0; i < outputArray.length; i+=1) {
                outputArray[i] = outputArray[i].trim();
            }
            return outputArray;
        } catch(err) {
            //console.log("failed at building CSL array");
            //intended to handle the "CSL is null scenario"
            return [];
        }
    },

    query: function (component, soql) {
        var action = component.get("c.query");
        action.setParams({
            "soql" : soql
        });
        action.setCallback(self, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var records = JSON.parse(response.getReturnValue());
                component.set("v.results", records);
            }
        });
        $A.enqueueAction(action);
    },

    describe: function (component, objectName) {
        var dFieldsList = this.CSL2Array(component.get("v.displayFields"));
        var aFieldsList = this.CSL2Array(component.get("v.additionalFields"));

        //	public static String describe(String objtype) {
        var selfDescribe = component.get("c.describe");
        selfDescribe.setStorable();
        selfDescribe.setParams({
            "objtype" : objectName
        });
        selfDescribe.setCallback(this, function (a){
            var dFieldsArray=[];
            var aFieldsArray=[];

            var output = JSON.parse(a.getReturnValue());
            component.set("v.pluralLabel", output.objectProperties.pluralLabel);
            var title = component.get("v.title");
            if (!title || (title && title.length === 0)) {
                component.set("v.title", output.objectProperties.pluralLabel)
            }
            
            this.processSelfFields(output, dFieldsList, dFieldsArray);
            this.processSelfFields(output, aFieldsList, aFieldsArray);

            //first (and possibly only) setting. Will update if parent fields found
            component.set("v.displayFieldsArray", dFieldsArray);
            component.set("v.additionalFieldsArray", aFieldsArray);

            //related objects (up one level only!)
            dFieldsList.forEach(function (relValue) {
                if (relValue.includes(".")) {
                    var parentDesribe = component.get("c.describe");
                    var parentObjectName = relValue.split(".")[0].replace("__r", "__c"); //replaces if custom
                    //do a describe for that object
                    parentDesribe.setStorable();
                    parentDesribe.setParams({
                        "objtype" : parentObjectName
                    });
                    parentDesribe.setCallback(this, function (response) {
                        var state = response.getState();
                        if (component.isValid() && state === "SUCCESS") {
                            var fieldsArray = component.get("v.displayFieldsArray");
                            var relatedOutput = JSON.parse(response.getReturnValue());
                            //get the describe for that field
                            var parentName = relValue.split(".")[1];
                            
                            // find the new field describe
                            var newParentResult = null;
                            for (var pr = 0; pr < relatedOutput.fields.length; pr+=1) {
                                var parentResult = relatedOutput.fields[pr];
                                if (parentResult.name === parentName) {
                                    newParentResult = parentResult;
                                    break;
                                }
                            }
                            
                            //Let's find where to put the new field describe
                            var fieldIndex = -1;
                            for(var fi = 0; fi < fieldsArray.length; fi+=1) {
                                if (fieldsArray[fi].describe === relValue) {
                                    fieldIndex = fi;
                                    break;
                                }
                            }
                            if (fieldIndex >= 0) {
                                fieldsArray[fieldIndex].describe = newParentResult;
                                component.set("v.displayFieldsArray", fieldsArray);
                            }
                        }
                    });

                    $A.enqueueAction(parentDesribe);
                }
            });
            aFieldsList.forEach(function (relValue) {
                if (relValue.includes(".")) {
                    var parentDesribe = component.get("c.describe");
                    var parentObjectName = relValue.split(".")[0].replace("__r", "__c"); //replaces if custom
                    //do a describe for that object
                    parentDesribe.setStorable();
                    parentDesribe.setParams({
                        "objtype" : parentObjectName
                    });
                    parentDesribe.setCallback(this, function (response) {
                        var state = response.getState();
                        if (component.isValid() && state === "SUCCESS") {
                            var fieldsArray = component.get("v.additionalFieldsArray");
                            var relatedOutput = JSON.parse(response.getReturnValue());
                            //get the describe for that field
                            var parentName = relValue.split(".")[1];
                            
                            // find the new field describe
                            var newParentResult = null;
                            for (var pr = 0; pr < relatedOutput.fields.length; pr+=1) {
                                var parentResult = relatedOutput.fields[pr];
                                if (parentResult.name === parentName) {
                                    newParentResult = parentResult;
                                    break;
                                }
                            }
                            
                            //Let's find where to put the new field describe
                            var fieldIndex = -1;
                            for(var fi = 0; fi < fieldsArray.length; fi+=1) {
                                if (fieldsArray[fi].describe === relValue) {
                                    fieldIndex = fi;
                                    break;
                                }
                            }
                            if (fieldIndex >= 0) {
                                fieldsArray[fieldIndex].describe = newParentResult;
                                component.set("v.additionalFieldsArray", fieldsArray);
                            }
                        }
                    });

                    $A.enqueueAction(parentDesribe);
                }
            });
        });
        $A.enqueueAction(selfDescribe);
    },
    
    processSelfFields: function(output, fieldsArray, resultArray) {
        //now, only get the ones that are in the displayfields
        for (var i = 0; i < fieldsArray.length; i+=1) {
            var currValue = fieldsArray[i];
            //check for reference dot
            if (!currValue.includes(".")){
                //just a normal, non-reference field
                var newResult = null;
                for (var f = 0; f < output.fields.length; f+=1) {
                    var resultLocal = output.fields[f];
                    if (resultLocal.name === currValue) {
                        newResult = resultLocal;
                        break;
                    }
                }
                var tempLocal = {
                    "describe" : newResult,
                    "original" : currValue,
                    "editable" : false,
                    "related"  : false
                };
                resultArray.push(tempLocal);
            } else { //it's a relationship/reference field
                resultArray.push({
                    "describe" : currValue, //placeholder, will update late with related object describe
                    "editable" : false,
                    "original" : currValue,
                    "related"  : true
                });
            }
        }
    },
    
    navToList: function (component, objtype, listname) {
        var action = component.get("c.getListView");
        action.setParams({
            "objtype" : objtype,
            "listname" : listname
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var listview = response.getReturnValue();
                var target = null;
                if (listview) {
                    target = listview.Id;
                }
                var navEvent = $A.get("e.force:navigateToList");
                navEvent.setParams({
                    "listViewId": target,
                    "listViewName": null,
                    "scope": objtype
                });
                navEvent.fire();
            }
        });
        $A.enqueueAction(action);
    }
})