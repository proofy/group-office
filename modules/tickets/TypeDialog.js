/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TypeDialog.js 21295 2016-04-07 13:50:31Z mschering $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.TypeDialog = function(config){	
	
	if(!config)
	{
		config={};
	}
	
	this.buildForm();
	
	var focusFirstField = function(){
		this.propertiesPanel.items.items[0].focus();
	};
	
	config.layout='fit';
	config.title=GO.tickets.lang.type;
	config.maximizable=true;
	config.modal=false;
	config.width=700;
	config.height=600;
	config.resizable=false;
	config.minizable=true;
	config.closeAction='hide';	
	config.items=this.formPanel;
	config.focus=focusFirstField.createDelegate(this);
	config.buttons=[{
		text: GO.lang['cmdOk'],
		handler: function()
		{
			this.submitForm(true);
		},
		scope: this
	},{
		text: GO.lang['cmdApply'],
		handler: function()
		{
			this.submitForm();
		},
		scope:this
	},{
		text: GO.lang['cmdClose'],
		handler: function()
		{
			this.hide();
		},
		scope:this
	}];
	
	GO.tickets.TypeDialog.superclass.constructor.call(this, config);
	
	this.addEvents({
		'save' : true
	});
}

Ext.extend(GO.tickets.TypeDialog, Ext.Window,{
		
	show : function (type_id)
	{
		if(!this.rendered)
			this.render(Ext.getBody());
		
		this.tabPanel.setActiveTab(0);
		
		if(!type_id)
		{
			type_id=0;			
		}
			
		this.setTypeId(type_id);
		
		if(this.type_id>0)
		{
			this.formPanel.load({
				url : GO.url("tickets/type/load"),
				
				success:function(form, action)
				{
					this.setRemoteComboTexts(action);
					this.setWritePermission(action.result.data.permission_level>=GO.permissionLevels.write);					
					this.readPermissionsTab.setAcl(action.result.data.acl_id);
					this._enableCustomSenderFields(action.result.data.custom_sender_field);
						
					GO.tickets.TypeDialog.superclass.show.call(this);
				},
				failure:function(form, action)
				{
					GO.errorDialog.show(action.result.feedback)
				},
				scope: this
			});
		}else {
			this.formPanel.form.reset();

			this.readPermissionsTab.setAcl(0);
			
			this.setWritePermission(true);
			
			GO.tickets.TypeDialog.superclass.show.call(this);
		}
	},
	setRemoteComboTexts : function(loadAction){
		if(loadAction.result.remoteComboTexts){
			var t = loadAction.result.remoteComboTexts;
			for(var fieldName in t){
				var f = this.formPanel.form.findField(fieldName);				
				if(f)
					f.setRemoteText(t[fieldName]);
			}
		}
	},
	setWritePermission : function(writePermission)
	{
		this.buttons[0].setDisabled(!writePermission);
		this.buttons[1].setDisabled(!writePermission);
	},
	setTypeId : function(type_id)
	{
		this.formPanel.form.baseParams['id']=type_id;
		
		if(GO.settings.modules.email && GO.settings.modules.email.read_permission)
		{
			// Added for the email account selection
			this.selectAccount.store.baseParams['type_id']=type_id;
			this.selectAccount.clearLastSearch();
			this.selectAccount.store.removeAll();
		}
		
		this.type_id=type_id;
	},
	submitForm : function(hide)
	{
		this.formPanel.form.submit(
		{
			url:GO.url("tickets/type/submit"),
			
			waitMsg:GO.lang['waitMsgSave'],
			success:function(form, action)
			{
				this.fireEvent('save', this);
				
				if(hide)
				{
					this.hide();	
				}else{
					if(action.result.id)
					{
						this.setTypeId(action.result.id);
						
						this.readPermissionsTab.setAcl(action.result.acl_id);
					}
				}
			},		
			failure: function(form, action)
			{
				if(action.failureType == 'client')
				{					
					Ext.MessageBox.alert(GO.lang['strError'], GO.lang['strErrorsInForm']);			
				} else {
					Ext.MessageBox.alert(GO.lang['strError'], action.result.feedback);
				}
			},
			scope: this
		});
	},
	buildForm : function ()
	{
		var propItems = [ 
		{
			xtype:'textfield',
			name:'name',
			anchor:'95%',
			allowBlank:false,
			fieldLabel:GO.lang.strName
		},{
			xtype: 'comboboxreset',
			name:'type_group_id',
			hiddenName: 'type_group_id',
			anchor:'95%',
			fieldLabel:GO.tickets.lang['typeGroup'],
			mode: 'remote',
			pageSize: 10,
			emptyText:GO.tickets.lang['general'],
			autoLoad: true,
			triggerAction: 'all',
			store: new GO.data.JsonStore({
				url: GO.url('tickets/typeGroup/store'),
				fields: ['id', 'name']
			}),
			valueField: 'id',
			displayField: 'name'
        },{
			xtype:'textarea',
			name:'description',
			anchor:'95%',
			allowBlank:true,
			fieldLabel:GO.lang.strDescription
		},{
			xtype:'xcheckbox',
			name:'show_from_others',
			boxLabel:GO.tickets.lang.show_from_others,
			hideLabel:true
		},{
			xtype:'textarea',
			name:'email_on_new',			
			fieldLabel:GO.tickets.lang.ticketEmail_on_new,
			anchor:'95%'
		},{
			xtype:'xcheckbox',
			name:'email_to_agent',
			boxLabel:GO.tickets.lang.emailToAgent,
			hideLabel:true
		},this.customSenderCB = new Ext.ux.form.XCheckbox({
			name:'custom_sender_field',
			boxLabel:GO.tickets.lang['customSender'],
			hideLabel:true
		}),this.customSenderNameField = new Ext.form.TextField({
			name:'sender_name',			
			fieldLabel:GO.tickets.lang['customSenderName'],
			anchor:'95%',
			allowBlank: false,
			disabled: true
		}),this.customSenderEmailField = new Ext.form.TextField({
			name:'sender_email',			
			fieldLabel:GO.tickets.lang['customSenderEmail'],
			anchor:'95%',
			allowBlank: false,
			disabled: true
		}),{
			xtype:'xcheckbox',
			name:'publish_on_site',
			boxLabel:GO.tickets.lang.show_external,
			hideLabel:true
		}
		];
				
		this.customSenderCB.on('check',function(cb,checked){
			this._enableCustomSenderFields(checked);
		},this);
		
		if(GO.settings.modules.email && GO.settings.modules.email.read_permission)
		{
			
			propItems.push({
				style:'margin-top:20px; margin-bottom:5px;',
				anchor:'95%',
				xtype:'htmlcomponent',
				html:GO.tickets.lang.importCaution
			})
			
			this.selectAccount = new GO.form.ComboBoxReset({
				fieldLabel: GO.tickets.lang.importMailbox,
				hiddenName:'email_account_id',
				anchor:'95%',
				emptyText:GO.lang.none,
				store: new GO.data.JsonStore({
					url: GO.url("tickets/type/availableEmailAccounts"),
					fields: ['id', 'username'],
					remoteSort: true
				}),
				valueField:'id',
				displayField:'username',
				typeAhead: true,
				mode: 'remote',
				triggerAction: 'all',
				editable: true,
				selectOnFocus:true,
				forceSelection: true,
				pageSize:GO.settings.max_rows_list
			});

			propItems.push(this.selectAccount);
		}
		
		this.propertiesPanel = new Ext.Panel({
			url:GO.settings.modules.tickets.url+'action.php',
			border:false,
			baseParams:{
				task:'type'
			},
			title:GO.lang['strProperties'],	
			cls:'go-form-panel',
			waitMsgTarget:true,			
			layout:'form',
			autoScroll:true,
			items:propItems
		});
						     		
		this.readPermissionsTab = new GO.grid.PermissionsPanel({
			levels: [
				GO.permissionLevels.read, 
				GO.permissionLevels.write, 
				GO.permissionLevels.writeAndDelete, 
				GO.permissionLevels.manage
			]
		});
		
		
		this.templates = new Ext.Panel({
			title: GO.tickets.lang['email notifications'],
			autoScroll: true,
			cls:'go-form-panel',
			bodyStyle:'padding:5px',
			defaults:{
				hideLabel: true
			},
			items: [
				this.enableTemplates = new Ext.ux.form.XCheckbox({
					name: 'enable_templates',
					boxLabel: GO.tickets.lang['enable templates by type'],
					checked: false
				}), 
				this.settingsTemplatesForm = new GO.tickets.SettingsTemplatesForm({
					disabled: !this.enableTemplates.checked
				})
			]
		});
		
		this.enableTemplates.on('check', function(chechBox, checked) {
			if(checked) {
				this.settingsTemplatesForm.enable();
			} else {
				this.settingsTemplatesForm.disable();
			}
		}, this);
		
		var items = [
			this.propertiesPanel, 
			this.readPermissionsTab, 
			this.templates
		];
			 
		this.tabPanel = new Ext.TabPanel({
			activeTab:0,      
			deferredRender:false,
			border:false,
			items:items,
			anchor:'100% 100%'
		});
	    
		this.formPanel = new Ext.form.FormPanel({
			waitMsgTarget:true,
			url:GO.settings.modules.tickets.url+'action.php',
			border:false,
			baseParams:{
				task:'type'
			},
			items:this.tabPanel
		});
	},
	
	_enableCustomSenderFields : function(enable) {
		var disable = !enable;
		this.customSenderNameField.setDisabled(disable);
		this.customSenderEmailField.setDisabled(disable);
	}
});