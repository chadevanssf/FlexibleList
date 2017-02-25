global class LightningComponentPickList extends VisualEditor.DynamicPickList {
    global override VisualEditor.DataRow getDefaultValue() {
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('c:FlexibleListItem', 'c:FlexibleListItem');
        return defaultValue;
    }
    
    global override VisualEditor.DynamicPickListRows getValues() {
        List <AuraDefinitionBundleInfo> lightningComponents = 
            [SELECT DurableId FROM AuraDefinitionBundleInfo ORDER BY DurableId];
        VisualEditor.DynamicPickListRows  objRows = new VisualEditor.DynamicPickListRows();
        
        for(AuraDefinitionBundleInfo lc : lightningComponents) {
            String objName = lc.DurableId.replace('.',':');
            VisualEditor.DataRow dr = new VisualEditor.DataRow(objName, objName); // label, value
            objRows.addRow(dr);
        }
        return objRows;
    }
}