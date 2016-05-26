/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: IncomeDialog.js 20558 2015-06-01 12:05:56Z mdhart $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
 
GO.projects2.IncomeDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
		
	jsonPost: true,
	_projectId: 0,
		
	initComponent : function(){
		
		Ext.apply(this, {
			titleField:'description',
			title:GO.projects2.lang.income,
			height: 650,
			formControllerUrl: 'projects2/income'
		});
		
		GO.projects2.IncomeDialog.superclass.initComponent.call(this);	
	},
	
	toggleContractFields : function(visible){
		this.repeatComp.setVisible(visible);
		this.contractEndDate.setVisible(visible);
		this.contractNotificationComp.setVisible(visible);
		this.notificationText.setVisible(visible);
	},
	
	buildForm : function () {
		
		this.isContractCheck = new Ext.ux.form.XCheckbox({
			name: 'income.is_contract',
			fieldLabel: GO.projects2.lang.contract,
			listeners:{
				check: function(cmp,val){
					this.toggleContractFields(val);
				},
				scope:this
			}
		});
		
		this.contractEndDate = new Ext.form.DateField({
			name: 'income.contract_end',
			width:205,
			maxLength: 50,
			allowBlank:true,
			fieldLabel: GO.projects2.lang.contractEnd,
			value: new Date(),
			hidden: true
		});
		
		this.repeatAmount = new GO.form.NumberField({
			decimals:0,
			name : 'income.contract_repeat_amount',
			minValue:1,
			width : 50,
			value : '1'
		});

		this.repeatFreq = new Ext.form.ComboBox({
			hiddenName : 'income.contract_repeat_freq',
			triggerAction : 'all',
			editable : false,
			selectOnFocus : true,
			width : 150,
			forceSelection : true,
			mode : 'local',
			value : '',
			valueField : 'value',
			displayField : 'text',
			store : new Ext.data.SimpleStore({
				fields : ['value', 'text'],
				data : [['', GO.lang.noRecurrence],
				['DAYS', GO.lang.strDays],
				['WEEKS', GO.lang.strWeeks],
				['MONTHS', GO.lang.strMonths],
				['YEARS', GO.lang.strYears]]
			}),
			hideLabel : true
		});
//
//		this.repeatFreq.on('select', function(combo, record) {
//			this.checkDateInput();
//			this.changeRepeat(record.data.value);
//		}, this);

		this.repeatComp = new Ext.form.CompositeField({
			fieldLabel : GO.projects2.lang.repeat,
			items : [this.repeatAmount,this.repeatFreq],
			hidden: true
		});
		
		this.notificationText = new GO.form.PlainField({
			value: GO.projects2.lang.contractNotificationText
		});

		this.notificationDays = new GO.form.NumberField({
			decimals:0,
			name : 'income.contract_end_notification_days',
			minValue:0,
			width : 50,
			value : '0'
		});
		
		this.notificationActive = new Ext.ux.form.XCheckbox({
			name: 'income.contract_end_notification_active',
			boxLabel: GO.projects2.lang.active,
			flex: 1
		});
		
		this.selectnotificationTemplate = new GO.form.ComboBoxReset({
			hiddenName:'income.contract_end_notification_template',
//			fieldLabel:GO.projects2.lang.select_template,
			valueField:'id',
			displayField:'name',
			store:new GO.data.JsonStore({
				url: GO.url('addressbook/template/store'),
				baseParams: {'type':0},
				root: 'results',
				id: 'id',
				fields: ['id','name'],
				remoteSort: true
			}),
			mode:'remote',
			triggerAction:'all',
			editable:false,
			selectOnFocus:true,
			forceSelection:true,
			emptyText:GO.projects2.lang.emailTemplate,
			flex: 2
		});
		
		this.contractNotificationComp  = new Ext.form.CompositeField({
			fieldLabel : GO.projects2.lang.notification,
			items : [
				this.notificationDays,
				{xtype: 'plainfield', value: GO.lang.strDays},
				this.notificationActive,
				this.selectnotificationTemplate
			],
			hidden: true,
			anchor: '100%'
		});

		this.emptyLine = new GO.form.PlainField({
			value: '&nbsp;'
		});

		this.propertiesPanel = new Ext.Panel({
			title:GO.lang['strProperties'],
			cls:'go-form-panel',
			layout:'form',
			items:[
			this.projectButton = new Ext.Button({
				text: GO.projects2.lang['showProject'],
				handler: function() {
					GO.projects2.showProjectDialog({
						project_id: this._projectId
					})
				},
				scope: this
			}),
			this.isContractCheck,
			this.repeatComp,
			this.contractEndDate,
			this.notificationText,
			this.contractNotificationComp,
			this.emptyLine,
			{				
				xtype: 'textfield',
				name: 'income.description',
				anchor: '100%',
				maxLength: 250,	
				fieldLabel: GO.lang.strDescription
			},{				
				xtype: 'numberfield',
				name: 'income.amount',
				anchor: '100%',		
				fieldLabel: GO.projects2.lang['amount']
			},{				
				xtype: 'datefield',
				name: 'income.invoice_at',
				anchor: '100%',
				maxLength: 50,
				allowBlank:false,
				fieldLabel: GO.projects2.lang['invoiceAt'],
				value: new Date()
			},{				
				xtype: 'xcheckbox',
				name: 'income.is_invoiced',
				fieldLabel: GO.projects2.lang['invoiced']
			},{				
				xtype: 'xcheckbox',
				name: 'income.invoiceable',
				fieldLabel: GO.projects2.lang['invoiceable']
			},this.txtInvoiceNo = new Ext.form.TextField({				
				name: 'income.invoice_number',
				maxLength: 50,
//				hidden: this.isNew(),
				fieldLabel: GO.projects2.lang['invoiceNo']
			}),this.referenceNoField = new Ext.form.TextField({				
				name: 'income.reference_no',
				maxLength: 64,
				fieldLabel: GO.projects2.lang['referenceNo']
			}),
			this.commentsField = new Ext.form.TextArea({				
				name: 'income.comments',
				height: 150,
				width: '100%',
				fieldLabel: GO.lang['strComment']
			}),
			{
				xtype: 'plainfield',
				value: '<br /><strong>'+GO.projects2.lang['customerAddress']+':</strong>',
				hideLabel: true
			},
			this.customerAddressField = new GO.form.PlainField({
				name: 'customer.formatted_address',
				hideLabel: true
			})
			]
		});

		this.addPanel(this.propertiesPanel);
	},
	
	afterShowAndLoad : function (remoteModelId, config, result){
		this.toggleContractFields(result.data.income.attributes.is_contract);
	},
	
	show : function (remoteModelId, config) {
//		this.txtInvoiceNo.setVisible(!!remoteModelId);
		
		GO.projects2.IncomeDialog.superclass.show.call(this,remoteModelId, config);

		this.formPanel.baseParams['income.project_id'] = this._projectId = config.project_id;
//		this.projectId.setValue(config.project_id);
		this.projectButton.setVisible(this._projectId>0);
	},
	changeRepeat : function(value) {

		var repeatForever = this.repeatForever.getValue();
		
		var form = this.formPanel.form;
		switch (value) {
			default :
				this.disableDays(true);
				this.monthTime.setDisabled(true);
				this.repeatForever.setDisabled(true);
				this.repeatEndDate.setDisabled(true);
				this.repeatEvery.setDisabled(true);
				break;

			case 'DAILY' :
				this.disableDays(true);
				this.monthTime.setDisabled(true);
				this.repeatForever.setDisabled(false);
				this.repeatEndDate.setDisabled(repeatForever);
				this.repeatEvery.setDisabled(false);

				break;

			case 'WEEKLY' :
				this.disableDays(false);
				this.monthTime.setDisabled(true);
				this.repeatForever.setDisabled(false);
				this.repeatEndDate.setDisabled(repeatForever);
				this.repeatEvery.setDisabled(false);

				break;

			case 'MONTHLY_DATE' :
				this.disableDays(true);
				this.monthTime.setDisabled(true);
				this.repeatForever.setDisabled(false);
				this.repeatEndDate.setDisabled(repeatForever);
				this.repeatEvery.setDisabled(false);

				break;

			case 'MONTHLY' :
				this.disableDays(false);
				this.monthTime.setDisabled(false);
				this.repeatForever.setDisabled(false);
				this.repeatEndDate.setDisabled(repeatForever);
				this.repeatEvery.setDisabled(false);
				break;

			case 'YEARLY' :
				this.disableDays(true);
				this.monthTime.setDisabled(true);
				this.repeatForever.setDisabled(false);
				this.repeatEndDate.setDisabled(repeatForever);
				this.repeatEvery.setDisabled(false);
				break;
		}
	},
});