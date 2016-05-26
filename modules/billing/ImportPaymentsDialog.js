GO.billing.ImportPaymentsDialog = Ext.extend(GO.Window,{
	title:GO.billing.lang.importPayments,
	layout:'card',
	maximizable:true,
	collapsible:true,
	width:1000,
	height:500,
	initComponent:function(){
		
		this.uploadFile = new GO.form.UploadFile({
			inputName : 'importfile',
			max:1  				
		});		
		
		this.formPanel = new Ext.form.FormPanel({
			fileUpload:true,
			cls:'go-form-panel',
			url:GO.url('billing/order/mt940'),
			items:[{
					xtype:'htmlcomponent',
					html:GO.billing.lang.importPaymentsSelectFile
				},
				this.uploadFile],
			buttons:[{
					text:GO.lang.cmdContinue,
					handler:function(){
						this.submitForm();
					},
					scope:this
			}]
		});
		
		this.gridPanel = new GO.billing.ImportPaymentsGrid();
		
		this.items=[this.formPanel, this.gridPanel];
		
		this.on('show',function(){this.getLayout().setActiveItem(this.formPanel);}, this);
	
		GO.billing.ImportPaymentsDialog.superclass.initComponent.call(this);
	},
	submitForm:function(){
		this.formPanel.form.submit({
			success:function(form, action){
				
				this.gridPanel.store.loadData(action.result);
				this.getLayout().setActiveItem(this.gridPanel);
			},
			failure:function(form, action){
				GO.errorDialog.show(action.result.feedback);
			},
			scope:this
		})
	}
})