/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: CategoryDialog.js 15897 2013-05-21 09:02:45Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

 
GO.billing.CategoryDialog = function(config){
	
	
	if(!config)
	{
		config={};
	}
	
	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};
	
	var records = GO.billing.languagesStore.getRange();
		
	var items = [];
	for(var i=0;i<records.length;i++)
	{
		var textfield = new Ext.form.TextField({
			fieldLabel:GO.lang.strName+' ('+records[i].get("name")+')',
			name:"name_"+records[i].get("id"),
			anchor:'-20',
			allowBlank: false
		});			
		
		items.push(textfield);	
	}
	
	//if webshop module
	if(GO.webshop)
	{
		items.push({
			  xtype: 'xcheckbox',
				boxLabel : GO.billing.lang.published,
				labelSeparator : '',
				name : 'published',
				hideLabel : true
			});
	}
	
	this.formPanel = new Ext.form.FormPanel({
			defaultType: 'textfield',
			labelWidth:120,
			cls:'go-form-panel',
			waitMsgTarget:true,
			items:items,
			autoHeight:true	,
			baseParams:{id : 0}
		});
	
	
	
	
	config.layout='fit';
	config.modal=false;
	config.resizable=false;
	config.width=400;
	config.autHeight=true;
	config.closeAction='hide';
	config.title= GO.billing.lang.newCategory;					
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

	
	GO.billing.CategoryDialog.superclass.constructor.call(this, config);
	
	
	this.addEvents({'save' : true});	
}

Ext.extend(GO.billing.CategoryDialog, Ext.Window,{

	
	show : function (category_id) {
		
		if(!this.rendered)
			this.render(Ext.getBody());

		this.setCategoryId(category_id);
		
		if(this.category_id>0)
		{
			this.formPanel.load({
				url : GO.url('billing/productCategory/load'),
				
				success:function(form, action)
				{		
					this.setCategoryId (action.result.data.id);
					this.formPanel.baseParams.parent_id=action.result.data.parent_id;
					this.setTitle(GO.billing.lang.category);
					
					GO.billing.CategoryDialog.superclass.show.call(this);
				},
				failure:function(form, action)
				{
					GO.errorDialog.show(action.result.feedback)
				},
				scope: this
				
			});
		}else 
		{
			this.setTitle(GO.billing.lang.newCategory);
			this.formPanel.form.reset();
			
			GO.billing.CategoryDialog.superclass.show.call(this);
		}
	},
	
	setCategoryId : function(category_id)
	{
		if(!category_id)
		{
			category_id = 0;
		} 
		this.formPanel.form.baseParams['id']=category_id;
		this.category_id=category_id;		
	},
	
	submitForm : function(hide){
		this.formPanel.form.submit(
		{
			url: GO.url('billing/productCategory/submit'),
			params: {
//				'task' : 'save_category'
				},
			waitMsg:GO.lang['waitMsgSave'],
			success:function(form, action){
				
				this.fireEvent('save', this);
				
				if(hide)
				{
					this.hide();	
				}else
				{				
					if(action.result.id)
					{
						this.setCategoryId(action.result.id);
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
		
	}
});

