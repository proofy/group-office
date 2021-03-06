GO.billing.DocTemplatesGrid = function(config) {

	if (!config)
	{
		config = {};
	}

	config.title = GO.billing.lang.docTemplates;
	config.layout = 'fit';
	config.autoScroll = true;
	config.split = true;
	config.store = GO.billing.docTemplatesStore = new GO.data.JsonStore({
		url: GO.url('billing/docTemplate/store'),
		baseParams: {
			book_id: 0
		},
		root: 'results',
		id: 'id',
		totalProperty: 'total',
		fields: ['id', 'name'],
		remoteSort: true
	});

	config.paging = false;
	var columnModel = new Ext.grid.ColumnModel({
		defaults: {
			sortable: true
		},
		columns: [
			{
				header: GO.lang.strName,
				dataIndex: 'name'
			}
		]
	});

	config.cm = columnModel;

	config.view = new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: GO.lang['strNoItems']
	}),
	config.sm = new Ext.grid.RowSelectionModel();
	config.loadMask = true;


	this.templateDialog = new GO.billing.DocTemplateDialog();

	this.templateDialog.on('save', function() {
		this.store.reload();
	}, this);


	config.tbar = [{
			iconCls: 'btn-add',
			text: GO.lang['cmdAdd'],
			cls: 'x-btn-text-icon',
			handler: function()
			{
				this.templateDialog.show();
				this.templateDialog.formPanel.baseParams.book_id = this.store.baseParams.book_id;
			},
			scope: this
		}, {
			iconCls: 'btn-delete',
			text: GO.lang['cmdDelete'],
			cls: 'x-btn-text-icon',
			handler: function()
			{
				this.deleteSelected();
			},
			scope: this
		}, {
			iconCls: 'btn-copy',
			text: GO.lang['copy'],
			cls: 'x-btn-text-icon',
			handler: function()
			{
				this.copySelected();
			},
			scope: this
		}];



	GO.billing.DocTemplatesGrid.superclass.constructor.call(this, config);

	this.on('rowdblclick', function(grid, rowIndex) {
		var record = grid.getStore().getAt(rowIndex);

		this.templateDialog.show(record.data.id);

	}, this);

};

Ext.extend(GO.billing.DocTemplatesGrid, GO.grid.GridPanel, {
	copySelected: function()
	{
		var sm = this.getSelectionModel();
		var record = sm.getSelected();

		if (record)
		{
			GO.request({
				url: 'billing/docTemplate/copy',
				params: {
					id: record['id']
				},
				success:function(){
					this.store.load();
				},
				scope:this
				
			}, this);
			
		} else
		{
			alert(GO.lang.noItemSelected);
		}
	}
}, this);