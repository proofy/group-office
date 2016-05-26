GO.workflow.WorkflowGrid = Ext.extend(GO.grid.GridPanel,{
	changed : false,
	
  
	initComponent : function(){
		
    this.searchField = new GO.form.SearchField({
      store: GO.workflow.workflowStore,
      width:320
    });
    
		Ext.apply(this,{
			standardTbar:false,
			standardTbarDisabled:!GO.settings.modules.workflow.write_permission,
			store: GO.workflow.workflowStore,
			border: false,
      tbar: [GO.lang['strSearch'] + ':', this.searchField],
			paging:true,
			view:new Ext.grid.GridView({
				autoFill: true,
				forceFit: true,
				emptyText: GO.lang['strNoItems']		
			}),
			cm:new Ext.grid.ColumnModel({
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
            sortable: false,
            hidden:false,
            width: 100
          },
//					{
//            header: GO.workflow.lang.modelModel_type_id,
//            dataIndex: 'model_name',
//            sortable: true,
//            hidden:true,
//            width: 100
//          },
//					{
//            header: GO.workflow.lang.modelModel_id,
//            dataIndex: 'model_id',
//            sortable: true,
//            hidden:true,
//            width: 100
//          },
					{
            header: GO.workflow.lang.processName,
            dataIndex: 'name',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: GO.workflow.lang.modelDue_time,
            dataIndex: 'due_time',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: GO.workflow.lang.modelStep_id,
            dataIndex: 'stepname',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: GO.workflow.lang.modelProcess_id,
            dataIndex: 'processname',
            sortable: true,
            hidden:false,
            width: 100
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
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: GO.workflow.lang.progress,
            dataIndex: 'progress',
            sortable: true,
            hidden:false,
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
			})
		});

		GO.workflow.WorkflowGrid.superclass.initComponent.call(this);
	},
	
	dblClick : function(grid, record, rowIndex){
		GO.workflow.showModel({'model_id':record.data.model_id, 'model_name':record.data.model_name});
	},
	
	btnAdd : function(){				
		this.showProcessDialog();	  	
	},
	showProcessDialog : function(id){
		if(!this.processDialog){
			this.processDialog = new GO.workflow.ProcessDialog();

			this.processDialog.on('save', function(){   
				this.store.load();
				this.changed=true;	    			    			
			}, this);	
		}
		this.processDialog.show(id);	  
	},
	deleteSelected : function(){
		GO.workflow.WorkflowGrid.superclass.deleteSelected.call(this);
		this.changed=true;
	}
});