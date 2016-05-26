/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: EmployeeDialog.js 17837 2014-01-17 14:29:56Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.EmployeeDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

	initComponent: function() {

		Ext.apply(this, {
			layout: 'fit',
			title: GO.projects2.lang['employee'],
			width: 440,
			height: 200,
			resizable: false,
			remoteModelIdName:'user_id',
			formControllerUrl: 'projects2/employee'
		});

		GO.projects2.EmployeeDialog.superclass.initComponent.call(this);
	},
	buildForm: function() {

		this.formPanel = new Ext.Panel({
			cls: 'go-form-panel',
			layout: 'form',
			labelWidth: 140,
			items: [
			this.selectUser = new GO.form.SelectUser({
				hiddenName:'add_user_id',
				startBlank:true,
				value:0
			})
			,{
				xtype: 'datetime',
				fieldLabel: GO.projects2.lang['entriesClosedTill'],
				name: 'closed_entries_time',
				allowBlank: true
			},{
				xtype: 'numberfield',
				fieldLabel: GO.projects2.lang['externalFee'],
				name: 'external_fee'
			},{
				xtype: 'numberfield',
				fieldLabel: GO.projects2.lang['internalFee'],
				name: 'internal_fee'
			}
			]
		});
		this.addPanel(this.formPanel);
	},
	afterShowAndLoad : function(remoteModelId, config){
		this.selectUser.setDisabled(remoteModelId>0);
	}
});