
GO.leavedays.CreditTypeDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		Ext.apply(this, {
			title: GO.leavedays.lang['type'],
			height: 220,
			resizable: false,
      formControllerUrl: 'leavedays/creditType',
//			jsonPost:true,
			updateAction: 'update',
			createAction: 'create'
		});
		
		GO.leavedays.CreditTypeDialog.superclass.initComponent.call(this);	
	},
	
	buildForm: function() {
		
		
		this.typeForm = new Ext.Panel({
			cls:'go-form-panel',
			layout:'form',
			items: [
				this.nameField = new Ext.form.TextField({
					name: 'name',
					width: 300,
					anchor: '100%',
					maxLength: 100,
					allowBlank: false,
					fieldLabel: GO.lang['name']
				}),
				this.descriptionField = new Ext.form.TextArea({
					name: 'description',
					width: 300,
					anchor: '100%',
					fieldLabel: GO.lang['description']
				}),
				this.creditDoesntExpiredField = new Ext.ux.form.XCheckbox({
					name: 'credit_doesnt_expired',
					width: 300,
					anchor: '100%',
					maxLength: 100,
					boxLabel: GO.leavedays.lang['credit_doesnt_expired']
				})
				
			
		
			]
		});
		
		this.addPanel(this.typeForm);
		
	}
	
	
	
});
