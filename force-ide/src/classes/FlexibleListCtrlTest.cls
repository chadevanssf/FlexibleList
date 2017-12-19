@isTest
private class FlexibleListCtrlTest {
	@isTest static void testQuery() {
		FlexibleListCtrl.query('select id from case');
	}
	
	@isTest static void testGetListView() {
		ListView lv1 = FlexibleListCtrl.getListView('account', 'no such list');
        system.assertEquals(lv1, null);
        
		ListView lv2 = FlexibleListCtrl.getListView('contact', 'All Contacts');
        system.assertNotEquals(lv2, null);
	}
    
	@isTest static void testDescribe() {
		FlexibleListCtrl.describe('Case');
	}
}