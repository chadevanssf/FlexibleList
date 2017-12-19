global class FlexibleListCtrl {
    @AuraEnabled
    global static ListView getListView(String objtype, String listname) {
        List <ListView> listviews = 
            [SELECT Id, Name FROM ListView 
             WHERE SobjectType = :objtype AND Name=:listname
            LIMIT 1];
        if (listviews.size() > 0) {
        	// Perform isAccessible() check here
            return listviews.get(0);
        }
        
        return null;
    }

    @AuraEnabled
    global static string query(String soql) {
        return Ora.queryJSON(soql);
    }
    
    @AuraEnabled
    global static String describe(String objtype) {
        return Ora.describe(objtype);
    }
}