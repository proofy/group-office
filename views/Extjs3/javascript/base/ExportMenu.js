GO.base.ExportMenu = Ext.extend(Ext.Button,{
	
	className : null,
	currentGridColumns:false,
	
	constructor : function(config){
		
		this.className = config.className;
		
//		this.hiddenExportWindow = new GO.Window({
//			width: 1,
//			height: 1,
//			items: [
				this.hiddenExportForm = new Ext.FormPanel({
					hidden: true,
					url:GO.url("core/export/export"),
					standardSubmit: true,
					baseParams: {},
					items: [
						{
							xtype: 'hidden',
							name: 'class_name'
						},
						{
							xtype: 'hidden',
							name: 'export_columns'
						},
						{
							xtype: 'hidden',
							name: 'include_column_names'
						},
						{
							xtype: 'hidden',
							name: 'orientation'
						},
						{
							xtype: 'hidden',
							name: 'use_db_column_names'
						},
						{
							xtype: 'hidden',
							name: 'view'
						},
						{
							xtype: 'hidden',
							name: 'id'
						}
					]
				});
//			]
//		});
				
		GO.base.ExportMenu.superclass.constructor.call(this);	
		
		Ext.onReady(function(){
			this.hiddenExportForm.render(Ext.getBody());
			this.hiddenExportForm.form.getEl().dom.target='_blank';
		},this);	
		
	},
	
	render: function(container, position) {
		GO.base.ExportMenu.superclass.render.call(this,container,position);
	},
	
	/**
	 * Use this function to change the className after the menu is created.
	 * 
	 * @param string className
	 */
	setClassName : function(className){
		this.className = className;
		this.savedExportMenu.store.baseParams.className = className;
		this.savedExportMenu.store.load();
	},
	
	setColumnModel : function(columnModel){
		var cgColumns = [];
		var columns = columnModel.getColumnsBy(function(c){
			return !c.hidden;
		});
		
		for(var i = 0; i < columns.length; i++){
			
			var colName = columns[i].dataIndex.toString();
			
			if(colName.substring(0, 4) == "col_"){
				var cfColname = 'customfields.'+columns[i].dataIndex;
				cgColumns.push(cfColname);
			} else {
				cgColumns.push(columns[i].dataIndex);
			}
		}
		
		this.currentGridColumns = cgColumns.join();
	},
	
	initComponent : function(){

		Ext.apply(this, {
			iconCls: 'btn-export',
			text: GO.lang.cmdExport,
			menu: new Ext.menu.Menu()
		});

		GO.base.ExportMenu.superclass.initComponent.call(this);	

		this._createDefaultMenu();
	},
	
	// Add an item at the end of the menu
	addItem : function(menuItem){
		this.menu.addItem(menuItem);
	},
	
	// Insert an item at the given position. When 0, then add it at the top.
	insertItem : function(position,menuItem){
		this.menu.insert(position,menuItem);
	},
	
	_createDefaultMenu : function(){

		this.savedExportMenu = new GO.menu.JsonMenu({
			store: new GO.data.JsonStore({
				url: GO.url('core/export/savedExportsStore'),
				baseParams : {
					className : this.className
				},
				root: 'results',
				id: 'id',
				totalProperty:'total',
				fields: ['id','name'],
				remoteSort: true,
				model:"GO\\Base\\Model\\SavedExport"
			}),
			listeners:{
				scope:this,
				itemclick : function(item, e ) {
					if(!item.isManageButton && !item.isSeparator){
						this.doExport(item);
					}
				},
				load : function(menu,records){
					
					if(menu.items.length < 1){
						this.savedExportMenu.addItem(
							new Ext.menu.Item({
								text : GO.lang.noSavedExports,
								disabled: true
							})
						);
					}
					
					this.savedExportMenu.addItem(new Ext.menu.Separator({isSeparator:true}));
					this.savedExportMenu.addItem(this.getManageExportButton());
				}
			}
		});

		this.savedExportsButton = new Ext.menu.Item({
			text: GO.lang.savedExports,
			menu: this.savedExportMenu,
			scope: this
		});
		
		this.gridExportButton = new Ext.menu.Item({
			text: GO.lang.exportScreen,
			handler: function(item,event){

				if(!GO.base.currentGridExportDialog){
					GO.base.currentGridExportDialog = new GO.base.CurrentGridExportDialog();
				}
				
				GO.base.currentGridExportDialog.setClass(this.className);
				GO.base.currentGridExportDialog.show(0,{
					loadParams:{
						className:this.className,
						exportColumns:this.currentGridColumns
					}
				});
			},
			scope: this
		});
		
		this.menu.addItem(this.gridExportButton);
		this.menu.addSeparator();
		this.menu.addItem(this.savedExportsButton);
	},

	getManageExportButton : function(){
		
		this.manageExportsButton = new Ext.menu.Item({
			isManageButton: true,
			text: GO.lang.manageSavedExports,
			handler:function(){

				if(!GO.base.savedExportGridDialog){
					GO.base.savedExportGridDialog = new GO.base.SavedExportGridDialog();

					GO.base.savedExportGridDialog.on('hide', function(){
						this.savedExportMenu.store.load();
					}, this);

				}

				GO.base.savedExportGridDialog.setClass(this.className);
				GO.base.savedExportGridDialog.show();
			},
			scope: this
		});
		
		return this.manageExportsButton;
	},
	
	doExport : function(item){
		
		var data = {
			class_name:item.class_name,
			export_columns:item.export_columns,
			include_column_names:item.include_column_names,
			orientation:item.orientation,
			use_db_column_names:item.use_db_column_names,
			view:item.view,
			id: item.id			
		};
		
//		this.hiddenExportWindow.show();
		
		this.hiddenExportForm.form.setValues(data);
		this.hiddenExportForm.form.submit({
			scope:this
		});
//		this.hiddenExportWindow.hide();
//
//		window.open(GO.url("core/export/export",data));
	}
	
});