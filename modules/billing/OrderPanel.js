GO.billing.OrderPanel = Ext.extend(GO.DisplayPanel,{
	
	model_name : "GO\\Billing\\Model\\Order",

	stateId : 'bs-order-panel',

	editGoDialogId : 'order',
	
	editHandler : function(){
		if(this.data.read_only != '1'){
			GO.billing.showOrderDialog(this.link_id);
		}
	},
	initComponent : function(){
	
		this.loadUrl=("billing/order/display");


		this.orderStatusesStore = new GO.data.JsonStore({
			url: GO.url('billing/status/store'),
			baseParams: {
				task: 'order_statuses',
				book_id: 0
			},
			root: 'results',
			id: 'id',
			totalProperty:'total',
			fields: ['id','name', 'status_with_count', 'checked'],
			remoteSort: true
		});
	
		this.template =
			
		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
		'<tr>'+
			'<td colspan="2" class="display-panel-heading">'+GO.billing.lang.order+': {order_id}</td>'+
		'</tr>'+
		'<tr><td valign="top">'+

		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
		/*'<tr>'+
		'<td colspan="2" class="display-panel-heading">'+		
		'<tpl if="!GO.util.empty(order_id)">'+
			GO.billing.lang.informationAbout+' {order_id}</td>'+
		'</tpl>'+
		'<tpl if="!!GO.util.empty(order_id)">'+
			GO.billing.lang.sceduledOrder+
		'</tpl>'+
		'</tr>'+*/
					
		'<tpl if="!GO.util.empty(reference)">'+
		'<tr>'+
		'<td>'+GO.billing.lang.reference+':</td><td>{reference}</td>'+
		'</tr>'+
		'</tpl>'+
					
		'<tpl if="!GO.util.empty(btime)">'+
		'<tr>'+
		'<td>'+GO.billing.lang.btime+':</td><td>{btime}</td>'+
		'</tr>'+
		'</tpl>'+
					
					
				
		'<tr>'+
		'<td>'+GO.billing.lang.statusId+':</td><td>{status_name}</td>'+
		'</tr>'+
					

		'<tpl if="!GO.util.empty(po_id)">'+
		'<tr>'+
		'<td>'+GO.billing.lang.poId+':</td><td>{po_id}</td>'+
		'</tr>'+
		'</tpl>'+
		
		'<tr>'+
		'<td>'+GO.billing.lang.book+':</td><td>{book_name}</td>'+
		'</tr>'+
					
					
		'<tpl if="!GO.util.empty(recur_type)">'+
		'<tr>'+
		'<td>'+GO.billing.lang.recurType+':</td><td>{[this.showRecurrence(values)]}</td>'+
		'</tr>'+
		'</tpl>'+


		'<tpl if="!GO.util.empty(payment_method)">'+
		'<tr>'+
		'<td>'+GO.billing.lang.paymentMethod+':</td><td>{payment_method}</td>'+
		'</tr>'+
		'</tpl>'+
					
					


		'<tr><td colspan="2">&nbsp;</td></tr>'+
		'<tr>'+
		'<td>'+GO.lang.strOwner+':</td><td>{user_name}</td>'+
		'</tr>'+
		
		'<tpl if="show_sales_agents &gt; 0">'+
		
			'<tpl if="!GO.util.empty(telesales_agent_name)">'+
				'<tr>'+
					'<td>'+GO.billing.lang.telesalesAgent+':</td><td>{telesales_agent_name}</td>'+
				'</tr>'+
			'</tpl>'+

			'<tpl if="!GO.util.empty(fieldsales_agent_name)">'+
				'<tr>'+
					'<td>'+GO.billing.lang.fieldsalesAgent+':</td><td>{fieldsales_agent_name}</td>'+
				'</tr>'+
			'</tpl>'+
			
		'</tpl>'+
		
		'</table>'+

		'</td><td valign="top">'+

		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
		'<tr>'+
		'<td colspan="2">'+
		'<tpl if="company_id &gt; 0"><a href="#" onclick="GO.linkHandlers[\'GO\\\\\\\\Addressbook\\\\\\\\Model\\\\\\\\Company\'].call(this, {company_id});"></tpl>'+
		'{customer_name}'+
		'<tpl if="company_id &gt; 0"></a></tpl>'+
		'<br />'+
		'<tpl if="!GO.util.empty(customer_contact_name)">'+
			'<tpl if="contact_id &gt; 0"><a href="#" onclick="GO.linkHandlers[\'GO\\\\\\\\Addressbook\\\\\\\\Model\\\\\\\\Contact\'].call(this, {contact_id});"></tpl>'+
			'{customer_contact_name}'+
			'<tpl if="contact_id &gt; 0"></a></tpl>'+
			'<br />'+
		'</tpl>'+
		'<br />'+
		
		'<tpl if="!GO.util.empty(customer_email)">'+
		'{[GO.mailTo(values.customer_email)]}'+
		'</tpl>'+
		'</td>'+
		'</tr>'+
		'<tpl if="!GO.util.empty(customer_vat_no)">'+
		'<tr>'+
		'<td>'+GO.billing.lang.customerVatNo+':</td><td>{customer_vat_no}</td>'+
		'</tr>'+
		'</tpl>';
		
		if(GO.projects2){
			this.template += '<tpl if="!GO.util.empty(project_name)">'+
			'<tr>'+
			'<td>'+GO.projects2.lang.project+':</td><td><a href="#" onclick="GO.linkHandlers[\'GO\\\\\\\\Projects2\\\\\\\\Model\\\\\\\\Project\'].call(this, {project_id});">{project_name}</a></td>'+
			'</tr></tpl>';
		}
		
		this.template += '</table>'+
		'</td></tr>'+
		'</table>'+

		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
			'<tr>'+
				'<td colspan="2" class="display-panel-heading">'+GO.lang.strAddress+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td class="table_header_links" valign="top">'+GO.billing.lang.customerAddress+'</td><td class="table_header_links" valign="top">'+GO.billing.lang.shippingAddress+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td valign="top">'+
					
					'{customer_to}'+
					'<br />'+
					'<tpl if="!GO.util.empty(google_maps_link)">'+
						'<a href="{google_maps_link}" target="_blank">'+
					'</tpl>'+
					'{formatted_address}'+
					'<tpl if="!GO.util.empty(google_maps_link)">'+
						'</a>'+
					'</tpl>'+
					
				'</td>'+
				'<td valign="top">'+
					'<tpl if="!GO.util.empty(other_shipping_address)">'+
					
						'{shipping_to}'+
						'<br />'+
						'<tpl if="!GO.util.empty(shipping_google_maps_link)">'+
							'<a href="{shipping_google_maps_link}" target="_blank">'+
						'</tpl>'+
						'{formatted_shipping_address}'+
						'<tpl if="!GO.util.empty(shipping_google_maps_link)">'+
							'</a>'+
						'</tpl>'+	
						
					'</tpl>'+	
					
					'<tpl if="GO.util.empty(other_shipping_address)">'+
						
						'{customer_to}'+
						'<br />'+
						'<tpl if="!GO.util.empty(google_maps_link)">'+
							'<a href="{google_maps_link}" target="_blank">'+
						'</tpl>'+
						'{formatted_address}'+
						'<tpl if="!GO.util.empty(google_maps_link)">'+
							'</a>'+
						'</tpl>'+
						
					'</tpl>'+	
					
				'</td>'+
			'</tr>'+
			'<tr>'+
		'</table>'+

		'<tpl if="status_history.length">'+

		'<table class="display-panel bs-display-items" cellpadding="0" cellspacing="0" border="0">'+
		//LINK DETAILS
		'<tr>'+
		'<td colspan="4" class="display-panel-heading">'+GO.billing.lang.orderStatusHistory+'</td>'+
		'</tr>'+

		'<tr>'+
		'<td class="table_header_links">'+GO.billing.lang.statusId+'</td>'+
		'<td class="table_header_links">' + GO.lang.strOwner + '</td>'+
		'<td class="table_header_links" style="width:100px">'+GO.lang.strCtime+'</td>'+
		'<td class="table_header_links" style="width:50px">'+GO.billing.lang.notified+'</td>'+
		'</tr>'+

		'<tpl for="status_history">'+
		'<tr id="pm-status-history-{id}">'+
		'<td>{status_name}</td>'+
		'<td>{user_name}</div></td>'+
		'<td>{ctime}</td>'+
		'<td><tpl if="notified&gt;0"><div class="go-grid-icon btn-ok"><a href="#" onclick="GO.linkHandlers[\'GO\\\\\\\\Savemailas\\\\\\\\Model\\\\\\\\LinkedEmail\'].call(this, 0, {action:\'path\', path: \'{[Ext.util.Format.htmlEncode(values.notification_email)]}\'});">'+GO.lang.strView+'</a></div></tpl></td>'+
		'</tr>'+

		'</tpl>'+
		'</table>'+

		'</tpl>'+


					
		'<tpl if="items.length">'+

		'<table class="display-panel bs-display-items" cellpadding="0" cellspacing="0" border="0">'+
		//LINK DETAILS
		'<tr>'+
		'<td colspan="7" class="display-panel-heading">'+GO.billing.lang.items+'</td>'+
		'</tr>'+
						
		'<tr>'+
		'<td class="table_header_links" style="width:16px">'+GO.billing.lang.amount+'</td>'+
		'<td class="table_header_links" style="width:16px">'+GO.billing.lang.delivered+'</td>'+
		'<td class="table_header_links">' + GO.lang['strDescription'] + '</td>'+
		'<td class="table_header_links">'+GO.billing.lang.unitPrice+'</td>'+
		'<td class="table_header_links">'+GO.billing.lang.subtotal+'</td>'+
//		'<td class="table_header_links">'+GO.billing.lang.total+'</td>'+
//		'<td class="table_header_links">'+GO.billing.lang.costCode+'</td>'+
		'</tr>'+
											
		'<tpl for="items">'+
		'<tr id="pm-item-row-{id}">'+
		'<td style="width:16px">{amount}</td>'+
		'<td style="width:16px">{amount_delivered}</td>'+
		'<td>{description}</div></td>'+
		'<td style="white-space:nowrap">{unit_price}</td>'+
		'<td style="white-space:nowrap">{subtotal}</td>'+
//		'<td style="white-space:nowrap">{total}</td>'+
//		'<td style="white-space:nowrap">{cost_code}</td>'+
		'</tr>'+
													
		'</tpl>'+
		'</table>'+
					
		'</tpl>'+
		
		
					
		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
		'<tr>'+
		'<td colspan="2" class="display-panel-heading">Totals</td>'+
		'</tr>'+
		'<tr>'+
		'<td>'+GO.billing.lang.costs+':</td><td>{costs}</td>'+
		'</tr>'+
		'<tr>'+
		'<td>'+GO.billing.lang.subtotal+':</td><td>{subtotal}</td>'+
		'</tr>'+
		'<tr>'+
		'<td>'+GO.billing.lang.vat+':</td><td>{vat}</td>'+
		'</tr>'+

		'<tr>'+
		'<td>'+GO.billing.lang.total+':</td><td>{total}</td>'+
		'</tr>'+
	
		'<tpl if="frontpage_text.length && frontpage_text!=\'&lt;br&gt;\' && frontpage_text!=\'&lt;br /&gt;\'">'+
		'<tr>'+
		'<td colspan="2" class="display-panel-heading">'+GO.billing.lang.frontpage+'</td>'+
		'</tr>'+
		'<tr>'+
		'<td colspan="2">{frontpage_text}</td>'+
		'</tr>'+
		'</tpl>'+

		'</table>'+
	
		'<table class="display-panel bs-display-payments" cellpadding="0" cellspacing="0" border="0">'+
		'<tr>'+
		'<td colspan="2" class="display-panel-heading">'+GO.billing.lang.payments+'</td>'+
		'</tr>'+
		'<tr>'+
		'<td class="table_header_links" style="width:16px">'+GO.lang.strDate+'</td>'+
		'<td class="table_header_links" style="width:16px">'+GO.billing.lang.amount+'</td>'+
		'</tr>'+
		'<tpl if="payments.length">'+
		'<tpl for="payments">'+
		'<tr id="pm-payment-row-{id}">'+
		'<td style="width:16px">{date}</td>'+
		'<td style="width:16px">{amount}</td>'+
		'</tr>'+
		'</tpl>'+
		'</tpl>'+
		'<tr style="border-top: 1px solid black;">'+
		'<td>'+GO.billing.lang.totalPaid+':</td><td>{total_paid}</td>'+
		'</tr>'+
		'<tr>'+
		'<td>'+GO.billing.lang.totalOutstanding+':</td><td>{total_outstanding}</td>'+
		'</tr>'+
		'<tr><td colspan="2"><a class="display-panel-browse" href="#" onclick="GO.billing.addPayment({id});">'+GO.billing.lang.addPayment+'</a></td></tr>'+
		
		'</table>';
		
												
		if(GO.customfields)
		{
			this.template +=GO.customfields.displayPanelTemplate;
		}

		if(GO.tasks)
			this.template +=GO.tasks.TaskTemplate;

		if(GO.calendar)
			this.template += GO.calendar.EventTemplate;
		
		if(GO.workflow){
			this.template +=GO.workflow.WorkflowTemplate;
		}

		if(GO.lists)
			this.template += GO.lists.ListTemplate;

		this.template +=GO.linksTemplate;
		
	    	
		Ext.apply(this.templateConfig,{
	  	
			showRecurrence : function(values)
			{
				var order_id = values.recurred_order_id;
				var d = values.recur_number+' ';
				switch(values.recur_type){
					case 'W':
						d+=GO.lang.strWeeks;
						break;
					case 'M':
						d+=GO.lang.strMonths;
						break;
					case 'Y':
						d+=GO.lang.strYears;
						break;
				}
	  		
				return '<a href="#" onclick="GO.linkHandlers[\'GO\\\\Billing\\\\Model\\\\Order\'].call(this, '+order_id+');">'+d+'</a>';
			}
		});
		
				
		if(GO.files)
		{
			Ext.apply(this.templateConfig, GO.files.filesTemplateConfig);
			this.template += GO.files.filesTemplate;
		}
		Ext.apply(this.templateConfig, GO.linksTemplateConfig);
		
		if(GO.comments)
		{
			this.template += GO.comments.displayPanelTemplate;
		}
		
		this.template += GO.createModifyTemplate;
		
		GO.billing.OrderPanel.superclass.initComponent.call(this);
		
		if(GO.tasks)
		{
			this.scheduleCallItem = new GO.tasks.ScheduleCallMenuItem();
			this.newMenuButton.menu.add(this.scheduleCallItem);
		}
	},
	
	reset : function(){
		
		this.getTopToolbar().setDisabled(true);
		GO.billing.OrderPanel.superclass.reset.call(this);
	},

	getFile : function(order_id, is_pdf, status_id)
	{
		if(!status_id)
			status_id = 0;
		
		if(is_pdf){
			window.open(GO.url('billing/order/pdf',{id:order_id,status_id:status_id}));
		}else{
			GO.request({
				params:{
					id: order_id,
					status_id : status_id
				},
				url:"billing/order/odf",
				success: function(response, options, result){
					GO.files.openFile({id: result.file_id});															
				},
				scope:this
			});
		}		
	},
	
	createTopToolbar : function(){

		if (GO.util.empty(this.extraMenuItems)) // used in MainPanel.js of order planning module
			this.extraMenuItems = new Array();

		var tbar = GO.billing.OrderPanel.superclass.createTopToolbar.call(this);

		var menuItems = [{
					iconCls: 'filetype-pdf',
					text: 'PDF',
					handler: function()
					{
//						if(GO.billing.isPurchaseOrderBook)
//						{
//							this.createPurchaseOrders(1, this.data.id);
//						}else
//						{
							if(this.data.status_id>0)
							{
								this.getFile(this.data.id, true);
							}else
							{
								this.showOrderStatusSelect(true);
							}
//						}
					},
					scope: this
				},{
					iconCls: 'filetype-doc',
					text: 'Document',
					handler: function()
					{
						if(!GO.util.empty(this.data.is_purchase_order_book))
						{
							if(this.data.status_id>0)
								this.createPurchaseOrders(0, this.data.id);
							else
								alert("Please assign a status to the order first");
						}else
						{
							if(this.data.status_id>0)
							{
								this.getFile(this.data.id);
							}else
							{
								this.showOrderStatusSelect(false);
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
							if(this.data.status_id>0)
							{
								GO.email.showComposer({
									link_config:this.newMenuButton.menu.link_config,
									loadUrl: GO.url("billing/order/send"),
									loadParams:{
										id: this.data.id
									},
									template_id: 0,									
									disableTemplates:true
								});
							}else
							{
								this.showOrderStatusSelect(true, true);
							}
						}
						
					},
					scope:this
				},{
					iconCls: 'bs-duplicate',
					text: GO.billing.lang.duplicate,
					cls: 'x-btn-text-icon',
					handler: function(){
						
						GO.mainLayout.tabPanel.setActiveTab('go-module-panel-billing');
						
						GO.billing.duplicateDialog.show(this.data.id, this.data.book_id);
					},
					scope:this
				},this.deliveryButton = new Ext.menu.Item({
					iconCls: 'bs-duplicate',
					text: GO.billing.lang.delivery,
					cls: 'x-btn-text-icon',
					handler: function(){                       
						if(!GO.billing.deliveryDialog)
						{
							GO.billing.deliveryDialog = new GO.billing.DeliveryDialog();
						}

						GO.billing.deliveryDialog.show(this.data.id);
                        
					},
					scope:this
				}),{
					iconCls: 'bs-duplicate',
					text: GO.billing.lang.changeStatus,
					cls: 'x-btn-text-icon',
					menu: this.statusMenu = new Ext.menu.Menu({
						/*items: [
							{
								text: 'Aero Glass',
								checked: true,
								group: 'theme',
								checkHandler: onItemCheck
							}, {
								text: 'Vista Black',
								checked: false,
								group: 'theme',
								checkHandler: onItemCheck
							}, {
								text: 'Gray Theme',
								checked: false,
								group: 'theme',
								checkHandler: onItemCheck
							}, {
								text: 'Default Theme',
								checked: false,
								group: 'theme',
								checkHandler: onItemCheck
							}
						]*/
						})
				}];

		for (var i=0; i<this.extraMenuItems.length; i++) {
			menuItems.push(this.extraMenuItems[i]);
		}

		tbar.splice(tbar.length-2,0 , this.actionsButton = new Ext.Button({
			iconCls: 'btn-actions',
			cls: 'x-btn-text-icon',
			text: GO.lang.cmdActions,
			menu: new Ext.menu.Menu({
				items: menuItems
			})
		}));

		return tbar;
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
							link_config:this.newMenuButton.menu.link_config,
							loadUrl: GO.url("billing/order/send"),
							loadParams:{
								id: this.data.id,
								status_id: status_id
							},
							template_id: 0
						});
					}else
					{
						this.getFile(this.data.id, this.is_pdf, status_id);
					}
				}
			});
		}	
		
		this.orderStatusWindow.show();
	},    
    
	createPurchaseOrders : function(is_pdf, order_id)
	{
		GO.request({
			url:"billing/order/createPurchaseOrderDocuments",
			params:{			
				id:order_id,
				is_pdf: is_pdf
			},
			success: function(response, options, result){
				this.reload();
				Ext.Msg.alert(GO.lang['strSuccess'], result.feedback);
			},
			scope:this
		});
	},
	
	
	getLinkName : function(){

		if(!this.data.order_id){
			return GO.billing.lang.sceduledOrder;
		} else {
			return this.data.order_id;
		}
	},

	setStatusMenu : function(refresh){

		if(this.orderStatusesStore.baseParams.book_id!=this.data.book_id || refresh){
			this.orderStatusesStore.baseParams.book_id=this.data.book_id;
			this.orderStatusesStore.load({
				callback:function(){
					this.statusMenu.removeAll();
					this.suppressCheck=true;
					this.orderStatusesStore.each(function(r)
					{
						this.statusMenu.add({
							text:r.data.name,
							status_id:r.data.id,
							group:'status-'+this.getId(),
							checked:this.data.status_id==r.data.id,
							checkHandler:function(i){
								if(!this.suppressCheck){
									Ext.Msg.show({
										modal:false,
										title:GO.billing.lang.notifyCustomer,
										msg: GO.billing.lang.notifyCustomerText,
										buttons: Ext.Msg.YESNOCANCEL,
										fn: function(btn){
											if(btn=='cancel'){

												//reset the checked item
												this.suppressCheck=true;
												this.statusMenu.items.each(function(i){
													i.setChecked(i.status_id==this.data.status_id, true);
												}, this);
												this.suppressCheck=false;

												return false;
											}
											GO.request({
												maskEl:Ext.getBody(),
												url:"billing/order/submit",
												params:{                                                    
													id: this.data.id,
													status_id:i.status_id,
													notify_customer: btn=='yes' ? 1 : 0
												},
												success:function(options, response, data){

                                                    
													if(!data.success)
													{
														GO.errorDialog.show(data.feedback);
                                                                                                                
														this.suppressCheck=true;
														this.statusMenu.items.each(function(i){
															i.setChecked(i.status_id==this.data.status_id, true);
														}, this);
														this.suppressCheck=false;
													}else
													{
														this.reload();
														//check if it's not a popup

														var billing = GO.mainLayout.getModulePanel('billing');

														if(billing.centerPanel.store.baseParams.book_id==this.data.book_id){
															billing.centerPanel.store.reload();
														}
														if (!GO.util.empty(data.showTaskId))
															GO.linkHandlers['GO\\Tasks\\Model\\Task'].call(this, data.showTaskId);
															//GO.tasks.showTaskDialog({task_id: data.showTaskId});
													}
												},
												scope:this
											});
										},
										scope:this,
										icon: Ext.MessageBox.QUESTION
									});
								}
							},
							scope:this
						});
					}, this);
					this.suppressCheck=false;
				},
				scope:this
			});
			
		}else
		{
			this.suppressCheck=true;
			this.statusMenu.items.each(function(i){
				i.setChecked(i.status_id==this.data.status_id, true);
			}, this);
			this.suppressCheck=false;
		}
	},
	
	setData : function(data)
	{
		GO.billing.OrderPanel.superclass.setData.call(this, data);

//		var title = !GO.util.empty(data.order_id) ? GO.billing.lang.informationAbout+' '+data.order_id : GO.billing.lang.sceduledOrder;
//		this.setTitle(title);
		
		this.setStatusMenu();
		
		this.getTopToolbar().setDisabled(!data.write_permission);
		if(this.data.read_only == '1')
			this.editButton.disable();

		this.deliveryButton.setVisible(data.is_purchase_order_book);
        
		if(data.write_permission)
		{
			if(this.scheduleCallItem)
			{
				this.scheduleCallItem.setLinkConfig({
					name: this.data.customer_contact_name,
					model_id: this.data.contact_id,
					model_name:"GO\\Addressbook\\Model\\Contact",
					callback:this.reload,
					scope: this
				});
			}
		}
	}
});

/**
 * Show a dialog to add payments to the given order
 * 
 * @param int orderId
 * @returns {undefined}
 */
GO.billing.addPayment = function(orderId) {
	
	if(!this.paymentDialog){
		this.paymentDialog = new GO.billing.PaymentDialog();
	}
		
	this.paymentDialog.setOrderId(orderId);
	this.paymentDialog.show();		
};
