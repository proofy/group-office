/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TypeDialog.js 17031 2013-10-13 09:20:34Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.TypeDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

    initComponent: function() {

        Ext.apply(this, {
            goDialogId: 'expenseType',
            layout: 'fit',
            title: GO.projects2.lang['type'],
            width: 700,
            height: 500,
            resizable: false,
            formControllerUrl: 'projects2/type'
        });

        GO.projects2.TypeDialog.superclass.initComponent.call(this);
    },
	afterLoad : function(remoteModelId, config){
	  this.formPanel.form.baseParams['id']=remoteModelId;
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
		this.addPermissionsPanel(new GO.grid.PermissionsPanel());
    }
  

});