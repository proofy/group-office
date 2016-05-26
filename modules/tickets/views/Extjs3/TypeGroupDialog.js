/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TypeGroupDialog.js 17091 2013-10-17 11:57:54Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.tickets.TypeGroupDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

    initComponent: function() {

        Ext.apply(this, {
            goDialogId: 'tiTypeGroup',
            layout: 'fit',
            title: GO.tickets.lang['typeGroup'],
            width: 400,
            height: 140,
            resizable: false,
            formControllerUrl: 'tickets/typeGroup'
        });

        GO.tickets.TypeGroupDialog.superclass.initComponent.call(this);
    },
    buildForm: function() {

        this.formPanel = new Ext.Panel({
            cls: 'go-form-panel',
            layout: 'form',
			title: GO.lang['strProperties'],
            labelWidth: 100,
            items:[{
				xtype: 'textfield',
				name: 'name',
				anchor: '-20',
				fieldLabel: GO.lang.strName,
				allowBlank:false
			}]
        });

        this.addPanel(this.formPanel);
    }

});