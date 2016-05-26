GO.billing.OrdersGrid = function(config){
	
	if(!config)
	{
		config = {};
	}

//	var summary = new Ext.grid.JsonSummary();
//
//	config.plugins = [summary];

	var fields ={
		fields : [
		'id',
		'late',
		'due_date',
		'overdue',
		'status_id',
		'status_name',
		'user_name',
		'order_id',
		'po_id',
		'ctime',
		'mtime',
		'btime',
			'dtime',
		'ptime',
		'costs',
		'subtotal',
		'vat',
		'total',
		'total_paid',
		'customer_name',
		'customer_contact_name',
		'customer_address',
		'customer_address_no',
		'customer_zip',
		'customer_city',
		'customer_state',
		'customer_country',
		'customer_vat_no',
		'customer_email',
		'customer_extra',
		'recur_type',
		'payment_method',
		'recurred_order_id',
		'reference',
		'read_only',
		'color',
		'project_name'],
		columns :[
		{
			header: GO.billing.lang.orderId,
			dataIndex: 'order_id',
			renderer: this.renderOrderId,
			width:110
			}, {
			header: GO.billing.lang.btime,
			dataIndex: 'btime',
			width:80
			}, {
				header: GO.billing.lang.dtime,
				dataIndex: 'dtime',
				width: 80
			}, {
			header: GO.billing.lang.statusId,
			dataIndex: 'status_name',
			width:120,
			renderer: function(value,meta,record) {
				return '<div style="background-color: #'+record.data.color+';border: 1px solid #666;width:9px;height:9px;margin-right:4px;float:left;"></div>'+value;
			},
			summaryRenderer: function(value) {
				return '-';
			}
		},		{
			header: GO.billing.lang.ptime,
			dataIndex: 'ptime',
			hidden:true
		},		{
			header: GO.billing.lang.customer,
			dataIndex: 'customer_name',
			id:'customer'
		},{
			header: GO.billing.lang.paymentMethod,
			dataIndex: 'payment_method'
		},		{
			header: GO.billing.lang.reference,
			dataIndex: 'reference'
		},{
			header: GO.billing.lang.poId,
			dataIndex: 'po_id',
			hidden:true
		},			{
			header: GO.billing.lang.costs,
			dataIndex: 'costs',
			hidden:true,
			align: 'right'
		},		{
			header: GO.billing.lang.subtotal,
			dataIndex: 'subtotal',
			align: 'right'
		},		{
			header: GO.billing.lang.vat,
			dataIndex: 'vat',
			hidden:true,
			align: 'right'
		},{
			header: GO.billing.lang.total,
			dataIndex: 'total',
			align: 'right'
		},{
			header: GO.billing.lang.totalPaid,
			dataIndex: 'total_paid',
			align: 'right'
		},	{
			header: GO.lang.strMtime,
			dataIndex: 'mtime',
			hidden: true,
			width:110
		},		{
			header: GO.lang.strCtime,
			dataIndex: 'ctime',
			hidden:true,
			width:110
		},		{
			header: GO.billing.lang.customerContact,
			dataIndex: 'customer_contact_name',
			hidden:true
		}
		,		{
			header: GO.lang.strAddress,
			dataIndex: 'customer_address',
			hidden:true
		},		{
			header: GO.lang.strNo,
			dataIndex: 'customer_address_no',
			hidden:true
		},		{
			header: GO.lang.strZip,
			dataIndex: 'customer_zip',
			hidden:true
		},		{
			header: GO.lang.strCity,
			dataIndex: 'customer_city',
			hidden:true
		},		{
			header: GO.lang.strState,
			dataIndex: 'customer_state',
			hidden:true
		},		{
			header: GO.lang.strCountry,
			dataIndex: 'customer_country',
			hidden:true
		},		{
			header: GO.billing.lang.customerVatNo,
			dataIndex: 'customer_vat_no',
			hidden:true
		},		{
			header: GO.lang.strEmail,
			dataIndex: 'customer_email',
			hidden:true
		},		{
			header: GO.billing.lang.customerExtra,
			dataIndex: 'customer_extra',
			hidden:true
		},{
			header: GO.billing.lang.dueDate,
			dataIndex: 'due_date',
			hidden:true,
			renderer: function(value,meta,record) {

				if(record.data.overdue == 1){
					meta.css = 'cellbg-red';
				}else if(record.data.overdue == 0){
					meta.css = 'cellbg-green';
				}else{
					meta.css = 'cellbg-blue';
				}

				return value;
			}
		}
		]
	};
	
	if(GO.settings.modules.billing.write_permission) {
		fields.fields.push('telesales_agent_name');
		fields.fields.push('fieldsales_agent_name');
		fields.columns.push({
			header: GO.billing.lang.telesalesAgent,
			dataIndex: 'telesales_agent_name',
			hidden:true
		});
		fields.columns.push({
			header: GO.billing.lang.fieldsalesAgent,
			dataIndex: 'fieldsales_agent_name',
			hidden:true
		});
	}
	
	if(GO.projects){
		
		fields.columns.push({
			header: GO.projects.lang.project,
			dataIndex: 'project_name',
			hidden:true
		});
		
	} else if(GO.projects2){
		
		fields.columns.push({
			header: GO.projects2.lang.project,
			dataIndex: 'project_name',
			hidden:true
		});
		
	}

	if(GO.customfields)
	{
		GO.customfields.addColumns("GO\\Billing\\Model\\Order", fields);
	}
	
//	config.title = GO.billing.lang.orders;
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.autoExpandColumn='customer';
	
	var reader = new Ext.data.JsonReader({
		root: 'results',
		totalProperty: 'total',
		fields: fields.fields,
		id: 'id'
	});
	
	config.store = new Ext.data.GroupingStore({
		url: GO.url('billing/orderJson/store'),
		//url: GO.settings.modules.billing.url+ 'json.php',
		baseParams: {
			task: 'orders',
			book_id: 0	    	
		},
		reader: reader,
		//sortInfo: {
		//	field: 'btime',
		//	direction: 'DESC'
		//},
		//groupField: 'project_name',
		remoteGroup:true,
		remoteSort:true
	});
	
	this.searchField = new GO.form.SearchField({
		store: config.store,
		width:320
	});
        
	config['tbar']=[
		GO.lang['strSearch']+': ', ' ',this.searchField,
		GO.lang['strMonth']+': ',' ',this.searchMonthField = new Ext.form.ComboBox({
			hiddenName : 'search_month',
			triggerAction : 'all',
			editable : false,
			selectOnFocus : true,
			width : 148,
			forceSelection : true,			
			mode : 'local',
			valueField : 'number',
			displayField : 'name',
			value: 0,
			store : new Ext.data.SimpleStore({
				fields : ['name', 'number'],
				data : [
					["--", 0],
					[GO.lang['months'][1], 1],
					[GO.lang['months'][2], 2],
					[GO.lang['months'][3], 3],
					[GO.lang['months'][4], 4],
					[GO.lang['months'][5], 5],
					[GO.lang['months'][6], 6],
					[GO.lang['months'][7], 7],
					[GO.lang['months'][8], 8],
					[GO.lang['months'][9], 9],
					[GO.lang['months'][10], 10],
					[GO.lang['months'][11], 11],
					[GO.lang['months'][12], 12]
				]
			}),
			listeners: {
				scope:this,
				select:function(cb, record, index){
					this.store.baseParams['search_month'] = record.data['number'];
					if (this.store.baseParams['search_year']>=1900)
						this.store.load();
				}
			}
		}),
		GO.lang['strYear']+': ',' ',this.searchYearField = new Ext.form.NumberField({
			name : 'search_year',
			width : 100,
			minValue : '1900',
			maxValue : '3000',
			allowBlank : true,		
			enableKeyEvents : true,
			listeners : {
				change : {
					fn : function(field,newValue,oldValue) {
						this.store.baseParams['search_year'] = newValue;
						this.store.load();
					},
					scope : this
				},
				keypress : {
					fn : function(field,event) {
						if (event.getKey()==event.ENTER) {
							this.store.baseParams['search_year'] = this.searchYearField.getValue();
							this.store.load();
						}
					},
					scope : this
				}
			}
		}),
		this.resetSearchButton = new Ext.Button({
//			iconCls: 'btn-delete',
			text: GO.billing.lang['resetSearch'],
			cls: 'go-white-bg',
			handler: function()
			{
				this.searchMonthField.reset();
				this.searchYearField.reset();
				this.searchField.reset();
				delete this.store.baseParams['search_month'];
				delete this.store.baseParams['search_year'];
				delete this.store.baseParams['query'];
				this.store.load();
			},
			scope: this
		}),
    this.removeProjectFilterButton = new Ext.Button({
			iconCls: 'btn-delete',
			text: GO.billing.lang.removeProjectFilter,
			hidden:true,
			cls: 'x-btn-text-icon',
			handler: function()
			{
				delete(this.store.baseParams.filter_project_id);
				this.store.reload();
				this.removeProjectFilterButton.hide();
			},
			scope: this
		})
	];
	
	config.paging=true;
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:fields.columns
	});
	
	config.cm=columnModel;
	config.editDialogClass = GO.billing.OrderDialog;
					
	config.view=new Ext.grid.GroupingView({
			scrollOffset: 2,
			//forceFit:true,
			hideGroupedColumn:true,
			emptyText: GO.lang['strNoItems'],
			getRowClass : function(record, rowIndex, p, store){
				if(record.data.late || record.data.status_id==0)
				{
					return 'bs-late';
				}
			}
		});
	
//	config.view=new Ext.grid.GridView({
//		emptyText: GO.lang['strNoItems'],
//		getRowClass: function(record, index){
//
//			if(record.data.late || record.data.status_id==0)
//			{
//				return 'bs-late';
//			}
//		}
//	});
	
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;

	GO.billing.OrdersGrid.superclass.constructor.call(this, config);
	
	this.on('rowcontextmenu', this.onContextClick, this);	
};

Ext.extend(GO.billing.OrdersGrid, GO.grid.GridPanel,{
	
	onContextClick : function(grid, index, e)
	{
		if(!this.menu)
		{
			this.orderStatusStore = new GO.data.JsonStore({
				url: GO.url('billing/status/store'),
				baseParams: {
					book_id: 0
					},
				id: 'id',
				fields: ['id','name','checked']
			});
			
			this.statusMenu = new Ext.menu.Menu({
				grid:grid
			});
		
			this.menu = new Ext.menu.Menu({
				id:'order-grid-ctx',
				items: [
					{
						iconCls: 'bs-duplicate',
						text: GO.billing.lang.changeStatus,
						cls: 'x-btn-text-icon',
						menu: this.statusMenu
					}
				]
			});
		}

		if(!this.orderStatusStore.loaded || this.orderStatusStore.baseParams.book_id != this.store.baseParams.book_id){
			this.orderStatusStore.baseParams.book_id=this.store.baseParams.book_id;
			
			this.orderStatusStore.load({
				callback:function(){

					this.statusMenu.removeAll();

					this.orderStatusStore.each(function(r){
						
						this.statusMenu.add({
							text:r.data.name,
							status_id:r.data.id,
							grid: this.statusMenu.grid,
							listeners: {
								
								click : function(mnu,e){
			
									Ext.Msg.show({
										modal:false,
										title:GO.billing.lang.notifyCustomer,
										msg: GO.billing.lang.notifyCustomerText,
										buttons: Ext.Msg.YESNOCANCEL,
										icon: Ext.MessageBox.QUESTION,
										fn: function(btn){
											
											if(btn=='cancel'){
												return false;
											}

											var ids = [];
											var selected = mnu.grid.selModel.getSelections();
											for (var i = 0; i < selected.length; i++) {
												if (!GO.util.empty(selected[i].data.id))
													ids.push(selected[i].data.id);
											}

											GO.request({
												maskEl:Ext.getBody(),
												url:"billing/order/setOrderStatusses",
												params:{                                                    
													ids: Ext.encode(ids),
													status_id:mnu.status_id,
													notify_customer: btn=='yes' ? 1 : 0
												},
												success:function(options, response, data){
													if(!data.success)	{
														GO.errorDialog.show(data.feedback);
													} else {
														mnu.grid.store.reload();
													}
												}
											});
										}
									});
								},
								scope:this
							}
						});
					},this);
				},
				scope:this
			});
		}
		
		this.menu.on('hide', this.onContextHide, this);
		
		e.stopEvent();
		
		this.menu.showAt(e.getXY());
	},	
	
	onContextHide : function()
	{
		if(this.selectedRows)
		{
			this.selectedRows = null;
		}
	},
	
//	showBatchStatusDialog : function(grid) {
//		var ids = [];
//		var selected = grid.selModel.getSelections();
//		for (var i = 0; i < selected.length; i++) {
//			if (!GO.util.empty(selected[i].data.id))
//				ids.push(selected[i].data.id);
//		}
//		
//		console.log(ids);
//		
//	},
	
	renderOrderId : function(id,cell,record){
		
		if(id==0)
		{
			id=GO.billing.lang.sceduledOrder;
		}
		
		var cls = 'bs-order-id';
		if(record.data.recur_type!='')
			cls += ' bs-icon-recur';
			
		return '<div class="'+cls+'">'+id+'</div>';
	},
					
	enableDateSearch : function( enable ) {
		
		if (!enable) {
			this.searchMonthField.reset();
			this.searchYearField.reset();
			delete this.store.baseParams['search_month'];
			delete this.store.baseParams['search_year'];
			this.store.load();
			this.searchMonthField.setDisabled(true);
			this.searchYearField.setDisabled(true);
		} else {
			this.searchMonthField.setDisabled(false);
			this.searchYearField.setDisabled(false);
		}
		
	}
});
