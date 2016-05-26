/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: Settings.js 19906 2014-11-03 08:49:35Z wsmits $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 
GO.sync.SyncSettingsPanel = function(config)
{
	if(!config)
	{
		config={};
	}
	
	config.autoScroll=true;
	config.border=false;
	config.hideLabel=true;
	config.title = GO.sync.lang.sync;
	config.layout='form';
	config.forceLayout=true;
	config.defaults={
		anchor:'-20'
	};
	config.defaultType = 'textfield';
	//config.cls='go-form-panel';
	config.bodyStyle='padding:5px';
	config.labelWidth=190;
	config.items=[];


	config.items.push(new GO.form.HtmlComponent({
		html: '<p class="go-form-text">'+GO.sync.lang.max_age_text+'</p>'
	}));

	config.items.push(new GO.form.NumberField({
		decimals: "0",
		fieldLabel: GO.sync.lang.max_age,
		name: 'max_days_old',
		width:50,
		maxValue: 127,
		minValue: 0
	}));

//	config.items.push({
//		xtype:'checkbox',
//		name: 'delete_old_events',
//		hideLabel:true,
//		boxLabel: GO.sync.lang.delete_old_events.replace('Group-Office', GO.settings.config.product_name)
//	});

	if(GO.settings.modules.email && GO.settings.modules.email.read_permission)
	{
		this.selectAccount = new GO.form.ComboBox({
			fieldLabel: GO.email.lang.account,
			hiddenName:'account_id',
			anchor:'-20',
			emptyText:GO.lang.strPleaseSelect,
			store: new GO.data.JsonStore({
				url: GO.url("email/account/store"),
				fields: ['id', 'username'],
				remoteSort: true
			}),
			valueField:'id',
			displayField:'username',
			typeAhead: true,
			mode: 'remote',
			triggerAction: 'all',
			editable: false,
			selectOnFocus:true,
			forceSelection: true
		});
		
		config.items.push(this.selectAccount);
	}

	if(GO.settings.modules.calendar && GO.settings.modules.calendar.read_permission)
	{
		var defaultCalendarCol = new GO.grid.RadioColumn({
			header: GO.sync.lang.defaultType,
			dataIndex: 'default_calendar',
			width: 90,
			isDisabled:function(record){
				return record.get('permission_level')<GO.permissionLevels.writeAndDelete;
			}
		});

		this.panelCalendar = new GO.base.model.multiselect.panel({
				autoLoadStore: false,
				deleteDefaultCol: 'default_calendar',
				deleteSelected : this.checkDefaultSelected,
				height:120,
				forceLayout:true,
				autoExpandColumn:'name',
				url:'sync/userCalendar',
				columns:[{
					header: GO.lang['strName'], 
					dataIndex: 'name', 
					sortable: true,
					id:'name'
				},
				defaultCalendarCol
				],
				plugins: [defaultCalendarCol],
				selectColumns:[{
					header: GO.lang['strName'], 
					dataIndex: 'name', 
					sortable: true
				}],
				fields:['id','name','default_calendar','permission_level'],
				model_id:GO.settings.user_id
			});
			
		config.items.push(new Ext.Panel({
			forceLayout:true,
			layout: 'column',
			bodyStyle:'margin-bottom:10px',
			border:false,
			items: [{
					forceLayout:true,
					bodyStyle:'padding-left:0px',
					width: config.labelWidth,
					border:false,
					html:GO.calendar.lang.calendar+':'
				},{
					forceLayout:true,
					bodyStyle:'padding-right:0px',
					items:[this.panelCalendar],
					border:false,
					columnWidth:1,
					layout:'fit'
				}
				
			]
		}));
	}

	if(GO.settings.modules.tasks && GO.settings.modules.tasks.read_permission)
	{
		var defaultTasklistCol = new GO.grid.RadioColumn({
			header: GO.sync.lang.defaultType,
			dataIndex: 'default_tasklist',
			width: 90,
			isDisabled:function(record){
				return record.get('permission_level')<GO.permissionLevels.writeAndDelete;
			}
		});

		this.panelTasklist = new GO.base.model.multiselect.panel({
				autoLoadStore: false,
				height:120,
				deleteDefaultCol: 'default_tasklist',
				deleteSelected : this.checkDefaultSelected,
				forceLayout:true,
				autoExpandColumn:'name',
				url:'sync/userTasklist',
				columns:[{
					header: GO.lang['strName'], 
					dataIndex: 'name', 
					sortable: true,
					id:'name'
				},
				defaultTasklistCol
				],
				plugins: [defaultTasklistCol],
				selectColumns:[{
					header: GO.lang['strName'], 
					dataIndex: 'name', 
					sortable: true
				}],
				fields:['id','name','default_tasklist','permission_level'],
				model_id:GO.settings.user_id
			});
			
		config.items.push(new Ext.Panel({
			forceLayout:true,
			layout: 'column',
			bodyStyle:'margin-bottom:10px',
			border:false,
			items: [{
					forceLayout:true,
					bodyStyle:'padding-left:0px',
					width: config.labelWidth,
					border:false,
					html:GO.tasks.lang.tasklist+':<br /><font style="font-size:10px; color:red;">'+GO.sync.lang.tasklistActiveSyncOnly+'</font>'
				},{
					forceLayout:true,
					bodyStyle:'padding-right:0px',
					items:[this.panelTasklist],
					border:false,
					columnWidth:1,
					layout:'fit'
				}
			]
		}));
	}
	
	if(GO.settings.modules.addressbook && GO.settings.modules.addressbook.read_permission)
	{
		var defaultAddressbookCol = new GO.grid.RadioColumn({
			header: GO.sync.lang.defaultType,
			dataIndex: 'default_addressbook',
			width: 90,
			isDisabled:function(record){
				return record.get('permission_level')<GO.permissionLevels.writeAndDelete;
			}
		});

		this.panelAddressbook = new GO.base.model.multiselect.panel({
				autoLoadStore: false,
				height:120,
				forceLayout:true,
				deleteDefaultCol: 'default_addressbook',
				deleteSelected : this.checkDefaultSelected,
				autoExpandColumn:'name',
				url:'sync/userAddressbook',
				columns:[{
					header: GO.lang['strName'], 
					dataIndex: 'name', 
					sortable: true,
					id:'name'
				},
				defaultAddressbookCol
				],
				plugins: [defaultAddressbookCol],
				selectColumns:[{
					header: GO.lang['strName'], 
					dataIndex: 'name', 
					sortable: true
				}],
				fields:['id','name','default_addressbook','permission_level'],
				model_id:GO.settings.user_id
			});
			
		config.items.push(new Ext.Panel({
			forceLayout:true,
			layout: 'column',
			bodyStyle:'margin-bottom:10px',
			border:false,
			items: [{
					forceLayout:true,
					bodyStyle:'padding-left:0px',
					width: config.labelWidth,
					border:false,
					html:GO.addressbook.lang.addressbook+':'
				},{
					forceLayout:true,
					bodyStyle:'padding-right:0px',
					items:[this.panelAddressbook],
					border:false,
					columnWidth:1,
					layout:'fit'
				}
			]
		}));
	}

	if(GO.settings.modules.notes && GO.settings.modules.notes.read_permission)
	{
		var defaultNoteCategoriesCol = new GO.grid.RadioColumn({
			header: GO.sync.lang.defaultType,
			dataIndex: 'default_category',
			width: 90,
			isDisabled:function(record){
				return record.get('permission_level')<GO.permissionLevels.writeAndDelete;
			}
		});

		this.panelNoteCategories = new GO.base.model.multiselect.panel({
				autoLoadStore: false,
				height:120,
				deleteDefaultCol: 'default_category',
				deleteSelected : this.checkDefaultSelected,
				forceLayout:true,
				autoExpandColumn:'name',
				url:'sync/userNoteCategory',
				columns:[{
					header: GO.lang['strName'], 
					dataIndex: 'name', 
					sortable: true,
					id:'name'
				},
				defaultNoteCategoriesCol
				],
				plugins: [defaultNoteCategoriesCol],
				selectColumns:[{
					header: GO.lang['strName'], 
					dataIndex: 'name', 
					sortable: true
				}],
				fields:['id','name','default_category','permission_level'],
				model_id:GO.settings.user_id
			});
			
		config.items.push(new Ext.Panel({
			forceLayout:true,
			layout: 'column',
			bodyStyle:'margin-bottom:10px',
			border:false,
			items: [{
					forceLayout:true,
					bodyStyle:'padding-left:0px',
					width: config.labelWidth,
					border:false,
					html:GO.notes.lang.category+':'
				},{
					forceLayout:true,
					bodyStyle:'padding-right:0px',
					items:[this.panelNoteCategories],
					border:false,
					columnWidth:1,
					layout:'fit'
				}
			]
		}));
	}


	if(GO.settings.modules.syncml && GO.settings.modules.syncml.permission_level){
		this.devicesGrid = new GO.sync.DevicesGrid({
			height:100,
			forceLayout: true,
			bodyStyle: 'padding:0px'
		});

		this.paneldevicesGrid = new Ext.Panel({
			forceLayout:true,
			layout: 'column',
			bodyStyle:'margin-bottom:10px',
			border:false,
			items: [{
				forceLayout:true,
				bodyStyle:'padding-left:0px',
				width: config.labelWidth,
				border:false,
				html:"SyncML "+GO.sync.lang.devices+':'
			},{
				forceLayout:true,
				bodyStyle:'padding-right:0px',
				items:[this.devicesGrid],
				border:false,
				columnWidth:1,
				layout:'fit'
			}]

		});
		config.items.push(this.paneldevicesGrid);
	}
	
	config.listeners={
		show:function(){
			if(this.panelAddressbook)
				this.panelAddressbook.store.load();
			
			if(this.panelTasklist)
				this.panelTasklist.store.load();
			
			if(this.panelCalendar)
				this.panelCalendar.store.load();
			
			if(this.panelNoteCategories)
				this.panelNoteCategories.store.load();
			
			if(this.devicesGrid)
				this.devicesGrid.store.load()
		},
		scope:this
	}
	
	GO.sync.SyncSettingsPanel.superclass.constructor.call(this, config);		
};


Ext.extend(GO.sync.SyncSettingsPanel, Ext.Panel,{
	
	checkDefaultSelected : function(){
		var defaultFound = false;
		
		var records = this.selModel.getSelections();
		for (var i=0;i<this.selModel.selections.keys.length;i++) {
			if(records[i].data[this.deleteDefaultCol] == 1 && !defaultFound){
				defaultFound = true;
				break;
			}
		}

		if(defaultFound){

			alert(GO.lang.cantDeleteDefault);

//						Ext.MessageBox.show({
//							title: GO.lang.strError,
//							msg: GO.lang.cantDeleteDefault,
//							buttons: Ext.MessageBox.OK,
//							icon: Ext.MessageBox.ERROR
//						});

			return;
		} else {
			return GO.base.model.multiselect.panel.superclass.deleteSelected.call(this);
		}
	}
	
//	onLoadSettings : function(action){		
//
//		if(this.selectAddressbook)
//			this.selectAddressbook.store.load();
//		
//		if(this.selectTasklist)
//			this.selectTasklist.store.load();
//
//		if(this.selectNoteCategories)
//			this.selectNoteCategories.store.load();
//		
//	},
//	onBeforeSaveSettings : function(dlg){
//		if(this.selectAddressbook){
//			dlg.formPanel.baseParams.sync_addressbooks=Ext.encode(this.selectAddressbook.getGridData());
//			if(!this.selectAddressbook.getGridData().def)
//			{
//				alert(GO.sync.lang.noDefaultAddressbook);
//				return false;
//			}
//		}
//		if(this.selectTasklist){
//			dlg.formPanel.baseParams.sync_tasklists=Ext.encode(this.selectTasklist.getGridData());
//			if(!this.selectTasklist.getGridData().def)
//			{
//				alert(GO.sync.lang.noDefaultTasklist);
//				return false;
//			}		
//		}
//
//		if(this.selectNoteCategories){
//			dlg.formPanel.baseParams.sync_note_categories=Ext.encode(this.selectNoteCategories.getGridData());
//			if(!this.selectNoteCategories.getGridData().def)
//			{
//				alert(GO.sync.lang.noDefaultNoteCategory);
//				return false;
//			}
//		}
//
//		return true;
//	},

//	onSaveSettings : function(){
//		if(this.selectTasklist)
//			this.selectTasklist.store.commitChanges();
//		
//		if(this.selectAddressbook)
//			this.selectAddressbook.store.commitChanges();
//
//		if(this.selectNoteCategories)
//			this.selectNoteCategories.store.commitChanges();
//	}
	
});			


GO.mainLayout.onReady(function(){
	GO.moduleManager.addSettingsPanel('sync', GO.sync.SyncSettingsPanel);	
});	
