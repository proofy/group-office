/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: YearOverviewGrid.js 17032 2013-10-13 09:20:48Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.YearOverviewGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		var now = new Date();
		
		Ext.apply(this,{
			title: 'Overview ' + now.format('Y') + ' Workdays: ',
			store: new Ext.data.GroupingStore({
				url: GO.url('timeregistration2/year/overViewStore'),
				baseParams:{ year:now.format('Y')},
				sortInfo:{
					field: 'user_id',
					direction: "ASC"
				},
				//id : 'id',
				reader: new Ext.data.JsonReader({
				  root: 'results',
				  totalProperty: 'total',
				  //id: 'id',
				  fields:['user_id','month', 'hours', 'hours_worked', 'hours_absence','hours_leave', 'total_workdays','earned_leave_time', 'remaining_work_time']
				}),
				groupField:'user_id',
				remoteSort:true,
				remoteGroup:true
			}),
			listeners:{
				show:function(){
					this.store.load();
				},
				scope:this
			},
			cm:new Ext.grid.ColumnModel({
				defaults:{
				  sortable:false
				},
				columns:[
				{
					header:GO.lang['strMonth'],
					dataIndex: 'month',
					width: 40
				},{
					header:GO.timeregistration2.lang['totalWorkdays'],
					dataIndex: 'total_workdays',
					align: 'right',
					width: 40
				},{
					header:GO.timeregistration2.lang['remainingWorktime'],
					dataIndex: 'remaining_work_time',
					align: 'right',
					width: 40
				},{
					header:GO.timeregistration2.lang['hoursTotal'],
					dataIndex: 'hours',
					align: 'right',
					width: 40
				},{
					header:GO.timeregistration2.lang['hoursWorked'],
					dataIndex: 'hours_worked',
					align: 'right',
					width: 40
				},{
					header:GO.timeregistration2.lang['hoursAbsence'],
					dataIndex: 'hours_absence',
					align: 'right',
					width: 40
				},{
					header:GO.timeregistration2.lang['hoursLeft'],
					dataIndex: 'hours_leave',
					align: 'right',
					width: 40
				},{
					header:GO.timeregistration2.lang['earnedLeaveTime'],
					dataIndex: 'earned_leave_time',
					align: 'right',
					width: 40
				}]
			})
		});
		
		GO.timeregistration2.YearOverviewGrid.superclass.initComponent.call(this);

	},
	/**
	 * This function is called by the MonthGrd or WeekGrid
	 * It will change and reload the store and display correct time entries
	 */
	loadEntries : function(year) {
	  this.store.baseParams['year'] = year;
	  this.store.reload();
	}
});