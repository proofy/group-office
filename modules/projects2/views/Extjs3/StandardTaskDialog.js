/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: StandardTaskDialog.js 19558 2014-08-21 09:16:36Z wvbeusekom $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */

/**
 * This is the dialog for create and update the Standard tasks / Activities
 * It is also used in the settings dialog of the time registration module
 */
GO.projects2.StandardTaskDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

	initComponent: function() {

		Ext.apply(this, {
			goDialogId: 'pm-standardTask',
			layout: 'fit',
			title: GO.projects2.lang['activityType'],
			width: 600,
			height: 350,
			resizable: false,
			formControllerUrl: 'projects2/standardTask'
		});

		GO.projects2.StandardTaskDialog.superclass.initComponent.call(this);
	},
	buildForm: function() {

		this.formPanel = new Ext.Panel({
			cls: 'go-form-panel',
			layout: 'form',
			labelWidth: 150,
			items: [
			{
				name: 'code',
				xtype: 'textfield',
				fieldLabel: GO.projects2.lang['code'],
				width: 100,
				allowBlank:false
			},{
				name: 'name',
				xtype: 'textfield',
				fieldLabel: GO.lang['strName'],
				anchor: '100%',
				allowBlank:false
			},{
				xtype: 'compositefield',
				fieldLabel: GO.projects2.lang['defaultDuration'],
				items: [
				{
					name: 'units',
					xtype: 'numberfield',
					width: 100,
					allowBlank:false
				},
				{
					xtype:'htmlcomponent',
					html: GO.timeregistration2.lang['hours']
				}
				]
			},{
				name: 'description',
				xtype: 'textarea',
				fieldLabel: GO.lang['strDescription'],
				anchor: '100%',
				allowBlank:true
			},{
				name: 'disabled',
				xtype: 'xcheckbox',
				boxLabel: GO.lang['disabled'],
				hideLabel: true
			},this.billableCheckbox = new Ext.ux.form.XCheckbox({
				name: 'is_billable',
				xtype: 'xcheckbox',
				boxLabel: GO.timeregistration2.lang['hoursBillable'],
				hideLabel: true
			}),this.alwaysBillableCheckbox = new Ext.ux.form.XCheckbox({
				name: 'is_always_billable',
				xtype: 'xcheckbox',
				boxLabel: GO.projects2.lang['hoursAlwaysBillable'],
				hideLabel: true,
				disabled: true
			})
			]
		});

		this.addPanel(this.formPanel);
		
		this.billableCheckbox.on('check',function(checkbox,checked){
			this.alwaysBillableCheckbox.setDisabled(!checked);
		}, this);
	},
	
	afterLoad: function(remoteModelId,config,action) {
		
		this.alwaysBillableCheckbox.setDisabled(!action.result.data.is_billable);
		
	}

});