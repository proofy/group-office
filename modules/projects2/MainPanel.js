GO.projects2.MainPanel = function(config){

	if(!config)
	{
		config = {};
	}

	config.id=config.id || Ext.id();


//	this.projectsView = new GO.projects2.ProjectsView({
//		layout:'fit',
//		region:'center',
//		border: false,
//		id:config.id+'-projects-view'
//	});
//

	this.selectProject = new GO.projects2.SelectProject({
			emptyText:GO.projects2.lang.searchProject,
			hideLabel:true,
			anchor:'100%',
			minListWidth:600,
			region: 'northdele',
			store:new GO.data.JsonStore({
				url: GO.url('projects2/project/store'),
				fields:['id', 'path','use_tasks_panel'],
				remoteSort: true
			}),
			listeners:{
				select:function(cmb, record){
					this.project_id=record.id;
					this.tasksPanel.setProjectId(this.project_id,record.data.use_tasks_panel);
					if(this.project_id > 0)
					{
						this.projectPanel.load(this.project_id);
					}
				},
				scope:this
			}
	});


	var subProjectFields = {
		fields: ['id', 'name','reference_no','status_name','user_name','type_name','template_name','responsible_user_name','icon','start_time', 'due_time','customer_name'],
		columns: [{
				header: '',
				dataIndex: 'icon',
				id: 'icon',
				width: 20,
				renderer: function(v) {
					if (!GO.util.empty(v))
						return '<img src="'+v+'" />';
					else
						return '<img class="x-tree-node-icon go-model-icon-GO_Projects2_Model_Project" src="'+GO.settings.config.full_url+'views/Extjs3/ext/resources/images/default/s.gif" />';
				}
			},{
				header: 'ID',
				dataIndex: 'id',
				id: 'id',
				width: 50
			},{
				header:GO.lang['strName'],
				dataIndex: 'name',
				id:'name',
				width: 150
			},{
				header:GO.projects2.lang['referenceNo'],
				dataIndex: 'reference_no',
				id:'reference_no',
				width: 150
			},{
				header:GO.projects2.lang['status'],
				dataIndex: 'status_name',
				id:'status_name',
				width: 100
			},{
				header:GO.projects2.lang['startTime'],
				dataIndex: 'start_time',
				id:'start_time',
				width: 80,
				scope: this,
				hidden: true
			},{
				header:GO.projects2.lang['dueAt'],
				dataIndex: 'due_time',
				id:'due_time',
				width: 80,
				renderer: function(value,metaData,record) {
					return '<span class="'+this.projectPanel.templateConfig.getClass(record.data)+'">'+value+'</span>';
				},
				scope: this
			},{
				header: GO.lang['strUser'],
				dataIndex: 'user_name',
				id: 'user_name',
				width: 120,
				sortable:false
			},{
				header: GO.projects2.lang['type'],
				dataIndex: 'type_name',
				id: 'type_name',
				width: 80
			},{
				header: GO.projects2.lang['template'],
				dataIndex: 'template_name',
				id: 'template_name',
				width: 80
			},{
				header: GO.projects2.lang['projectManager'],
				dataIndex: 'responsible_user_name',
				id: 'responsible_user_name',
				width: 120,
				sortable:false
			},{
				header: GO.projects2.lang['customer'],
				dataIndex: 'customer_name',
				id: 'customer_name',
				width: 120,
				sortable:false
			}]
	}

	if(GO.customfields)
		GO.customfields.addColumns("GO\\Projects2\\Model\\Project", subProjectFields);

	var exportBtn = new GO.base.ExportMenu({className:'GO\\Projects2\\Export\\CurrentGrid'});
	exportBtn.iconCls = null;
	



	this.subProjectsGrid = new GO.grid.GridPanel({
		tbar: [exportBtn,this.showMineOnlyField = new Ext.form.Checkbox({
			boxLabel: GO.projects2.lang.showMineOnly,
			labelSeparator: '',
			name: 'show_mine_only',
			allowBlank: true,
			ctCls:'apr-show-mine-only-cb'
		})],
		border: false,
		region: 'south',
		height:300,
		hidden:true,
		layout:'fit',
		enableDragDrop: true,
		ddGroup: 'ProjectsDD',
		id:'pr2-sub-projects',
//		collapseMode:'mini',
//		hideCollapseTool:true,
//		collapsible:true,
//		hidden: true,
//		title:GO.projects2.lang['subprojects'],
		split: true,
//		renderTo: 'projects2-subprojectsgrid',
		store: new GO.data.JsonStore({
			url: GO.url('projects2/project/store'),
			baseParams: {
				parent_project_id: 0
			},
			root: 'results',
			totalProperty: 'total',
			id: 'id',
			fields: subProjectFields.fields,
			remoteSort:true
		}),
		autoScroll:true,
		paging : true,
		sm: new Ext.grid.RowSelectionModel(),
		cm: new Ext.grid.ColumnModel({
			defaultSortable:true,
			columns:subProjectFields.columns

		}),
		view:new Ext.grid.GridView({
			forceFit:false,
			autoFill:false
			}),
		scope: this
	});
	
	exportBtn.setColumnModel(this.subProjectsGrid.getColumnModel());
	
	this.subProjectsGrid.on('rowdblclick',function(grid,rowIndex,event){
//		THIS IS NEW
		var record = grid.store.getAt(rowIndex);
		this._switchProject(record.data.id);


		// NEXT 10 LINES TO BE COMMENTED OUT
//		var record = grid.store.getAt(rowIndex);
//				this.selectProject.reset();
//
//		if(record.data.id > 0)
//		{
//			this.projectPanel.load(record.data.id);
//		}else
//		{
//			this.projectPanel.reset();
//		}
	},this);


	this.treePanel = new GO.projects2.ProjectsTree({
		//		title:GO.projects2.lang.projects,
		width:250,
		split:true,
		autoScroll:true,
		region:'center',
		border:true,
		grid: this.subProjectsGrid
	});
	
	this.subProjectsGrid.store.on('load',function(store,records,options){
		this.showMineOnlyField.setValue(!GO.util.empty(store.reader.jsonData.showMineOnly));
	},this);
	
	this.showMineOnlyField.on('check', function(checkBox,checked){
		this.subProjectsGrid.store.baseParams.showMineOnly = checked;
		//this.getTreePanel().getRootNode().reload();
		this.subProjectsGrid.store.load();
		delete this.subProjectsGrid.store.baseParams.showMineOnly;
		//delete this.getTreePanel().treeLoader.baseParams.showMineOnly;
	},this);


	this.treePanel.on('click',function(){
		// NEXT LINE TO BE COMMENTED OUT
//		this.selectProject.reset();

		this.project_id=this.treePanel.project_id;
// THIS IS NEW
		this._switchProject(this.project_id)

		// NEXT 7 LINES TO BE COMMENTED OUT
//		if(this.project_id > 0)
//		{
//			this.projectPanel.load(this.project_id);
//		}else
//		{
//			this.projectPanel.reset();
//		}
	}, this);



	//	this.treePanel.treeLoader.on('load',function(){
	//		var node = this.treePanel.getNodeById(this.projectsView.projectsPanel.store.baseParams.parent_project_id);
	//		this.treePanel.getSelectionModel().select(node);
	//	}, this,{
	//		single:true
	//	});





//	this.filterPanel= new GO.grid.MultiSelectGrid({
//		id:'pm-status-filter',
//		title:GO.projects2.lang.statuses,
//		region:'south',
//		loadMask:true,
//		height:200,
//		split:true,
//		relatedStore: this.projectsView.projectsPanel.store,
//		autoLoadRelatedStore:false,
//		allowNoSelection:true,
//		store:new GO.data.JsonStore({
//			url: GO.url("projects2/status/store"),
//			fields: ['id','name','checked'],
//			baseParams:{
//				filterable:1
//			},
//			remoteSort: true
//		})
//	});
//


	this.statusesFilterGrid = new GO.projects2.StatusesFilterGrid({
		region:'south',
		id:'pr2-statuses',
		width:180,
		height:250
	});

	this.selectManagerField = new GO.form.SelectUser({
			hiddenName:'manager_id',
			emptyText: GO.projects2.lang.filterManager,
			startBlank:true,
			hideLabel: true,
			minListWidth: 300,
			allowBlank:true,
			displayField: 'name',
			valueField:'id',
			anchor: '100%',
			store: new GO.data.JsonStore({
				url: GO.url('projects2/employee/users'),
				root: 'results',
				totalProperty: 'total',
				id: 'id',
				fields:['id','name'],
				remoteSort: true
			}),
			listeners: {
				select: function (cmb, record) {
					// Set the selected manager parameter for the treeloader
					this.treePanel.treeLoader.baseParams.manager_id = record.id;
					this.selectProject.store.baseParams.manager_id = record.id;
					this.selectProject.clearValue();
					this.selectProject.store.reload();
					this.treePanel.rootNode.reload();
				},
				clear: function (){
					// Clear the manager parameter for the treeloader
					this.treePanel.treeLoader.baseParams.manager_id = null;
					this.selectProject.store.baseParams.manager_id = null;
					this.selectProject.store.reload();
					this.treePanel.rootNode.reload();
				},
				scope: this
			}
		});


	var items = [];

	items.push({
		region:'north',
		height:60,
		cls:'go-form-panel',
		layout:'form',
		items:[
			this.selectManagerField,
			this.selectProject			
		]

	},this.treePanel

	,this.statusesFilterGrid

	);

	this.westPanel = new Ext.Panel({
		id:config.id+'-west',
		region:'west',
		layout:'border',
		border:false,
		split:true,
		width:250,
		items:items,
		collapsible:true,
		collapseMode:'mini',
		header:false
	});


	this.projectPanel = new GO.projects2.ProjectPanel({
		region: 'center',
		id:'pr2-project-panel'
//		height: '350',
//		width: 500,
//		split:true,
//		collapseMode:'mini',
//		hideCollapseTool:true,
//		collapsible:true
	});


	this.projectPanel.on('load', function(tp, project_id){

		this.project_id=project_id;
		this.tasksPanel.setProjectId(project_id,tp.data.use_tasks_panel==1);

		var node = this.getTreePanel().getNodeById(project_id);
		if(node){
			this.getTreePanel().getSelectionModel().select(node);
			node.expand();
		}

		if(project_id>0 && !this.projectPanel.data.write_permission){
			this.addButton.setDisabled(true);
		} else {
			this.addButton.setDisabled(false);
		}

		//if (!(project_id>0) || this.projectPanel.data.project_type!=1) { // 1 means: leaf project.
		if(project_id>0 && this.projectPanel.data.has_children){
			this.subProjectsGrid.store.baseParams['parent_project_id'] = project_id;
			this.subProjectsGrid.store.load();
//			this.subProjectsGrid.expand();
			this.subProjectsGrid.setVisible(true);
		} else {
			this.subProjectsGrid.store.baseParams['parent_project_id'] = 0;
			this.subProjectsGrid.store.removeAll();
			this.subProjectsGrid.setVisible(false);
		}

		this.centerPanel.doLayout();

	}, this);
	
	this.projectPanel.on('reset', function(){
		this.subProjectsGrid.store.baseParams['parent_project_id'] = 0;
		this.subProjectsGrid.store.load();
		this.subProjectsGrid.setVisible(true);
		
		this.centerPanel.doLayout();
	}, this);

	this.centerPanel = new Ext.Panel({
		region: 'center',
		layout:'border',
		split:true,
		id:this.id+'_east',
		items: [
			this.projectPanel,
			this.subProjectsGrid
		]
	})

	this.tasksPanel = new GO.projects2.TasksGrid({
		region:'east',
		width: 500,
		id:'pm-tasks',
		collapsible:true
	});

	config.items=[
	this.westPanel,
	this.tasksPanel,
	this.centerPanel
	];

	this.statusesFilterGrid.on('change', function(grid, statuses, records)
	{
		this.onChangeStatusesFilterGrid(grid, statuses, records);
	}, this);

	var items = [
	{
		xtype:'htmlcomponent',
		html:GO.projects2.lang.projects,
		cls:'go-module-title-tbar'
	}];

	this.addButton = new Ext.Button({
		iconCls: 'btn-add',
		text: GO.projects2.lang['addProject'],
		cls: 'x-btn-text-icon',
//		disabled:true,
		handler: function(){
			if(GO.projects2.max_projects>0 && this.store.totalLength>=GO.projects2.max_projects)
			{
				Ext.Msg.alert(GO.lang.strError, GO.projects2.lang.maxProjectsReached);
			}else
			{
				//this.projectPanel.reset();
				GO.projects2.showProjectDialog({
					parent_project_id: this.project_id/*,
					values:{
						type_id:this.parentProject ? this.parentProject.type_id : null
					}*/
				});
			}
		},
		scope: this
	});
	items.push(this.addButton);

	if(GO.settings.modules.projects2.permission_level==GO.permissionLevels.manage)
	{
		
		items.push({
			iconCls:'btn-delete',
			text:GO.lang.cmdDelete,
			handler:function(){
				if(this.project_id && this.project_id != 0) {
						if(confirm(GO.lang.areYouSureDeleteItem.replace('{item}','#'+this.project_id))){
						GO.request({
							url:'projects2/project/delete',
							params:{id:this.project_id},
							scope:this,
							success:function(){
								if(this.treePanel.selModel && this.treePanel.selModel.selNode){
									if(this.treePanel.selModel.selNode.id == this.project_id) {
										this.treePanel.selModel.selNode = this.treePanel.selModel.selNode.parentNode;
									}
									this.treePanel.selModel.selNode.select();
									this.treePanel.selModel.selNode.reload();
									
									this.treePanel.fireEvent('click', this.treePanel.selModel.selNode);
								}
							}
						});
					}
				}
			},
			scope:this
		});

		items.push({
			iconCls:'btn-settings',
			text:GO.lang.administration,
			handler:function(){
				if(!this.settingsDialog)
				{
					this.settingsDialog = new GO.projects2.SettingsDialog();
				}
				this.settingsDialog.show();
			},
			scope:this
		});

//		if(GO.billing){
//			items.push({
//				iconCls:'btn-add',
//				text:GO.projects2.lang.bill,
//				handler:function(){
//					if(!GO.projects2.invoiceDialog)
//					{
//						GO.projects2.invoiceDialog= new GO.projects2.InvoiceDialog();
//					}
//					GO.projects2.invoiceDialog.show({
//						project_id:0
//					});
//				},
//				scope:this
//			});
//		}


	}
	items.push({
		iconCls:'btn-actions',
		text:GO.projects2.lang.report,
		hidden: !GO.projects2.has_finance_permission && !GO.projects2.has_report_permission,
		handler:function(){
			if(!this.reportDialog)
			{
				this.reportDialog = new GO.projects2.ReportDialog();
			}
			this.reportDialog.show();
		},
		scope:this
	});

//	if(GO.hoursapproval){
//		items.push({
//			iconCls:'btn-email',
//			text:GO.projects2.lang.remindForApproval,
//			handler:function(){
//				if(!this.remindDialog){
//					this.remindDialog = new GO.projects2.RemindDialog();
//				}
//				this.remindDialog.show({
//					task:'remind_hoursapproval_users'
//				});
//			},
//			scope:this
//		});
//	}

	items.push({
		iconCls:'btn-refresh',
		text:GO.lang.cmdRefresh,
		handler:function(){
			this.refresh();
		},
		scope:this
	});

	if(GO.settings.modules.projects2.permission_level==GO.permissionLevels.manage)
	{
		items.push({
			iconCls:'btn-add',
			text:GO.lang.cmdImport,
			handler:function(){
				if(!this.importDialog)
				{
					this.importDialog = new GO.projects2.CsvImportDialog();
				}
				this.importDialog.show();
			},
			scope:this
		});
	}
//	var templateMenu = new Ext.menu.Menu({
//		items:[]
//	});
//	GO.projects2.templatesStore.on('load', function(el,rec,op){
//		templateMenu.removeAll();
//		for(var i=0; i<rec.length; i++) {
//			var item = {
//				text: rec[i].data.name,
//				cls: 'x-btn-text-icon',
//				data: rec[i].data,
//				handler: function(item) {
//					if(GO.projects2.max_projects>0 && this.store.totalLength>=GO.projects2.max_projects) {
//						Ext.Msg.alert(GO.lang.strError, GO.projects2.lang.maxProjectsReached);
//						return;
//					}
//					this.projectPanel.reset();
//					GO.projects2.showProjectDialog({
//						parent_project_id: this.project_id,
//						template_id: item.data.id
//					});
//				},
//				scope:this
//			};
//			templateMenu.addItem(item);
//		}
//    },this);

	this.invoiceButton = new Ext.Button({
		iconCls: 'btn-add',
		text: GO.projects2.lang['invoice'],
		hidden: !GO.projects2.has_finance_permission,
		cls: 'x-btn-text-icon',
		handler: function() {
			if(!this.invoiceDialog)
				this.invoiceDialog = GO.projects2.invoiceDialog = new GO.projects2.InvoiceDialog();
			this.invoiceDialog.show();
		},
		scope:this
	});
	items.push(this.invoiceButton);

//	this.addButton = new Ext.Button({
//		iconCls: 'btn-add',
//		text: GO.projects2.lang['addProject'],
//		cls: 'x-btn-text-icon',
//		menu: templateMenu,
//		handler: function() {
//			templateMenu.removeAll();
//			templateMenu.addItem({
//				text: 'Loading...',
//				disabled: true
//			});
//			GO.projects2.templatesStore.load();
//		}
//	});


	config.tbar = new Ext.Toolbar({
		cls:'go-head-tb',
		items:items
	});


	config.border=false;
	config.layout='border';
	GO.projects2.MainPanel.superclass.constructor.call(this, config);

//	THIS IS NEW
	this.tasksPanel.on('saved', function(projectId){
		if (this._saveTaskPanelBeforeLeaving) {
			this.selectProject.reset();
			if(projectId > 0)
			{
				this.projectPanel.load(projectId);
			}else
			{
				this.projectPanel.reset();
			}
			this._saveTaskPanelBeforeLeaving = false;
		}
	}, this);

	this.on('show', function() {
		this.statusesFilterGrid.store.load();
	}, this);
};

Ext.extend(GO.projects2.MainPanel, Ext.Panel, {

	project_id : 0,
// THIS IS NEW
	_saveTaskPanelBeforeLeaving : false,


	refresh : function(){
//		this.filterPanel.store.load();
//		this.projectsView.projectsPanel.store.load();
		this.getTreePanel().rootNode.reload();
	},

	onChangeStatusesFilterGrid : function(grid, statuses, records){
		this.getTreePanel().treeLoader.baseParams.pr2_statuses = Ext.encode(statuses);
		var node = this.getTreePanel().getNodeById(this.project_id) || this.getTreePanel().getRootNode();
		this.getTreePanel().getRootNode().reload();
//		this.treePanel.treeLoader.load(node);
		delete this.subProjectsGrid.store.baseParams.statuses;
		
		this.subProjectsGrid.store.baseParams['parent_project_id'] = this.project_id;
		this.subProjectsGrid.store.load();
		this.subProjectsGrid.setVisible(true);
		
		this.centerPanel.doLayout();
	},

	getTreePanel : function(){
		return this.treePanel;
	},

	afterRender : function(){

		GO.projects2.MainPanel.superclass.afterRender.call(this);
//		this.filterPanel.store.load();

		GO.dialogListeners.add('project',{
			scope:this,
			save:function(e, project_id, parent_project_id){
//				this.projectsView.projectsPanel.store.reload();
				this.getTreePanel().project_id = parent_project_id;
				this.getTreePanel().reloadActiveNode();
			}
		});
		
		
		this.subProjectsGrid.store.baseParams['parent_project_id'] = 0;
		this.subProjectsGrid.store.load();
		this.subProjectsGrid.setVisible(true);
		
	}
//	THIS IS NEW
	,
	_switchProject : function(projectId) {

		if (!this.tasksPanel.isDirty()) {
			this.selectProject.reset();

			if(projectId > 0){
				this.projectPanel.load(projectId);
			} else {
				this.projectPanel.reset();
					
				// Disable the "Add project" button when the root node is clicked and the user doesn't have manage permissions on the project2 module.
				if(!GO.settings.modules.projects2.write_permission){
					this.addButton.setDisabled(true);
				} else {
					this.addButton.setDisabled(false);
				}
			}
		} else {
			Ext.Msg.show({
				title: GO.projects2.lang['saveBeforeLeavingTitle'],
				msg: GO.projects2.lang['saveBeforeLeavingMsg'],
				buttons: Ext.Msg.YESNOCANCEL,
				scope: this,
				fn: function(btn) {
					if (btn=='no') {
						this.selectProject.reset();

						if(projectId > 0)
						{
							this.projectPanel.load(projectId);
						}else
						{
							this.projectPanel.reset();
						}
					} else if (btn=='yes') {
						this._saveTaskPanelBeforeLeaving = true;
						this.tasksPanel.save(projectId);
					}
				}
			});
		}

	}

});

GO.projects2.showProjectDialog = function(config){
	if(!GO.projects2.projectDialog)
		GO.projects2.projectDialog = new GO.projects2.ProjectDialog();

	GO.projects2.projectDialog.show(config);
};

/**
 * Open the projects2 tab and select the given project
 * 
 * @param int id The project id
 */
GO.projects2.openProjectTab = function(id){
	GO.mainLayout.openModule('projects2');
	
	var pr2Panel = GO.mainLayout.getModulePanel('projects2');
	pr2Panel._switchProject(id);
};


/*
 * This will add the module to the main tabpanel filled with all the modules
 */

GO.moduleManager.addModule('projects2', GO.projects2.MainPanel, {
	title : GO.projects2.lang.projects,
	iconCls : 'go-tab-icon-projects'
});

GO.linkPreviewPanels["GO\\Projects2\\Model\\Project"]=function(config){
	config = config || {};
	return new GO.projects2.ProjectPanel(config);
}

/*
 * If your module has a linkable item, you should add a link handler like this.
 * The index (no. 1 in this case) should be a unique identifier of your item.
 * See classes/base/links.class.inc for an overview.
 *
 * Basically this function opens a project window when a user clicks on it from a
 * panel with links.
 */
GO.linkHandlers["GO\\Projects2\\Model\\Project"]=function(id){
	if(!GO.projects2.linkWindow){
		var projectPanel = new GO.projects2.ProjectPanel();
		GO.projects2.linkWindow = new GO.LinkViewWindow({
			title: GO.projects2.lang.project,
			projectPanel: projectPanel,
			items: projectPanel,
			width:600,
			closeAction:"hide"
		});
	}
	GO.projects2.linkWindow.show();
	GO.projects2.linkWindow.projectPanel.load(id);
	return GO.projects2.linkWindow;
}

GO.newMenuItems.push({
    text: GO.projects2.lang.project,
    iconCls: 'go-model-icon-GO_Projects2_Model_Project',
    handler:function(item, e){
        GO.projects2.showProjectDialog({
            link_config: item.parentMenu.link_config
        });
    }
});


