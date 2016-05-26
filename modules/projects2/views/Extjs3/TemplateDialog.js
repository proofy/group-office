/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * This is the dialog that shows up when double clicking a template
 * Was converted to a TabbedFormDialog at Nov 14 2012
 *
 * @version $Id: TemplateDialog.js 21269 2016-03-22 16:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.TemplateDialog = Ext.extend(GO.dialog.TabbedFormDialog, {
	initComponent: function() {

		Ext.apply(this, {
			goDialogId: 'pm-template-dialog',
			layout: 'fit',
			title: GO.projects2.lang.template,
			width: 700,
			height: 500,
			resizable: false,
			formControllerUrl: 'projects2/template'
		});

		GO.projects2.TemplateDialog.superclass.initComponent.call(this);
	},
	buildForm: function() {

		this.fieldsPanel = {
			xtype: 'checkboxgroup',
			fieldLabel: GO.projects2.lang.enabledFields,
			columns: 3,
			items:[{
				name:'fields[responsible_user_id]',
				boxLabel:GO.projects2.lang.projectManager
			},{
				name:'fields[customer]',
				boxLabel:GO.lang.customer
			},{
				name:'fields[contact]',
				boxLabel:GO.projects2.lang.contact
			},{
				name:'fields[date]',
				boxLabel:GO.lang['date']
			},{
				name:'fields[status]',
				boxLabel:GO.projects2.lang.status
			},{
				name:'fields[budget_fees]',
				boxLabel:GO.projects2.lang.budgetAndFees
			},{
				name:'fields[expenses]',
				boxLabel:GO.projects2.lang.expenses
			},{
				name:'fields[default_distance]',
				boxLabel:GO.projects2.lang.defaultDistance
			},{
				name:'fields[travel_costs]',
				boxLabel:GO.projects2.lang.travelCosts
			},{
				name:'fields[income]',
				boxLabel:GO.projects2.lang.income
			},{
				name: 'fields[tasks_panel]',
				boxLabel:GO.projects2.lang['useTasksPanel']
			},{
				name: 'fields[reference_no]',
				boxLabel:GO.projects2.lang['referenceNo']
			},{
				name: 'fields[std_task_required]',
				boxLabel:GO.projects2.lang['stdTaskRequired']
			},{
				name: 'fields[show_subproject_totals]',
				boxLabel:GO.projects2.lang['showSubprojectAmountTotals']
			}]
		};
		


		//Define the Properties tab
	
		this.propertiesPanel = new Ext.Panel({
			title: GO.lang['strProperties'],
			cls: 'go-form-panel',
			layout: 'form',
			autoScroll: true,
			items: [{
				xtype: 'textfield',
				name: 'name',
				anchor: '-20',
				fieldLabel: GO.lang.strName
			}, {
				xtype: 'combo',
				fieldLabel: GO.lang['strType'],
				hiddenName: 'project_type',
				store: new Ext.data.SimpleStore({
					fields: ['value', 'text'],
					data: [
					['0', GO.projects2.lang.container],
					['1', GO.projects2.lang.project]
					]
				}),
				value: '1',
				valueField: 'value',
				displayField: 'text',
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				selectOnFocus: true,
				forceSelection: true
			}, new GO.projects2.SelectStatus({
				anchor: '-20',
				fieldLabel: GO.projects2.lang.defaultStatus,
				hiddenName: 'default_status_id',
				allowBlank: false
			}), new GO.projects2.SelectType({
				anchor: '-20',
				fieldLabel: GO.projects2.lang.defaultPermissionType,
				hiddenName: 'default_type_id',
				emptyText:GO.projects2.lang.inheritPermissionType
			}),
			this.fieldsPanel]
		});

		if (GO.files)
		{
			this.propertiesPanel.add({
				xtype: 'selectfile',
				name: 'icon',
				anchor: '-20',
				fieldLabel: 'Icon (16x16px)',
				root_folder_id: GO.projects2.templateIconsFolderId
			});
			this.fileBrowseButton = new GO.files.FileBrowserButton({
				iconCls:'',
				model_name: "GO\\Projects2\\Model\\Template"
			});
			this.propertiesPanel.add(this.fileBrowseButton);
		} 
		
		this.propertiesPanel.add(this.useProjectNameTemplate = new  Ext.ux.form.XCheckbox({
			fieldLabel: GO.projects2.lang.enableFollowNumber,
			name: 'use_name_template',
			labelStyle:'margin:5px'
		}));
		
		this.propertiesPanel.add(this.projectNameTemplate = new Ext.form.TextField({
			fieldLabel: GO.projects2.lang.followNumberFormat,
			name: 'name_template',
			labelStyle:'margin:5px'
		}));		
		
		
		
		this.addPanel(this.propertiesPanel);

		this.templateEventsGrid = new GO.projects2.TemplateEventsGrid();
		this.addPanel(this.templateEventsGrid); // This is the default jobs grid
		
		this.defaultResourcesGrid = new GO.projects2.ResourceGrid({template:true});
		this.addPanel(this.defaultResourcesGrid);

		if(GO.customfields){
			this.disableTemplateCategoriesPanel = new GO.customfields.DisableCategoriesPanel({
				title:GO.customfields.lang.enabledCustomFields
			});
			this.addPanel(this.disableTemplateCategoriesPanel);        
		}

		this.readPermissionsTab = new GO.grid.PermissionsPanel({
			title : GO.lang['strReadPermissions'],
			hideLevel:true
		});
		this.addPanel(this.readPermissionsTab);
    
	},
        
	afterLoad : function(remoteModelId, config, action){
		if(GO.customfields){
			this.disableTemplateCategoriesPanel.setModel(remoteModelId, "GO\\Projects2\\Model\\Project");
		}
		this.templateEventsGrid.setTemplateID(remoteModelId);
	  
		this.readPermissionsTab.setAcl(action.result.data.acl_id);
		
		if(this.fileBrowseButton){
			this.fileBrowseButton.setId(remoteModelId);
		}
		
		if(this.defaultResourcesGrid){
			this.defaultResourcesGrid.setTemplateId(remoteModelId);
			this.defaultResourcesGrid.setDisabled(remoteModelId==0);
		}
		
	}

});