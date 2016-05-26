GO.workflow.ModelDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'model',
			title:GO.workflow.lang.name,
			titleField:'process_id',
			formControllerUrl: 'workflow/model',
			enableApplyButton:false,
			height:140,
			width:400,
			formPanelConfig:{
				labelWidth:150
			}
		});
		
		GO.workflow.ModelDialog.superclass.initComponent.call(this);	
	},
	  
	buildForm : function () {

		this.selectProcess = new GO.form.ComboBox({
			fieldLabel: GO.workflow.lang.modelProcess_id,
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
//				{
//					xtype: 'textfield',
//					name: 'model_id',
//					width:300,
//					anchor: '100%',
//					maxLength: 100,
//					allowBlank:false,
//					fieldLabel: GO.workflow.lang.modelModel_id
//				},
//				{
//					xtype: 'textfield',
//					name: 'model_type_id',
//					width:300,
//					anchor: '100%',
//					maxLength: 100,
//					allowBlank:false,
//					fieldLabel: GO.workflow.lang.modelModel_type_id
//				},
				this.selectProcess,
//				{
//					xtype: 'textfield',
//					name: 'step_id',
//					width:300,
//					anchor: '100%',
//					maxLength: 100,
//					allowBlank:false,
//					fieldLabel: GO.workflow.lang.modelStep_id
//				},{
//					xtype: 'textfield',
//					name: 'ctime',
//					width:300,
//					anchor: '100%',
//					maxLength: 100,
//					allowBlank:false,
//					fieldLabel: GO.workflow.lang.modelCtime
//  			},
//				{
//					xtype: 'textfield',
//					name: 'due_time',
//					width:300,
//					anchor: '100%',
//					maxLength: 100,
//					allowBlank:false,
//					fieldLabel: GO.workflow.lang.modelDue_time	
//				},
				{
					xtype: 'numberfield',
					name: 'shift_due_time',
					width:100,					
					decimals:0,
					value:0,
					fieldLabel: GO.workflow.lang.modelShift_due_time
				}				
			]				
		});
		
    this.addPanel(this.propertiesPanel);
	}
});