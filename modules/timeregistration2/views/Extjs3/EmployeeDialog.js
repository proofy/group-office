/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: EmployeeDialog.js 17032 2013-10-13 09:20:48Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.EmployeeDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

    initComponent: function() {

        Ext.apply(this, {
            layout: 'fit',
            title: GO.projects2.lang['employee'],
            width: 400,
            height: 150,
            resizable: false,
            formControllerUrl: 'timeregistration2/employee'
        });

        GO.timeregistration2.EmployeeDialog.superclass.initComponent.call(this);
    },
    buildForm: function() {

        this.formPanel = new Ext.Panel({
            cls: 'go-form-panel',
            layout: 'form',
            labelWidth: 140,
            items: [
                {
                    xtype: 'textfield',
					disabled: true,
                    fieldLabel: GO.lang.strName,
                    name: 'name',
                    allowBlank: false
                },{
                    xtype: 'datetime',
                    fieldLabel: GO.projects2.lang['entriesClosedTill'],
                    name: 'closed_entries_time',
                    allowBlank: false
                }
            ]
        });
        this.addPanel(this.formPanel);
    }
});