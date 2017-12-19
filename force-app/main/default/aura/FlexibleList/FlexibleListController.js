({
	doInit : function(component, event, helper) {
        var obj = component.get("v.sObjectName");
        
        if (!obj || !obj.length) {
            return;
        }
        
		//build the query
		var soql = component.get("v.customSoql");
        if ((!soql || (soql && soql.length === 0))) {
            var dFields = component.get("v.displayFields");
            var aFields = component.get("v.additionalFields");
            var fields = dFields;
            if (aFields && aFields !== "") {
                fields += "," + aFields;
            }
            
            var fieldsList = helper.CSL2Array(fields);
            if (fieldsList.indexOf("Id") < 0) {
                fieldsList.push("Id");
            }
            if (fieldsList.indexOf("Name") < 0) {
                fieldsList.push("Name");
            }
            fields = fieldsList.join();
            
            soql = "select " + fields
            	+ " from " + obj;

            var whereClause = component.get("v.whereClause");
            if ((whereClause && whereClause.length > 0)) {
                soql = soql + " where " + whereClause;
            }

            soql = soql + " limit " + component.get("v.limitRecords");
        }

		helper.query(component, soql);
		helper.describe(component, obj);
	},
    
    loadComponents : function (component) {
        // create the child components
        var results = component.get("v.results");
        
        results.forEach(function (item) {
            $A.createComponent(
                component.get("v.listItemComponent"),
                {
                    "aura:id": "flexibleListItem", // to find the components later
                    "sObjectName": component.get("v.sObjectName"),
                    "record": item,
                    "recordId": item.Id,
                    "iconCategoryName": component.get("v.iconCategoryName")
                },
                function (newCmp, status) { //,errorMessage
                    //Add the new component to the listItem array
                    if (component.isValid() && status === "SUCCESS") {
                        // add the component to the placeholder
                        var listItemHolder = component.get("v.flexibleListItems");
                        listItemHolder.push(newCmp);
                        component.set("v.flexibleListItems", listItemHolder);
                        
                        // ensure these are set at least once
                        newCmp.set("v.displayFieldsArray", component.get("v.displayFieldsArray"));
                        newCmp.set("v.additionalFieldsArray", component.get("v.additionalFieldsArray"));
                    } else if (status === "ERROR") {
                        //console.log("CreateComponent Error: " + errorMessage);
                    }
                }
            );
        });
    },
    
    loadDisplayFields : function (component) {
        // due to W-2529066, this doesn't work
        //var listItems = component.find("flexibleListItem");
        var listItems = component.get("v.flexibleListItems");
        
        if (listItems) {
            listItems.forEach(function (listItem) {
                listItem.set("v.displayFieldsArray", component.get("v.displayFieldsArray"));
            });
        }
    },
    
    loadAdditionalFields : function (component) {
        // due to W-2529066, this doesn't work
        //var listItems = component.find("flexibleListItem");
        var listItems = component.get("v.flexibleListItems");
        
        if (listItems) {
            listItems.forEach(function (listItem) {
                listItem.set("v.additionalFieldsArray", component.get("v.additionalFieldsArray"));
            });
        }
    },
    
    navToList : function (component, event, helper) {
        var objtype = component.get("v.sObjectName");
        var listviewname = component.get("v.listViewName");

        helper.navToList(component, objtype, listviewname);
    }
})