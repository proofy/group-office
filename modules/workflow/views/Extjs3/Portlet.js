GO.workflow.SimpleWorkflowPanel = function(config)
	{
		if(!config)
			config = {};
		
		config.id='su-workflow-grid';
		config.store = GO.workflow.portletWorkflowStore;
		config.store.setDefaultSort('days_left', 'asc');
		config.store.on('load', function(){
			//do layout on Startpage
			if(this.rendered)
				this.ownerCt.ownerCt.ownerCt.doLayout();
		}, this);
	
		config.paging=false,
		config.autoExpandMax=2500;
		config.enableColumnHide=false;
		config.enableColumnMove=false;
		config.cm = new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:[
					{
            header: GO.workflow.lang.modelId,
            dataIndex: 'id',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: GO.workflow.lang.modelModel_id,
            dataIndex: 'localized_name',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: GO.workflow.lang.startedBy,
            dataIndex: 'user_id',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: GO.workflow.lang.modelModel_type_id,
            dataIndex: 'model_name',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: GO.workflow.lang.modelModel_id,
            dataIndex: 'model_id',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: GO.workflow.lang.processName,
            dataIndex: 'name',
            sortable: true,
            hidden:false,
            width: 200
          },
					{
            header: GO.workflow.lang.modelDue_time,
            dataIndex: 'due_time',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: GO.workflow.lang.modelStep_id,
            dataIndex: 'stepname',
            sortable: true,
            hidden:false,
            width: 200
          },
					{
            header: GO.workflow.lang.modelProcess_id,
            dataIndex: 'processname',
            sortable: true,
            hidden:false,
            width: 300
          },
					{
            header: GO.workflow.lang.stepDue_in,
            dataIndex: 'due_in',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: GO.workflow.lang.timerunning,
            dataIndex: 'time_running',
            sortable: false,
            hidden:true,
            width: 100
          },
					{
            header: GO.workflow.lang.progress,
            dataIndex: 'progress',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: GO.workflow.lang.timeRemaining,
            dataIndex: 'time_remaining',
            sortable: false,
            hidden:true,
            width: 100
          },
					{
            header: GO.workflow.lang.hoursleft,
            dataIndex: 'days_left',
            sortable: true,
            hidden:true,
            width: 100,
						renderer:function(val){
							if(val < 0){
									return '<span style="color:red;">' + val + '</span>';
							}else if(val > 0 && val < 1){
									return '<span style="color:blue;">' + val + '</span>';
							}
							return val;
						}
          }
        ]
			}),
//		config.sm=new Ext.grid.RowSelectionModel();
		config.loadMask=true;
		config.autoHeight=true;
	
		GO.workflow.SimpleWorkflowPanel.superclass.constructor.call(this, config);
	
	};

Ext.extend(GO.workflow.SimpleWorkflowPanel, GO.grid.GridPanel, {
	
	saveListenerAdded : false,
		
	afterRender : function()
	{
		GO.workflow.SimpleWorkflowPanel.superclass.afterRender.call(this);

		this.on("rowdblclick", function(grid, rowClicked, e){
			var record = grid.getSelectionModel().getSelected();
			GO.workflow.showModel({'model_id':record.data.model_id, 'model_name':record.data.model_name});
		}, this);
			
		Ext.TaskMgr.start({
			run: function(){
				this.store.load();
			},
			scope:this,
			interval:960000
		});
	}
});


GO.mainLayout.onReady(function(){
	if(GO.summary)
	{
		var workflowGrid = new GO.workflow.SimpleWorkflowPanel();
		
		GO.summary.portlets['portlet-workflow']=new GO.summary.Portlet({
			id: 'portlet-workflow',
			//iconCls: 'go-module-icon-tasks',
			title: GO.workflow.lang.workflow,
			layout:'fit',
			tools: [
//				{
//				id: 'gear',
//				handler: function(){
//					if(!this.selectTasklistsWin)
//					{
//						this.selectTasklistsWin = new GO.base.model.multiselect.dialog({
//							url:'tasks/portlet',
//							columns:[{ header: GO.lang['strName'], dataIndex: 'name', sortable: true }],
//							fields:['id','name'],
//							title:GO.workflow.lang.visibleTasklists,
//							model_id:GO.settings.user_id,
//							listeners:{
//								hide:function(){
//									tasksGrid.store.reload();
//								},
//								scope:this
//							}
//						});
//					}
//					this.selectTasklistsWin.show();
//				}
//			},
			{
				id:'close',
				handler: function(e, target, panel){
					panel.removePortlet();
				}
			}],
			items: workflowGrid,
			autoHeight:true
		});
	}
});