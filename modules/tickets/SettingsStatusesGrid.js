/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: SettingsStatusesGrid.js 18293 2014-02-17 12:01:11Z wsmits $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.SettingsStatusesGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title=GO.tickets.lang.statuses;
	config.layout='fit';
	config.autoScroll=true;
	config.loadMask=true;
	config.store = new GO.data.JsonStore({
			url: GO.url('tickets/status/store'),
	    baseParams: {
				showTicketCount : 0
			},
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
		fields: ['id','name','user_id','user_name']
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
	
	this.statusDialog = new GO.tickets.StatusDialog();
	    			    		
	this.statusDialog.on('save', function()
	{   
		this.store.reload();
		this.changed=true;
	}, this);
	
	if(GO.settings.modules.tickets.write_permission)
	{
		config.tbar=[{
			iconCls: 'btn-add',							
			text: GO.lang['cmdAdd'],
			cls: 'x-btn-text-icon',
			handler: function()
			{				
	    		this.statusDialog.show();	    	
			},
			scope: this
		},{
			iconCls: 'btn-delete',
			text: GO.lang['cmdDelete'],
			cls: 'x-btn-text-icon',
			handler: function()
			{
				this.deleteSelected();
				this.changed=true;
			},
			scope: this
		}];
	}
	
	GO.tickets.SettingsStatusesGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex)
	{
		var record = grid.getStore().getAt(rowIndex);
		this.statusDialog.show(record);
	
	}, this);
	
};

Ext.extend(GO.tickets.SettingsStatusesGrid, GO.grid.GridPanel,{
	
	changed : false,
	
	afterRender : function()
	{
		GO.tickets.SettingsStatusesGrid.superclass.afterRender.call(this);
		
		if(this.isVisible())
		{
			this.onGridShow();
		}
	},	
	onGridShow : function()
	{
		if(!this.store.loaded && this.rendered)
		{
			this.store.load();
		}	
	}
});