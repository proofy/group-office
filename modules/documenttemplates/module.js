GO.newMenuItems.push({
	text: GO.documenttemplates.lang.emailFromTemplate,
//	iconCls: 'go-model-icon-GO_Notes_Model_Note',
	handler:function(item, e){		
		if(!GO.documenttemplates.emailTemplateDialog){
			GO.documenttemplates.emailTemplateDialog = new GO.documenttemplates.EmailTemplateDialog();
		}

		GO.documenttemplates.emailTemplateDialog.on('create', function(){
			this.fireEvent('create', this);
		}, this)

		GO.documenttemplates.emailTemplateDialog.show(this);
	}
});