/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: TicketDialog.js 20129 2015-01-13 10:22:06Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 
GO.tickets.TicketDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	customFieldType : "GO\\Tickets\\Model\\Ticket",
	
	initComponent : function(){
		
		Ext.apply(this, {
			fileUpload:true,
			enableApplyButton : false,
			titleField:'subject',
			goDialogId:'ticket',
			minWidth:800,
			width:800,
			minHeight:570,
			height:570,
			modal:true,
			title:GO.tickets.lang.ticket,
			formControllerUrl: 'tickets/ticket'
		});
		
		GO.tickets.TicketDialog.superclass.initComponent.call(this);
	},
	
	buildTicketGroupSelect: function(){
		
		
		
		var ticketGroupStore = new GO.data.JsonStore({
			url: GO.url('tickets/ticketGroup/store'),
			remoteSort: true,
			fields: ['id','name'],
			autoLoad: true,
			listeners: {
				load : function (store, records, options) {
					if(GO.util.empty(this.selectTicketGroup.getValue())){
						if (records.length>0)
							this.selectTicketGroup.setValue(records[0].data.id);
						else
							this.selectTicketGroup.setValue('');
					}else
					{
						this.selectTicketGroup.setValue(this.selectTicketGroup.getValue());
					}
					
					this.selectTicketGroup.setDisabled(!records.length);
				},
				scope: this
			}
		});
		ticketGroupStore.setDefaultSort('name', 'asc');
		
		this.selectTicketGroup = new GO.form.ComboBox({
			displayField : 'name',
			valueField : 'id',
			hiddenName : 'group_id',
			store : ticketGroupStore,
			triggerAction : 'all',
			selectOnFocus : true,
			emptyText:GO.lang.strNA,
			pageSize : parseInt(GO.settings['max_rows_list']),
			fieldLabel : GO.tickets.lang.ticketGroup,
			name:'group_id',
			mode: 'remote'
		});
	},
	
	buildCustomerFieldSet : function(){
		if(GO.addressbook){
			this.selectContact = new GO.addressbook.SelectContact ({
				name: 'contact_name',
				hiddenName:'contact_id',
				anchor: '-20',
				fieldLabel:GO.tickets.lang.contact,
				remoteSort: true
			});
			
			this.selectContact.on('select', function(combo, record)
			{
				var contact = record.json;

				var values = record.data;

				var email = '';
				if (contact.email)
					email = contact.email;
				else if (contact.email2)
					email = contact.email2;
				else if (contact.email3)
					email = contact.email3;

				values.email=email;

				var phone = '';
				if (contact.work_phone)
					phone = contact.work_phone;
				else if (contact.cellular)
					phone = contact.cellular;
				else if (contact.home_phone)
					phone = contact.home_phone;

				values.phone = phone;                                		

				if (values.id)
					this.selectTicketGroup.store.baseParams['contact_id'] = values.id;

				if(values.company_id)
					this.setCompanyId(values.company_id, values.company_name);
					

				this.formPanel.form.setValues(values);

			}, this);

		} else {
			this.selectContact = new Ext.form.TextField({
				name:'contact_name',
				fieldLabel:GO.lang.strContact,
				disabled:true
			});
		}
		
		
		if(GO.addressbook) {
			this.selectCompany = new GO.addressbook.SelectCompany({
					//hiddenName:'company_id',
					fieldLabel:GO.lang.strCompany,
					name:'company',
					remoteSort: true,
					listeners:{
						scope:this,
						select:function(combo, record){
							this.formPanel.baseParams.company_id=record.data.id;
						}
					}
				});
			// If the company changes, the ticket group store and the rates store
			// change too.
			this.selectCompany.on('change',function(combo,newValue){
				this.setCompanyId(newValue);
			
			},this);
			
		} else {
			this.selectCompany = new Ext.form.TextField({
				name:'company',
				fieldLabel:GO.lang.strCompany,
				readOnly: true,
				disabled:true
			});
		}
		this.first_name = new Ext.form.TextField({
			name:'first_name',
			fieldLabel: GO.lang['strFirstName'],
			allowBlank:false
		});
		this.middle_name = new Ext.form.TextField({
			name:'middle_name',
			fieldLabel: GO.lang['strMiddleName']
		});
		this.last_name = new Ext.form.TextField({
			name:'last_name',
			fieldLabel: GO.lang['strLastName'],
			allowBlank:false
		});
		this.phone = new Ext.form.TextField({
			name:'phone',
			fieldLabel: GO.lang['strPhone'],
			maskRe:/([0-9\s]+)$/
		});
		this.email = new Ext.form.TextField({
			name:'email',
			fieldLabel:GO.lang['strEmail'],
			allowBlank: GO.settings.config.tickets_no_email_required,
			vtype:'emailAddress'
		});
		
		this.contactFieldset = {
			xtype:'fieldset',
			title:GO.lang['customer'],
			collapsed:false,
			defaults:{
				anchor:'100%'
			},
			items:[
				this.selectContact,
				this.selectCompany, 
				this.selectTicketGroup, 
				this.first_name, 
				this.middle_name, 
				this.last_name, 
				this.phone, 
				this.email
			]
		}
	},
	
	buildTicketFieldSet : function(){
		this.subject = new Ext.form.TextField({
			name:'subject',
			fieldLabel: GO.tickets.lang.subject,
			allowBlank:false
		});
		
		this.selectType = new GO.tickets.SelectType();
//		this.selectType = new GO.form.ComboBox({
//			hiddenName:'type_id',
//			fieldLabel:GO.lang['strType'],
//			valueField:'id',
//			displayField:'name',
//			pageSize: parseInt(GO.settings.max_rows_list),
//			store:GO.tickets.writableTypesStore,
//			mode:'local',
//			triggerAction:'all',
//			editable:false,
//			selectOnFocus:true,
//			allowBlank:false,
//			forceSelection:true
//		});
		
		this.selectType.on('select', function(combo, record)
		{
			this.setTypeAcl(record.data.acl_id);
			this.setFormMode(record.data.permission_level<GO.permissionLevels.manage);
		}, this);
		
		this.selectAgent = new GO.tickets.SelectAgent();
				
		this.selectPriority = new GO.form.SelectPriority();		
//		this.selectStatus = new GO.form.ComboBox({
//			hiddenName:'status_id',
//			fieldLabel:GO.tickets.lang.status,
//			valueField:'id',
//			displayField:'name_clean',
//			store:GO.tickets.statusesStore,
//			mode:'local',
//			triggerAction:'all',
//			editable:false,
//			selectOnFocus:true,
//			forceSelection:true
//		});


			GO.tickets.ratesStore.on('load',function(){
				var selectRateEl = this.formPanel.form.findField('rate_fields').getEl().up('.x-form-item');
				selectRateEl.setVisibilityMode(Ext.Element.DISPLAY);
				
				//hide on existing tickets or when there are no rates
				if(!GO.tickets.ratesStore.getCount() || this.remoteModelId || this.formModeCustomer){
					if(selectRateEl.isVisible()){
						selectRateEl.hide();
					}
				}else
				{
					if(!selectRateEl.isVisible()){
						selectRateEl.show();
						this.formPanel.form.findField('rate_fields').doLayout();
					}
				}
			}, this);
			
			this.selectRate = new Ext.form.CompositeField({
//				xtype:'compositefield',
				itemId:'rate_fields',
				fieldLabel:GO.tickets.lang.rateHours,
				items:[
				{
					flex:2,
					xtype:'comboboxreset',
					mode:'local',
					triggerAction:'all',
					store:GO.tickets.ratesStore,
					emptyText:GO.tickets.lang.noRate,
					hiddenName:'rate_id',
					valueField:'id',
					displayField:'name',
					listeners:{
						clear:this.toggleRateHours,
						select:this.toggleRateHours,
						scope:this
					}
				},{
					flex:1,
					xtype:'numberfield',
					name:'rate_hours',
					value:0
				}
				]
			});
		
		
		this.ticketFieldset = {
			xtype:'fieldset',
			title:GO.tickets.lang.ticket,
			//autoHeight:true,
			collapsed:false,
			defaults:{
				anchor:'100%'
			},
			items:[
				this.subject, 
				this.selectType,
				this.selectAgent,
				this.selectPriority,
				this.selectRate
			]
		}
	},
	
	beforeLoad : function(remoteModelId, config){
		
		this.setCompanyId(0);
		this.external.setValue(GO.tickets.notify_contact);
		
		if(!GO.tickets.writableTypesStore.loaded)
			GO.tickets.writableTypesStore.load();

		//When a ticket is created from a contact new menu, send the contact ID so the data can be loaded.
		if(!this.formModeCustomer && !remoteModelId && config.link_config){			
			if(config.link_config.model_name=='GO\\Addressbook\\Model\\Contact'){				
				config.loadParams.contact_id=config.link_config.model_id;
			}
			if(config.link_config.model_name=='GO\\Addressbook\\Model\\Company'){				
				config.loadParams.company_id=config.link_config.model_id;
			}
		}
		
		
		if(!this.selectTemplate.store.loaded)
		{
			this.selectTemplate.store.load({
				scope:this,
				callback:function(){
					if(GO.tickets.ticketCreatedforClientTemplateID)
						this.selectTemplate.setValue(GO.tickets.ticketCreatedforClientTemplateID);
				}
			});
		}else
		{
			if(GO.tickets.ticketCreatedforClientTemplateID)
				this.selectTemplate.setValue(GO.tickets.ticketCreatedforClientTemplateID);
		}
	},
	
	afterSubmit : function(action){
		this.uploadFile.clearQueue();
	},
	
	afterShowAndLoad : function(remoteModelId, config){
		
	  this.uploadFile.clearQueue();
		// Following three ifs with config.values are for when the dialog is openened
		// from Save Mail As Ticket
		if(config && config.values){
			var v = config.values;
			
//			if(v.contact_name)
//				this.selectContact.setRemoteText(v.contact_name);

			if(v.company_id) {
				this.setCompanyId(v.company_id);
				this.selectCompany.setValue(v.company_id);
			}
			
			if(this.selectCompany.setRemoteText){
				if(v.company_name)
					this.selectCompany.setRemoteText(config.values.company_name);				
			}
		}
		
		
	},
	
	toggleRateHours : function(){
		if(this.rendered && this.selectRate){
			var enabled = this.formPanel.form.findField('rate_id').getValue()>0;
			this.formPanel.form.findField('rate_hours').setDisabled(!enabled);
		}
	},
	
	buildContentFieldSet : function(){
		this.content = new Ext.form.TextArea({
			name:'content',
			hideLabel: true,
			anchor:'100%',
			height:130
		});
		this.selectTemplate = new GO.form.ComboBox({
			hiddenName:'template_id',
			fieldLabel:GO.tickets.lang.select_template,
			valueField:'id',
			displayField:'name',
			store:GO.tickets.templatesStore,
			mode:'local',
			triggerAction:'all',
			editable:false,
			selectOnFocus:true,
			forceSelection:true
		});
		this.external = new Ext.ux.form.XCheckbox({
			name:'notify_contact',
			boxLabel:GO.tickets.lang.notifyContact,
			hideLabel:true,
			checked:true
		});
		
		this.uploadFile = new GO.form.UploadFile({
			inputName : 'attachments',
			addText : GO.tickets.lang.attachFiles
		});
		
		this.contentOptionsPanel = {
			xtype:'panel',
			layout:'form',
			//autoHeight:true,
			border:false,
			defaults:{
				anchor:'100%'
			},
			items:[this.selectTemplate,this.external,	this.uploadFile]
		}
		
		this.contentFieldset = new Ext.form.FieldSet({
			title:GO.tickets.lang.message,
			collapsed:false,
			//autoHeight:true,
			defaults:{
				border:false
			},
			items:[{
				layout:'column',				
				defaults:{
					border:false
				},
				items:[{
					columnWidth:.5,
					layout:'form',
					items:[this.content]
				},{
					columnWidth:.5,
					bodyStyle:'padding:10px 0 0 20px',
					items:[this.contentOptionsPanel]
				}]
			}]
		});
	},
	
	buildForm : function () {
		this.buildTicketGroupSelect();
		this.buildCustomerFieldSet();
		this.buildTicketFieldSet();
		this.buildContentFieldSet();
		
		this.selectLinkField = new GO.form.SelectLink({
			anchor:'100%'
		});
		this.selectLinkPanel = new Ext.Panel({
			xtype:'panel',
			layout:'form',
			bodyStyle:'padding-left:10px',
			border:false,
			forceLayout:true,
			//autoHeight:true,
			items:[this.selectLinkField]
		});

		if (GO.email) {
			this.ccField = new GO.form.ComboBoxMulti({
				sep : ',',
				fieldLabel : GO.tickets.lang['ccNotificationsTo'],
				name : 'cc_addresses',
				//width: '-20',
				height : 50,
				store : new GO.data.JsonStore({
					url : GO.url("search/email"),
					fields : ['full_email','info']
				}),
				maxLength: 255,
				valueField : 'full_email',
				displayField : 'info',
				allowBlank:true
			});
		} else {
			this.ccField = new Ext.form.TextArea({
				name:'cc_addresses',
				//width: '-20',
				height: 50,
				maxLength: 255,
				fieldLabel:GO.tickets.lang['ccNotificationsTo'],
				allowBlank:true
			});
		}
		
		
		this.ccFieldset = {
			xtype:'fieldset',
//			title:,
			collapsed:false,
			defaults:{
				anchor:'100%'
			},
			items:[
				this.ccField
			]
		}
		
		this.propertiesPanel = new Ext.Panel({
			bodyStyle:'padding:5px',			
			defaults:{
				border:false
			},
			autoScroll:true,
			layoutConfig:{autoScroll:true},
			title:GO.tickets.lang.ticket,
			border:false,
			items:[{				
				layout:'column',
				defaults:{
					border:false
				},
				items:[{
					columnWidth:.5,
					items:[this.contactFieldset]
				},{
					columnWidth:.5,
					bodyStyle:'padding-left:10px',
					items:[
						this.ticketFieldset,
						this.ccFieldset
					]
				}]
			},{
				items:[
					this.contentFieldset, 
					this.selectLinkPanel
				]
			}]
		})

		this.addPanel(this.propertiesPanel);
	},
	
	afterLoad  : function(remoteModelId, config, action){	
		if(remoteModelId){
			this.contentFieldset.hide();
			this.content.allowBlank=true;
		}else
		{
			this.contentFieldset.show();
			this.content.allowBlank=false;
		}
		
		this.setFormMode(action.result.data.permission_level<GO.permissionLevels.manage);
		this.setCompanyId(action.result.data.company_id);
		this.setTypeAcl(action.result.data.acl_id);
		
		//do focus again so it finds a field that's not disabled
		this.focus();
	},
	
	formModeCustomer : false,

  //customer: boolean, true if permissionlevel lower then manager
	setFormMode : function(customer){
		var oldCustomer = this.formModeCustomer;
		this.formModeCustomer = customer;
		
		this.selectContact.setDisabled(customer);
		this.selectCompany.setDisabled(customer);
		this.first_name.setDisabled(customer);
		this.middle_name.setDisabled(customer);
		this.last_name.setDisabled(customer);
		this.phone.setDisabled(customer);
		this.email.setDisabled(customer);		
		
		if(oldCustomer && !customer){
			this.setCompanyId(0);
			this.selectContact.reset();
			this.selectCompany.reset();
			this.first_name.reset();
			this.middle_name.reset();
			this.last_name.reset();
			this.phone.reset();
			this.email.reset();	
		}
		
		
		if(customer){
			this.selectTemplate.setValue(0);
			this.formPanel.form.setValues(GO.tickets.customerDefaultAttr);
			this.selectContact.reset();
			this.selectCompany.reset();
		}else{
			if(GO.tickets.ticketCreatedforClientTemplateID)
				this.selectTemplate.setValue(GO.tickets.ticketCreatedforClientTemplateID);
		}
		
		this.selectTemplate.getEl().up('div.x-form-item').setDisplayed(!customer);
		this.external.getEl().up('div.x-form-item').setDisplayed(!customer);	
		
		if(!GO.tickets.ratesStore.getCount() || this.formModeCustomer)
			this.selectRate.getEl().up('div.x-form-item').hide();
		else
			this.selectRate.getEl().up('div.x-form-item').show();
		
		this.selectAgent.getEl().up('div.x-form-item').setDisplayed(!customer);	
		//this.selectPriority.getEl().up('div.x-form-item').setDisplayed(!customer);	
		if(customer)
			this.selectLinkPanel.hide();
		else
			this.selectLinkPanel.show();
	},
	
	setTypeAcl : function(acl_id){
		if(this.selectAgent.store.baseParams.acl_id != acl_id){
			this.selectAgent.store.baseParams.acl_id = acl_id;
			//this.selectAgent.clearValue();
			delete this.selectAgent.lastQuery;
		}
	},
	
	// this may happen after company is set or type is changed
	setCompanyId : function(company_id, company_name) {
			
		this.company_id = this.formPanel.baseParams.company_id=company_id;
		if(this.selectCompany && company_name)
			this.selectCompany.setValue(company_name);
		
		this.selectTicketGroup.store.baseParams['company_id'] = company_id;
		this.selectTicketGroup.store.load();
		this.selectTicketGroup.clearLastSearch();
		
		if(this.selectRate && !this.formModeCustomer){
			this.selectRate.items.get(0).clearLastSearch();		
			this.selectRate.items.get(0).store.reload({
				params : {
					'company_id': this.company_id,
					include_global_rates: true
				}
			});
		}
		//this.selectCompany.fireEvent('change', this.selectCompany,company_id);

		
	}
	
	
});