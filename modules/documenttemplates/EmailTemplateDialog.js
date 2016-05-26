GO.documenttemplates.EmailTemplateDialog = Ext.extend(GO.Window,{
	
	item:0,
	
	initComponent: function(){
		
		this.checkCol = new GO.grid.RadioColumn({
			header: '',
			dataIndex: 'checked',
			width: 55,
			onMouseDown : function(e, t){
				if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
					e.stopEvent();
					var index = this.grid.getView().findRowIndex(t);
					var record = this.grid.store.getAt(index);
					var disabled = this.isDisabled(record);

					if (!disabled)
					{
						if(record.get(this.dataIndex)) {
							return;
						}

						for(var i = 0, max = this.grid.store.getCount();i < max; i++) {
							var rec = this.grid.store.getAt(i);
							if(rec.get(this.dataIndex) && rec.get('model_name')==record.get('model_name')) {
								rec.set(this.dataIndex, false);
							}

						}
						record.set(this.dataIndex, true);
					}

				}
			}
		});
		
		this.columnModel = new Ext.grid.ColumnModel({
			defaults:{
				sortable:true
			},
			columns:[
				this.checkCol,
				{
					header: GO.lang.strName,
					dataIndex: 'name',
					renderer:function(v, meta, record){
						return '<div class="go-grid-icon go-model-icon-'+record.data.model_name+'">'+v+'</div>';
					}
				},{
					header: GO.lang.strType,
					dataIndex: 'type'
				}
			]
		});
		
		this.searchField = new GO.form.SearchField({
			store: GO.documenttemplates.emailTemplatesStore,
			width:200
		});
		
		this.templatesGrid = new GO.grid.GridPanel({
			region:'center',
			tbar: [GO.lang['strSearch'] + ':', this.searchField],
			title:GO.documenttemplates.lang.selectEmailTemplate,
			listeners:{
				scope:this,
				delayedrowselect: function(grid, rowIndex, r){
					var selectedArray = this.templatesGrid.getSelectionModel().getSelections();
					
					if(selectedArray.length > 0){
						this.loadAmbiguousLinksGrid();
					}
				}
			},
			viewConfig: {
				autoFill: true,
				forceFit: true,
				emptyText: GO.lang.strNoItems,
				afterRender: function(){
					this.constructor.prototype.afterRender.apply(this, arguments);
					this.grid.getSelectionModel().selectFirstRow();
				}
			},
			store:GO.documenttemplates.emailTemplatesStore,
			sm: new Ext.grid.RowSelectionModel({
				singleSelect:true
			}),
			columns:[{
				header: GO.lang['strName'],
				dataIndex: 'name',
				sortable:true
			}]
		});
		
		this.ambiguousLinksGrid = new GO.grid.GridPanel({
			flex:4,
			region:'south',
			height:200,
			split:true,
			title:GO.documenttemplates.lang.selectRelevantResources,
			store:new Ext.data.GroupingStore({
				url: GO.url("documenttemplates/EmailTemplate/getLinks"),
				reader: new Ext.data.JsonReader({
					root: 'results',
					id: 'model_name_and_id',
					fields: ['model_name_and_id','name', 'checked', 'type', 'model_name']
				}),
				groupField:'type',
				/*sortInfo: {
					field: 'name',
					direction: 'ASC'
				},*/
				remoteSort:true
			}),
			paging:false,
			plugins:this.checkCol,
			cm:this.columnModel,
			view:new Ext.grid.GroupingView({
				hideGroupedColumn:true,
				groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "'+GO.lang.items+'" : "'+GO.lang.item+'"]})',
				emptyText: GO.lang['strNoItems'],
				showGroupName:false
			}),
			autoExpandColumn:1,
			loadMask:true
		});
		
		
		Ext.applyIf(this,{
			title:GO.documenttemplates.lang.emailFromTemplate,
			width:500,
			height:500,
			closeAction:'hide',
			layout:'border',
			keys:[{
				key:Ext.EventObject.ENTER, fn:function(key, e){
					if(e.target.id!=this.searchField.id){
						this.createFileFromTemplate();
					}
				},
				scope:this
			}],
			defaults:{
				margins:'0 0 5 0'
			},
			focus:function(){
				this.searchField.focus();
			},
			items:[
				this.templatesGrid, 
				this.ambiguousLinksGrid
			],
			buttons:[{
				text:GO.lang.cmdOk,
				handler:function(){
					this.composeEmailFromTemplate();
				},
				scope:this
			}]
		});
		
		GO.documenttemplates.EmailTemplateDialog.superclass.initComponent.call(this);
	},
	
	show : function(item){
		
		this.item=item;
		
		if(this.rendered){
		
			var selectedArray = this.templatesGrid.getSelectionModel().getSelections();
			if(selectedArray.length > 0){
				this.loadAmbiguousLinksGrid();
			}
		} else {
			this.templatesGrid.store.load();
		}
		
		GO.documenttemplates.EmailTemplateDialog.superclass.show.call(this);

	},

	loadAmbiguousLinksGrid : function(){

		var params = {
			template_id: this.templatesGrid.getSelectionModel().getSelected().id,
			model_name:this.item.parentMenu.link_config.model_name,
			model_id:this.item.parentMenu.link_config.model_id
		};
		
		this.ambiguousLinksGrid.store.load({
			callback:function(){
				this.ambiguousLinksGrid.setDisabled(false);
			},
			scope:this,
			params:params
		});
		
	},
	
	composeEmailFromTemplate : function(){
	
		var composerParams = {
			loadUrl:GO.url("documenttemplates/emailTemplate/emailcomposer"),
			template_id:this.templatesGrid.getSelectionModel().getSelected().id,
			disableTemplates: true,
		};
	
		var records = this.ambiguousLinksGrid.store.getRange();
		var links=[];
		
		for(var i=0,max=records.length;i<max;i++){
			if(!GO.util.empty(records[i].get('checked'))){
				links.push(records[i].get('model_name_and_id'));
			}
		}

		composerParams.loadParams = {
			selected_links: Ext.encode(links),
		};						

		if (Ext.isDefined(this.item)) {
			composerParams.values={};
			if(typeof(this.item.parentMenu.panel)!='undefined' && typeof(this.item.parentMenu.panel.data.email)!='undefined'){
				var to='';
				if(this.item.parentMenu.panel.data.full_name){
					to='"'+this.item.parentMenu.panel.data.full_name+'" <'+this.item.parentMenu.panel.data.email+'>';
				}else if(this.item.parentMenu.panel.data.name){
					to='"'+this.item.parentMenu.panel.data.name+'" <'+this.item.parentMenu.panel.data.email+'>';
				}

				composerParams.values.to=to;
			}
			
			composerParams.loadParams.model_name = this.item.parentMenu.link_config.model_name;
			composerParams.loadParams.model_id = this.item.parentMenu.link_config.model_id;
			composerParams.link_config = this.item.parentMenu.link_config;
			
		}

		GO.email.showComposer(composerParams);
		
		this.hide();
	}
	
});