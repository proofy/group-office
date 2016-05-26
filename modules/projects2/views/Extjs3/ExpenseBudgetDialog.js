/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: ExpenseBudgetDialog.js 21269 2016-03-22 16:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.projects2.ExpenseBudgetDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

	initComponent: function() {

		Ext.apply(this, {
			titleField: 'description',
			goDialogId: 'expenseBudget',
			title: GO.projects2.lang.expenseBudget,
			resizable:false,
			submitEmptyText: false,
			height: 350,
			width: 655,
			formControllerUrl: 'projects2/expenseBudget'
		});

		GO.projects2.ExpenseBudgetDialog.superclass.initComponent.call(this);
	},
	buildForm: function() {

		this.propertiesPanel = new Ext.Panel({
			title: GO.lang['strProperties'],
			layout: 'column',
			items: [
				{ 
					xtype: 'panel',
					cls: 'go-form-panel',
					columnWidth: .5,
					layout: 'form',
					items: [
						{
							xtype: 'hidden',
							name: 'project_id'
						},{
							xtype: 'plainfield',
							name: 'id',
							fieldLabel: 'ID'
						},{
							xtype: 'textfield',
							name: 'id_number',
							maxLength: 1024,
							allowBlank: true,
							fieldLabel: GO.projects2.lang['idNumber'],
							emptyText: GO.projects2.lang['emptyForID']
						},
						//aantal  + eenheid
						{
							xtype: 'compositefield',
							fieldLabel: GO.projects2.lang['quantity'],
							items: [
								this.quantityField = new GO.form.NumberField({
									width: 80, 
									name: 'quantity'
								}),
								{xtype: 'textfield',
									width: 60, 
									maxLength: 50,
									name: 'unit_type',
									emptyText: GO.projects2.lang['unit']
								}
							]
						},
						//Stuk
						this.unitField = new GO.form.NumberField({
							fieldLabel: GO.projects2.lang['cost'],
							name: 'unit_cost',
							decimalPrecision:2
						}),
						//Totaal
						this.nettField = new GO.form.NumberField({
							fieldLabel: GO.projects2.lang['nett'],
							decimalPrecision:2,
							name: 'nett'
						}),
						//BTW
						{
							xtype: 'compositefield',
							fieldLabel: GO.projects2.lang['vat'],
							items: [
								{xtype: 'numberfield', name: 'vat'},
								{xtype: 'plainfield', value: '%'}
							]
						},
						{
							xtype: 'panel',
							layout: 'form',
							padding: '20px 0 0 0',
							margins:0,
							items: [
								this.contactField = new GO.addressbook.SelectContact({
									anchor:'100%',
									fieldLabel: GO.projects2.lang.contact,
									hiddenName:'contact_id'
								}),
								this.customerField = new GO.addressbook.SelectCompany({
									anchor:'100%',
									fieldLabel: GO.projects2.lang['supplier'],
									hiddenName: 'supplier_company_id'
								})
							]
						}
					]
				},{ 
					xtype: 'panel',
					cls: 'go-form-panel',
					columnWidth: .5,
					labelAlign: 'top',
					layout: 'form',
					items: [
						{
							xtype: 'textarea',
							name: 'description',
							width: 300,
							height: 80,
							anchor: '100%',
							maxLength: 255,
							allowBlank: false,
							fieldLabel: GO.lang['strDescription']
						},{
							xtype: 'textarea',
							name: 'comments',
							width: 300,
							height: 120,
							anchor: '100%',
							maxLength: 1024,
							allowBlank: true,
							fieldLabel: GO.projects2.lang['comments']
						}
					]
				}
			]
		});
		//cost
		this.unitField.on('change',function(f,value) {
			var quantity = GO.util.unlocalizeNumber(this.quantityField.getValue());
			var unit = GO.util.unlocalizeNumber(value);
			if(quantity)
				this.nettField.setValue(GO.util.numberFormat(quantity*unit));
		},this);
		//total
		this.nettField.on('change',function(f,value) {
			var quantity = GO.util.unlocalizeNumber(this.quantityField.getValue());
			var total = GO.util.unlocalizeNumber(value);
			if(quantity && quantity!=0)
				this.unitField.setValue(GO.util.numberFormat(total/quantity));
		},this);
		//aantal
		this.quantityField.on('change',function(f,value) {
			var total = GO.util.unlocalizeNumber(this.nettField.getValue());
			var quantity = GO.util.unlocalizeNumber(value);
			if(total && total!=0)
				this.unitField.setValue(GO.util.numberFormat(total/quantity));
		},this);

		this.addPanel(this.propertiesPanel);
	},
	afterLoad : function(id, request, json) {
		var total = GO.util.unlocalizeNumber(json.result.data.nett);
		var quantity = GO.util.unlocalizeNumber(json.result.data.quantity);
		this.unitField.setValue(GO.util.numberFormat(total/quantity));
	}

});