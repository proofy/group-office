/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: EmployeeGrid.js 17032 2013-10-13 09:20:48Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.EmployeeGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		Ext.apply(this,{
			title:GO.projects2.lang['employees'],
			noDelete: true,
			standardTbar:false,
			store: new GO.data.JsonStore({
				url:GO.url("timeregistration2/employee/store"),
				fields:['id','name', 'closed_entries_time']
			}),
            editDialogClass: GO.timeregistration2.EmployeeDialog,
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
                    hidden: true,
					header: 'id', 
					dataIndex: 'id'
				},{
					header: GO.lang.strName, 
					dataIndex: 'name'
				},{
					header: GO.projects2.lang['entriesClosedTill'], 
					dataIndex: 'closed_entries_time'
				}
				]
			})
		});
		
		GO.timeregistration2.EmployeeGrid.superclass.initComponent.call(this);		
	}
});