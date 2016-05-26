GO.workflow.WorkflowDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'workflow',
			title:GO.workflow.lang.workflow,
			formControllerUrl: 'workflow/workflow'
		});
		
		GO.workflow.WorkflowDialog.superclass.initComponent.call(this);	
	},
	  
	buildForm : function () {
	
		this.propertiesPanel = new Ext.Panel({
			title:GO.lang['strProperties'],			
			cls:'go-form-panel',
			layout:'form',
			items:[]				
		});

    this.addPanel(this.propertiesPanel);
	}
});