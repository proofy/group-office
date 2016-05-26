GO.zpushadmin.DeviceDialog = Ext.extend(GO.dialog.TabbedFormDialog , {

	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'zpushadmindevice',
			title:GO.zpushadmin.lang.device,
			formControllerUrl: 'zpushadmin/device',
			height:280,
			width:400,
			helppage:'Z-push_admin_user_manual#Device_dialog'
		});
		
		GO.zpushadmin.DeviceDialog.superclass.initComponent.call(this);	
	},
	  
	buildForm : function () {
		
		this.deviceIDTextField = new Ext.form.TextField({
			name: 'device_id',
			width:300,
			anchor: '99%',
			maxLength: 100,
			allowBlank:false,
			disabled:true,
			fieldLabel: GO.zpushadmin.lang.device
		});
		
		this.deviceTypeTextField = new Ext.form.TextField({
			name: 'device_type',
			width:300,
			anchor: '99%',
			maxLength: 100,
			allowBlank:false,
			disabled:true,
			fieldLabel: GO.zpushadmin.lang.deviceType
		});
		
		this.resyncButton = new Ext.Button({
			text : GO.zpushadmin.lang.resyncDevice,
			handler : function() {
				Ext.Msg.show({
					title: GO.zpushadmin.lang.resyncDevice,
					icon: Ext.MessageBox.WARNING,
					msg: GO.zpushadmin.lang.resyncDeviceAreYouSure,
					buttons: Ext.Msg.YESNO,
					scope:this,
					fn: function(btn) {
						if (btn=='yes') {
							GO.request({
								maskEl:Ext.getBody(),
								url:'zpushadmin/admin/resyncDevice',
								params:{
									deviceId:this.loadData.device_id,
									username:this.loadData.username
								},
								scope:this
							});
						}
					}
				})
			},
			scope : this
		});
		
//		this.wipeDeviceButton = new Ext.Button({
//			text : GO.zpushadmin.lang.wipeDevice,
//			handler : function() {
//				Ext.Msg.show({
//					title: GO.zpushadmin.lang.wipeDevice,
//					icon: Ext.MessageBox.WARNING,
//					msg: GO.zpushadmin.lang.wipeDeviceAreYouSure,
//					buttons: Ext.Msg.YESNO,
//					scope:this,
//					fn: function(btn) {
//						if (btn=='yes') {
//							GO.request({
//								maskEl:Ext.getBody(),
//								url:'zpushadmin/admin/wipe',
//								params:{
//									deviceId:this.loadData.device_id,
//									username:this.loadData.username
//								},
//								scope:this
//							});
//						}
//					}
//				})
//			},
//			scope : this
//		});
		
		this.canConnectCheckbox = new Ext.ux.form.XCheckbox({
			name: 'can_connect',
			width:300,
			anchor: '99%',
			maxLength: 100,
			allowBlank:false,
			fieldLabel: GO.zpushadmin.lang.canConnect
		});
		
		this.commentsTextArea = new Ext.form.TextArea({
			name: 'comment',
			width:300,
			anchor: '99%',
			allowBlank:true,
			disabled:false,
			fieldLabel: GO.zpushadmin.lang.comments
		});
			
			
		this.buttonContainer = new Ext.Container({
			layout: {
				type: 'hbox',
				padding: '20px'
			},
			items: [
				this.resyncButton
//				,
//				this.wipeDeviceButton
			]
		});	
		
		this.propertiesPanel = new Ext.Panel({
			title:GO.lang['strProperties'],			
			cls:'go-form-panel',
			layout:'form',
			items:[
				this.deviceIDTextField,
				this.deviceTypeTextField,
				this.canConnectCheckbox,
				this.commentsTextArea,
				this.buttonContainer
      ]				
		});

    this.addPanel(this.propertiesPanel);
	},
	afterLoad : function(remoteModelId, config, action){
		
		this.resyncButton.setDisabled(!action.result.zpushAdminFound);
		//this.wipeDeviceButton.setDisabled(!action.result.zpushAdminFound);
	}
});