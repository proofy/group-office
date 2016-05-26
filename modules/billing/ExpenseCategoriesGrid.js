GO.billing.ExpenseCategoriesGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = GO.billing.lang.expenseCategories;
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.disabled=true;
	config.store = GO.billing.expenseCategoriesStore;
	
	config.paging=false;
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
	
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: GO.lang['strNoItems']		
	}),
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	
	
	this.expenseCategoryDialog = new GO.billing.ExpenseCategoryDialog();
	    			    		
		this.expenseCategoryDialog.on('save', function(){   
			this.store.reload();	    			    			
		}, this);
	
	
	config.tbar=[{
			iconCls: 'btn-add',							
			text: GO.lang['cmdAdd'],
			cls: 'x-btn-text-icon',
			handler: function(){				
	    	this.expenseCategoryDialog.show();
	    	this.expenseCategoryDialog.formPanel.baseParams.expense_book_id=this.store.baseParams.expense_book_id;
			},
			scope: this
		},{
			iconCls: 'btn-delete',
			text: GO.lang['cmdDelete'],
			cls: 'x-btn-text-icon',
			handler: function(){
				this.deleteSelected();
			},
			scope: this
		}];
	
	
	
	GO.billing.ExpenseCategoriesGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		
		this.expenseCategoryDialog.show(record.data.id);
		
		}, this);
	
};

Ext.extend(GO.billing.ExpenseCategoriesGrid, GO.grid.GridPanel,{
	setExpenseBookId : function(expense_book_id)
	{
		this.store.baseParams.expense_book_id=expense_book_id;
		this.store.loaded=false;
		this.setDisabled(expense_book_id==0);
	},
	onShow : function(){
		if(!this.store.loaded)
		{
			this.store.load();
		}
		
		GO.billing.ExpenseCategoriesGrid.superclass.onShow.call(this);
	}
});