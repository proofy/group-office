GO.workflow.StepGrid = Ext.extend(GO.grid.GridPanel,{
	 
	initComponent : function(){
		
    this.searchField = new GO.form.SearchField({
      store: GO.workflow.stepStore,
      width:320
    });
    
		Ext.apply(this,{
			standardTbar:true,
			title:GO.workflow.lang.steps,
			standardTbarDisabled:!GO.settings.modules.workflow.write_permission,
			store: GO.workflow.stepStore,
			border: false,
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
            header: GO.workflow.lang.stepId,
            dataIndex: 'id',
            sortable: true,
            hidden:true,
            width: 100
          },{
            header: GO.workflow.lang.stepProcess_id,
            dataIndex: 'process_id',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: GO.workflow.lang.stepName,
            dataIndex: 'name',
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
            header: GO.workflow.lang.stepEmail_alert,
            dataIndex: 'email_alert',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: GO.workflow.lang.stepPopup_alert,
            dataIndex: 'popup_alert',
            sortable: true,
            hidden:false,
            width: 100
          }
        ]
			})
		});

		GO.workflow.StepGrid.superclass.initComponent.call(this);
	},
	
	editDialogClass : GO.workflow.StepDialog
	
});