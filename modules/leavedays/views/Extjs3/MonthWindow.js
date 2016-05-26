/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: MonthWindow.js 21269 2016-03-22 16:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.leavedays.MonthWindow = Ext.extend(GO.Window,{
	
	tpl: null,
	
	initComponent : function(){
		
		var now = new Date();
		
		var fields = ['name'];
		for(var d = 0; d <= 30; d++){
			fields.push(d.toString());
		}
		
		var store = this.store = new GO.data.JsonStore({
			url: GO.url('leavedays/report/month'),
			id: 'id',
			baseParams: {
				month: now.getMonth(),
				year: now.getFullYear()
			},
			scope:this,
			fields: fields,
			remoteSort: true
		});
		
		

		this.tpl = new Ext.XTemplate(
			'<table cellspacing="0" class="monthReport x-grid3">',
			'<thead class="x-grid3-header">',
				'{[this.renderHeader()]}',
			'</thead>',
			'<tbody class="x-grid3-body">',
				'{[this.renderRows(values)]}',
			'</tbody>',
			'</table>',
			{
				month: now.getMonth(),
				year: now.getFullYear(),
				renderHeader : function() {
					var today = new Date(this.year,this.month,1),
						firstDay = new Date(today.getFullYear(), today.getMonth(), 1),
						lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

					var h2 = '<tr><th></th>',
						h3 = '<tr><th>'+GO.lang['strName']+'</th>',
						day = new Date(firstDay.getTime()), 
						firstWeekDay = day.getDay(); 
					for(; day <= lastDay; day.setDate(day.getDate() + 1)) {
						if(day.getDay() == 0) { //sunday
							h2 += '<th colspan="'+(7-(day.getDate()<7?firstWeekDay-1:0))+'">Week '+day.getWeekOfYear()+'</th>';
						}
						h3 += '<th style="text-align:center">'+day.getDate()+'</th>';
					}
					return h2+'</tr>'+h3+'</tr>';
				},
				renderRows : function(data) {
					
					var today = new Date(this.year,this.month,1),
						firstDay = new Date(today.getFullYear(), today.getMonth(), 1),
						lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
					
					var row = '',
						day, style = '';
					Ext.each(data, function(r) {
						row += '<tr class="x-grid3-row"><th>'+r['name']+'</th>';
						for(day = new Date(firstDay.getTime()); day <= lastDay; day.setDate(day.getDate() + 1)) {
							if(r[day.getDate()-1].id) {
								row += '<td style="background-color:#8bc34a;">';
							}
							else if(day.getDay() == 0 || day.getDay() == 6) //saturday or sunday
								row += '<td style="background-color:#eee;">';
							else
								row += '<td>';
							row += '&nbsp;</td>';
						}
						row +='</tr>';
					});
					return row;
				}
			}
		);

		Ext.apply(this,{
			frame:true,
			width:960,
			height:700,
			//autoHeight:true,
			collapsible:false,
			resizable: true,
			maximizable: true,
			layout:'fit',
			title:GO.leavedays.lang['monthReport']+ ' '+now.getFullYear(),
			tbar: [
				GO.leavedays.lang['month']+': ',
				{
					xtype: 'combo',
					displayField:'month',
					valueField:'id',
					hiddenValue:this.month,
					editable:false,
					readOnly:false,
					mode: 'local',
					triggerAction: 'all',
					store: new Ext.data.SimpleStore({
						fields : ['id', 'month'],
						data : [
							[0, GO.leavedays.lang["january"]],
							[1, GO.leavedays.lang["february"]],
							[2, GO.leavedays.lang["march"]],
							[3, GO.leavedays.lang["april"]],
							[4, GO.leavedays.lang["may"]],
							[5, GO.leavedays.lang["june"]],
							[6, GO.leavedays.lang["july"]],
							[7, GO.leavedays.lang["august"]],
							[8, GO.leavedays.lang["september"]],
							[9, GO.leavedays.lang["october"]],
							[10, GO.leavedays.lang["november"]],
							[11, GO.leavedays.lang["december"]]
						]
					}),
					listeners: {
						select: function(me, value) {
							this.tpl.month = value.data.id;
							store.baseParams['month'] = value.data.id;
							store.reload();
						},
						scope:this
					}
				},{
					text: GO.leavedays.lang['reload'],
					handler: function() {
						store.reload();
					}
				}
			],
			items: 
				new Ext.DataView({
					store: this.store,
					tpl: this.tpl,
					autoHeight:true,
					multiSelect: true,
					emptyText: GO.leavedays.lang['noHolidaysTaken']
				})
			
		});
		
		GO.leavedays.MonthWindow.superclass.initComponent.call(this);		
	},
	
	show : function(year) {
		
		
		this.store.baseParams['year'] = year;
		this.tpl.year = year;
		if(this.year != year || !this.store.loaded) {
			this.store.load();
		}
		this.setTitle(GO.leavedays.lang['monthReport']+ ' '+this.year);
		
		GO.leavedays.MonthWindow.superclass.show.call(this);
	}

});