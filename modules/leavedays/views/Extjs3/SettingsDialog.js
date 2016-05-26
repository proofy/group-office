//SettingsDialog


GO.leavedays.SettingsDialog = Ext.extend(GO.dialog.TabbedFormDialog, {
	
	initComponent: function() {

    Ext.apply(this, {
      goDialogId: 'pm-settings-dialog',
      layout: 'fit',
      title: GO.lang['administration'],
      width: 700,
      height: 500,
      resizable: false,
      formControllerUrl: 'leavedays/settings',
			enableApplyButton:false,
			enableOkButton:false,
    });

    GO.leavedays.SettingsDialog.superclass.initComponent.call(this);
  },
	
	buildForm: function() {
		
		this.creditTypes  = new GO.leavedays.CreditTypesGrid({
			title: GO.leavedays.lang['credittypes'],
			border: false,
			paging: true
		});
		
		this.addPanel(this.creditTypes);
		
	}
	
});