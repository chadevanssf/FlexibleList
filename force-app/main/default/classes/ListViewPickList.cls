global class ListViewPickList extends VisualEditor.DynamicPickList {
    global override VisualEditor.DataRow getDefaultValue() {
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('All', 'All');
        return defaultValue;
    }
    
    global override VisualEditor.DynamicPickListRows getValues() {
        List <ListView> listViews = 
            [SELECT Id, Name, SObjectType FROM ListView
            ORDER BY SObjectType, Name];
        VisualEditor.DynamicPickListRows  objRows = new VisualEditor.DynamicPickListRows();
        
        for(ListView lv : listViews) {
            String objName = lv.SObjectType + ':' + lv.Name;
            VisualEditor.DataRow dr = new VisualEditor.DataRow(objName, objName); // label, value
            objRows.addRow(dr);
        }
        return objRows;
    }
}