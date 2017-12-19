global class EntityPickList extends VisualEditor.DynamicPickList {
    global override VisualEditor.DataRow getDefaultValue() {
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('Account', 'Account');
        return defaultValue;
    }
    
    global override VisualEditor.DynamicPickListRows getValues() {
        List<Schema.SObjectType> gd = Schema.getGlobalDescribe().Values(); 
        
        VisualEditor.DynamicPickListRows  objRows = new VisualEditor.DynamicPickListRows();
        
        for(Schema.SObjectType f : gd)
        {
            String objName = f.getDescribe().getName();
            objRows.addRow(new VisualEditor.DataRow(objName, objName));
        }
        return objRows;
    }
}