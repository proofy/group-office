GO.projects2.StatusesFilterGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = GO.projects2.lang.statuses;
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	if(!config.store)
		config.store = new GO.data.JsonStore({
			url: GO.url("projects2/status/store"),
			fields: ['id','name','checked'],
			remoteSort: true,
			baseParams:{
				forEditing:true,
				forFilterPanel:true
			}
	});

	Ext.apply(config, {
		allowNoSelection:true,
		bbar: new GO.SmallPagingToolbar({
			items:[this.searchField = new GO.form.SearchField({
				store: config.store,
				width:120,
				emptyText: GO.lang.strSearch
			})],
			store:config.store,
			pageSize:GO.settings.config.nav_page_size
		})
	});
	
	GO.projects2.StatusesFilterGrid.superclass.constructor.call(this, config);
};


Ext.extend(GO.projects2.StatusesFilterGrid, GO.grid.MultiSelectGrid, {
	
	type: '',

	setType : function(type)
	{
		this.type = type;
	}
});
