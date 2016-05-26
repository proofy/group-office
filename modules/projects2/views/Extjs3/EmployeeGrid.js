/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: EmployeeGrid.js 17837 2014-01-17 14:29:56Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.EmployeeGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		Ext.apply(this,{
			title:GO.projects2.lang['employees'],
			noDelete: true,
			standardTbar:true,
			store: new GO.data.JsonStore({
				id:'user_id',
				url:GO.url("projects2/employee/store"),
				fields:['user_id','name', 'closed_entries_time','external_fee','internal_fee']
			}),
			editDialogClass: GO.projects2.EmployeeDialog,
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
					header: GO.lang.strName, 
					dataIndex: 'name'
				},{
					header: GO.projects2.lang['externalFee'], 
					dataIndex: 'external_fee'
				},{
					header: GO.projects2.lang['internalFee'], 
					dataIndex: 'internal_fee'
				},{
					header: GO.projects2.lang['entriesClosedTill'], 
					dataIndex: 'closed_entries_time'
				}
				]
			})
		});
		
		GO.projects2.EmployeeGrid.superclass.initComponent.call(this);		
	}
});