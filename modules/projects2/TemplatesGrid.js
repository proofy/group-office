/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: TemplatesGrid.js 19124 2014-06-06 15:04:24Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
GO.projects2.TemplatesGrid = function(config){
	if(!config)
	{
		config = {};
	}
	config.title = GO.projects2.lang.templates;
	config.layout='fit';
	config.region='center';
	config.autoScroll=true;
	config.split=true;
	config.store = new GO.data.JsonStore({
		url: GO.url('projects2/template/store'),
		baseParams: {
			auth_type:'write'
		},
		root: 'results',
		id: 'id',
		totalProperty:'total',
		fields: ['id','user_name','project_type', 'name','acl_id'],
		remoteSort: true
	});

	config.store.on('load', function(){
		config.store.on('load', function(){
			GO.projects2.templatesStore.load();
		}, this);
	}, this);

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
	},{
      header: GO.projects2.lang.projetType,
      dataIndex: 'project_type'
    }
	]
	});
	
	config.cm=columnModel;
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: GO.lang['strNoItems']		
	});
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	
	config.tbar=[{
		iconCls: 'btn-add',
		text: GO.lang['cmdAdd'],
		cls: 'x-btn-text-icon',
		handler: function(){
			this.showTemplateDialog();
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

	config.listeners={
		render:function(){
			if(!this.store.loaded)
				this.store.load();
		},
		scope:this
	};

	GO.projects2.TemplatesGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		this.showTemplateDialog(record.data.id);
	}, this);
};
Ext.extend(GO.projects2.TemplatesGrid, GO.grid.GridPanel,{
	

	showTemplateDialog : function(config){
		if(!this.templateDialog){
			this.templateDialog = new GO.projects2.TemplateDialog();
			this.templateDialog.on('save', function(){
				this.store.reload();
			}, this);
		}

		this.templateDialog.show(config);
	}
});
