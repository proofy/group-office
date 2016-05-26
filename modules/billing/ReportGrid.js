GO.billing.ReportGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = new GO.data.JsonStore({
	    url: GO.url('billing/report/yearReport'),
	    baseParams: {
	    	
	    	},
	    root: 'results',
	    id: 'month',
	    totalProperty:'total',
	    fields: ['month', 'period', 'turnover', 'expenses', 'profit'],
	    remoteSort: true
	});
	
	
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			header: GO.billing.lang.period, 
			dataIndex: 'period'
		},{
			header: GO.billing.lang.turnover, 
			dataIndex: 'turnover'
		},{
			header: GO.billing.lang.expenses, 
			dataIndex: 'expenses'
		},{
			header: GO.billing.lang.profit, 
			dataIndex: 'profit'
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
	
	GO.billing.ReportGrid.superclass.constructor.call(this, config);
	
	this.detailedReportDialog = new GO.billing.DetailedReportDialog();

	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);		
		
		this.detailedReportDialog.show();
		this.detailedReportDialog.loadReport(record.data.month, this.ownerCt.ownerCt.yearField.getValue());
		
		
		}, this);	
	
};

Ext.extend(GO.billing.ReportGrid, GO.grid.GridPanel);