/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: DevicesGrid.js 16399 2013-07-23 13:55:30Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */

GO.zpushadmin.DevicesGrid = Ext.extend(GO.grid.GridPanel,{
	changed : false,
	
	// These 2 parameters are used in the render function of the comments column
	maxLength : 20,
	cutWholeWords : true,

	initComponent : function(){
		
		Ext.apply(this,{
			standardTbar:false,
			store: GO.zpushadmin.deviceStore,
			border: false,
			paging:true,
			view:new Ext.grid.GridView({
				emptyText: GO.lang['strNoItems'],
				getRowClass: this.rowRenderer
			}),
			cm:new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:[
				{
					header: GO.zpushadmin.lang.status,
					dataIndex: 'new',
					sortable: true,
					renderer: this.statusRenderer,
					width:100
				},
				{
					header: GO.zpushadmin.lang.user,
					dataIndex: 'username',
					sortable: true,
					width:180
				},
				{
					header: GO.zpushadmin.lang.canConnect,
					dataIndex: 'can_connect',
					sortable: true,
					renderer: GO.grid.ColumnRenderers.yesNo,
					width:100,
					hidden:true
				},
				{
					header: GO.zpushadmin.lang.deviceId,
					dataIndex: 'device_id',
					sortable: true,
					width:200
				},
				{
					header: GO.zpushadmin.lang.deviceType,
					dataIndex: 'device_type',
					sortable: true,
					width:200
				},
				{
					header: GO.zpushadmin.lang.deviceASVersion,
					dataIndex: 'as_version',
					sortable: true,
					width:120
				},
				{
					header: GO.zpushadmin.lang.remoteAddr,
					dataIndex: 'remote_addr',
					sortable: true,
					width:100
				},
				{
					header: GO.zpushadmin.lang.firstSyncAttempt,
					dataIndex: 'ctime',
					sortable: true,
					width:180
				},{
					header: GO.zpushadmin.lang.lastSyncAttempt,
					dataIndex: 'mtime',
					sortable: true,
					width:180
				},
				{
					header: GO.zpushadmin.lang.comments,
					dataIndex: 'comment',
					sortable: false,
					renderer: {
						fn: GO.grid.ColumnRenderers.Text,
						scope: this
					},
					width:180
				}
				]
			})
		});
		
		GO.zpushadmin.DevicesGrid.superclass.initComponent.call(this);
		
		GO.zpushadmin.deviceStore.load();
	},
	
	dblClick : function(grid, record, rowIndex){
		this.showDeviceDialog(record.id);
	},
//	
//	btnAdd : function(){				
//		this.showDeviceDialog();	  	
//	},
	showDeviceDialog : function(id){
		if(!this.deviceDialog){
			this.deviceDialog = new GO.zpushadmin.DeviceDialog();

			this.deviceDialog.on('save', function(){   
				this.store.load();
				this.changed=true;	    			    			
			}, this);	
		}
		this.deviceDialog.show(id);	  
	},
	showSettingsDialog : function(){
		if(!this.settingsDialog){
			this.settingsDialog = new GO.zpushadmin.SettingsDialog();

			this.settingsDialog.on('save', function(){   
				this.store.load();
				this.changed=true;	    			    			
			}, this);	
		}
		this.settingsDialog.show();	  
	},
	deleteSelected : function(){
		GO.zpushadmin.DevicesGrid.superclass.deleteSelected.call(this);
		this.changed=true;
	},
	statusRenderer : function(value, metaData, record, rowIndex, colIndex, store){
		if(record.data['new']==true)
			return GO.zpushadmin.lang.statusNew;
		else if(record.data['can_connect']==true)
			return GO.zpushadmin.lang.statusEnabled;
		else
			return GO.zpushadmin.lang.statusDisabled;		
	},
	rowRenderer : function(record, index){
		if(record.data['new']==true)
			return 'zpushadmin-new-device';
		else if(record.data['can_connect']==true)
			return 'zpushadmin-enabled-device';
		else
			return 'zpushadmin-disabled-device';
	}
	
});