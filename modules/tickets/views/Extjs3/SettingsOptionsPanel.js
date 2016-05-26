/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: SettingsOptionsPanel.js 18345 2014-02-21 14:43:13Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.tickets.SettingsOptionsPanel = Ext.extend(Ext.Panel, {
	title:GO.tickets.lang.options,			
	cls:'go-form-panel',
	layout:'form',
	labelWidth: 240,
	
	initComponent : function(){
		
		this.buildForm();
		
		GO.tickets.SettingsOptionsPanel.superclass.initComponent.call(this);
	},
	
	buildForm : function(params) {
		
		this.nameField = new Ext.form.TextField({
			name: 'from_name',
			anchor: '100%',
			maxLength: 100,
			allowBlank:false,
			fieldLabel: GO.lang['strName']
		});
		
		this.emailField = new Ext.form.TextField({
			name: 'from_email',
			anchor: '100%',
			maxLength: 100,
			allowBlank:false,
			fieldLabel: GO.lang['strEmail']
		});
		
		this.subjectField = new Ext.form.TextField({
			name: 'subject',
			anchor: '100%',
			maxLength: 100,
			allowBlank:false,
			fieldLabel: GO.lang['strSubject']
		});
		
	
		this.languageCombo = new Ext.form.ComboBox({
			fieldLabel: GO.users.lang['cmdFormLabelLanguage'],
			name: 'language_id',
			store:  new Ext.data.SimpleStore({
				fields: ['id', 'language'],
				data : GO.Languages
			}),
			displayField:'language',
			valueField: 'id',
			hiddenName:'language',
			mode:'local',
			triggerAction:'all',
			editable: false,
			selectOnFocus:true,
			forceSelection: true,
			anchor: '100%',
			value: GO.settings.language
		});
//			
//		this.customerMessageTextarea = new Ext.form.TextArea({
//			name: 'customer_message',
//			anchor: '100%',
//			allowBlank:false,
//			fieldLabel:GO.tickets.lang.customer_message_label,
//			height:100
//		});
//		
//		this.responseMessageTextarea = new Ext.form.TextArea({
//			name: 'response_message',
//			anchor: '100%',
//			allowBlank:false,
//			fieldLabel:GO.tickets.lang.response_message_label,
//			height:100
//		});


		
		this.expireDaysField = new Ext.form.NumberField({
			name: 'expire_days',
			fieldLabel: GO.tickets.lang.expireDays,
			width: 50,
			allowNegative: false,
			allowDecimals: false,
			decimalPrecision: 0
		});
		
		this.closeStatusCombo = new GO.form.ComboBoxReset({
			fieldLabel:GO.tickets.lang.neverCloseStatus,
			xtype:'comboboxreset',
			hiddenName:'never_close_status_id',
			valueField:'id',
			displayField:'name',	
			store:GO.tickets.statusesStore,
			mode:'local',
			triggerAction:'all',
			anchor: '100%',
			editable:false,
			selectOnFocus:true,
			forceSelection:true
		});
		
		this.notifyContactCheckbox = new Ext.ux.form.XCheckbox({
			name: 'notify_contact',
			width:300,
			anchor: '100%',
			maxLength: 100,
			allowBlank:false,
			boxLabel: GO.tickets.lang.notifyContactCheck,
			hideLabel:true
		});
		
		this.disableAssignedReminderCheckbox = new Ext.ux.form.XCheckbox({
			name: 'disable_reminder_assigned',
			width:300,
			anchor: '100%',
			maxLength: 100,
			allowBlank:false,
			boxLabel: GO.tickets.lang.disableReminderAssigned,
			hideLabel:true
		});
		
		this.disableUnansweredReminderCheckbox = new Ext.ux.form.XCheckbox({
			name: 'disable_reminder_unanswered',
			width:300,
			anchor: '100%',
			maxLength: 100,
			allowBlank:false,
			boxLabel: GO.tickets.lang.disableReminderUnanswered,
			hideLabel:true
		});
		
		this.leaveTypeBlankByDefault = new Ext.ux.form.XCheckbox({
			name: 'leave_type_blank_by_default',
			width:300,
			anchor: '100%',
			maxLength: 100,
			allowBlank:false,
			boxLabel: GO.tickets.lang.leaveTypeBlankByDefault,
			hideLabel:true
		});
		
//		this.expireFieldset = new Ext.form.FieldSet({
//			border: false,
//			hideLabel: true,
//			labelWidth: 300,
//			bodyStyle:'padding:0px',
//			style:'padding:0px',
//			items:[
//				this.expireDaysField,
//				this.closeStatusCombo
//			]
//		});
		
		this.items = [
			this.nameField,
			this.emailField,
			this.subjectField,
			this.languageCombo,
//			this.customerMessageTextarea,
//			this.responseMessageTextarea,
			this.expireDaysField,
				this.closeStatusCombo,
			this.notifyContactCheckbox,
			this.disableAssignedReminderCheckbox,
			this.disableUnansweredReminderCheckbox,
			this.leaveTypeBlankByDefault
		];
		
		
//		if(GO.settings.modules.email && GO.settings.modules.email.read_permission)
//		{
//			
//			this.items.push({
//				style:'margin-top:20px',
//				xtype:'htmlcomponent',
//				html:GO.tickets.lang.importCaution
//			})
//			
//			this.selectAccount = new GO.form.ComboBoxReset({
//				fieldLabel: GO.tickets.lang.importMailbox,
//				hiddenName:'email_account_id',
//				anchor:'-20',
//				emptyText:GO.lang.none,
//				store: new GO.data.JsonStore({
//					url: GO.url("email/account/store"),
//					fields: ['id', 'username'],
//					remoteSort: true
//				}),
//				valueField:'id',
//				displayField:'username',
//				typeAhead: true,
//				mode: 'remote',
//				triggerAction: 'all',
//				editable: true,
//				selectOnFocus:true,
//				forceSelection: true,
//				pageSize:GO.settings.max_rows_list
//			});
//
//			this.items.push(this.selectAccount);
//		}
		
		
	}
});