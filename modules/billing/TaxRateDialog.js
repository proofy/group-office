/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: TaxRateDialog.js 20419 2015-04-15 12:51:40Z wsmits $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.billing.TaxRateDialog = Ext.extend(GO.dialog.TabbedFormDialog , {

	initComponent : function(){
		
		Ext.apply(this, {
			updateAction: 'update',
			createAction: 'create',
			goDialogId:'bs-taxrate',
			title:GO.billing.lang.taxRate,
			formControllerUrl: 'billing/taxRate',
			enableApplyButton : false,
			width:400,
			height:220
		});
		
		GO.billing.TaxRateDialog.superclass.initComponent.call(this);	
	},
	
	buildForm : function () {
		
		this.nameField = new Ext.form.TextField({
			name: 'name',
			anchor: '-20',
			allowBlank:false,
			fieldLabel: GO.lang.strName,
			maxLength: 100
		});
		
		this.percentageField = new GO.form.NumberField({
			name: 'percentage',
			allowBlank:false,
			decimals: 2,
			fieldLabel: GO.billing.lang.percentage,
			maxLength: 10
		});
		
		this.percentageLabel = new Ext.form.Label({
			text : '%'
		});
		
		this.percentageFieldComp = new Ext.form.CompositeField({
			anchor: '-20',
			items:[
				this.percentageField,
				this.percentageLabel
			]
		});
		
		this.descriptionField = new Ext.form.TextArea({
			name: 'description',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: GO.lang.strDescription
		});
		
		this.propertiesPanel = new Ext.Panel({
			title:GO.lang['strProperties'],			
			cls:'go-form-panel',
			layout:'form',
			items:[
				this.nameField,
				this.percentageFieldComp,
				this.descriptionField
			]
		});

		this.addPanel(this.propertiesPanel);
	},
	setBookId : function(book_id){
		this.formPanel.form.baseParams.book_id=book_id;
	}
});

