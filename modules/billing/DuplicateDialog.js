/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: DuplicateDialog.js 20813 2015-09-14 08:07:42Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

 
GO.billing.DuplicateDialog = function(config){
	
	config = config || {};

	this.formPanel = new Ext.form.FormPanel({
		waitMsgTarget:true,
		border: false,
		baseParams: {
			id: 0
		},			
		cls:'go-form-panel',			
		layout:'form',
		autoHeight:true,
		labelWidth:200,
		items:[
		new Ext.form.ComboBox({
			hiddenName: 'status_id',
			fieldLabel: GO.billing.lang.changeOrderStatus,
			store: GO.billing.orderStatusesStore, // GO.billing.orderStatusSelectStore,
			valueField:'id',
			displayField:'name',
			mode: 'local',
			triggerAction: 'all',
			emptyText: GO.billing.lang.noChangeStatus,
			anchor: '-20',
			editable: false
		}),this.newBookField = new Ext.form.ComboBox({
			hiddenName: 'new_book_id',
			fieldLabel: GO.billing.lang.copyToBook,
			store: GO.billing.writableBooksStore,
			valueField:'id',
			displayField:'name',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			editable: false,
			anchor: '-20'
		}),new Ext.form.Checkbox({
			boxLabel: GO.billing.lang.notifyCustomer,
			labelSeparator: '',
			name: 'notify_customer',		
			allowBlank: true,
			hideLabel:true
		}),new Ext.form.Checkbox({
			boxLabel: GO.billing.lang.duplicateLinks,
			labelSeparator: '',
			name: 'duplicate_links',		
			allowBlank: true,
			hideLabel:true
		}),new Ext.ux.form.XCheckbox({
			hideLabel: true,
			boxLabel: GO.billing.lang['linkToOriginal'],
			name: 'link_to_original',
			value: false
		})]
				
	});
	
	
	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};
	
	
	config.maximizable=true;
	config.layout='fit';
	config.modal=true;
	config.resizable=false;
	config.width=500;
	config.autoHeight=true;
	config.closeAction='hide';
	config.title= GO.billing.lang.duplicateOrder;					
	config.items= this.formPanel;
	config.focus= focusFirstField.createDelegate(this);
	config.buttons=[{
		text: GO.lang['cmdOk'],
		handler: function(){
			this.submitForm(true);
		},
		scope: this
	},{
		text: GO.lang['cmdCancel'],
		handler: function(){
			this.hide();
		},
		scope:this
	}					
	];
	
	GO.billing.DuplicateDialog.superclass.constructor.call(this, config);
	this.addEvents({
		'save' : true
	});	
}
Ext.extend(GO.billing.DuplicateDialog, Ext.Window,{
	
	show : function (order_id, book_id) {
			
		GO.billing.DuplicateDialog.superclass.show.call(this);
		
		
		this.formPanel.form.reset();
		this.formPanel.baseParams.id=order_id;
		
		this.newBookField.setValue(book_id);

	},
	
	
	submitForm : function(hide){
		this.formPanel.form.submit(
		{
			url:GO.url("billing/order/duplicate"),			
			waitMsg:GO.lang['waitMsgSave'],
			success:function(form, action){
				
				this.fireEvent('save', this, action.result.new_order_id, this.newBookField.getValue());
				this.hide();	
											
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