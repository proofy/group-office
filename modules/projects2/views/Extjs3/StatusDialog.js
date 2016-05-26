/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: StatusDialog.js 19986 2014-11-19 12:53:08Z mdhart $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */

/**
 * The status dialog is for adding/changing project statusses
 * Since new projects module statuses have a permissions tab
 */
GO.projects2.StatusDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

	initComponent: function() {

		Ext.apply(this, {
			goDialogId: 'pm-statusDialog',
			layout: 'fit',
			title: GO.projects2.lang['status'],
			width: 500,
			autoheight: true,
			closeAction: 'hide',
			enableApplyButton: false,
			formControllerUrl: 'projects2/status'
		});

		GO.projects2.StatusDialog.superclass.initComponent.call(this);
	},
	buildForm: function() {

		this.formPanel = new Ext.Panel({
			cls: 'go-form-panel',
			layout: 'form',
			labelWidth: 100,
			title: GO.projects2.lang['status'],
			waitMsgTarget:true,
			border: false,
			autoHeight:true,
			layout: 'form',
			cls:'go-form-panel',
			
			items:[{
				xtype: 'textfield',
				name: 'name',
				anchor: '100%',
				fieldLabel: GO.lang.strName
			},{
				xtype: 'xcheckbox',
				name: 'complete',
				anchor: '100%',
				hideLabel:true,
				checked:true,
				boxLabel: GO.projects2.lang['finishedStatus']
			},{
				xtype:'xcheckbox',
				name:'show_in_tree',
				hideLabel: true,
				boxLabel:GO.projects2.lang.showInTree,
				listeners: {
					check: function(cb, value) {
						if(!value)
							this.cbFilterable.setValue(value);
						this.cbFilterable.setDisabled(!value);
					},
					scope: this
				}
			},this.cbFilterable = new Ext.ux.form.XCheckbox({
				name: 'filterable',
				anchor: '100%',
				hideLabel:true,
				checked:true,
				boxLabel: GO.projects2.lang.filterable
			}),{
				xtype:'xcheckbox',
				name:'not_for_postcalculation',
				hideLabel: true,
				boxLabel:GO.projects2.lang['notForPostcalculation']
			}]
		});

		this.addPanel(this.formPanel);
		this.addPermissionsPanel(new GO.grid.PermissionsPanel());
	}

});