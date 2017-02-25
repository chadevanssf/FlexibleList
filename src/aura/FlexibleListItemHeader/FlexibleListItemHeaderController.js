({
	navToRecord : function(component, event) {
    	//console.log("nav invoked, get id first");

    	//console.log(event.target);
    	var recordId = event.target.dataset.recordid;
    	//console.log(recordId);

    	var navEvt = $A.get("e.force:navigateToSObject");
	    navEvt.setParams({
	      "recordId": recordId
	    });
	    navEvt.fire();
    }
})