GO.billing.BooksGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.cls='go-grid3-hide-headers';
//	config.title = GO.billing.lang.books;
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = GO.billing.readableBooksStore;
	
	
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			header: GO.lang.strName, 
			dataIndex: 'name'
		}]
	});
	
	config.cm=columnModel;
	
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: GO.lang['strNoItems']		
	});
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	
	GO.billing.BooksGrid.superclass.constructor.call(this, config);
};

Ext.extend(GO.billing.BooksGrid, GO.grid.GridPanel,{
	
	
});