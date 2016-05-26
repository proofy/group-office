GO.billing.LanguagesGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = GO.billing.lang.languages;
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = GO.billing.languagesStore;
	
	GO.billing.languagesStore.on("load", function(){
		Ext.MessageBox.alert(GO.billing.lang.restartRequiredTitle, GO.billing.lang.restartRequired)
	});
	
	config.paging=true;
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
	   {
			header: GO.lang.strName, 
			dataIndex: 'name'
		},{
			header: GO.billing.lang.language, 
			dataIndex: 'language'
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
	
	
	this.languageDialog = new GO.billing.LanguageDialog();
	    			    		
		this.languageDialog.on('save', function(){   
			
			this.store.reload();	    			    			
		}, this);
	
	
	config.tbar=[{
			iconCls: 'btn-add',							
			text: GO.lang['cmdAdd'],
			cls: 'x-btn-text-icon',
			handler: function(){
				
	    	this.languageDialog.show();
	    	
	    	
	    	
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
	
	
	
	GO.billing.LanguagesGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		
		this.languageDialog.show(record.data.id);
		
		}, this);
	
};

Ext.extend(GO.billing.LanguagesGrid, GO.grid.GridPanel,{
	
});