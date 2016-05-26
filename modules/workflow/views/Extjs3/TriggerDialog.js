GO.workflow.TriggerDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'trigger',
			title:GO.workflow.lang.trigger,
			titleField:'name',
			formControllerUrl: 'workflow/trigger'
		});
		
		GO.workflow.TriggerDialog.superclass.initComponent.call(this);	
	},
	  
	buildForm : function () {

		this.selectProcess = new GO.form.ComboBox({
				fieldLabel: GO.workflow.lang.triggerProcess_id,
				hiddenName:'process_id',
        anchor:'100%',
        value: 1,
        valueField:'id',
        displayField:'name',
        store: GO.workflow.processStore,
        mode:'remote',
        triggerAction:'all',
        editable:true,
        selectOnFocus:true,
        forceSelection:true,
        allowBlank:false,
        emptyText:GO.lang.strPleaseSelect
			});


		this.propertiesPanel = new Ext.Panel({
			title:GO.lang['strProperties'],			
			cls:'go-form-panel',
			layout:'form',
			items:[
				{
					xtype: 'textfield',
					name: 'model_type_id',
					width:300,
					anchor: '100%',
					maxLength: 100,
					allowBlank:false,
					fieldLabel: GO.workflow.lang.triggerModel_type_id
				},{
					xtype: 'textfield',
					name: 'model_attribute',
					width:300,
					anchor: '100%',
					maxLength: 100,
					allowBlank:false,
					fieldLabel: GO.workflow.lang.triggerModel_attribute
				},{
					xtype: 'textfield',
					name: 'model_attribute_value',
					width:300,
					anchor: '100%',
					maxLength: 100,
					allowBlank:false,
					fieldLabel: GO.workflow.lang.triggerModel_attribute_value
				},
				this.selectProcess
			]				
		});
		
    this.addPanel(this.propertiesPanel);
	}
});