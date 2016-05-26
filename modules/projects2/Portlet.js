GO.projects2.SimpleProjectsPanel = function(config)
	{
		if(!config)
		{
			config = {};
		}

		config.id='su-projects-grid';
		
		var projectFields = {
			fields: ['id', 'name', 'status_name', 'responsible_user_name', 'customer', 'due_time', 'units_budget','type','ctime','mtime','contact', 'icon','path'],
			columns:[
		{
			header:'ID',
			dataIndex: 'id',
			hidden:true,
			sortable:true,
			width:50
		},{
			id:'project-portlet-name-col',
			header:GO.lang['strName'],
			dataIndex: 'path',
			renderer:function(value, p, record){
				if(!GO.util.empty(record.data.description))
				{
					p.attr = 'ext:qtip="'+Ext.util.Format.htmlEncode(record.data.description)+'"';
				}
				return value;
			},
			sortable:true
		},{
			header:GO.projects2.lang.customer,
			dataIndex: 'customer',
			sortable:true,
			width:150
		},{
			header:GO.projects2.lang.projectManager,
			dataIndex: 'responsible_user_name',
			sortable:false,
			width:150
		},{
			header:GO.projects2.lang['status'],
			dataIndex: 'status_name',
			sortable:true,
			width:100
		},{
			header:GO.projects2.lang.dueAt,
			dataIndex: 'due_time',
			sortable:true,
			width:80
		},{
			header:GO.projects2.lang.unitsBudget,
			dataIndex: 'units_budget',
			sortable:true,
			width:100
		},{
			header:GO.projects2.lang.contact,
			dataIndex: 'contact',
			sortable:true,
			hidden:true,
			width:150
		},{
			header:GO.projects2.lang.type,
			dataIndex: 'type',
			sortable:true,
			hidden:true,
			width:80
		},{
			header: GO.lang.strMtime,
			dataIndex:'mtime',
			hidden:true,
			width:110,
			sortable:true
		},{
			header: GO.lang.strCtime,
			dataIndex:'ctime',
			hidden:true,
			width:110,
			sortable:true
		}]
		};
		
		if(GO.customfields)
			GO.customfields.addColumns("GO\\Projects2\\Model\\Project", projectFields);

		var reader = new Ext.data.JsonReader({
			root: 'results',
			totalProperty: 'total',
			fields:projectFields.fields,
			id: 'id'
		});

		config.store = new Ext.data.GroupingStore({
			url: GO.url("projects2/project/store"),
			baseParams: {
				'portlet':true				
			},
			reader: reader,
			sortInfo: {
				field: 'due_time',
				direction: 'ASC'
			},
			groupField: 'status_name',
			remoteGroup:true,
			remoteSort:true
		});

		config.store.on('load', function(){
			//do layout on Startpage
			if(this.rendered)
				this.ownerCt.ownerCt.ownerCt.doLayout();
		}, this);


		config.paging=false,

		config.autoExpandColumn='project-portlet-name-col';
		config.autoExpandMax=2500;
		config.columns=projectFields.columns;
		config.view=new Ext.grid.GroupingView({
			scrollOffset: 2,
			hideGroupedColumn:true,
			emptyText: GO.projects2.lang.noproject

		}),
		config.sm=new Ext.grid.RowSelectionModel();
		config.loadMask=true;
		config.autoHeight=true;


		config.paging=true;


		GO.projects2.SimpleProjectsPanel.superclass.constructor.call(this, config);

	};

Ext.extend(GO.projects2.SimpleProjectsPanel, GO.grid.GridPanel, {

	saveListenerAdded : false,

	afterRender : function()
	{
		this.store.load();
		GO.projects2.SimpleProjectsPanel.superclass.afterRender.call(this);
		this.on("rowdblclick", function(grid, rowClicked, e){
			GO.linkHandlers["GO\\Projects2\\Model\\Project"].call(this, grid.selModel.selections.keys[0]);
		}, this);

	}
});


GO.mainLayout.onReady(function(){
	if(GO.summary)
	{
		var projectsGrid = new GO.projects2.SimpleProjectsPanel();

		GO.summary.portlets['portlet-projects']=new GO.summary.Portlet({
			id: 'portlet-projects',
			//iconCls: 'go-module-icon-projects',
			title: GO.projects2.lang.projects,
			layout:'fit',
			tools: [{
				id: 'gear',
				
				handler: function(){
					if(!this.portletConfigWindow) {
						this.portletConfigWindow = new GO.Window({
							layout: 'border',
							title:GO.projects2.lang.statuses,
							modal:false,
							height:400,
							width:600,
							closeAction:'hide',
							items: [
								this.multiselectPanel = new GO.base.model.multiselect.panel({
									region: 'center',
									url:'projects2/portlet',
									columns:[{ header: GO.lang['strName'], dataIndex: 'name', sortable: true }],
									fields:['id','name'],
									model_id:GO.settings.user_id
								}),
								new Ext.form.FormPanel({
									region: 'south',
									height: 40,
									items: [
										this.showMineOnlyCheckbox = new Ext.ux.form.XCheckbox({
											boxLabel: GO.projects2.lang.showMyOwn,
											labelSeparator: '',
											name: 'showMineOnly',
											allowBlank: true,
											hideLabel: true,
											handler:  function() {
												GO.request({
													url: 'projects2/portletConfig/saveShowMineOnly',
													params:{
														value: this.getValue()
													}
												})
											}
										}),
										this.showMineWorkCheckbox = new Ext.ux.form.XCheckbox({
											boxLabel: GO.projects2.lang.showMyWork,
											labelSeparator: '',
											name: 'showMineWork',
											allowBlank: true,
											hideLabel: true,
											handler:  function() {
												GO.request({
													url: 'projects2/portletConfig/saveShowMineWork',
													params:{
														value: this.getValue()
													}
												})
											}
										})
									]
								})
							],
							listeners:{
								hide:function(){
									projectsGrid.store.reload();
								},
								show: function() {
									this.multiselectPanel.store.load();
									GO.request({
										url: 'projects2/portletConfig/loadShowMineOnly',
										params:{},
										success: function(response, options, result){
											
											this.showMineOnlyCheckbox.setValue(result['value'])
										},
										scope: this
									});
								},
								scope:this
							},
							buttons: [		
								{
									text: GO.lang['cmdClose'],
									handler: function(){
										this.portletConfigWindow.hide();
									},
									scope: this
								}
							]
						})
						
						this.portletConfigWindow.on('show', function() {
							this.multiselectPanel.store.load();
							GO.request({
								url: 'projects2/portletConfig/loadShowMineOnly',
								params:{},
								success: function(response, options, result){
									
									this.showMineOnlyCheckbox.setValue(result['value'])
								},
								scope: this
							});
							GO.request({
								url: 'projects2/portletConfig/loadShowMineWork',
								params:{},
								success: function(response, options, result){
									
									this.showMineWorkCheckbox.setValue(result['value'])
								},
								scope: this
							});
						}, this);
						
					}
					
					this.portletConfigWindow.show();
					
				}
			},{
				id:'close',
				handler: function(e, target, panel){
					panel.removePortlet();
				}
			}],
			items: projectsGrid,
			autoHeight:true
		});
	}
});