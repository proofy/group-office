GO.zpushadmin.SettingsDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'zpushadminsettings',
			title: GO.lang['cmdSettings'],
			formControllerUrl: 'zpushadmin/settings',
			height:200,
			width:300,
			helppage:'Z-push_admin_user_manual#Settings'
		});
		
		GO.zpushadmin.SettingsDialog.superclass.initComponent.call(this);	
	},
	  
	buildForm : function () {
		
		this.defaultCanConnectCheckBox = new Ext.ux.form.XCheckbox({
			hideLabel: true,
			boxLabel: GO.zpushadmin.lang.standardCanConnect,
			name: 'zpushadmin_can_connect'
		});
		
		this.propertiesPanel = new Ext.Panel({
			title:GO.lang['strProperties'],			
			cls:'go-form-panel',
			layout:'form',
			items:[
				this.defaultCanConnectCheckBox
      ]				
		});

    this.addPanel(this.propertiesPanel);
	}
});