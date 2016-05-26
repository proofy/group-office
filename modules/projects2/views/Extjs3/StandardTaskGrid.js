/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: StandardTaskGrid.js 19445 2014-08-06 08:16:15Z wvbeusekom $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.StandardTaskGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		Ext.apply(this,{
			title:GO.projects2.lang.activityTypes,
			standardTbar:true,
//			view: new Ext.grid.GroupingView({
//				showGroupName: false,
//				enableNoGroups:false, // REQUIRED!
//				hideGroupedColumn: true,
//				emptyText: 'empty',
//				autoFill: true, 
//				forceFit: true ,
//				getRowClass : function(row, index) {	
//					if (row.data.disabled == '1') {
//						return 'go-grid-row-inactive';
//					} 
//				}
//			}),
			store: new GO.data.JsonStore({
				url:GO.url("projects2/standardTask/store"),
				fields:['id','code','name', 'description', 'units', 'disabled','is_billable'],
				remoteSort:true
			}),
			editDialogClass: GO.projects2.StandardTaskDialog,
			border: false,
			paging:true,
			listeners:{
				show:function(){
					this.store.load();
				},
				scope:this
			},
			cm:new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:[
				{
					header: GO.projects2.lang['code'],
					dataIndex: 'code',
					width: 40
				},{
					header: GO.lang.strName,
					dataIndex: 'name'
				},{
					header: GO.lang.strDescription,
					dataIndex: 'description',
					renderer: function(value){
						return value.replace(/<br[^>]*>/gi," "); //hide those newlines in the grid
					}
				},{
					header: GO.projects2.lang['defaultDuration'],
					dataIndex: 'units',
					width: 40,
					align:'right'
				},{
					header: GO.projects2.lang['isBillable'],
					dataIndex: 'is_billable',
					width: 40,
					renderer: function(value) {
						return value ? GO.lang['cmdYes'] : GO.lang['cmdNo'];
					}
				}
				]
			})
		});
		
		GO.projects2.StandardTaskGrid.superclass.initComponent.call(this);		
	}
});