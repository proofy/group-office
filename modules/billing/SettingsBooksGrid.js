GO.billing.SettingsBooksGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = GO.billing.lang.books;
	config.layout='fit';
	config.autoScroll=true;

	config.store = GO.billing.writableBooksStore;
	
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			header: GO.lang.strName, 
			dataIndex: 'name'
		},
		{
			header: GO.lang.strOwner, 
			dataIndex: 'user_name'
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
	
	
	this.bookDialog = new GO.billing.BookDialog();
	    			    		
	this.bookDialog.on('save', function(){
		this.store.load();	    			    			
	}, this);

	
	
	config.tbar=[{
		iconCls: 'btn-add',
		text: GO.lang['cmdAdd'],
		cls: 'x-btn-text-icon',
		disabled: !GO.settings.modules.billing.write_permission,
		handler: function(){
			this.bookDialog.show();
		},
		scope: this
	},{
		iconCls: 'btn-delete',
		text: GO.lang['cmdDelete'],
		cls: 'x-btn-text-icon',
		disabled: !GO.settings.modules.billing.write_permission,
		handler: function(){
			this.deleteSelected();
		},
		scope: this
	}];
	
	
	
	GO.billing.SettingsBooksGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	

		this.bookDialog.show(record.data.id);
		
		}, this);
	
};

Ext.extend(GO.billing.SettingsBooksGrid, GO.grid.GridPanel,{
	
	
	afterRender : function()
	{
		GO.billing.SettingsBooksGrid.superclass.afterRender.call(this);
		
		if(this.isVisible())
		{
			this.onGridShow();
		}
	},
	
	onGridShow : function(){
		if(!this.store.loaded && this.rendered)
		{
			this.store.load();
		}
	}
	
});