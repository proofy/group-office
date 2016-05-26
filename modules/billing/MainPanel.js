GO.billing.MainPanel = function(config){
	
	if(!config)
	{
		config = GO.billing.LanguagesGrid;
	}
	this.booksPanel = new GO.billing.BooksGrid({
		region:'north',
		title:GO.billing.lang.books,
		autoScroll:true,				
		height:200,
		split:true
	});	
	
	GO.billing.orderStatusesStore.on('load', function()
	{            
		if(this.isVisible())
		{
			this.displayPanel.reset();

			this.centerPanel.selModel.clearSelections();
		}
	},this);
	
	GO.billing.ordersGrid = this.centerPanel = new GO.billing.OrdersGrid({
		id:'bs-orders-grid',
		region:'center',
		border:true
	});
	
	this.filterPanel = new GO.grid.MultiSelectGrid({
		region:'center',
		id:'order_statuses',
		title:GO.billing.lang.filter,
		loadMask:true,
		store: GO.billing.orderStatusesStore,
		split:true,
		allowNoSelection:true,
		relatedStore: this.centerPanel.store,
		tbar: [this.showScheduledField = new Ext.form.Checkbox({
			boxLabel: GO.billing.lang.showScheduledOrders,
			labelSeparator: '',
			name: 'show_Scheduled',		
			allowBlank: true,
			ctCls:'bs-scheduled-cb',
			listeners: {'check': function(checkbox, checked) { 
				GO.billing.ordersGrid.store.baseParams['show_scheduled'] = checked;
				GO.billing.ordersGrid.store.reload();
			} }
		})]
	});
	this.filterPanel.store.on('load', function(store,records,options){
		if(options.params)
			this.filterPanel.requestPrefix = options.params.book_id
	}, this);
		
	var westPanel = new Ext.Panel({
		id:'bs-west-panel',
		region:'west',
		layout:'border',
		border: false,
		split:true,
		width:230,
		items:[this.booksPanel, this.filterPanel]
	});
	
	this.booksPanel.on('delayedrowselect', function(grid, rowIndex)
	{
		var record = grid.getStore().getAt(rowIndex);	
		GO.billing.defaultVAT = GO.util.unlocalizeNumber(record.data.default_vat);
		GO.billing.defaultCountry = record.data.country;
		this.setBookId(record.data.id);		
		
		this.centerPanel.setTitle(record.data.name);
	}, this);

	this.centerPanel.store.on('load', function(){
		this.setWritePermission(this.centerPanel.store.reader.jsonData.write_permission);
	}, this);
	
	this.centerPanel.on("delayedrowselect",function(grid, rowIndex, r){
		if(this.eastPanel.isVisible())
			this.eastPanel.load(r.data.id);

		if(this.southPanel.isVisible())
			this.southPanel.load(r.data.id);
	}, this);

	var displayEast = Ext.state.Manager.get('bs-display-east');
	if(displayEast)
	{
		displayEast = Ext.decode(displayEast);
	}else
	{
		displayEast =screen.width>=1024;
	}

	var eastPanelConfig = {
//		title: GO.billing.lang.order,
		border:true,
		region: 'east',
		width: 460,
		hidden: !displayEast,
		id:'bs-east-panel',
		stateId : 'bs-order-panel-main-east',
		collapseMode:'mini',
		hideCollapseTool:true,
		collapsible:true,
		split:true
	};
	var southPanelConfig = {
//		title: GO.billing.lang.order,
		border:true,
		region: 'south',
		height: 250,
		stateId : 'bs-order-panel-main-south',
		hidden: displayEast,
		id:'bs-south-panel',
		collapseMode:'mini',
		collapsible:true,
		split:true
	};

	
	GO.billing.activePanel = this.displayPanel = this.eastPanel = new GO.billing.OrderPanel(eastPanelConfig);
	this.southPanel = new GO.billing.OrderPanel(southPanelConfig);
	
	
//	this.exportButton = new Ext.menu.Item({
//		iconCls: 'btn-export',
//		text: GO.lang.exportScreen,
//		cls: 'x-btn-text-icon',
//		scope: this,
//		handler: function(){			
//
//			if(!this.exportDialog)
//			{
//				this.exportDialog = new GO.ExportGridDialog ({
//					url: 'billing/orderJson/export',
//					name: 'orders',
//					documentTitle:this.centerPanel.title,
//					colModel: this.centerPanel.getColumnModel(),
//					searchQuery: this.centerPanel.searchField.getValue()
//				});
////				this.exportDialog.on('show',function(){
////					this.centerPanel.enableDateSearch(false);
////				}, this);
////				this.exportDialog.on('hide',function(){
////					this.centerPanel.enableDateSearch(true);
////				}, this);
//			}
//
//			this.exportDialog.show();
//		}
//	});
	
	this.exportMenu = new GO.base.ExportMenu({className:'GO\\Billing\\Export\\CurrentGrid'});
	this.exportMenu.setColumnModel(this.centerPanel.getColumnModel());
	
	this.exportOrders = new Ext.menu.Item({
		text:GO.billing.lang.exportOrders,
		handler:function(){
			if(!this.exportOrdersDialog){

				var now = new Date();
				var lastMonth = now.add(Date.MONTH, -1);
				var startOfLastMonth = lastMonth.getFirstDateOfMonth();
				var endOfLastMonth = lastMonth.getLastDateOfMonth();

				var startDate = new Ext.form.DateField({
					name: 'start_time',
					format: GO.settings['date_format'],
					allowBlank:true,
					fieldLabel: GO.lang.strStart,
					value: startOfLastMonth.format(GO.settings.date_format)
				});

				var endDate = new Ext.form.DateField({
					name: 'end_time',
					format: GO.settings['date_format'],
					allowBlank:true,
					fieldLabel: GO.lang.strEnd,
					value: endOfLastMonth.format(GO.settings.date_format)
				});

				this.exportOrdersDialog = new GO.dialog.ExportDialog({
					title:GO.billing.lang.exportCustomers,
					exportController:'billing/exportOrders',
					formItems:[
						startDate,
						endDate,
						new GO.billing.SelectBook({
							store:GO.billing.readableBooksStore
						})								
					]
				});
			}

			this.exportOrdersDialog.show();
		},
		scope:this				
	});
	
	this.exportOutstanding = new Ext.menu.Item({
		text:GO.billing.lang.exportOutstanding,
		handler:function(){
			if(!this.exportOutstandingDialog){
				this.exportOutstandingDialog = new GO.dialog.ExportDialog({
					title:GO.billing.lang.exportOutstanding,
					exportController:'billing/exportOutstanding',
					formItems:[
						{
							name:'date',
							xtype:'datefield',
							value:new Date(),
							fieldLabel:GO.lang.strDate
						},
						new GO.billing.SelectBook({
							store:GO.billing.readableBooksStore
						})								
					]
				});
			}

			this.exportOutstandingDialog.show();
		},
		scope:this				
	});
	
	this.exportCustomers = new Ext.menu.Item({
		text:GO.billing.lang.exportCustomers,
		handler:function(){

			if(!GO.addressbook)
			{
				alert("Addressbook is required");
			}

			if(!this.exportCustomersDialog){

				var now = new Date();
				var lastMonth = now.add(Date.MONTH, -1);
				var startOfLastMonth = lastMonth.getFirstDateOfMonth();
				var endOfLastMonth = lastMonth.getLastDateOfMonth();

				var startDate = new Ext.form.DateField({
					name: 'start_time',
					format: GO.settings['date_format'],
					allowBlank:true,
					fieldLabel: GO.lang.strStart,
					value: startOfLastMonth.format(GO.settings.date_format)
				});

				var endDate = new Ext.form.DateField({
					name: 'end_time',
					format: GO.settings['date_format'],
					allowBlank:true,
					fieldLabel: GO.lang.strEnd,
					value: endOfLastMonth.format(GO.settings.date_format)
				});

				this.exportCustomersDialog = new GO.dialog.ExportDialog({
					title:GO.billing.lang.exportCustomers,
					exportController:'billing/exportCustomers',
					formConfig:{
						labelAlign:'top'
					},
					formItems:[
						startDate,
						endDate,
						new GO.billing.SelectBook({
							store:GO.billing.readableBooksStore
						}),
						new GO.addressbook.SelectAddressbook({
							allowBlank:false,
							fieldLabel:GO.billing.lang.addressbookForNewCompanies
						})
					]
				});						
			}

			this.exportCustomersDialog.show();
		},
		scope:this				
	});
	
	this.exportIncome = new Ext.menu.Item({
		text:GO.billing.lang.exportIncome,
		handler:function(){
			this.exportIncomeDialog = new GO.billing.ExportIncomeDialog();	
			this.exportIncomeDialog.show();		
		},
		scope:this
	});

	this.exportMenu.insertItem(0,this.exportOrders);
	this.exportMenu.insertItem(1,this.exportOutstanding);
	this.exportMenu.insertItem(2,this.exportCustomers);
	this.exportMenu.insertItem(3,this.exportIncome);

	var settingsMenu = [{
		iconCls: 'btn-settings',
		text: GO.lang.cmdSettings,
		cls: 'x-btn-text-icon',
		handler: function(){
			if(!this.settingsDialog)
			{
				this.settingsDialog = new GO.billing.SettingsDialog();
			}
			this.settingsDialog.show();
		},
		scope: this
	},{
		iconCls:'btn-toggle-window',
		text: GO.billing.lang.toggleInfoPanelPosition,
		cls: 'x-btn-text-icon',
		handler: function(){
			var id;

			if (this.eastPanel.isVisible()) {
				this.displayPanel = this.southPanel;
				this.eastPanel.hide();
				id= this.eastPanel.link_id;
			} else {
				this.displayPanel = this.eastPanel;
				this.southPanel.hide();
				id= this.southPanel.link_id;
			}
			
			this.displayPanel.show();
						
			this.displayPanel.ownerCt.doLayout();
			
			if(id){
				this.displayPanel.load(id);
			}

			this.displayPanel.show();
			//needed for chrome somehow
			this.displayPanel.getEl().applyStyles({
				'visibility':'visible'
			});
			this.displayPanel.expand();

			Ext.state.Manager.set('bs-display-east', Ext.encode(this.eastPanel.isVisible()));
		},
		scope: this
	}];
	
	config.tbar=new Ext.Toolbar({
		cls:'go-head-tb',
		items: [{
			xtype:'htmlcomponent',
			html:GO.billing.lang.name,
			cls:'go-module-title-tbar'
		},this.addButton = new Ext.Button({
			iconCls: 'btn-add',
			itemId:'add',
			text: GO.lang['cmdAdd'],
			cls: 'x-btn-text-icon',
			handler: function(){
				this.displayPanel.reset();
				GO.billing.showOrderDialog(0, {
					values : {
						book_id: this.centerPanel.store.baseParams.book_id
						}
					});				
		},
		scope: this
		}),this.deleteButton = new Ext.Button({
		iconCls: 'btn-delete',
		text: GO.lang['cmdDelete'],
		cls: 'x-btn-text-icon',
		handler: function(){
			this.centerPanel.deleteSelected({
				callback : this.displayPanel.gridDeleteCallback,
				scope: this.displayPanel
			});
		},
		scope: this
	}),this.settingsButton = new Ext.Button({
		iconCls: 'btn-settings',
		text: GO.lang.administration,
		cls: 'x-btn-text-icon',
		menu: settingsMenu,
		scope: this				
	}),this.catalogButton = new Ext.Button({
		itemId:'catalog',
		iconCls: 'bs-btn-catalog',
		text: GO.billing.lang.catalog,
		cls: 'x-btn-text-icon',
		handler: function(){
			if(!this.catalogDialog)
			{
				this.catalogDialog = new GO.billing.CatalogDialog();
			}
			this.catalogDialog.show();
		},
		scope: this				
	}),this.expensesButton = new Ext.Button({
		itemId:'expenses',
		iconCls: 'bs-btn-expenses',
		text: GO.billing.lang.expenses,
		cls: 'x-btn-text-icon',
		handler: function(){
			if(!this.expensesWindow)
			{
				this.expensesWindow = new GO.billing.ExpensesWindow();
			}
			this.expensesWindow.show();
		},
		scope: this				
	}),this.batchjobButton = new Ext.Button({
		iconCls: 'bs-btn-batchjob',
		text: GO.billing.lang.batchjobs,
		cls: 'x-btn-text-icon',
		handler: function(){
			if(!this.batchjobDialog)
			{
				this.batchjobDialog = new GO.billing.BatchjobDialog();
			}
			this.batchjobDialog.show(this.centerPanel.store.baseParams.book_id);
					
		},
		scope: this
	}),
	this.exportMenu,
	this.reportButton = new Ext.Button({
		iconCls: 'bs-btn-report',
		text: GO.billing.lang.report,
		cls: 'x-btn-text-icon',
		scope: this,
		handler: function(){
			if(!this.reportDialog)
			{
				this.reportDialog = new GO.billing.ReportDialog();
			}			
			this.reportDialog.show();
		}
	}),this.stockButton = new Ext.Button({
		itemId:'stock',
		iconCls: 'btn-add',
		text: GO.billing.lang.stock,
		cls: 'x-btn-text',
		scope: this,
		handler: function(){
			if(!this.stockDialog)
			{
				this.stockDialog = new GO.billing.StockDialog();

				this.stockDialog.on('save', function()
				{
					this.centerPanel.store.reload();
				},this);
			}

			this.stockDialog.show();
		}
	}),this.importButton = new Ext.Button({
		iconCls: 'btn-upload',
		text:GO.billing.lang.importPayments,
		scope:this,
		handler: function(){
			this.importDialog = new GO.billing.ImportPaymentsDialog();
			this.importDialog.show();
		}
		
	})
	]
	});
	
config.items=[
westPanel,
this.largePanel = new Ext.Panel({
	border:false,
	region:'center',
	titlebar: false,
	layout:'border',
	items: [this.centerPanel,this.eastPanel,this.southPanel]
})
];	

config.layout='border';
GO.billing.MainPanel.superclass.constructor.call(this, config);
	
	this.addEvents({
		'bookchanged':true
	});
};

Ext.extend(GO.billing.MainPanel, Ext.Panel, {

	refresh : function(){
		GO.billing.orderStatusesStore.load();
		this.centerPanel.store.load();
	},

	init : function(){
		this.getEl().mask(GO.lang.waitMsgLoad);
		GO.request({
			maskEl:this.getEl(),
			url: "core/multiRequest",
			params:{
				requests:Ext.encode({
					languages:{r:"billing/language/store"},
					writable_books:{r:"billing/book/store",permissionLevel:GO.permissionLevels.write}
				})
			},
			success: function(options, response, jsonData)
			{

				GO.billing.languagesStore.loadData(jsonData.languages);



				GO.billing.writableBooksStore.loadData(jsonData.writable_books);
				//GO.billing.readableBooksStore.loadData(jsonData.readable_books);
				GO.billing.readableBooksStore.on('load', function() {
					this.booksPanel.getSelectionModel().selectFirstRow();
				},this);
				GO.billing.readableBooksStore.load();

				this.booksPanel.getSelectionModel().selectFirstRow();
				var record = this.booksPanel.selModel.getSelected();

				if(record)
				{
					GO.billing.orderStatusesStore.baseParams.book_id=record.data.id;
					GO.billing.orderStatusesStore.loadData(jsonData.statuses);

					GO.billing.costCodesStore.loadData(jsonData.cost_codes);
					GO.billing.costCodesStore.baseParams.book_id=record.data.id;

					GO.billing.defaultVAT = GO.util.unlocalizeNumber(record.data.default_vat);
					GO.billing.defaultCountry = record.data.country;
					this.setBookId(record.data.id);
					this.centerPanel.setTitle(record.data.name);
				}

		
				
			},
			scope:this
		});
	},
	
	afterRender : function(){
		GO.billing.MainPanel.superclass.afterRender.call(this);

		if(GO.billing.max_orders>0){
			Ext.MessageBox.alert(GO.billing.lang.demoMode, GO.billing.lang.demoText.replace('%max_orders%', GO.billing.max_orders));
		}
			
		GO.billing.duplicateDialog = new GO.billing.DuplicateDialog();
		GO.billing.duplicateDialog.on('save', function(dialog, new_order_id, new_book_id){
			this.setBookId(new_book_id);
			
			var record = this.booksPanel.store.getById(new_book_id);
			this.booksPanel.selModel.selectRecords([record]);
			
			GO.billing.showOrderDialog(new_order_id);
		}, this);	

		GO.dialogListeners.add('order',{
			scope:this,
			save:function(){
				this.centerPanel.store.reload();
			}
		});

		this.init();
	},
	
	setWritePermission : function(write_permission){
		this.deleteButton.setDisabled(!write_permission);
		this.addButton.setDisabled(!write_permission);
		this.batchjobButton.setDisabled(!write_permission);
	
	},
	setBookId : function(book_id)
	{
		this.book_id=book_id;
		if(GO.billing.orderStatusesStore.baseParams.book_id!=book_id){
			GO.billing.orderStatusesStore.baseParams.book_id=this.book_id=book_id;
			GO.billing.orderStatusesStore.load();
		}

		GO.billing.isPurchaseOrderBook = false;
		var book = GO.billing.readableBooksStore.getById(book_id);         
		if(book)
		{
			GO.billing.isPurchaseOrderBook = (book.json.is_purchase_orders_book == '1') ? true : false;
		}

		this.stockButton.setVisible(GO.billing.isPurchaseOrderBook);
//		this.reversalButton.setVisible(GO.billing.isPurchaseOrderBook);
		GO.billing.costCodesStore.setBookId(book_id);
		GO.billing.SelectTaxRateStore.setBookId(book_id);
		
		this.centerPanel.store.baseParams.book_id = book_id;
		//this.centerPanel.store.load();
		
		this.fireEvent('bookchanged', this, book);
	}
});

GO.billing.defaultVAT = 0;
	

/*
 * This will add the module to the main tabpanel filled with all the modules
 */

if(!GO.addressbook){
	alert('The billing module requires the addressbook. The billing module is disabled');
}else
{
	GO.billing.showOrderDialog = function(order_id, config){

		if(!GO.billing.orderDialog)
			GO.billing.orderDialog = new GO.billing.OrderDialog();

		
		GO.billing.orderDialog.show(order_id, config);
	}

	
	GO.moduleManager.addModule('billing', GO.billing.MainPanel, {
		title : GO.billing.lang.billing,
		iconCls : 'go-tab-icon-billing'
	});
}
/*
 * If your module has a linkable item, you should add a link handler like this. 
 * The index (no. 1 in this case) should be a unique identifier of your item.
 * See classes/base/links.class.inc for an overview.
 * 
 * Basically this function opens a project window when a user clicks on it from a 
 * panel with links. 
 */
GO.linkHandlers["GO\\Billing\\Model\\Order"]=function(id){

	if(!GO.billing.linkWindow){
		var orderPanel = new GO.billing.OrderPanel();
		GO.billing.linkWindow = new GO.LinkViewWindow({
			title: GO.billing.lang.order,
			items: orderPanel,
			orderPanel: orderPanel,
			closeAction:"hide"
		});		
	}
	GO.billing.linkWindow.orderPanel.load(id);
	GO.billing.linkWindow.show();
	return GO.billing.linkWindow;
}

GO.linkPreviewPanels["GO\\Billing\\Model\\Order"]=function(config){
	config = config || {};
	return new GO.billing.OrderPanel(config);
}
/* {LINKHANDLERS} */

GO.newMenuItems.push({
	text: GO.billing.lang.order,
	iconCls: 'go-model-icon-GO\\Billing\\Model\\Order',
	handler:function(item, e){

		GO.billing.showOrderDialog(0, {
			link_config: item.parentMenu.link_config,	
			values: {
				book_id: ""
			}
		});
		
		if(item.parentMenu.link_config.model_name == 'GO\\Addressbook\\Model\\Contact')
		{
			GO.billing.orderDialog.setContactValue(item.parentMenu.link_config.model_id);				
		}
		
		if(item.parentMenu.link_config.model_name == 'GO\\Addressbook\\Model\\Company')
		{
			GO.billing.orderDialog.setCompanyValue(item.parentMenu.link_config.model_id);				
		}
	}
});
/* {NEWMENUITEMS} */

