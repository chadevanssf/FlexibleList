({
	doInit : function(component, event, helper) {
		//build the query
		var soql = component.get("v.customSoql");
        if ((!soql || (soql && soql.length === 0))) {
            var dFields = component.get("v.displayFields");
            var aFields = component.get("v.additionalFields");
            var fields = dFields;
            if (aFields && aFields !== "") {
                fields += "," + aFields;
            }
            
            soql = "select Id,Name," + fields
            	+ " from " + component.get("v.objectName");

            var whereClause = component.get("v.whereClause");
            if ((whereClause && whereClause.length > 0)) {
                soql = soql + " where " + whereClause;
            }

            soql = soql + " limit " + component.get("v.limitRecords");
        }

		helper.query(component, soql);
		helper.describe(component, component.get("v.objectName"));
	},
    
    loadComponents : function (component) {
        // create the child components
        var results = component.get("v.results");
        
        results.forEach(function (item) {
            $A.createComponent(
                component.get("v.listItemComponent"),
                {
                    "aura:id": "flexibleListItem", // to find the components later
                    "objectName": component.get("v.objectName"),
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
        var objtype = component.get("v.objectName");
        var listviewname = component.get("v.listViewName");

        helper.navToList(component, objtype, listviewname);
    }
})