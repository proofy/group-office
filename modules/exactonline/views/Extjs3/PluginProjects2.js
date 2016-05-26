GO.moduleManager.onModuleReady('projects2', function() {
	Ext.override(GO.projects2.IncomeDialog, {

		buildForm : GO.projects2.IncomeDialog.prototype.buildForm.createSequence(function(){
			
			this.exactInvoiceButton = new Ext.Button({
				text: GO.exactonline.lang['showExactInvoice'],
				handler: function() {
					window.open(GO.url('exactonline/oauth/callApi',{invoiceNumber:this.txtInvoiceNo.getValue(),'incomeId':this.remoteModelId,'toPDF':true}));
				},
				scope: this
			});

			// Get the index of the "Old" txtInvoiceNo input.
			var currentFieldIndex = this.propertiesPanel.items.indexOf(this.txtInvoiceNo);

			this.invoiceComp = new Ext.form.CompositeField({
				items:[
					this.txtInvoiceNo,
					this.exactInvoiceButton
				]
			});

			// Replace the "Old" txtInvoiceNo with the new invoiceComp
			this.propertiesPanel.insert(currentFieldIndex,this.invoiceComp);
		})
	});
	
	Ext.override(GO.projects2.TemplateDialog, {
		buildForm: GO.projects2.TemplateDialog.prototype.buildForm.createSequence(function(){	
//			
//			if (GO.util.empty(this.pluginPropertiesFields))
//				this.pluginPropertiesFields = new Array();
			
			this.propertiesPanel.add({
				xtype: 'textfield',
				name: 'exactonline_division_number',
				anchor: '-20',
				fieldLabel: GO.exactonline.lang['divisionNumber']
			});
		})
	});
}, this);


GO.exactonline.downloadSalesInvoice = function(projectId,invoiceNumber) {
	
	window.open(GO.url('exactonline/oauth/callApi',{invoiceNumber:invoiceNumber,'projectId':projectId,'toPDF':true}));
	
}