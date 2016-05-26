/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: BatchjobDialog.js 15897 2013-05-21 09:02:45Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 
GO.billing.BatchjobDialog = function(config){
	
	
	if(!config)
	{
		config={};
	}
	

	this.fromStatusField = new Ext.form.ComboBox({
         	hiddenName: 'from_status_id',
          fieldLabel: GO.billing.lang.changeOrderStatus,
          store: GO.billing.orderStatusesStore,
          valueField:'id',
          value:"0",
          displayField:'name',
          mode: 'local',
          triggerAction: 'all',
          forceSelection:true,
          anchor: '-20',
          editable: false
      });
  
  this.toStatusStore = new Ext.data.SimpleStore({
  	fields: ['id','name'],
  	data:[]
  });
  
  this.fromStatusField.on('select', function(){
  	if(this.toStatusField.getValue()==this.fromStatusField.getValue())
  		this.toStatusField.reset();
  		
  	this.toStatusStore.filterBy(function(record, id){
  		var from_status_id = this.fromStatusField.getValue();
  		return record.data.id != "0" && record.data.id!=from_status_id;  	
  	}, this)
  }, this);
      
  this.toStatusField = new Ext.form.ComboBox({
         	hiddenName: 'to_status_id',
          fieldLabel: GO.billing.lang.toStatus,
          store: this.toStatusStore,
          valueField:'id',
          displayField:'name',
          mode: 'local',
          triggerAction: 'all',
          emptyText: GO.billing.lang.selectStatus,
          allowBlank:false,
          forceSelection:true,
          anchor: '-20',
          editable: false
      });
      
  this.submitButton = new Ext.Button({
			text: GO.lang['cmdOk'],
			handler: function(){
				this.progressDialog = Ext.Msg.progress(GO.billing.lang.batchjob, GO.billing.lang.changingStatuses, GO.billing.lang.startCompleted);
				this.formPanel.form.baseParams.start=1;
				this.submitForm();
			},
			scope:this
		});
	
	this.formPanel = new Ext.form.FormPanel({
		region:'north',
		height:210,
		labelWidth:200,
		border: false,
		baseParams: {start: '1'},			
		cls:'go-form-panel',
		waitMsgTarget:true,			
		layout:'form',
		autoScroll:true,
		items:[
			this.fromStatusField,
			this.toStatusField,
			new Ext.form.DateField({
			  name: 'start_time',
				anchor: '-20',
			  format: GO.settings.date_format,			  
			  fieldLabel: GO.billing.lang.startPeriod
			}),
			new Ext.form.DateField({
			  name: 'end_time',
				anchor: '-20',
			  format: GO.settings.date_format,			  
			  fieldLabel: GO.billing.lang.endPeriod
			}),
			new Ext.form.Checkbox({
				boxLabel: GO.billing.lang.notifyCustomer,
				labelSeparator: '',
				name: 'notify_customer',
				hideLabel:true
			}),
			new Ext.form.Checkbox({
				boxLabel: GO.billing.lang.updateOrderDate,
				labelSeparator: '',
				name: 'update_btime',
				hideLabel:true
			})			
			]			
	});	
	
	config.buttons=[this.submitButton, {
		text: GO.lang.cmdClose,
		handler: function(){
			this.hide();
		},
		scope:this
	}];
	
	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};
	
	config.maximizable=false;
	config.layout='fit';
	config.modal=true;
	config.resizable=false;
	config.width=600;
	config.height=240;
	config.closeAction='hide';
	config.title= GO.billing.lang.batchjob;					
	config.items= [this.formPanel];
	config.focus= focusFirstField.createDelegate(this);
	
	GO.billing.BatchjobDialog.superclass.constructor.call(this, config);
	this.addEvents({'save' : true});	
}
Ext.extend(GO.billing.BatchjobDialog, GO.Window,{
	
	show : function (book_id) {
		if(!this.rendered)
		{
			this.render(Ext.getBody());
		}
		
		var data = [];
		var records = GO.billing.orderStatusesStore.getRange();
		
		for(var i=0;i<records.length;i++)
		{
			if(records[i].get('id')!="0")
				data.push([records[i].get('id'), records[i].get('name')]);
		}
		
		this.toStatusStore.loadData(data);		
		
		this.formPanel.form.baseParams.book_id=book_id;
			
		GO.billing.BatchjobDialog.superclass.show.call(this);
		
	},
	
	
	submitForm : function(){
		
		this.formPanel.form.submit(
		{
			waitMsg:GO.lang.waitMsgSave,
			url:GO.url("billing/order/batchStatus"),
			success:function(form, action){			
				
				this.formPanel.form.baseParams.start=0;
				
				if(action.result.finished)
				{		
					var msg = action.result.successfull+GO.billing.lang.ordersSuccessChanged;
					
					if(action.result.failed.length)
					{
						msg += GO.billing.lang.ordersFailed+"<br /><br />";
						
						for(var i=0;i<action.result.failed.length;i++)
						{
							msg +=action.result.failed[i]+"<br />";
						}
					}
					
					this.progressDialog.hide();						
					Ext.Msg.alert(GO.billing.lang.finished, msg);
					GO.mainLayout.getModulePanel('billing').refresh();
					this.hide();
				}else
				{
					
					var percentage = action.result.processed/action.result.total;
					var text = Math.round(percentage*100)+"% "+GO.billing.lang.completed;
					
					this.progressDialog.updateProgress(percentage, text);
					
					this.submitForm();
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