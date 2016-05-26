/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: OrderDialog.js 21319 2016-04-18 11:08:43Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

 
GO.billing.OrderDialog = function(config){	
	if(!config)
	{
		config={};
	}
	
	//for adding listeners before contstruction
	config.goDialogId='order';
	
	this.buildForm();
	
	var focusFirstField = function(){
		this.propertiesPanel.items.items[0].focus();
	};
	
	config.tbar=[
	{
		iconCls: 'filetype-pdf',
		text: 'PDF',
		itemId:'pdf',
		handler: function()
		{
//			if(GO.billing.isPurchaseOrderBook)
//			{
//				GO.billing.activePanel.createPurchaseOrders(1, this.order_id);
//			}else
//			{
				if(this.formPanel.form.findField('status_id').getValue()>0)
				{
					GO.billing.activePanel.getFile(this.order_id, true);
				}else
				{
					Ext.Msg.show({
						title: '',
						icon: Ext.MessageBox.INFO,
						msg: GO.billing.lang.statusNeeded,
						buttons: Ext.Msg.OK,
						animEl: 'elId',
						fn: function(btn) {
							this.showOrderStatusSelect(true);
						},
						scope : this
					});
				}
//			}
		},
		scope: this
	},{
		iconCls: 'filetype-doc',
		text: 'Document',
		itemId:'document',
		handler: function()
		{
			if(GO.billing.isPurchaseOrderBook)
			{
				GO.billing.activePanel.createPurchaseOrders(0, this.order_id);
			}else
			{
				if(this.formPanel.form.findField('status_id').getValue()>0)
				{
					GO.billing.activePanel.getFile(this.order_id);
				}else
				{
					Ext.Msg.show({
						title: '',
						icon: Ext.MessageBox.INFO,
						msg: GO.billing.lang.statusNeeded,
						buttons: Ext.Msg.OK,
						animEl: 'elId',
						fn: function(btn) {
							this.showOrderStatusSelect();
						},
						scope : this
					});
				}
			}
		},
		scope: this
	},{
		iconCls: 'bs-send-email',
		text: GO.lang.strEmail,
		cls: 'x-btn-text-icon',
		handler: function(){
			
				if(!GO.settings.modules.email)
				{
					GO.errorDialog.show(GO.billing.lang.noEmailModule);
				}else
				{
					if(this.formPanel.form.findField('status_id').getValue()>0)
					{
						GO.email.showComposer({
							link_config:{modelNameAndId:"GO\\Billing\\Model\\Order:"+this.order_id,'text':this.title},
							loadUrl: GO.url("billing/order/send"),
							loadParams:{
								id: this.order_id
							},
							template_id: 0
						});
					} else {
						Ext.Msg.show({
						title: '',
						icon: Ext.MessageBox.INFO,
						msg: GO.billing.lang.statusNeeded,
						buttons: Ext.Msg.OK,
						animEl: 'elId',
						fn: function(btn) {
							this.showOrderStatusSelect(true, true);
						},
						scope : this
					});
					}
				}
				
		},
		scope:this
	},{
		iconCls: 'bs-duplicate',
		text: GO.billing.lang.duplicate,
		cls: 'x-btn-text-icon',
		handler: function(){
			GO.billing.duplicateDialog.show(this.order_id, this.formPanel.baseParams.book_id);
		},
		scope:this
	},this.deliveryButton = new Ext.Button({
		iconCls: 'bs-duplicate',
		text: GO.billing.lang.delivery,
		hidden:true,
		cls: 'x-btn-text-icon',
		handler: function(){
			if(!GO.billing.deliveryDialog)
			{

				GO.billing.deliveryDialog = new GO.billing.DeliveryDialog();
			}

			GO.billing.deliveryDialog.show(this.order_id);

		},
		scope:this
	})
	];
	
	config.collapsible=true;
	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.animCollapse=false;
	config.resizable=true;
	config.width=800;
	config.height=600;
	config.closeAction='hide';
	config.title= GO.billing.lang.order;					
	config.items= this.formPanel;
	config.focus= focusFirstField.createDelegate(this);
	config.buttons=[{
		text: GO.lang['cmdOk'],
		handler: function(){
			this.submitForm(true);
		},
		scope: this
	},{
		text: GO.lang['cmdSave'],
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
	
	GO.billing.OrderDialog.superclass.constructor.call(this, config);
	this.addEvents({
		'save' : true
	});
	
	
	GO.billing.orderDialog =  this;
}
Ext.extend(GO.billing.OrderDialog, GO.Window,{
	contactEmailNotOverwriteCustomerEmail : false,

	afterLoad : function(action){},
	
	show : function (order_id, config) {
		
		config = config || {};
		
		if(!this.rendered)
		{
			this.render(Ext.getBody());
		}

		if(!this.inititalized){
			
			var requests = {
				writable_books:{r:"billing/book/store", "permissionLevel": GO.permissionLevels.write},				
				languages:{r:"billing/language/store"}
			}
			
			if(GO.webshop){
				requests.webshops={r:"webshop/webshop/store"}
			}
			
			GO.request({
				maskEl:this.getEl(),
				url: "core/multiRequest",
				params:{
					requests:Ext.encode(requests)
				},
				success: function(options, response, result)
				{
						if(GO.webshop)
						{
							GO.billing.webshopsStore.loadData(result.webshops);
						}

						this.selectBook.store.loadData(result.writable_books);

						if(!GO.billing.languagesStore.loaded)
						{
							GO.billing.languagesStore.loadData(result.languages);
						}
		
						this.inititalized=true;
						this.show(order_id, config);
				},
				scope:this
			});    

//			this.getEl().mask(GO.lang.waitMsgLoad);
//			Ext.Ajax.request({
//				url: GO.settings.modules.billing.url+'json.php',
//				params:{
//					task:'init_order_window'
//				},
//				callback: function(options, success, response)
//				{
//
//					if(!success)
//					{
//						alert( GO.lang['strRequestError']);
//					}else
//					{
//						var jsonData = Ext.decode(response.responseText);
//
//						if(GO.billing.webshopsStore && !GO.billing.webshopsStore.loaded)
//						{
//							GO.billing.webshopsStore.loadData(jsonData.webshops);
//						}
//
//						this.selectBook.store.loadData(jsonData.writable_books);
//
//						if(!GO.billing.languagesStore.loaded)
//						{
//							GO.billing.languagesStore.loadData(jsonData.languages);
//						}
//
//						
//						this.getEl().unmask();
//
//						this.inititalized=true;
//						this.show(order_id, config);
//
//					}
//				},
//				scope:this
//			});
			return false;
		}
		
		delete this.link_config;
		this.formPanel.form.reset();
		
		
		if(config.values)
		{
			this.formPanel.form.setValues(config.values);	
		}
		
		
		this.tabPanel.setActiveTab(0);
		
		if(!order_id)
		{
			order_id=0;			
		}
			
		this.setOrderId(order_id);
		
		this.formPanel.baseParams.contact_id=0;
		this.formPanel.baseParams.company_id=0;

		if(this.order_id>0)
		{
			this.formPanel.load({
				//url : GO.settings.modules.billing.url+'json.php',				
				url:GO.url('billing/order/load'),
				success:function(form, action)
				{					
					this.statusPanel.setBookId(action.result.data.book_id);
					
					this.itemsPanel.itemsGrid.setBookId(action.result.data.book_id);
					// Initialize the salesagents fields
					this.setDisplaySalesAgents(action.result.data.book_id);
					
					//this.formPanel.baseParams.book_id=action.result.data.book_id;
					this.selectUser.setRemoteText(action.result.data.user_name);
					this.selectTelesalesAgent.setRemoteText(action.result.data.telesales_agent_name);
					this.selectFieldsalesAgent.setRemoteText(action.result.data.fieldsales_agent_name);
					
					this.shippingPanel.disableFields(action.result.data.other_shipping_address);
					
					if(this.selectProject)
						this.selectProject.setRemoteText(action.result.remoteComboTexts.project_id);
					
					this.formPanel.baseParams.contact_id=action.result.data.contact_id;
					this.formPanel.baseParams.company_id=action.result.data.company_id;

					this.itemsPanel.itemsGrid.setSupplierId(action.result.data.book_id, action.result.data.company_id, action.result.data.customer_name);
					
					this.setTitleFromBook(action.result.data.order_id);
					
					this.afterLoad(action);
					
					this.contactEmailNotOverwriteCustomerEmail = false;
					
					// Load the due date (initialize both dueDate fields)
					this.loadDueDate();
					
					GO.billing.OrderDialog.superclass.show.call(this);
				},
				failure:function(form, action)
				{
					GO.errorDialog.show(action.result.feedback)
				},
				scope: this
				
			});
		}else 
		{
			var book_id=this.selectBook.getValue();
			this.selectBook.setValue(book_id);
			this.selectCountry.setValue(GO.billing.defaultCountry);
		
			// Load the due date (initialize both dueDate fields)
			this.setDefaultDueDate(book_id);
			
			// Initialize the salesagents fields
			this.setDisplaySalesAgents(book_id);
		
			this.statusPanel.setBookId(book_id);
                        
			this.itemsPanel.itemsGrid.setSupplierId(book_id, 0,"");

			this.setTitleFromBook();
			this.costCodeCombo.selectFirst();                        
			
			this.contactEmailNotOverwriteCustomerEmail = false;
				
			GO.billing.OrderDialog.superclass.show.call(this);			
		}

		//delete this.formPanel.baseParams.project_id;
		
		if(this.order_id==0 && this.selectBook.getValue()==0)
		{
			this.selectBook.container.up('div.x-form-item').show();
			if(config.link_config && (config.link_config.model_name == "GO\\Projects\\Model\\Project"))
			{
				//this.formPanel.baseParams.project_id = config.link_config.model_id;
				if(this.selectProject){
					this.selectProject.setValue(config.link_config.model_id);
					this.selectProject.setRemoteText(config.link_config.text);
				}
			}
		}else
		{
			this.selectBook.container.up('div.x-form-item').hide();
		}
		
		//if the newMenuButton from another passed a linkTypeId then set this value in the select link field
		if(config && config.link_config)
		{
			this.link_config=config.link_config;
			if(config.link_config.modelNameAndId)
			{
				this.selectLinkField.setValue(config.link_config.modelNameAndId);
				this.selectLinkField.setRemoteText(config.link_config.text);
				
				if(this.selectProject && config.link_config.model_name == "GO\\Projects2\\Model\\Project") {
					this.selectProject.setValue(config.link_config.model_id);
					this.selectProject.setRemoteText(config.link_config.text);
				}
				
//				var params=false;
//				var url=false;
//				if(config.link_config.model_name=="GO\\Addressbook\\Model\\Contact")
//				{
//					url = GO.url("addressbook/contact/load");
//					params={						
//						id:config.link_config.model_id
//					};
//
//					this.formPanel.baseParams.contact_id=config.link_config.id;
//
//				}
//				if(config.link_config.model_name=="GO\\Addressbook\\Model\\Company")
//				{
//					url = GO.url("addressbook/company/load");
//					params={						
//						id:config.link_config.model_id
//					};
//					this.formPanel.baseParams.company_id=config.link_config.id;
//				}
//				
//				if(params)
//				{				
//					this.formPanel.load({
//						url : url,
//						params: params,
//						failure:function(form, action)
//						{
//							GO.errorDialog.show(action.result.feedback)
//						},
//						scope: this						
//					});
//				}
			}
		}
	},
  
	// Display the sales agent fields
	setDisplaySalesAgents : function(bookId){
		
		if (!GO.util.empty(bookId))
			var record = this.selectBook.getStore().getById(bookId);
		else
			var record = this.selectBook.getStore().getAt(0);
		
		if (record){
			this.selectTelesalesAgent.setVisible(record.json.show_sales_agents);
			this.selectFieldsalesAgent.setVisible(record.json.show_sales_agents);
		}
	},	
	
	// DUE DATE FIELDS 
	setDefaultDueDate : function(bookId){
		
		if (!GO.util.empty(bookId))
			var record = this.selectBook.getStore().getById(bookId);
		else
			var record = this.selectBook.getStore().getAt(0);
		if (record)
			this.dueDateNumber.setValue(record.json.default_due_days);
		this.syncDueDateFields(true);
	},
	
	loadDueDate : function(){
		this.syncDueDateFields(false);
	},
	
	syncDueDateFields : function(fromNumber){

		var startField = (this.dTimeField.getValue() > this.bTimeField.getValue()) ? this.dTimeField : this.bTimeField;

		// fromNumber is a boolean that tells from which input field the value needs to be the leading value.
		if(fromNumber){
			var days = this.dueDateNumber.getValue();
			var newDate = startField.getValue();
			newDate.setDate(newDate.getDate()+parseInt(days));
			this.dueDate.setValue(newDate);
		} else {
			var dueDate = this.dueDate.getValue();
			var bDate = startField.getValue();
			
			// If dueDate is empty, then set it to today (First try it from the bTimeField else use new Date objects)
			if(GO.util.empty(dueDate)){
				dueDate = startField.getValue();

				if(GO.util.empty(dueDate)){
					dueDate = new Date();
					bDate = new Date();
				}
				
				this.dueDate.setValue(dueDate);
			}
				
			var days = dueDate.calculateDaysBetweenDates(bDate);
			this.dueDateNumber.setValue(days);
		}
	},
	// END OF DUE DATE FIELDS
	
	setOrderId : function(order_id, items_loaded)
	{
		this.getTopToolbar().setDisabled(order_id==0);
//		this.totalPaidField.setDisabled(true);
		this.formPanel.form.baseParams['id']=order_id;
		this.order_id=order_id;
		this.itemsPanel.setOrderId(order_id, items_loaded);
		this.statusPanel.setOrderId(order_id);	
		
		if(order_id > 0){
			this.paymentsPanel.setDisabled(false);
		} else {
			this.paymentsPanel.setDisabled(true);
		}
		this.paymentsPanel.setOrderId(order_id);

		this.selectLinkField.container.up('div.x-form-item').setDisplayed(order_id==0);		
	},
	
	submitForm : function(hide, params){
		
		params = params || {
			//'task' : 'save_order'				
		};

//		if(!params.dialog && (this.formPanel.baseParams.company_id == 0 || (this.formPanel.baseParams.contact_id == 0 && !GO.util.empty(this.selectContact.getValue()))))
//		{
//			params['add_company']=0;
//			this.addContactDialog = new GO.billing.AddContactDialog();
//			this.addContactDialog.show();
//
//			params['ab'] = '';
//
//			this.addContactDialog.on('hide', function(){
//				params['dialog']=true;
//				if(this.addContactDialog.addToAddressbook)
//				{
//					params['ab'] = this.addContactDialog.selectAddressbook.getRawValue();
//					params['add_company']=1;
//				}
//				this.submitForm(hide, params);
//			}, this);
//		}
//		else
//		{
		
			if(this.itemsPanel.itemsGrid.changed)
			{
				params['items']=Ext.encode(this.itemsPanel.itemsGrid.getGridData());
			}

			this.formPanel.form.submit(
			{
				url:GO.url('billing/order/submit'),//GO.settings.modules.billing.url+'action.php',
				params: params,
				waitMsg:GO.lang['waitMsgSave'],
				success:function(form, action){

					if(action.result.id)
					{
						this.setOrderId(action.result.id, this.itemsPanel.itemsGrid.changed);
					}

					if(action.result.contact_id)
					{
						this.formPanel.baseParams.contact_id = action.result.contact_id;
					}

					if(action.result.company_id)
					{
						this.formPanel.baseParams.company_id = action.result.company_id;
					}

					if(action.result.text_order_id)
					{
						this.setTitleFromBook(action.result.text_order_id);
					}

					if(hide)
					{
						this.hide();
					}else
					{
						if(action.result.new_items)
						{
							this.itemsPanel.itemsGrid.setIds(action.result.new_items);
						}

						this.itemsPanel.itemsGrid.store.commitChanges();

						if(action.result.status_history_changed)
						{
							if(action.result.ptime)
							{
								this.formPanel.form.findField('ptime').setValue(action.result.ptime);
							}

							//if(this.statusPanel.statusGrid.store.loaded)
							//{
							this.statusPanel.statusGrid.store.load();
						//}
						}
					}

					this.fireEvent('save', this, this.order_id);
					
					GO.dialog.TabbedFormDialog.prototype.refreshActiveDisplayPanels.call(this);
					
					if(params.callback){
						params.callback.call(params.scope);
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

						if(action.result.order_id)
						{
							this.setOrderId(action.result.order_id, this.itemsPanel.itemsGrid.changed);
						}

						if(action.result.new_items)
						{
							this.itemsPanel.itemsGrid.setIds(action.result.new_items);
						}
						this.itemsPanel.itemsGrid.store.commitChanges();

					}
				},
				scope: this
			});
		//}
	},

	setTitleFromBook : function(order_id){
		var bookRecord = this.selectBook.store.getById(this.selectBook.getValue());

		if(GO.util.empty(order_id)){
			order_id=GO.lang.cmdNew;
		}

		if(bookRecord){
			
			if(bookRecord.data.is_purchase_orders_book=="1")
				this.changeLabelsForBookType('purchaseorder');
			else
				this.changeLabelsForBookType('default');
			
			this.itemsPanel.itemsGrid.setPurchaseOrderBook(bookRecord.data.is_purchase_orders_book=="1");
			this.deliveryButton.setVisible(bookRecord.data.is_purchase_orders_book=="1");
			//this.dtimeField.setVisible(bookRecord.data.is_purchase_orders_book=="1");
			
			this.setTitle(bookRecord.get('name')+' - '+order_id);
			this.selectContact.store.baseParams.addressbook_id=bookRecord.data.addressbook_id;
			this.selectCompany.store.baseParams.addressbook_id=bookRecord.data.addressbook_id;

			this.selectContact.lastQuery = null;
			this.selectCompany.lastQuery = null;

		}else{
			this.setTitle(GO.billing.lang.selectBook);
		}
	},
	
	changeLabelsForBookType : function(booktype){

		this.statusPanel.changeLabelsForBookType(booktype);
		
		if(booktype == 'purchaseorder'){
			this.selectCompany.setLabel(GO.billing.lang.supplier);
		} else {
			this.selectCompany.setLabel(GO.billing.lang.customer);
		}
	},
	
	applyContactRecord : function(record){
		var values = {
			customer_name: record.data.name,
			customer_contact_name: record.data.name,
			customer_address: record.data.address,
			customer_address_no: record.data.address_no,
			customer_zip: record.data.zip,
			customer_city: record.data.city,
			customer_state: record.data.state,
			customer_country: record.data.country,
			customer_email: record.data.email
		};

		if(GO.customfields){
			var map = GO.customfields.getMatchingFieldNamesMap("GO\\Addressbook\\Model\\Company", "GO\\Billing\\Model\\Order");

			for(var contact_col in map){
				values[map[contact_col]]=record.data[contact_col];
			}
		}
		this.formPanel.form.setValues(values);
		this.formPanel.baseParams['contact_id'] = record.data.id;
		
	},

	applyCompanyRecord : function(record){		
		if (!GO.util.empty(record.data.invoice_email)) {
			this.contactEmailNotOverwriteCustomerEmail = true;
			var customer_email = record.data.invoice_email;
		} else {
			this.contactEmailNotOverwriteCustomerEmail = false;
			var customer_email = record.data.email;
		}

		var values = {
			customer_name : record.data.name_and_name2,
			customer_address: record.data.post_address,
			customer_address_no: record.data.post_address_no,
			customer_zip: record.data.post_zip,
			customer_city: record.data.post_city,
			customer_state: record.data.post_state,
			customer_country: record.data.post_country,
			customer_vat_no: record.data.vat_no,
			customer_crn: record.data.crn
		};                
		
		if(customer_email) {
			values.customer_email = customer_email;
		}

		if(GO.customfields){
			var map = GO.customfields.getMatchingFieldNamesMap("GO\\Addressbook\\Model\\Company", "GO\\Billing\\Model\\Order");
			for(var contact_col in map){
				values[map[contact_col]]=record.data[contact_col];
			}
		}
		var cmp;		
		for(var field in values){
			cmp=this.formPanel.form.findField(field);
			if(cmp){// && (cmp.getValue()=='' || cmp.getName()=='customer_country'))
					
					cmp.setValue(values[field]);
			}
		}
		
		//this.formPanel.form.setValues(values);
		this.formPanel.baseParams.company_id=record.data.id;

		this.itemsPanel.itemsGrid.setSupplierId(this.selectBook.getValue(), record.id, record.data.name_and_name2);
                
	},
	
	buildForm : function () {
		
		var now = new Date();
		
		this.selectLinkField = new GO.form.SelectLink({
			anchor:'-20'
		});
		
		this.selectCompany = new GO.addressbook.SelectCompany ({
			name: 'customer_name',
			anchor: '-20',
			allowBlank:false,
			fieldLabel: GO.billing.lang.customer
		});

		this.selectCompany.on('focus',function(){
			this.oldCompany=this.selectCompany.getRawValue();
			this.oldContact=this.selectContact.getRawValue();
		}, this);
			
		this.selectCompany.on('select', function(combo, record){
			this.applyCompanyRecord(record);
			
			
			
			
			
			
			
		}, this);

		this.selectCompany.on('change', function(){
			if((this.txtCustomerTo.getValue()==this.buildCustomerTo(this.oldCompany, this.oldContact) || (this.txtCustomerTo.getValue()== '')))
				this.txtCustomerTo.setValue(this.buildCustomerTo(this.selectCompany.getRawValue(),this.selectContact.getRawValue()));
		},this);

		this.txtCustomerTo = new Ext.form.TextArea({
			name: 'customer_to',
			anchor: '-20',
			height: 36,
			fieldLabel: GO.billing.lang.customerTo
		});


		
		this.selectContact = new GO.addressbook.SelectContact ({
//                        tpl: '<tpl for="."><div class="x-combo-list-item">{name} <tpl if="company_name">({company_name})</tpl> <tpl if="department">({department})</tpl> <tpl if="go_user_id&gt;0"><div class="go-model-icon-GO_Base_Model_User" style="width:16px;height:16px;display:inline-block;vertical-align:middle"></div></tpl></div></tpl>',
			
                    tpl: new Ext.XTemplate(
                        '<tpl for=".">',
                        '<tpl if="this.ab_name != values.ab_name">',
                        '<tpl exec="this.ab_name = values.ab_name"></tpl>',
                        '<h1><b>{ab_name}</b></h1>',
                        '</tpl>',
                        '<div class="x-combo-list-item">{name} <tpl if="company_name"><small style="color:#333;">{company_name}</small></tpl> <tpl if="department"><small style="color:#333;">({department})</small></tpl> <tpl if="go_user_id&gt;0"><div class="go-model-icon-GO_Base_Model_User" style="width:16px;height:16px;display:inline-block;vertical-align:middle"></div></tpl></div>',
                        '</tpl>'
                    ),
                    
                    name: 'customer_contact_name',
			anchor: '-20',
			getCompanyInfo:true,
			fieldLabel: GO.billing.lang.customerContact
		});

		this.selectContact.on('focus',function(){
			this.oldContact=this.selectContact.getRawValue();
			this.oldCompany=this.selectCompany.getRawValue();
		}, this);

		this.selectContact.on('change', function(){
			if((this.txtCustomerTo.getValue()==this.buildCustomerTo(this.oldCompany, this.oldContact) || (this.txtCustomerTo.getValue()== '')))
				this.txtCustomerTo.setValue(this.buildCustomerTo(this.selectCompany.getRawValue(),this.selectContact.getRawValue()));
		},this);

		this.selectContact.on('select', function(combo, record){
			this.formPanel.form.setValues({customer_salutation: record.data.salutation});
			
			if (!this.contactEmailNotOverwriteCustomerEmail)
				this.formPanel.form.setValues({customer_email: record.data.email});
			
			if(this.selectCompany.getValue()!=record.data.company_id && record.data.company_id>0){
				this.loadCompany(record.data.company_id)
			}
			else if(this.selectCompany.getValue()<1)
			{

				this.applyContactRecord(record);
			}
			this.formPanel.baseParams.contact_id=record.data.id;
		}, this);

		this.selectUser = new GO.form.SelectUser({
			fieldLabel: GO.lang['strUser'],
			disabled: !GO.settings.modules['billing']['write_permission'],
			value: GO.settings.user_id,
			anchor: '-20'
		});

		this.selectUser.on('select', function(combo, record){

			if(this.selectCompany.getValue()==''){
				var values = {
					customer_name: record.data.company,
					customer_contact_name: record.data.name,
					customer_address: record.data.address,
					customer_address_no: record.data.address_no,
					customer_zip: record.data.zip,
					customer_city: record.data.city,
					customer_state: record.data.state,
					customer_country: record.data.country,
					customer_email: record.data.email
				};

				this.formPanel.form.setValues(values);
			}
		}, this);
	
		var leftPanelItems = [
		this.selectLinkField,
		this.selectUser,
		this.selectBook = new GO.form.ComboBox({
			fieldLabel: GO.billing.lang.bookId,
			hiddenName:'book_id',
			anchor:'-20',
			emptyText:GO.lang.strPleaseSelect,
			store: new GO.data.JsonStore({
				url: GO.url('billing/book/store'),
				baseParams: {
					permissionLevel:GO.permissionLevels.write
				},
				root: 'results',
				id: 'id',
				totalProperty:'total',
				fields: ['id','name', 'addressbook_id', 'is_purchase_orders_book','show_sales_agents'],
				remoteSort: true
			}),
			pageSize: parseInt(GO.settings.max_rows_list),
			valueField:'id',
			displayField:'name',
			mode: 'local',
			triggerAction: 'all',
			editable: true,
			selectOnFocus:true,
			forceSelection: true,
			allowBlank: false,
			listeners:{
				change: function(combo, newval, oldval){
					this.statusPanel.setBookId(newval);

//					var company = this.selectBook.store.getById(this.selectCompany.getValue());
//
//					this.itemsPanel.itemsGrid.setSupplierId(newval, this.selectCompany.getValue(), company ? company.data.name_and_name2 : "");

					var book = this.selectBook.store.getById(newval);
					this.deliveryButton.setVisible(book.json.is_purchase_orders_book == '1');
						//this.dtimeField.setVisible(book.json.is_purchase_orders_book == '1');
					
					this.setTitleFromBook();
				},
				scope:this
			}
		}),
		{
			xtype: 'textfield',
			name: 'po_id',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: GO.billing.lang.poId
		},this.bTimeField = new Ext.form.DateField({
			name: 'btime',
			anchor: '-20',
			allowBlank:false,
			format: GO.settings.date_format,
			value: now.format(GO.settings.date_format),
			fieldLabel: GO.billing.lang.btime
			}), this.dTimeField = new Ext.form.DateField({
			name: 'dtime',
			anchor: '-20',
				//hidden:true,
			format: GO.settings.date_format,
			value: now.format(GO.settings.date_format),
			fieldLabel: GO.billing.lang.dtime
		}),new Ext.form.DateField({
			name: 'ptime',
			anchor: '-20',
			format: GO.settings.date_format,
			fieldLabel: GO.billing.lang.ptime
		}),{
			xtype: 'textfield',
			name: 'reference',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: GO.billing.lang.reference
		},
		new Ext.form.ComboBox({
			hiddenName: 'language_id',
			fieldLabel: GO.billing.lang.languageId,
			store: GO.billing.languagesStore,
			value:'1',
			valueField:'id',
			displayField:'name',
			mode: 'local',
			triggerAction: 'all',
			editable: false,
			selectOnFocus:true,
			forceSelection: true,
			anchor: '-20'
		}),{
			xtype:'compositefield',
			fieldLabel: GO.billing.lang.recurType,
			anchor: '-20',
			items:[{
				xtype:'numberfield',
				value:1,
				decimals:0,
				name:'recur_number',
				flex:1
			},
			new Ext.form.ComboBox({
				hiddenName: 'recur_type',
				store: new Ext.data.SimpleStore({
					fields: ['code', 'text'],
					data : [
					['', GO.lang.none],
					['W', GO.lang.strWeeks],
					['M', GO.lang.strMonths],
					['Y', GO.lang.strYears]
					]
				}),
				value:'',
				valueField:'code',
				displayField:'text',
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				selectOnFocus:true,
				forceSelection: true,
				flex:4
				
			})]
		},
		this.costCodeCombo = new GO.form.ComboBoxReset({
			name : 'cost_code',
			fieldLabel: GO.billing.lang.costCode,
			store: GO.billing.costCodesStore ,
			displayField:'code',
			valueField: 'code',
			tpl: new Ext.XTemplate(
				'<tpl for=".">',
				'<tpl if="this.type != values.type">',
				'<tpl exec="this.type = values.type"></tpl>',
				'<h1><b>{type}</b></h1>',
				'</tpl>',
				'<div ext:qtip="{description}" class="x-combo-list-item">{code}</div>',
				'</tpl>',
				'<tpl exec="this.type = null"></tpl>'
			),
			mode:'local',
			triggerAction:'all',
			selectOnFocus:true,
			forceSelection: true,
			anchor:'-20',
			value:'',
			listeners:{
				change:function(cb, newValue, oldValue){
					this.itemsPanel.itemsGrid.defaultCostCode=newValue;
				},
				scope:this
			}
		})];

		GO.billing.costCodesStore.on('load', function(){
			this.costCodeCombo.selectFirst();
			this.itemsPanel.itemsGrid.defaultCostCode=this.costCodeCombo.getValue();
		}, this);
		
		this.selectBook.on('change', function(){		
			GO.billing.orderStatusSelectStore.baseParams.book_id=this.selectBook.getValue();
		}, this);
		
		if(GO.webshop)
		{
			leftPanelItems.push(new GO.form.ComboBox({
				hiddenName: 'webshop_id',
				fieldLabel: GO.webshop.lang.webshop,
				store: GO.billing.webshopsStore,
				value:'',
				valueField:'id',
				displayField:'name',
				mode: 'local',
				triggerAction: 'all',
				emptyText: 'No webshop',
				editable: false,
				selectOnFocus:true,
				forceSelection: false,
				anchor: '-20'
			}));
		}
		
		if(GO.projects && GO.projects.SelectProject){
			this.selectProject = new GO.projects.SelectProject({
				anchor: '-20'
			});
			leftPanelItems.push(this.selectProject);
		}	else if(GO.projects2 && GO.projects2.SelectProject){
			this.selectProject = new GO.projects2.SelectProject({
				anchor: '-20'
			});
			leftPanelItems.push(this.selectProject);
		}

		var totalField = new GO.form.PlainField({
			fieldLabel: GO.lang['total'],
			anchor: '-20',
			value: 0,
			decimals: 2,
			name: 'total',
			readOnly: true,
			style: {
				'textAlign': 'right',
				'paddingRight': '5px'
			}
		});

		this.totalPaidField = new GO.form.PlainField({
			fieldLabel: GO.billing.lang['totalPaid'],
			anchor: '-20',
			value:0,
			decimals:2,
			name:'total_paid',
			readOnly: true,
			style: {
				'textAlign': 'right',
				'paddingRight': '5px'
			}
		});

//		this.totalPaidField = new GO.form.NumberField({
//			fieldLabel: GO.billing.lang['totalPaid'],
//			anchor: '-20',
//			value:0,
//			decimals:2,
//			name:'total_paid',
//			disabled: true
//		});
			
		leftPanelItems.push(totalField,this.totalPaidField);

		// DUE DATE FIELDS
		this.bTimeField.on('change',function(){
			this.syncDueDateFields(true);
		}, this);

		this.dTimeField.on('change', function () {
			this.syncDueDateFields(true);
		}, this);
		
		this.dueDateNumber = new GO.form.NumberField({
			name: 'due_date_number',
			decimals: 0,
			allowBlank: true,
			flex:2,
			listeners : {
				change : {
					fn : function(){
						this.syncDueDateFields(true);
					},
					scope : this
				}
			}
		});
		
		this.dueDatelabel = new Ext.form.Label({
			text: GO.billing.lang.dueDateBetween,
			flex:2
		});
		
		this.dueDate = new Ext.form.DateField({
			name : 'due_date',
			flex:6,
			format : GO.settings['date_format'],
			allowBlank : true,			
			listeners : {
				change : {
					fn : function(){
						this.syncDueDateFields(false);
					},
					scope : this
				}
			}
		});

		this.dueComposite = new Ext.form.CompositeField({
			fieldLabel: GO.billing.lang.payWithin,
			anchor: '-20',
			items:[
				this.dueDateNumber,
				this.dueDatelabel,
				this.dueDate
			]
		});

		leftPanelItems.push(this.dueComposite);
		// END OF DUE DATE FIELDS
		
		this.paymentMethodField = new Ext.form.TextField({
			name : 'payment_method',
			fieldLabel: GO.billing.lang.paymentMethod,
			anchor: '-20'
		});
		
		leftPanelItems.push(this.paymentMethodField);
		
		this.selectTelesalesAgent = new GO.form.SelectUser({
			hiddenName: 'telesales_agent',
			fieldLabel: GO.billing.lang.telesalesAgent,
			disabled: !GO.settings.modules['billing']['write_permission'],
			value: GO.settings.user_id,
			anchor: '-20',
			allowBlank:true
		});
		
		this.selectFieldsalesAgent = new GO.form.SelectUser({
			hiddenName: 'fieldsales_agent',
			fieldLabel: GO.billing.lang.fieldsalesAgent,
			disabled: !GO.settings.modules['billing']['write_permission'],
			value: GO.settings.user_id,
			anchor: '-20',
			allowBlank:true
		});
		
		leftPanelItems.push(this.selectTelesalesAgent);
		leftPanelItems.push(this.selectFieldsalesAgent);
		
		this.propertiesPanel = new Ext.Panel({
			border: false,

			title:GO.lang['strProperties'],						
			layout:'column',
			autoScroll:true,
			labelWidth: 110,
			items:[{
				border:false,
				cls:'go-form-panel',
				layout:'form',
				columnWidth:.5,
				items:leftPanelItems
			},{
				cls:'go-form-panel',
				layout:'form',
				columnWidth:.5,
				border:false,
				items:[
				this.selectContact,
				this.selectCompany,
				this.txtCustomerTo,
				{
					xtype: 'textfield',
					name: 'customer_salutation',
					anchor: '-20',
					allowBlank:true,
					fieldLabel: GO.lang.strSalutation,
					value: GO.billing.lang.defaultSalutation
				},this.customerAddressField = new Ext.form.TextArea({
					name: 'customer_address',
					anchor: '-20',
					allowBlank:true,
					fieldLabel: GO.lang.strAddress,
					height: 50,
					maxLength: 255
				}),this.customerAddressNoField = new Ext.form.TextField({
					name: 'customer_address_no',
					anchor: '-20',
					allowBlank:true,
					fieldLabel: GO.lang.strNo
				}),this.customerZipField = new Ext.form.TextField({
					name: 'customer_zip',
					anchor: '-20',
					allowBlank:true,
					fieldLabel: GO.lang.strZip
				}),this.customerCityField = new Ext.form.TextField({
					name: 'customer_city',
					anchor: '-20',
					allowBlank:true,
					fieldLabel: GO.lang.strCity
				}),this.customerStateField = new Ext.form.TextField({
					xtype: 'textfield',
					name: 'customer_state',
					anchor: '-20',
					fieldLabel: GO.lang.strState
				}),this.selectCountry = new GO.form.SelectCountry({
					name: 'customer_country_name',
					anchor: '-20',
					allowBlank:false,
					fieldLabel: GO.lang.strCountry,
					hiddenName: 'customer_country'
				}),{
					xtype: 'textfield',
					name: 'customer_vat_no',
					anchor: '-20',
					allowBlank:true,
					fieldLabel: GO.billing.lang.customerVatNo
				},{
					xtype: 'textfield',
					name: 'customer_crn',
					anchor: '-20',
					allowBlank:true,
					fieldLabel: GO.billing.lang.customerCrn
				},{
					xtype: 'textfield',
					name: 'customer_email',
					anchor: '-20',
					allowBlank:true,
					fieldLabel: GO.lang.strEmail
				},{
					xtype: 'textarea',
					name: 'customer_extra',
					anchor: '-20',
					height:80,
					fieldLabel: GO.billing.lang.customerExtra
				}]
			}]				
		});
		
		// Add the shipping panel to the order dialog
		this.shippingPanel = new GO.billing.OrderShippingPanel({orderDialog:this});
		
		this.frontPagePanel = new Ext.Panel({
			title: GO.billing.lang.frontpage,
			layout:'form',
			cls:'go-form-panel',
			hideMode:'offsets',
			items:[{
				xtype:'xcheckbox',
				name:'pagebreak',
				boxLabel: GO.billing.lang.pagebreak,
				hideLabel:true
			},{
				xtype: 'xhtmleditor',
				name: 'frontpage_text',
				anchor: '100% -22',
				value:'<br />',
				enableFont:false,
				allowBlank:true,
				hideLabel: true
			}]			
		});
		
		this.itemsPanel = new GO.billing.ItemsPanel({orderDialog:this});
		this.statusPanel = new GO.billing.StatusPanel();
		
		this.paymentsPanel = new GO.billing.PaymentsGrid({orderDialog:this});
				
		var items  = [
			this.propertiesPanel,
			this.shippingPanel,
			this.frontPagePanel,
			this.itemsPanel,
			this.statusPanel,
			this.paymentsPanel
		];

		if(GO.customfields && GO.customfields.types["GO\\Billing\\Model\\Order"])
		{
			for(var i=0;i<GO.customfields.types["GO\\Billing\\Model\\Order"].panels.length;i++)
			{			  	
				items.push(GO.customfields.types["GO\\Billing\\Model\\Order"].panels[i]);
			}
		}		
 
		this.tabPanel = new Ext.TabPanel({
			activeTab: 0,
			deferredRender: false,
			border: false,
			items: items,
			anchor: '100% 100%'
		});
    
		this.formPanel = new Ext.form.FormPanel({
			url: GO.settings.modules.billing.url+'action.php',
			waitMsgTarget:true,
			border: false,
			baseParams: {
				task: 'order'
			},
			items:this.tabPanel	
		});    
	},
	buildCustomerTo : function (company, contact){
		var str='';
		
		if(company == contact)
			company = '';


		if(company!=''){
			str = company;
		}
		if(contact!=''){

			if(company!='')
				str += '\n'+GO.billing.lang.tav + ' ';
			
			str +=  contact;
		}

		return str;

	},
	
	showOrderStatusSelect : function(pdf, email){
		this.is_pdf=pdf;
		this.email=email
		if(!this.orderStatusWindow)
		{
			this.orderStatusWindow = new GO.billing.OrderStatusWindow({
				scope:this,
				handler:function(status_id){
					if(this.email){
						GO.email.showComposer({
							//link_config:this.newMenuButton.menu.link_config,
							loadUrl: GO.url("billing/order/send"),
							loadParams:{
								id: this.order_id,
								status_id: status_id
							},
							template_id: 0
						});
					}else
					{
						GO.billing.activePanel.getFile(this.order_id, this.is_pdf, status_id);
					}
				}
			});
		}	
		this.orderStatusWindow.setBookId();
		this.orderStatusWindow.show();
	},
	
	loadCompany : function(company_id){
		GO.request({
			maskEl:this.getEl(),
			url:'addressbook/company/load',
			params:{						
				id:company_id
			},
			success: function(options, response, result)
			{
				this.applyCompanyRecord(result);
				this.txtCustomerTo.setValue(this.buildCustomerTo(this.selectCompany.getRawValue(),this.selectContact.getRawValue()));
			},
			scope:this
		});
	},

	setContactValue : function(contactId) {		
		//Makes sure the select event gets fires after selectContact.setValue()
		this.selectContact.setValue(contactId);
		
		GO.request({
			maskEl:this.getEl(),
			url:'addressbook/contact/load',
			params:{						
				id:contactId
			},
			success: function(options, response, result)
			{
				this.applyContactRecord(result);

				
				if(result.data.company_id>0){
					this.loadCompany(result.data.company_id);
					
				}else{
					this.txtCustomerTo.setValue(this.buildCustomerTo(this.selectCompany.getRawValue(),this.selectContact.getRawValue()));
				}
			},
			scope:this
		});
		
	},
	
	setCompanyValue : function(companyId) {
		this.selectCompany.setValue(companyId);
		this.loadCompany(companyId);		
	}

});
