/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TemplateDialog.js 21295 2016-04-07 13:50:31Z mschering $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.TemplateDialog = function(config){

	if(!config)
	{
		config = {};
	}

	this.buildForm();

	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};

	config.layout='fit';
	config.title=GO.tickets.lang.template;
	config.modal=false;
	config.border=false;
	config.width=600;
	config.height=430;
	config.resizable=true;
	config.closeAction='hide';
	config.items=this.formPanel;
	config.focus=focusFirstField.createDelegate(this);
	config.buttons=[{
		text:GO.lang['cmdOk'],
		handler: function()
		{
			this.submitForm(true)
		},
		scope: this
	},{
		text:GO.lang['cmdApply'],
		handler: function()
		{
			this.submitForm(false)
		},
		scope: this
	},{
		text:GO.lang['cmdClose'],
		handler: function()
		{
			this.hide()
		},
		scope: this
	}];
		
	GO.tickets.TemplateDialog.superclass.constructor.call(this,config);
	
	this.addEvents({
		'save' : true
	});
}

Ext.extend(GO.tickets.TemplateDialog, GO.Window, {
	
	show : function (record)
	{		
		if(!this.rendered)
			this.render(Ext.getBody());
			
		if(record)
		{
			this.template_id=record.data.id;
		}else
		{
			this.template_id=0;
		}
      
		if(this.template_id > 0)
		{			
			Ext.Ajax.request({
				url: GO.url("tickets/template/load"),
				params: {
					id: this.template_id
				},
				scope: this,
				callback: function(options, success, response)
				{
					var data = Ext.decode(response.responseText);
					
					if (!data.success)
					{					
						GO.errorDialog.show(data.feedback)
					} else {
						this.formPanel.form.setValues(data.data);
					}
				}
			});			
		}else
		{
			this.formPanel.form.reset();
		}
		
		GO.tickets.TemplateDialog.superclass.show.call(this);
	
	},
	submitForm : function(hide)
	{
		this.formPanel.form.submit(
		{		
			url:GO.url("tickets/template/submit"),
			params: {				
				id:this.template_id
			},
			waitMsg:GO.lang['waitMsgSave'],
			success:function(form, action)
			{
				if(action.result.id)
				{
					this.template_id=action.result.id;
				}

				if(this.formPanel.form.findField('ticket_created_for_client').getValue())
				{
					GO.tickets.ticketCreatedforClientTemplateID=this.template_id;
				}
			
				this.fireEvent('save');
				
				if(hide)
				{
					this.hide();
				}
			},
			failure: function(form, action) 
			{
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
	},
	buildForm : function () 
	{		
		this.formPanel = new Ext.FormPanel({
			cls:'go-form-panel',
			anchor:'100% 100%',
			bodyStyle:'padding:5px',
			defaults:{
				anchor: '95%'
			},
			defaultType:'textfield',
			waitMsgTarget:true,
			labelWidth:75,
			items: [
			{
				fieldLabel: GO.lang['strName'],
				name: 'name',
				allowBlank:false
			},{
				xtype:'textarea',
				name:'content',
				fieldLabel:GO.tickets.lang.template,
				height:210,
				allowBlank:false
			},{
				xtype:'xcheckbox',
				name:'default_template',
				boxLabel:GO.tickets.lang.default_template,
				hideLabel:true
			}
//			,{
//				xtype:'xcheckbox',
//				name:'autoreply',
//				boxLabel:GO.tickets.lang.auto_reply,
//				hideLabel:true
//			}
			,{
				xtype:'xcheckbox',
				name:'ticket_created_for_client',
				boxLabel:GO.tickets.lang.ticket_created_for_client,
				hideLabel:true
			}
//			,{
//				xtype:'xcheckbox',
//				name:'ticket_mail_for_agent',
//				boxLabel:GO.tickets.lang.ticket_created_for_agent,
//				hideLabel:true
//			},{
//				xtype:'xcheckbox',
//				name:'ticket_claim_notification',
//				boxLabel:GO.tickets.lang.ticket_claim_notification,
//				hideLabel:true
//			}
			]
		});

	}	
});