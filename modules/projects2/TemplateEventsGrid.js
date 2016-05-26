/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: TemplateEventsGrid.js 21269 2016-03-22 16:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
GO.projects2.TemplateEventsGrid = function(config){
	if(!config)
	{
		config = {};
	}
	config.title = GO.projects2.lang.tasks;
	config.layout='fit';
	config.id ='pm-template-action-grid';
	config.autoScroll=true;
	config.split=true;
	var fields ={
		fields:['id','template_id','name', 'user_name','description','time_offset','duration','type','reminder'],
		columns:[		{
			header: GO.lang.strName, 
			dataIndex: 'name'
		}
		,{
			header:GO.projects2.lang.projectManager,
			dataIndex: 'user_name',
			sortable:false
		},		{
			header: GO.lang.strDescription, 
			dataIndex: 'description'
		}
		,		{
			header: GO.projects2.lang.duration, 
			dataIndex: 'duration'
		}
		,		{
			header: GO.lang.strType,
			dataIndex: 'type'
		}
		]
	};
	config.store = new GO.data.JsonStore({
		url: GO.url('projects2/templateEvent/store'),
		baseParams: {
//			task: 'template_events',
			template_id: 0
		},
		root: 'results',
		id: 'id',
		totalProperty:'total',
		fields: fields.fields,
		remoteSort: true
	});
	config.paging=true;
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:fields.columns
	});
	
	config.cm=columnModel;
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: GO.lang['strNoItems']		
	});
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	this.templateEventDialog = new GO.projects2.TemplateEventDialog();
	this.templateEventDialog.on('save', function(){
		this.store.reload();
	}, this);
	config.tbar=[{
		iconCls: 'btn-add',
		text: GO.lang['cmdAdd'],
		cls: 'x-btn-text-icon',
		handler: function(){
			this.templateEventDialog.show();
			
			this.templateEventDialog.formPanel.baseParams.template_id=this.store.baseParams.template_id;
			
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
	GO.projects2.TemplateEventsGrid.superclass.constructor.call(this, config);
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);
//		console.log(record);
		this.templateEventDialog.show(record.data.id);
	}, this);
};
Ext.extend(GO.projects2.TemplateEventsGrid, GO.grid.GridPanel,{
	setTemplateID : function(template_id){
		this.setDisabled(GO.util.empty(template_id));
		this.store.baseParams.template_id=template_id;
		this.store.loaded=false;
		this.store.removeAll();
	},
	onShow : function(){
		GO.projects2.TemplateEventsGrid.superclass.onShow.call(this);
		if(!this.store.loaded)
		{
			this.store.load();
		}
	}

});
