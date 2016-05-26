GO.billing.ExpensesGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = GO.billing.lang.expenses;
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = new GO.data.JsonStore({
	    url: GO.url('billing/expense/store'),
	    baseParams: {
	    	expense_book_id: 0	    	
	    	},
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
	    fields: ['id','user_name','expense_book_id','category','supplier','invoice_no','ctime','mtime','btime','subtotal','vat','vat_percentage','ptime'],
	    remoteSort: true
	});
	
	config.paging=true;
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			header: GO.billing.lang.category, 
			dataIndex: 'category'
		},		{
			header: GO.billing.lang.supplier, 
			dataIndex: 'supplier'
		},		{
			header: GO.billing.lang.invoiceNo, 
			dataIndex: 'invoice_no'
		},		{
			header: GO.billing.lang.btime, 
			dataIndex: 'btime'
		},		{
			header: GO.billing.lang.subtotal, 
			dataIndex: 'subtotal',
			align: "right"
		},		{
			header: GO.billing.lang.vat, 
			dataIndex: 'vat',
			align: "right"
		},		{
			header: GO.billing.lang.paid, 
			dataIndex: 'ptime'
		}
	]
	});
	
	config.cm=columnModel;
	
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: GO.lang['strNoItems']		
	}),
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	
	
	this.expenseDialog = new GO.billing.ExpenseDialog();
	    			    		
		this.expenseDialog.on('save', function(){   
			this.store.reload();	    			    			
		}, this);
	
	this.searchField = new GO.form.SearchField({
								store: config.store,
								width:320
						  });
	
	config['tbar']=[
	            GO.lang['strSearch']+': ', ' ',this.searchField
	            ];
	
	GO.billing.ExpensesGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		
		this.expenseDialog.show(record.data.id);
		
		}, this);
	
};

Ext.extend(GO.billing.ExpensesGrid, GO.grid.GridPanel,{
	boolRender : function(value)
	{
		if(value=="1")
		{
			return GO.lang.cmdYes;
		}else
		{
			return GO.lang.cmdNo;
		}
	}
});