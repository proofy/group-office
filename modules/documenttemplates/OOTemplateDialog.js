/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: OOTemplateDialog.js 17091 2013-10-17 11:57:54Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

Ext.ns('GO.documenttemplates');

 
GO.documenttemplates.OOTemplateDialog = function(config){
	
	
	if(!config)
	{
		config={};
	}
	
	
	this.buildForm();
	
	var focusFirstField = function(){
		this.propertiesPanel.items.items[0].focus();
	};
	
	
	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=false;
	config.width=700;
	config.height=600;
	config.closeAction='hide';
	config.title= GO.documenttemplates.lang.documentTemplate;
	config.items= this.formPanel;
	config.focus= focusFirstField.createDelegate(this);
	config.buttons=[{
		text: GO.lang['cmdOk'],
		handler: function(){
			this.submitForm(true);
		},
		scope: this
	},{
		text: GO.lang['cmdApply'],
		handler: function(){
			this.submitForm();
		},
		scope:this
	},{
		text: GO.lang['cmdClose'],
		handler: function(){
			this.hide();
		},
		scope:this
	}
	];

	
	GO.documenttemplates.OOTemplateDialog.superclass.constructor.call(this, config);
	
	this.addEvents({
		'save' : true
	});
}

Ext.extend(GO.documenttemplates.OOTemplateDialog, Ext.Window,{
	
	show : function (oo_template_id) {
		
		if(!this.rendered)
		{
			this.render(Ext.getBody());
		}

		this.tabPanel.setActiveTab(0);

		if(!oo_template_id)
		{
			oo_template_id=0;			
		}
			
		this.setOOTemplateId(oo_template_id);
		
		if(this.oo_template_id>0)
		{
			this.formPanel.load({
				url : GO.url('documenttemplates/documentTemplate/load'),
				
				success:function(form, action)
				{
					this.readPermissionsTab.setAcl(action.result.data.acl_id);
					this.OODownloadButton.setDisabled(false);
					
					this.inline_attachments = action.result.data.inline_attachments;	
					
					GO.documenttemplates.OOTemplateDialog.superclass.show.call(this);
				},
				failure:function(form, action)
				{
					GO.errorDialog.show(action.result.feedback)
				},
				scope: this
				
			});
		}else 
		{			
			this.formPanel.form.reset();
			this.OODownloadButton.setDisabled(true);
			this.readPermissionsTab.setAcl(0);
			
			GO.documenttemplates.OOTemplateDialog.superclass.show.call(this);
		}
	},
	
	

	setOOTemplateId : function(oo_template_id)
	{
		this.formPanel.form.baseParams['id']=oo_template_id;
		this.oo_template_id=oo_template_id;		
	},
	
	submitForm : function(hide){
		this.formPanel.form.submit(
		{
			url:GO.url('documenttemplates/documentTemplate/submit'),
			waitMsg:GO.lang['waitMsgSave'],
			success:function(form, action){
				
				this.fireEvent('save', this);
				
				this.uploadFile.clearQueue();
					
				if(hide)
				{
					this.hide();	
				}else
				{
					if(action.result.id)
					{
						this.setOOTemplateId(action.result.id);
						this.OODownloadButton.setDisabled(false);
						this.readPermissionsTab.setAcl(action.result.acl_id);
					}
				}	
			},		
			failure: function(form, action) {
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
	
	
	buildForm : function () {
		
		var imageInsertPlugin = new GO.plugins.HtmlEditorImageInsert();
		imageInsertPlugin.on('insert', function(plugin)
		{
			this.inline_attachments.push({
				tmp_file: plugin.selectedPath,
				url: plugin.selectedUrl
			});
		}, this);

		this.propertiesPanel = new Ext.Panel({
			
			border: false,
			
			baseParams: {
				task: 'oo_template'
			},
			title:GO.lang['strProperties'],			
			cls:'go-form-panel',			
			layout:'form',
			autoScroll:true,
			items:[{
				xtype:'box',
				cls:'go-form-text',
				html:GO.documenttemplates.lang.documentTemplateText
			},{
				xtype: 'textfield',
				name: 'name',
				anchor: '100%',
				allowBlank:false,
				fieldLabel: GO.lang.strName
			},
			new GO.form.HtmlComponent({
				html:'<br />'
			}),
			this.uploadFile = new GO.form.UploadFile({
				inputName : 'import_file',
				max: 1
			}),
			new GO.form.HtmlComponent({
				html:'<br />'
			}),
			this.OODownloadButton = new Ext.Button({
				handler:  function()
				{
					document.location.href = GO.url("documenttemplates/documentTemplate/download",{id:this.oo_template_id});
				},
				disabled: true,
				text: GO.lang.download,
				scope: this
			})]
				
		});

		var items  = [this.propertiesPanel];
		
		this.readPermissionsTab = new GO.grid.PermissionsPanel({
			
			});
    
		items.push(this.readPermissionsTab);
 
		this.tabPanel = new Ext.TabPanel({
			activeTab: 0,
			deferredRender: false,
			border: false,
			items: items,
			anchor: '100% 100%'
		}) ;
    
    
		this.formPanel = new Ext.form.FormPanel({
			border: false,
			baseParams: {
				task: 'oo_template'
			},
			waitMsgTarget:true,
			fileUpload:true,	
			items:this.tabPanel				
		});
    
    
	}
});