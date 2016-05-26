/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: SettingsDialog.js 19987 2014-11-19 13:46:35Z wsmits $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */


GO.projects2.SettingsDialog = Ext.extend(GO.dialog.TabbedFormDialog, {
  initComponent: function() {

    Ext.apply(this, {
      goDialogId: 'pm-settings-dialog',
      layout: 'fit',
      title: GO.lang['administration'],
      width: 700,
      height: 500,
      resizable: false,
      formControllerUrl: 'projects2/settings'
    });

    GO.projects2.SettingsDialog.superclass.initComponent.call(this);
  },
  	
  buildForm: function() {

		this.statusesPanel = new GO.projects2.StatusesGrid({
			title:GO.projects2.lang.statuses,
			layout:'fit'
		});
		
		this.typesPanel = new GO.projects2.TypesGrid({
			title:GO.projects2.lang.types,
			layout:'fit'
		});
		
		this.templatesPanel = new GO.projects2.TemplatesGrid({
			title:GO.projects2.lang.templates,
			layout:'fit'
		});

		this.followNumberPanel = new Ext.Panel({
			layout:'form',
			labelWidth:120,
			title: GO.lang.cmdSettings,
			waitMsgTarget:true,
			style:'margin:5px',
			items:[{
					fieldLabel: GO.projects2.lang.enableFollowNumber,
					name: 'chkCustomId',
					xtype:'checkbox',
					labelStyle:'margin:5px'
				}, {
					fieldLabel: GO.projects2.lang.followNumberFormat,
					name: 'customId',
					xtype:'textfield',
					labelStyle:'margin:5px'
				}]
		});




		this.standardTaskGrid = new GO.projects2.StandardTaskGrid();
    
		this.employeesGrid = new GO.projects2.EmployeeGrid();
	
		this.officeTimePanel = new GO.projects2.OfficeTimePanel();
		
	
		this.addPanel(this.followNumberPanel);
		this.addPanel(this.typesPanel);
		this.addPanel(this.officeTimePanel);
		this.addPanel(this.templatesPanel);
		this.addPanel(this.statusesPanel);
		this.addPanel(this.standardTaskGrid);
		this.addPanel(this.employeesGrid);
		
		this.financePermissionsPanel = new GO.grid.PermissionsPanel({
			title: GO.projects2.lang.financePermissions,
			fieldName:'finance_acl',
			hideLevel:true
		});
		
		this.addPermissionsPanel(this.financePermissionsPanel);
	},
	
	afterSubmit : function(action){
		GO.projects2.nameTemplate = action.result.new_name_template;
		GO.projects2.useNameTemplate = action.result.use_name_template;
	}
});
