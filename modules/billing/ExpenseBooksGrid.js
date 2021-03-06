GO.billing.ExpenseBooksGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = GO.billing.lang.expenseBooks;
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = GO.billing.readableExpenseBooksStore;
	
	
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
	   {
			header: GO.lang.strName, 
			dataIndex: 'name'
		}
	]
	});
	
	config.cm=columnModel;
	
	config.cls='go-grid3-hide-headers';
	
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: GO.lang['strNoItems']		
	}),
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	
	
	this.expenseBookDialog = new GO.billing.ExpenseBookDialog();
	    			    		
		this.expenseBookDialog.on('save', function(){   
			this.store.reload();	    			    			
		}, this);
	

	
	
	GO.billing.ExpenseBooksGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		
		this.expenseBookDialog.show(record.data.id);
		
		}, this);
	
};

Ext.extend(GO.billing.ExpenseBooksGrid, GO.grid.GridPanel,{
	
});