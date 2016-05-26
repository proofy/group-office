GO.billing.ProductOptionValueDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'product-option',
			title:GO.billing.lang.optionSelection,
			formControllerUrl: 'billing/productOptionValue',
      width: 450,
      height: 200
		});
		
		GO.billing.ProductOptionValueDialog.superclass.initComponent.call(this);	
	},
	
	buildForm : function () {
		
		var items = [];
		
		var records = GO.billing.languagesStore.getRange();
		
		for(var i=0;i<records.length;i++)
		{
			var textfield = new Ext.form.TextField({
				fieldLabel:GO.lang.strName+' ('+records[i].get("name")+')',
				name:"name_"+records[i].get("id"),
				anchor:'-20',
				allowBlank: false
			});
			
			items.push(textfield);	
		}
		
		this.valueField = new Ext.form.NumberField({
			fieldLabel:GO.billing.lang.price,
			name:"value",
			anchor:'-20',
			allowBlank: false
		});
		
		items.push(this.valueField);	
		
		this.propertiesPanel = new Ext.Panel({
			title:GO.lang['strProperties'],			
			cls:'go-form-panel',
			layout:'form',
			items:items,
			labelWidth:130
		});

		this.addPanel(this.propertiesPanel);
	},
	setProductOptionId : function(productOptionId){
		this.formPanel.baseParams.product_option_id = productOptionId
	}
});