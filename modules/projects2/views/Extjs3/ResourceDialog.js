/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ResourceDialog.js 21269 2016-03-22 16:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.ResourceDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

    template: false,
	
	initComponent: function() {
		var relatedIdField = this.relatedIdField = this.template?'template_id':'prioject_id';
		var controllerRoute = this.template?'projects2/defaultResource':'projects2/resource';
		
		Ext.apply(this, {
			//goDialogId: 'pm-resource',
			layout: 'fit',
			title: GO.projects2.lang['resource'],
			width: 500,
			height: 200,
			resizable: true,
			formControllerUrl: controllerRoute
		});

		GO.projects2.ResourceDialog.superclass.initComponent.call(this);
	},
	afterShowAndLoad : function(remoteModelId, config){
		if(this.selectTimeUser.store.baseParams[this.relatedIdField] != config.loadParams[this.relatedIdField]){
			this.selectTimeUser.store.baseParams[this.relatedIdField] = config.loadParams[this.relatedIdField];
			delete this.selectTimeUser.lastQuery;
		}
	},
	buildForm: function() {
        
		this.formPanel = new Ext.Panel({
			autoScroll:true,
			cls: 'go-form-panel',
			layout: 'form',
			labelWidth: 170,
			items: [
			this.selectTimeUser = new GO.form.ComboBox({
				hiddenName:'user_id',
				fieldLabel:GO.projects2.lang['employee'],
				//emptyText:GO.tickets.lang.nobody,
				valueField:'user_id',
				displayField:'name',
				listWidth: 300,
				store:new GO.data.JsonStore({
					url:GO.url('projects2/employee/store'),
					baseParams:{
						//project_id:0 //this.showConfig.values.project_id
					},
					fields:['user_id','name','internal_fee','external_fee']
				}),
				pageSize: parseInt(GO.settings['max_rows_list']),
				listeners:{
					scope:this,
					select:function(cb, record){
						this.formPanel.form.findField('external_fee').setValue(record.data.external_fee);
						this.formPanel.form.findField('internal_fee').setValue(record.data.internal_fee);
					}
				},
				mode: 'remote',
				reloadOnExpand: true,
				triggerAction:'all',
				editable:false,
				selectOnFocus:true,
				allowBlank:false
			}),{
			xtype: 'compositefield',
			fieldLabel: GO.projects2.lang['externalFee'],
			items: [
				{
					xtype: 'numberfield',
					width:80,
					name: 'external_fee'
				},{
					xtype: 'xcheckbox',
					boxLabel: GO.projects2.lang['applyOvertime'],
					name: 'apply_external_overtime'
				}
			]},{
			xtype: 'compositefield',
			fieldLabel: GO.projects2.lang['internalFee'],
			items: [
				{
					xtype: 'numberfield',
					width:80,
					name: 'internal_fee'
				},{
					xtype: 'xcheckbox',
					boxLabel: GO.projects2.lang['applyOvertime'],
					name: 'apply_internal_overtime'
				}
			]},{
				xtype: 'numberfield',
				fieldLabel: GO.projects2.lang['budgetedUnits'],
				name: 'budgeted_units',
				decimals: 0,
				allowBlank: false
			}
			]
		});

		this.addPanel(this.formPanel);
	}

});