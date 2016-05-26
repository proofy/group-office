GO.workflow.ProcessDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'process',
			title:GO.workflow.lang.process,
			titleField:'name',
			formControllerUrl: 'workflow/process',
			height:600
		});
		
		GO.workflow.ProcessDialog.superclass.initComponent.call(this);	
	},
	  
	buildForm : function () {
	
		this.stepGrid = new GO.workflow.StepGrid();
	
		this.propertiesPanel = new Ext.Panel({
			title:GO.lang['strProperties'],			
			cls:'go-form-panel',
			layout:'form',
			items:[
				{
					xtype: 'textfield',
					name: 'name',
					width:300,
					anchor: '100%',
					maxLength: 100,
					allowBlank:false,
					fieldLabel: GO.lang.strName
				},
				this.selectUser = new GO.form.SelectUser({
					fieldLabel : GO.lang.strUser,
					disabled : !GO.settings.has_admin_permission,
					anchor : '100%'
				})
			]				
		});
		
    this.addPanel(this.propertiesPanel);
		this.addPanel(this.stepGrid, 'process_id');
		this.addPermissionsPanel(new GO.grid.PermissionsPanel());
	}
});