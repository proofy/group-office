/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TimeEntryGrid.js 20003 2014-11-24 12:52:50Z wsmits $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.TimeEntryGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		
		var cols = [];
			
		cols.push({	dataIndex: 'is_invoiced',	renderer: function(v,m,r) { 
				if(r.data.is_invoiced){
					return '<div title="'+GO.projects2.lang['invoiced']+'" class="tasks-complete-icon"></div>';
				}
			}, width: 10
		});

		cols.push({	header: GO.lang.strUser, dataIndex: 'user_id'	});
		cols.push({ header: GO.lang.strDate, dataIndex: 'date' });
		cols.push({ header: GO.lang.strDescription,dataIndex: 'comments' });
		cols.push({ header: GO.projects2.lang['task'], width:150, dataIndex: 'task' });
		cols.push({ header: GO.projects2.lang['activity'],	width:150, dataIndex: 'standard_task' });
		
		if(GO.projects2.has_finance_permission){
			cols.push({ header: GO.projects2.lang['externalFee'], dataIndex: 'external_fee', align:'right' });
			cols.push({ header: GO.projects2.lang['internalFee'], dataIndex: 'internal_fee', align:'right' });
		}
		
		cols.push({ header: GO.projects2.lang['duration'], dataIndex: 'units', align:'right' });	
		cols.push({ header: GO.projects2.lang['travelDistance'], dataIndex: 'travel_distance',	align:'right' });
		
		if(GO.projects2.has_finance_permission){
			cols.push({ header: GO.projects2.lang['travel_costs'], dataIndex: 'travel_costs',	align:'right' });
		}

		var colModel = new Ext.grid.ColumnModel({
			defaults:{
				sortable:true
			},
			columns:cols
		});
		
		this.summary = new Ext.grid.JsonSummary();

		Ext.apply(this,{

			plugins: this.summary,
			title:GO.projects2.lang['timeEntries'],
			standardTbar:true,
			tbar:[
				new GO.base.ExportMenu({className:'GO\\Timeregistration2\\Export\\CurrentGrid'}),
//				{
//				iconCls: 'btn-export',
//				text: GO.lang.cmdExport,
//				cls: 'x-btn-text-icon',
//				handler:function(){
//					if(!this.exportGridDlg){
//						this.exportGridDlg = new GO.ExportGridDialog({
//							url: 'projects2/timeEntry/export',
//							name: 'timeentries',
//							documentTitle: GO.projects2.lang['timeEntries'],
//							colModel: colModel							
//						});
//					}
//					
//					this.exportGridDlg.params={};
//					Ext.apply(this.exportGridDlg.params,this.store.baseParams);
//					Ext.apply(this.exportGridDlg.params,this.store.lastOptions.params);
//
//					this.exportGridDlg.show();
//				},
//				scope:this
//			}
			],
			store: new GO.data.JsonStore({
				url:GO.url("projects2/timeEntry/store"),
				model:"GO\\Projects2\\Model\\TimeEntry",
				remoteSort: true,
				fields:['user_id','project_name', 'comments','is_invoiced', 'external_fee','internal_fee', 'date','units','task','standard_task','travel_costs','travel_distance']
			}),
			editDialogClass: GO.projects2.TimeEntryDialog,
			border: false,
			paging:true, //page size of paging
			listeners:{
				show:function(){
					this.store.load();
				},
				scope:this
			},
			cm:colModel
		});
		
		GO.projects2.TimeEntryGrid.superclass.initComponent.call(this);		
	},
  
	btnAdd : function(){
		if(this.editDialogClass){
			this.showEditDialog(null, {
				loadParams: {
					'project_id' : this.store.baseParams.project_id
				}
			});
	}
},
  
setProjectId : function(project_id){
	this.store.baseParams.project_id=project_id;
	this.setDisabled(GO.util.empty(project_id));
}
});