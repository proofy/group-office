/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: StatusDialog.js 15897 2013-05-21 09:02:45Z mschering $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.StatusDialog = function(config){

	if(!config)
	{
		config = {};
	}

	this.buildForm();

	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};
    
	config.layout='fit';
	config.title=GO.tickets.lang.status;
	config.modal=false;
	config.border=false;
	config.width=400;
	config.autoHeight=true;
	config.resizable=false;
	config.plain=true;
	config.shadow=false,
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
		
	GO.tickets.StatusDialog.superclass.constructor.call(this,config);
	
	this.addEvents({'save' : true});
}

Ext.extend(GO.tickets.StatusDialog, Ext.Window, {
	
	show : function (record)
	{		
		if(!this.rendered)
			this.render(Ext.getBody());
			
		if(record)
		{
			this.status_id=record.data.id;
		}else
		{
			this.status_id=0;
		}
		
		if(this.status_id > 0)
		{
			this.formPanel.form.findField('name').setValue(record.data.name);
		}else
		{
			this.formPanel.form.reset();
		}
		GO.tickets.StatusDialog.superclass.show.call(this);
	},
	submitForm : function(hide)
	{
		this.formPanel.form.submit(
		{		
			url:GO.url("tickets/status/submit"),
			params: {
				id:this.status_id
			},
			waitMsg:GO.lang['waitMsgSave'],
			success:function(form, action)
			{
				if(action.result.id)
				{
					this.status_id=action.result.id;
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
			defaults:{anchor: '95%'},
			defaultType:'textfield',
			autoHeight:true,
			waitMsgTarget:true,
			labelWidth:75,
			items: [
				{
					fieldLabel: GO.lang['strName'],
					name: 'name',
					allowBlank:false
				}
			]
		});	
	}	
});