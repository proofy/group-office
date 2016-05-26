/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: SettingsTemplatesGrid.js 18293 2014-02-17 12:01:11Z wsmits $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.SettingsTemplatesGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title=GO.tickets.lang.emailTemplates;
	config.layout='fit';
	config.autoScroll=true;
	config.loadMask=true;
	config.store = new GO.data.JsonStore({
		url: GO.url('tickets/template/store'),
		root:'results',	
		id: 'id',
		totalProperty:'total',
		fields: ['id','name','user_id','user_name']		
	}),
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
			dataIndex: 'user_name',
			sortable: false
		}
	]
	});
	
	config.cm=columnModel;
	
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: GO.lang['strNoItems']		
	}),
	config.sm= new Ext.grid.RowSelectionModel();
	
	this.templateDialog = new GO.tickets.TemplateDialog();
	    			    		
	this.templateDialog.on('save', function()
	{   
		this.store.reload();	    			    			
		this.changed=true;
	}, this);

	config.tbar=[{
		iconCls: 'btn-add',							
		text: GO.lang['cmdAdd'],
		cls: 'x-btn-text-icon',
		handler: function()
		{       	
	    	this.templateDialog.show(0);
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
	
	GO.tickets.SettingsTemplatesGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex)
	{
		var record = grid.getStore().getAt(rowIndex);	
		this.templateDialog.show(record);
		
	}, this);
	
};

Ext.extend(GO.tickets.SettingsTemplatesGrid, GO.grid.GridPanel,{

	changed : false,

	afterRender : function()
	{
		GO.tickets.SettingsTemplatesGrid.superclass.afterRender.call(this);
		
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