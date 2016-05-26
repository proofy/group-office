/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: MessageForm.js 20082 2014-12-17 15:46:32Z wsmits $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.MessageForm = function(config)
{
	if(!config)
	{
		config={};
	}
	
	config.ticketData = {};
	
	config.width=700;
	//config.minHeight=config.height=GO.settings.modules.tickets.write_permission ?  200 : 180;
	config.autoHeight=true;
	//config.height=400;
	config.minWidth=300;
	//config.layout='fit';
//	config.modal=true;
	config.border=false;
	config.plain=true;
	config.split=true;
	config.resizable=true;
	config.closeAction='hide';
	config.collapsible=true;
	//config.buttonAlign='right';
	config.title=GO.tickets.lang.newMessage;

	//var height = GO.settings.modules.tickets.write_permission ? '-55' : '-30'
	
	var content = this.content = new Ext.form.TextArea({
		name:'content',
		hideLabel: true,			
		anchor:'100%',
		height:200
	});

	config.focus=function(){
		content.focus();
	}

	this.selectTemplate = new GO.form.ComboBoxReset({
		fieldLabel:GO.tickets.lang.select_template,
		hiddenName:'template_id',
		valueField:'id',
		displayField:'name',
		anchor:'100%',
		store:GO.tickets.templatesStore,
		mode:'local',
		triggerAction:'all',
		//disabled:true,
		editable:false,
		selectOnFocus:true,
		forceSelection:true
	});
	this.selectStatus = new GO.tickets.SelectStatus({
		fieldLabel:GO.tickets.lang.changeTicketStatus,
		disabled:true,
		anchor:'100%',
		listeners:{
			scope:this,
			change:function(){
				this.statusChanged=true;
			}
			
		}
	});
	this.selectType = new GO.tickets.SelectType({
		fieldLabel: GO.tickets.lang['changeTicketType'],
		anchor: '100%',
		allowBlank:true
	});
	
//	this.selectType.store.on('load',function(){
//		this.selectType.setValue(this.ticketData.type_id);
//	}, this);
	
	/*this.external = new Ext.form.Checkbox({
			name:'external',
			hideLabel:true,
			flex:1,
			boxLabel:GO.tickets.lang.notifyContact,
			disabled:true,
			checked:false
		});*/
	this.btnSaveAsNote = new Ext.Button({
		text:GO.tickets.lang.saveAsNote,
		flex:1,
		handler: function(){
			this.submitForm(false);
		},
		scope: this
	});

	this.btnSaveAsMessage = new Ext.Button({
		text:GO.tickets.lang.sendMessage,
		flex:1,
		handler: function(){
			this.submitForm(true);
		},
		scope: this
	});

	this.btnUpdateMessage = new Ext.Button({
		text: GO.lang.cmdSave,
		flex:1,
		handler: function(){
			this.submitForm();
		},
		hidden:true,
		scope: this
	});

	this.btnCancel = new Ext.Button({
		flex:1,
		text:GO.lang['cmdCancel'],
		minWidth:75,
		handler: function(){
			this.hide();
		},
		scope: this
	});
	
	this.rateFields = new Ext.form.CompositeField({
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
				clear:this.syncNumber,
				select:this.syncNumber,
				scope:this
			}
		},{
			flex:1,
			xtype:'numberfield',
			name:'rate_hours',
			value:0,
			disabled:true
		}
		]
	});

	var formPanelItems = [this.content];

	var formPanelBaseParams={};
	
	this.agentPanel = new Ext.Panel({
		border:false,
		forceLayout:true,
		layout:'form',
		items:[
			this.selectTemplate,
			this.selectStatus,
			this.selectType,
			this.rateFields,{
				anchor:'100%',
				xtype:'datefield',
				name:'date',
				fieldLabel:GO.lang.strDate,
				value:new Date().format(GO.settings.date_format),
				disabled:true
			}
		]
	});


	formPanelItems.push(this.agentPanel);

	

	this.uploadFile = new GO.form.UploadFile({
		inputName : 'attachments',
		addText : GO.tickets.lang.attachFiles
	});

	formPanelItems.push(this.uploadFile);


	this.formPanel = new Ext.form.FormPanel({
		cls:'go-form-panel',
		fileUpload:true,
		labelWidth:150,
		autoHeight:true,
		waitMsgTarget:true,
		items:formPanelItems,
		baseParams:formPanelBaseParams
	});
	
	
	

	/*
	this.selectTemplate.on('select', function(combo, record)
	{				
		this.setContent(record.data.id);
	}, this);
   
		this.external.on('check', function(cb, checked)
		{
			this.selectTemplate.setDisabled(!checked);
		},this); */
	
	config.items=[this.formPanel];
	config.buttons=[this.btnSaveAsMessage, this.btnSaveAsNote, this.btnUpdateMessage, this.btnCancel];
		
	GO.tickets.MessageForm.superclass.constructor.call(this, config);
			
	this.addEvents({
		'save' : true
	});
		
}
Ext.extend(GO.tickets.MessageForm, GO.Window,{
	
	message_id : 0,
	status_id: 0,	
	status_name:'',
	has_status: 0,
	ticket_id:0,

	syncNumber : function(){
		if(this.rendered && this.rateFieldsEl){
			var enabled = this.formPanel.form.findField('rate_id').getValue()>0;
			this.formPanel.form.findField('rate_hours').setDisabled(!enabled);
			enabled ? this.dateEl.show() : this.dateEl.hide();

			this.formPanel.form.findField('date').setDisabled(!enabled);

			this.syncShadow();
		}
	},

	setMessageId : function(id)
	{
		this.message_id = id;

		if(this.message_id)
		{
			this.setTitle(GO.tickets.lang.editMessage);

			this.btnSaveAsNote.hide();
			this.btnSaveAsMessage.hide()
			this.btnUpdateMessage.show();

			this.loadMessage();
		}else
		{
			this.setTitle(GO.tickets.lang.newMessage);

			//this.btnSaveAsNote.setVisible(GO.settings.modules.tickets.write_permission);
			this.btnSaveAsMessage.show()
			this.btnUpdateMessage.hide();			
		}
	},
   
	reset : function() 
	{
		if(this.rendered)
			this.formPanel.form.reset();

//		if(GO.tickets.templatesStore.data.length >0)
//		{
//			this.selectTemplate.setValue(GO.tickets.templatesStore.data.items[0].id);
//			this.selectTemplate.setRemoteText(GO.tickets.templatesStore.data.items[0].data.name);
//		}
		this.selectTemplate.selectFirst();
		this.selectTemplate.enable();

		this.message_id = 0;
		this.has_status = 0;

		this.setTitle(GO.tickets.lang.newMessage);

//		this.selectStatus.setValue(this.status_id);
		//this.selectStatus.setRemoteText(this.status_name);
		this.selectStatus.enable();
		
		this.syncNumber();

		this.uploadFile.clearQueue();
	},
//	prepareForm : function(ticket_id, status_id, status_name)
//	{		
//		this.status_id = status_id;
//		this.ticket_id = ticket_id;
//		this.status_name = status_name;
//	},
	loadMessage : function()
	{
		this.formPanel.form.load({
			url: GO.url('tickets/message/load'),
			params:{				
				id:this.message_id
			},
			waitMsg:GO.lang['waitMsgLoad'],
			success: function(form, action) 
			{
				this.selectTemplate.disable();
				this.selectStatus.disable();
				this.has_status = (action.result.data.has_status) ? 1 : 0;
				this.syncNumber();
				
				GO.tickets.MessageForm.superclass.show.call(this);
			},
			failure:function(form, action)
			{
				GO.errorDialog.show(action.result.feedback)
			},
			scope: this
		});
	},
	setCompanyId : function(company_id) {
		this.company_id = company_id;

		if (GO.addressbook)
			this.rateFields.items.get(0).store.baseParams['company_id'] = company_id;
		else
			this.rateFields.items.get(0).store.baseParams['company_id'] = 0;


		GO.tickets.ratesStore.load({
			callback:function(){
				GO.tickets.ratesStore.loaded = true;
			},
			scope:this
		});
	},
	show : function (message_id,ticketData){
		
		GO.tickets.MessageForm.superclass.show.call(this);
		
		
		this.statusChanged=false;
    
		this.ticket_id=ticketData.id;
		this.ticketData = ticketData;
				
		if(ticketData.permission_level==GO.permissionLevels.manage){
			this.agentPanel.show();		
			this.initRateField();	
			this.btnSaveAsNote.show();
			this.reset();
			this.setMessageId(message_id);
			
			if(!this.selectType.store.loaded){
				this.selectType.store.load({
					callback:function(){
						this.selectType.setValue(this.ticketData.type_id);		
					},
					scope:this
				});
			}else
			{
				this.selectType.setValue(this.ticketData.type_id);
			}
			this.selectStatus.setValue(this.ticketData.status_id);
		}else{
			this.btnSaveAsNote.hide();
			this.agentPanel.hide();
			this.reset();
			this.syncShadow();
		}
		this.setCompanyId(ticketData.company_id);		
		
//		this.btnSaveAsMessage.setDisabled(!this.isAgent()&&!this.isCustomer()); // Set the "send message button" to disabled when you are not the agent.
	},
	
	initRateField : function(){

		if(!this.rateFieldsEl){
			this.rateFieldsEl = this.formPanel.form.findField('rate_fields').getEl().up('.x-form-item');
			this.rateFieldsEl.setVisibilityMode(Ext.Element.DISPLAY);
			this.rateFieldsEl.hide();	

			GO.tickets.ratesStore.on('load',function(){
				if(!GO.tickets.ratesStore.getCount()){
					if(this.rateFieldsEl.isVisible()){
						this.rateFieldsEl.hide();					
					}
				}else
				{
					if(!this.rateFieldsEl.isVisible()){
						this.rateFieldsEl.show();
						this.formPanel.form.findField('rate_fields').doLayout();					
					}
				}
			}, this);
		}

		if(!this.dateEl){
			this.dateEl = this.formPanel.form.findField('date').getEl().up('.x-form-item');
			this.dateEl.setVisibilityMode(Ext.Element.DISPLAY);				
		}
		this.dateEl.hide();
		this.formPanel.form.findField('date').setDisabled(true);
		
		
	},
	
	isClaimedByMe : function(){
		return this.ticketData.agent_id==GO.settings.user_id;
	},
	isClaimed : function(){
		return this.ticketData.agent_id>0;
	},
	isAgent : function(){		
		var isAgent = this.ticketData.permission_level==GO.permissionLevels.manage;	
		return isAgent;
	},
	isCustomer : function(){
		return !this.isAgent() && this.ticketData.user_id==GO.settings.user_id;
	},
	
	submitForm : function(sendToCustomer)
	{
		if(this.getFooterToolbar().disabled)
			return;
		
		this.getFooterToolbar().setDisabled(true);
		
		var params =  {
			id:this.message_id,
			//has_status:this.has_status,
			ticket_id:this.ticket_id
		};


		if(typeof(sendToCustomer)!="undefined")			
			params.is_note=sendToCustomer ? '0' : '1';
		
		
		
		this.formPanel.form.submit(
		{
			url:GO.url('tickets/message/submit'),
			params:params,
			waitMsg:GO.lang['waitMsgSave'],
			success:function(form, action)
			{
				this.getFooterToolbar().setDisabled(false);
				//increase the totalUnseen value otherwise the system will think there's
				//a new ticket
//				if(action.result.changed_to_unseen){
//					GO.tickets.totalUnseen++;					
//				}
				this.fireEvent('save');				
				//this.reset();
				this.hide();
        
				// Let the reminder check for active reminders
				GO.checker.checkForNotifications();

			},
			failure: function(form, action) 
			{
				this.getFooterToolbar().setDisabled(false);
				var error = '';
				if(action.failureType=='client')
				{
					error = GO.lang['strErrorsInForm'];
				}
				else
				{
					error = action.result.feedback;
				}
				Ext.MessageBox.alert(GO.lang['strError'], error);
			},
			scope:this
		});
	}
});