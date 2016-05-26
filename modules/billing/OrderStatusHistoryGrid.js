GO.billing.OrderStatusHistoryGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = GO.billing.lang.orderStatusHistory;
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = new GO.data.JsonStore({
			url: GO.url('billing/statusHistory/orderStatusHistory'),
	    baseParams: {
				order_id: 0
	    },
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
	    fields: ['id','order_id','status_name','user_name','ctime','notified', 'notification_email'],
	    remoteSort: true
	});

	config.noDelete=true;
	
	config.paging=true;
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			header: GO.billing.lang.statusId, 
			dataIndex: 'status_name'
		},		{
			header: GO.lang.strOwner, 
			dataIndex: 'user_name',
		  sortable: false
		},		{
			header: GO.lang.strCtime, 
			dataIndex: 'ctime',
			width:110
		},		{
			header: GO.billing.lang.notified, 
			dataIndex: 'notified',
			renderer: this.notifiedRenderer 
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
	
	
	this.orderStatusHistoryDialog = new GO.billing.OrderStatusHistoryDialog();
	    			    		
		this.orderStatusHistoryDialog.on('save', function(){   
			this.store.reload();	    			    			
		}, this);
	

	
	GO.billing.OrderStatusHistoryGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		
		this.orderStatusHistoryDialog.show(record.data.id);
		
		}, this);
	
};

Ext.extend(GO.billing.OrderStatusHistoryGrid, GO.grid.GridPanel,{
	notifiedRenderer : function(value, p, record){
		if(value=="1")
		{
			
			return '<div class="go-grid-icon btn-ok"><a href="#" onclick="GO.linkHandlers[\'GO\\\\Savemailas\\\\Model\\\\LinkedEmail\'].call(this, 0, {action:\'path\',path: \''+Ext.util.Format.htmlEncode(record.data.notification_email)+'\'});">'+GO.lang.strView+'</a></div>';
		}else
		{
			return "";
		}
	}
});