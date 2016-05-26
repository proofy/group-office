GO.documenttemplates.TemplateDocumentDialog = function(config){

	config=config || {};

	config.title=GO.documenttemplates.lang.documentFromTemplate;
	config.width=500;
	config.height=500;
	config.closeAction='hide';
	//config.autoHeight=true;
	config.layout='border';
	/*config.layoutConfig={
			align : 'stretch',
			pack  : 'start',
			padding: '5'
	};*/
	config.keys=[{
			key:Ext.EventObject.ENTER,
			fn:function(key, e){
				if(e.target.id!=this.searchField.id){
					this.createFileFromTemplate();
				}
			},
			scope:this
		}];
	config.defaults={
		margins:'0 0 5 0'
		
	}


	var checkCol = new GO.grid.RadioColumn({
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
	var columnModel = new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		checkCol,
		{
			header: GO.lang.strName,
			dataIndex: 'name',
			renderer:function(v, meta, record){
				return '<div class="go-grid-icon go-model-icon-'+record.data.model_name+'">'+v+'</div>';
			}
		},
		{
			header: GO.lang.strType,
			dataIndex: 'type'
		}
		]
	});

	var f;
	f = this.formPanel = new Ext.form.FormPanel({
		title:GO.lang.filename,
		region:'north',
		height:30,
		cls:'go-form-panel',
		items:[{
				xtype:'textfield',
				name:'name',
				fieldLabel:GO.lang.strName,
				allowBlank:false,
				anchor:'100%'
		}]
	});

	config.focus = function(){
		f.form.findField('name').focus();
	};

	this.searchField = new GO.form.SearchField({
		store: GO.documenttemplates.ooTemplatesStore,
		width:200
  });

	this.templatesGrid = new GO.grid.GridPanel({
		region:'center',
		tbar: [GO.lang['strSearch'] + ':', this.searchField],
		title:GO.documenttemplates.lang.selectDocumentTemplate,
		listeners:{
			scope:this,
			delayedrowselect: function(grid, rowIndex, r){
				this.loadAmbiguousLinksGrid();
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
		store:GO.documenttemplates.ooTemplatesStore,
		sm: new Ext.grid.RowSelectionModel({
			singleSelect:true
		}),
		columns:[{
			header: GO.lang['strName'],
			dataIndex: 'name',
			sortable:true
		},
		{
			header: GO.documenttemplates.lang['cmdType'],
			dataIndex: 'type' ,
			renderer: this.typeRenderer.createDelegate(this),
			width: 100,
			sortable:false
		}]
	});
	
	


	this.ambiguousLinksGrid = new GO.grid.GridPanel({
		flex:4,
		region:'south',
		height:200,
		split:true,
		title:GO.documenttemplates.lang.selectRelevantResources,
		store:new Ext.data.GroupingStore({
			url: GO.url("documenttemplates/document/getLinks"),
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
		plugins:checkCol,
		cm:columnModel,
		view:new Ext.grid.GroupingView({
			hideGroupedColumn:true,
			groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "'+GO.lang.items+'" : "'+GO.lang.item+'"]})',
			emptyText: GO.lang['strNoItems'],
			showGroupName:false
		}),
		autoExpandColumn:1,
		loadMask:true
	});

	config.items=[this.formPanel, this.templatesGrid, this.ambiguousLinksGrid];
	config.buttons=[{
			text:GO.lang.cmdOk,
			handler:function(){
				this.createFileFromTemplate();
			},
			scope:this
	}];

	
	GO.documenttemplates.TemplateDocumentDialog.superclass.constructor.call(this, config);
}

Ext.extend(GO.documenttemplates.TemplateDocumentDialog, GO.Window,{

	model_id:0,
	model_name:0,
	
	show : function(model_id, model_name){
		
		this.model_id=model_id;
		this.model_name=model_name;
		
		if(this.rendered){
			this.loadAmbiguousLinksGrid();
		}
		
		GO.documenttemplates.TemplateDocumentDialog.superclass.show.call(this);

//		if(!this.templatesGrid.getSelectionModel().getSelected())
//			this.templatesGrid.getSelectionModel().selectFirstRow();
		
		this.formPanel.form.reset();
	},

	templateType : {
		'0' : 'E-mail',
		'1' : GO.documenttemplates.lang.documentTemplate
	},

	typeRenderer : function(val, meta, record)
	{
		var type = this.templateType[val];

		if(val=='1'){
			type+=' ('+record.get('extension')+')';
		}

		return type;
	},
	
	loadAmbiguousLinksGrid : function(){
		var params = {
			template_id: this.templatesGrid.getSelectionModel().getSelected().id,
			model_name:this.model_name,
			model_id:this.model_id
		};
		
		this.ambiguousLinksGrid.store.load({
			callback:function(){
				this.ambiguousLinksGrid.setDisabled(false);
			},
			scope:this,
			params:params
		});
	},
	createFileFromTemplate : function(){
		
		
						
		var params = {
			template_id: this.templatesGrid.getSelectionModel().getSelected().id,
			model_name:this.model_name,
			model_id:this.model_id,
			filename:this.formPanel.form.findField('name').getValue().trim()
		};
		
		if(params.filename==''){
			this.formPanel.form.findField('name').focus();
			return;
		}

		var records = this.ambiguousLinksGrid.store.getRange();
		var links=[];
		for(var i=0,max=records.length;i<max;i++){
			if(!GO.util.empty(records[i].get('checked'))){
				links.push(records[i].get('model_name_and_id'));
			}
		}
		params.selectedLinks=Ext.encode(links);
		
		GO.request({
			params:params,
			url:'documenttemplates/document/create',
			success: function(response, options, result){
				
				GO.files.openFile({id: result.file_id});
				
				this.hide();
				//this.fireEvent('create', this, responseParams.new_path);
				//defer was necessary for chrome. Otherwise it the reloading of the panel gave a connection error.
				this.fireEvent.defer(300,this,['create', this, result.file_id]);
				
			},
			scope:this
		})
	}
});