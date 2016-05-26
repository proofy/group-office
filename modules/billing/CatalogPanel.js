/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: CatalogPanel.js 17861 2014-01-22 11:23:42Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 
 
GO.billing.CatalogPanel = function(config){
	
	if(!config)
	{
		config={};
	}
	
	this.categoriesTree = new GO.billing.CategoriesTree({
		region:'west',
		split:true,
		title:GO.billing.lang.categories,
		enableDD: true,
		stateId:'bs-categories-tree'
	});
	
	this.categoriesTree.on('click', function(node)	{
		this.setCategory(node.id.substr(10));
	}, this);
	
	this.categoriesTree.on('beforenodedrop', function(e){
		
		var target = {
			category_id: e.target.id.substr(10)
		};
		
		var selections = [];		
		if(e.data.selections)
		{
			//dropped from grid
			for(var i=0;i<e.data.selections.length;i++)
			{
				selections.push('p:'+e.data.selections[i].data.id);
			}
		}else
		{
			//dropped from tree		  
			var selections = ['f:'+e.data.node.id.substr(10)];
		}
		
		this.moveSelections(selections, target);		
	},
	this);
	
	this.productsGrid = new GO.billing.ProductsGrid({
		region:'center',
		stateId:'bs-products-grid',
		enableDragDrop:true,
		deleteConfig: {
			scope:this,
			success:function(){
				var activeNode = this.categoriesTree.getNodeById('bs-folder-'+this.category_id);
				if(activeNode)
				{
					activeNode.reload();
				}else
				{
					this.categoriesTree.getRootNode().reload();
				}
			}
		}
	});
	
//	this.productsGrid.on('folderDrop', function(grid, selections, dropRecord){
//		var target = {
//			category_id: dropRecord.data.id.substr(2)
//		};
//		var selectedKeys=[]
//		for(var i=0;i<selections.length;i++)
//		{
//			selectedKeys.push(selections[i].data.id);
//		}
//		
//		this.moveSelections(selectedKeys, target);
//		this.categoriesTree.getRootNode().reload();
//		
//	}, this);
	
	GO.billing.categoryDialog = new GO.billing.CategoryDialog();
	GO.billing.categoryDialog.on('save', function(){
		this.productsGrid.store.reload();
		
		var activeNode = this.categoriesTree.getNodeById('bs-folder-'+this.category_id);
		if(activeNode && activeNode.parentNode)
		{
			activeNode.parentNode.reload();			
		}else
		{
			this.categoriesTree.getRootNode().reload();
		}
	}, this);
	
	config.items=[this.categoriesTree, this.productsGrid];	

	config['layout']='border';
	config.border=false;
	
	//was required to show the search field in the tbar
	config.hideMode='offsets';
		
	if(GO.settings.modules.billing.write_permission)
	{
		config['tbar'] = [{
			iconCls: 'btn-add',							
			text: GO.billing.lang.addProduct,
			cls: 'x-btn-text-icon',
			handler: function(){
				
				GO.billing.productDialog.show();
				GO.billing.productDialog.formPanel.baseParams.category_id=this.category_id;
			},
			scope: this
		},{
			iconCls: 'btn-add',							
			text: GO.billing.lang.addCategory,
			cls: 'x-btn-text-icon',
			handler: function(){
				
				GO.billing.categoryDialog.show();
				GO.billing.categoryDialog.formPanel.baseParams.parent_id=this.category_id;
			},
			scope: this
		},{
			iconCls: 'btn-delete',
			text: GO.lang['cmdDelete'],
			cls: 'x-btn-text-icon',
			handler: function(){
				this.productsGrid.deleteSelected();
			},
			scope: this
		},
		{
			iconCls: 'btn-copy',
			text: GO.lang.copy,
			handler: function(){
			
				var selModel = this.productsGrid.getSelectionModel().selections;
				var selModelTree = this.categoriesTree.getSelectionModel();
				if(selModel.items.length==0)
				{
					Ext.MessageBox.alert(GO.lang.strError, GO.billing.lang.selectFiles);
				}else
				{
					this.copyFolders=[];
					this.copyFiles=[];
					
					for(var i=0;i<selModel.items.length;i++)
					{
						this.copyFiles.push(selModel.items[i].data.id);
					}
					this.pasteButton.setDisabled(false);
				}
			},
			scope: this
		},this.pasteButton = new Ext.Button({
			disabled:true,
			iconCls: 'btn-paste',
			text: GO.lang.paste,
			handler: function(){
				if(this.copyFiles.length==0)
				{
					Ext.MessageBox.alert(GO.lang.strError, GO.billing.lang.selectDestination);
				}else
				{
					var params = {
						copy_products: Ext.encode(this.copyFiles),
						destination_category_id: this.category_id
					};

//					Ext.Msg.show({
//						title: GO.billing.lang['pastePromptTitle'],
//						msg: GO.billing.lang['pastePromptText1'] +' '+ this.copyFiles.length
//							+' '+ GO.billing.lang['pastePromptText2']
//							+' "'+ this.categoriesTree.getSelectionModel().getSelectedNode().attributes.text
//							+'" '+ GO.billing.lang['pastePromptText3'],
//						buttons: Ext.Msg.YESNO,
//						scope: this,
//						fn: function(btn) {
//							if (btn=='yes') {
								GO.request({
									// url: GO.url('billing/productCategory/pasteSelections'),
									url: 'billing/productCategory/pasteProducts',
									params: params,
									success: function(options, response, result){
										this.productsGrid.store.load();
										this.categoriesTree.root.reload();

										this.copyFolders=[];
										this.copyFiles=[];
										this.pasteButton.setDisabled(true);
									},
									scope:this
								});
//							}
//						},
//						animEl: 'elId',
//						icon: Ext.MessageBox.QUESTION
//					});

				}
			},
			scope: this
		}),
		this.editCategoryButton = new Ext.Button({
			iconCls: 'btn-edit',							
			text: GO.billing.lang.editCategory,
			cls: 'x-btn-text-icon',
			disabled: true,
			handler: function(){
				
				GO.billing.categoryDialog.show(this.category_id);
	    	
			},
			scope: this
		}),{
			iconCls: 'btn-upload',
			//hidden:true,
			text:GO.lang.cmdImport,
			handler:function(){
				if(!this.importDialog)
				{
								this.importDialog = new GO.billing.ImportDialog();
								this.importDialog.on('import', function(){
												this.refresh();
								}, this);
				}                                
				this.importDialog.show();
			},
			scope:this
		},{
			iconCls: 'btn-export',
			text: GO.lang.cmdExport,
//			cls: 'x-btn-text-icon',
			scope: this,
			handler: function(){
				window.open(GO.url('billing/exportCatalog/export')+'&category_id='+this.category_id);
			}
		},
		{
			iconCls:'btn-refresh',
			text:GO.lang.cmdRefresh,
			handler:function(){
				this.refresh();
			},
			scope:this
		}];
	}
		
	this.productsGrid.on("rowdblclick", this.rowDoulbleClicked, this);
	
	
	GO.billing.CatalogPanel.superclass.constructor.call(this, config);
	
}

Ext.extend(GO.billing.CatalogPanel, Ext.Panel, {

	refresh : function(){
		this.categoriesTree.getRootNode().reload();
		this.productsGrid.store.reload();
	},
	
	afterRender : function(){
		
		GO.billing.CatalogPanel.superclass.afterRender.call(this);
		
		this.setCategory(0);
	},
	
	
	moveSelections : function(selections, target)
	{
		Ext.Ajax.request({
			url: GO.url('billing/productCategory/moveSelections'),
			params: {
				selections : Ext.encode(selections),
				target : Ext.encode(target)
			},
			callback: function(options, success, response){				
				
				if(!success)
				{
					Ext.MessageBox.alert(GO.lang['strError'], GO.lang['strRequestError']);
				}else
				{
					var responseParams = Ext.decode(response.responseText);
					
					if(responseParams.moved_products)
					{
						for(var i=0;i<responseParams.moved_products.length;i++)
						{
							var arr = responseParams.moved_products[i].split(':');
							if(arr[0]=='p'){
								var record = this.productsGrid.store.getById(arr[1]);
								if(record)
								{
									this.productsGrid.store.remove(record);
								}
							}
						}
					}					
				}
			},
			scope:this								
			
		});
		
		
	},
	
	
	rowDoulbleClicked : function(grid, rowClicked, e) {
			
		var selectionModel = grid.getSelectionModel();
		var record = selectionModel.getSelected();
		
//		var type = record.data.id.substr(0,1);
//		var id = record.data.id.substr(2);
		
//		if(type=='f')
//		{
//			this.setCategory(id);			
//		}else	
//		{
			GO.billing.productDialog.show(record.data.id);
//	}
	},
	

	
	setWritePermission : function(writePermission){
		this.linkButton.setDisabled(!writePermission);
		this.unlinkButton.setDisabled(!writePermission);
		this.newCategoryButton.setDisabled(!writePermission);
		this.deleteButton.setDisabled(!writePermission);		
	},
	
	setCategory : function(category_id)
	{
		var activeNode = this.categoriesTree.getNodeById('bs-folder-'+category_id);
		if(activeNode)
		{
			activeNode.expand();			
		}
		

		if(GO.settings.modules.billing.write_permission)
			this.editCategoryButton.setDisabled(category_id==0);
		
		
		GO.billing.categoryDialog.category_id=category_id;
		
		this.category_id=category_id;
		this.productsGrid.store.baseParams["category_id"]=category_id;
		this.productsGrid.store.load();
	},

	itemType : function ( id ) {
		return id.substr(0,1);
	},

	folderNumber : function (id) {
		return id.substr(10);
	}

});