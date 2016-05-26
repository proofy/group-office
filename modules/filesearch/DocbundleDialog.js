/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: DocbundleDialog.js 21269 2016-03-22 16:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
GO.filesearch.DocbundleDialog = function(config){	
	if(!config)
	{
		config={};
	}
	this.buildForm();
	var focusFirstField = function(){
		this.propertiesPanel.items.items[0].focus();
	};
	config.collapsible=true;
	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=false;
	config.width=700;
	config.height=600;
	config.closeAction='hide';
	config.title= GO.filesearch.lang.docbundle;					
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
	GO.filesearch.DocbundleDialog.superclass.constructor.call(this, config);
	this.addEvents({
		'save' : true
	});
}
Ext.extend(GO.filesearch.DocbundleDialog, Ext.Window,{
	show : function (docbundle_id, config) {
		config = config || {};

		if(!this.rendered)
		{
			this.render(Ext.getBody());
		}
		delete this.link_config;
		this.formPanel.form.reset();		
		this.formPanel.form.baseParams.files=(config && config.files) ? Ext.encode(config.files) : "";
		this.formPanel.form.baseParams.dirs=(config && config.dirs) ? Ext.encode(config.dirs) : "";

		this.tabPanel.setActiveTab(0);
		if(!docbundle_id)
		{
			docbundle_id=0;			
		}
		this.setDocbundleId(docbundle_id);
		if(this.docbundle_id>0)
		{
			this.formPanel.load({
				url : GO.url("filesearch/docbundle/load"),
				waitMsg:GO.lang['waitMsgLoad'],
				success:function(form, action)
				{			
					this.readPermissionsTab.setAcl(action.result.data.acl_id);					
					GO.filesearch.DocbundleDialog.superclass.show.call(this);
				},
				failure:function(form, action)
				{
					GO.errorDialog.show(action.result.feedback)
				},
				scope: this				
			});
		}else 
		{
			if(config.saveLastSearch)
				this.formPanel.form.baseParams.save_last_search=1;

			this.readPermissionsTab.setAcl(0);
			GO.filesearch.DocbundleDialog.superclass.show.call(this);


		}
		//if the newMenuButton from another passed a linkTypeId then set this value in the select link field
		if(config && config.link_config)
		{
			this.link_config=config.link_config;
			if(config.link_config.modelNameAndId)
			{
				this.selectLinkField.setValue(config.link_config.modelNameAndId);
				this.selectLinkField.setRemoteText(config.link_config.text);
			}
		}

		if(config.values)
			this.formPanel.form.setValues(config.values);
	},

	setDocbundleId : function(docbundle_id)
	{
		this.formPanel.form.baseParams['id']=docbundle_id;
		this.docbundle_id=docbundle_id;
		this.selectLinkField.container.up('div.x-form-item').setDisplayed(docbundle_id==0);
	},
	submitForm : function(hide){
		this.formPanel.form.submit(
		{
			url:GO.url("filesearch/docbundle/submit"),
			
			waitMsg:GO.lang['waitMsgSave'],
			success:function(form, action){
				if(action.result.id)
				{
					this.setDocbundleId(action.result.id);
					this.readPermissionsTab.setAcl(action.result.acl_id);
				}				
				this.fireEvent('save', this, this.docbundle_id);				
				if(hide)
				{
					this.hide();	
				}
				if(this.link_config && this.link_config.callback)
				{					
					this.link_config.callback.call(this);					
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
		this.selectLinkField = new GO.form.SelectLink({
			anchor:'-20'
		});
		this.propertiesPanel = new Ext.Panel({
			title:GO.lang['strProperties'],			
			cls:'go-form-panel',			
			layout:'form',
			autoScroll:true,
			items:[{
				xtype: 'textfield',
				name: 'name',
				anchor: '-20',
				fieldLabel: GO.lang.strName
			}
			,{
				xtype: 'textarea',
				name: 'description',
				anchor: '-20',
				fieldLabel: GO.lang.strDescription
			},{
				xtype: 'textarea',
				name: 'keywords',
				anchor: '-20',
				fieldLabel: GO.lang.keywords
			},
			this.selectLinkField
			]
		});
		var items  = [this.propertiesPanel];		
		if(GO.customfields && GO.customfields.types["GO\\Filesearch\\Model\\Docbundle"])
		{
			for(var i=0;i<GO.customfields.types["GO\\Filesearch\\Model\\Docbundle"].panels.length;i++)
			{			  	
				items.push(GO.customfields.types["GO\\Filesearch\\Model\\Docbundle"].panels[i]);
			}
		}
		this.readPermissionsTab = new GO.grid.PermissionsPanel({
			});
		items.push(this.readPermissionsTab);
		this.tabPanel = new Ext.TabPanel({
			activeTab: 0,
			deferredRender: false,
			border: false,
			items: items,
			anchor: '100% 100%'
		});
		this.formPanel = new Ext.form.FormPanel({
			waitMsgTarget:true,
			
			border: false,
			baseParams: {
				id:0
			},
			items:this.tabPanel				
		});   
	}
});
GO.filesearch.showDocbundleDialog = function(docbundle_id, config){
	if(!GO.filesearch.docbundleDialog)
		GO.filesearch.docbundleDialog = new GO.filesearch.DocbundleDialog();
	if(GO.filesearch.docbundleDialogListeners){
		GO.filesearch.docbundleDialog.on(GO.filesearch.docbundleDialogListeners);
		delete GO.filesearch.docbundleDialogListeners;
	}
	GO.filesearch.docbundleDialog.show(docbundle_id, config);
}
//GO.linkHandlers["GO\\Filesearch\\Model\\Docbundle"]=function(id){
//	if(!GO.docbundles.linkWindow){
//		var docbundlePanel = new GO.filesearch.DocbundlePanel();
//		GO.filesearch.linkWindow= new GO.LinkViewWindow({
//			title: GO.docbundles.lang.docbundle,
//			items: docbundlePanel,
//			docbundlePanel: docbundlePanel,
//			closeAction:"hide"
//		});
//	}
//	GO.filesearch.linkWindow.docbundlePanel.load(id);
//	GO.filesearch.linkWindow.show();
//	return GO.filesearch.linkWindow;
//}
//
//GO.linkPreviewPanels["GO\\Filesearch\\Model\\Docbundle"]=function(config){
//	config = config || {};
//	return new GO.filesearch.DocbundlePanel(config);
//}
