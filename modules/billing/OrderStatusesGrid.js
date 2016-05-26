GO.billing.OrderStatusesGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = GO.billing.lang.orderStatuses;
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = new GO.data.JsonStore({
		url: GO.url('billing/status/store'),
	    //url: GO.settings.modules.billing.url+ 'json.php',
	    baseParams: {
	    	//task: 'order_statuses',
	    	for_settings: true,
	    	book_id: 0	    	
	    	},
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
	    fields: ['color','id','name','max_age','payment_required','remove_from_stock'],
	    remoteSort: true
	});
	
	config.paging=false;
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
	  {
			header: GO.lang.strName, 
			dataIndex: 'name',
			renderer: function(value,meta,record) {
				return '<div style="background-color: #'+record.data.color+';border: 1px solid #666;width:9px;height:9px;margin-right:4px;float:left;"></div>'+value;
			}
		},	{
			header: GO.billing.lang.paymentRequired, 
			dataIndex: 'payment_required',
			renderer: this.boolRender
		},		{
			header: GO.billing.lang.removeFromStock, 
			dataIndex: 'remove_from_stock',
			renderer: this.boolRender
		}
	]
	});
	
	config.cm=columnModel;
	config.editDialogClass = GO.billing.OrderStatusDialog;
	
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: GO.lang['strNoItems']		
	}),
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	config.standardTbar=true;
	config.relatedGridParamName='book_id';
	config.hideSearchField=true;
		
	config.disabled=true;	
	
	GO.billing.OrderStatusesGrid.superclass.constructor.call(this, config);

        this.store.on('load', function(){
                if(!this.firstLoad)
                {
                    if(this.store.baseParams.book_id == GO.billing.orderStatusesStore.baseParams.book_id)
                    {                        
                        GO.billing.orderStatusesStore.reload();

                        if(GO.billing.activePanel.data.id !== undefined)
                        {
                            GO.billing.activePanel.setStatusMenu(true);
                            //GO.billing.statusPanel.statusesStore.reload();
                        }
                    }
                }else
                {
                    this.firstLoad = false;
                }
	},this);
	
};

Ext.extend(GO.billing.OrderStatusesGrid, GO.grid.GridPanel,{
	setBookId : function(book_id){
		this.setDisabled(book_id==0);
		this.store.baseParams.book_id=book_id;
		this.store.loaded=false;
	},
	boolRender : function(value)
	{
		if(value=="1")
		{
			return GO.lang.cmdYes;
		}else
		{
			return GO.lang.cmdNo;
		}
	},
	onShow : function(){
		if(!this.store.loaded)
		{
                        this.firstLoad = true;
			this.store.load();
		}
		
		GO.billing.OrderStatusesGrid.superclass.onShow.call(this);
	}
});