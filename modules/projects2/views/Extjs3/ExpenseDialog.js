/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: ExpenseDialog.js 18083 2014-01-27 13:17:51Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 * @author WilmarVB <wilmar@intermesh.nl>
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
 
GO.projects2.ExpenseDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
		
	initComponent : function(){
		
		Ext.apply(this, {
			titleField:'description',
			goDialogId:'expense',
			title:GO.projects2.lang.expense,
			height: 300,
			formControllerUrl: 'projects2/expense'
		});
		
		GO.projects2.ExpenseDialog.superclass.initComponent.call(this);	
	},
	buildForm : function () {

		this.propertiesPanel = new Ext.Panel({
			title:GO.lang['strProperties'],
			cls:'go-form-panel',
			layout:'form',
			items:[
			{
				xtype:'hidden',
				name:'project_id'
			},
			{				
				xtype: 'datefield',
				name: 'date',
				//width:300,
				anchor: '100%',
				maxLength: 50,
				allowBlank:false,
				fieldLabel: GO.lang.strDate,
				value: new Date()
			},{				
				xtype: 'textfield',
				name: 'invoice_id',
				//width:300,
				anchor: '100%',
				maxLength: 50,
				//allowBlank:false,
				fieldLabel: GO.projects2.lang.invoiceNo
			},{				
				xtype: 'textfield',
				name: 'description',
				width:300,
				anchor: '100%',
				maxLength: 250,				
				fieldLabel: GO.lang.strDescription
			},
			this.selectExpenseBudget = new GO.projects2.SelectExpenseBudget(),
			
			this.nettField = new GO.form.NumberField({
				fieldLabel:GO.projects2.lang.nett,
				name:'nett'
			}),
			this.vatField = new GO.form.NumberField({
				fieldLabel:GO.projects2.lang.vat,
				name:'vat'
			})
//			this.fileBrowseButton = new GO.files.FileBrowserButton({
//				model_name:'GO_Projects2_Model_Expense',
//				fieldLabel : GO.projects2.lang['attachements']
//			})
			]				
		});

		this.addPanel(this.propertiesPanel);
	},
	
	afterLoad : function(remoteModelId, config, action){
		this.selectExpenseBudget.lastQuery = null;
		this.selectExpenseBudget.setProjectId(this.formPanel.form.findField('project_id').getValue());
//		this.fileBrowseButton.setId(remoteModelId);
	}

	
});