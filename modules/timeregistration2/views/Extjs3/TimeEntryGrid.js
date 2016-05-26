/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TimeEntryGrid.js 20064 2014-12-12 08:49:30Z mdhart $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.TimeEntryGrid = Ext.extend(GO.grid.GridPanel,{

	newEntryDay: null, // The day that is set when clicking New entry button
	startTime: null, // The start timestamp of the selected timespan
	_weekIsClosed: false,

	initComponent : function(){

		var now = new Date();
		
		var store = new Ext.data.GroupingStore({
			url: GO.url('timeregistration2/timeEntry/store'),
			baseParams:{
				year:now.format('Y'), 
				week:'3'
			},
			sortInfo:{
				field: 'date',
				direction: "ASC"
			},
			id : 'id',
			reader: new Ext.data.JsonReader({
				root: 'results',
				totalProperty: 'total',
				id: 'id',
				fields:['id','units', 'start_time', 'end_time', 'date', 'comments', 'project_name', 'standard_task','task', 'status','status_id', 'day','travel_distance','duration']
			}),
			groupField:'day',
			remoteSort:true,
			remoteGroup:true
		});

		// group sumaries don't work with time
		this.summary = new Ext.grid.GroupSummary();
		this.totalSummary = new Ext.grid.JsonSummary();
		
		Ext.grid.GridSummary.Calculations.sumTime = function(v, record, field){
			return v+record.data.duration;
		};
			
		Ext.apply(this,{
			id: 'tr-entry-grid',
			plugins: [this.summary, this.totalSummary],
			cls:'go-white-bg',
			title: GO.projects2.lang.units,
			autoFill: true,
			editDialogClass: GO.projects2.TimeEntryDialog,
			tbar: [
			this.addEntryButton = new Ext.Button({
				text: GO.timeregistration2.lang['addEntry'],
				iconCls: 'btn-add',
				handler: function(){
					if(!this.editDialog){
						this.editDialog = new GO.projects2.TimeEntryDialog();
						this.editDialog.on('save', function(){
							this.store.reload();
						}, this);
					}
					this.editDialog.show(0,{
						loadParams: {
							start_time: this.startTime
							}
						});
			},
			scope: this
		}),this.deleteButton = new Ext.Button({
			iconCls: 'btn-delete',
			text: GO.lang['cmdDelete'],
			cls: 'x-btn-text-icon',
			handler: function(){
				this.deleteSelected();
			},
			scope: this
		}),this.closeButton = new Ext.Button({ //see setTimeSpan for handler
			text: GO.timeregistration2.lang['closeWeek'],
			iconCls: 'btn-permissions',
			scope: this
		}),
		this.weekIsClosedField = new GO.form.PlainField({
			value: '<span style="color:red;">'+GO.timeregistration2.lang['weekIsClosed']+'</span>',
			hideLabel: true,
			hidden: true
		})
//		this.approveButton = new Ext.Button({ //see setTimeSpan for handler
//			text: GO.timeregistration2.lang['approve'],
//			iconCls: 'btn-actions',
//			hidden: !GO.settings.modules.timeregistration2.write_permission,
//			scope: this
//		})
		],
		view: new Ext.grid.GroupingView({
			showGroupName: false,
			enableNoGroups:false, // REQUIRED!
			hideGroupedColumn: true,
			emptyText: GO.timeregistration2.lang.noHours
//			autoFill: true,
//			forceFit: true
		}),
		store: store,
		listeners:{
			show:function(){
				this.store.load();
			},
			rowcontextmenu: function(grid, index, event){
				if(GO.settings.modules.timeregistration2.write_permission) {
					if(!this.contextMenu){
						this.contextMenu = new Ext.menu.Menu({
							items: [{
								text: GO.timeregistration2.lang['approve'],
								handler: function() {
									GO.request({
										params:{
											ids: Ext.encode(grid.selModel.selections.keys)
										},
										url:"timeregistration2/timeEntry/approve",
										success: function(response, options, result){
											grid.store.reload();
										},
										scope:this
									});
								}
							}, {
								text: GO.timeregistration2.lang['disapprove'],
								handler: function() {
									GO.request({
										params:{
											ids: Ext.encode(grid.selModel.selections.keys)
										},
										url:"timeregistration2/timeEntry/disapprove",
										success: function(response, options, result){
											grid.store.reload();
										},
										scope:this
									});
								}
							}],
							scope: this
						});
					}
					event.stopEvent();
					this.contextMenu.showAt(event.xy);
				}
			}
		},
		cm:new Ext.grid.ColumnModel({
			columns:[
			{
				header:GO.lang['strStart'],
				dataIndex: 'start_time',
				width:60,
				align:'right',
				summaryRenderer:function(){
					return GO.lang.total;
				}
			},{
				header:GO.lang['strEnd'],
				dataIndex: 'end_time',
				width:60,
				align:'right'
			},{
				header:GO.timeregistration2.lang['duration'],
				dataIndex: 'units',
				width:60,
				align:'right',
				summaryType:'sumTime',
				summaryRenderer:function(v, meta, r){
					
					if (typeof v =='string' && v.indexOf(':')!=-1) {
						return v;
					} else if (typeof v=='undefined') {
						return "0:00";
					}
					
					var hours = Math.floor(v/60);
					
					var mod = v % 60;
					
					var mins = mod+"";
					
					if(mins.length==1)
						mins = "0"+mins;
					
					return hours+":"+mins;
					
				}
			},{
				header:GO.projects2.lang.project,
				dataIndex: 'project_name',
				width:300,
				id:'project',
				renderer:function(v, meta, r){
					if(v!=null)
						return v+'<p class="pm-hours-comments" style="padding-left:0px;">'+r.data.comments+'</p>';
					else
						return "";
				}
			},{
				header:GO.projects2.lang['task'],
				width:200,
				dataIndex: 'task'
			},{
				header:GO.projects2.lang['activity'],
				width:150,
				dataIndex: 'standard_task'
			},{
				header:GO.lang['strStatus'],
				dataIndex: 'status'
			},{
				header:GO.lang.strDay,
				dataIndex: 'day'
			},{
				header:GO.projects2.lang.travelDistance,
				dataIndex: 'travel_distance'
			},{
				header:GO.projects2.lang.comments,
				dataIndex: 'comments',
				hidden:true
			}]
		})
		});
		
		
		if(GO.leavedays){
			
			this.tbar.splice(1,0,this.addLeavedayButton = new Ext.Button({
					text: GO.leavedays.lang['addHoliday'],
					iconCls: 'btn-add',
					handler: function(){					
						
						GO.mainLayout.openModule('leavedays');
						GO.leavedays.showLeavedayDialog();
					},				
					scope: this
				})
			);
			

		}
		
		
	this.store.on('load',function(store,records,options){
		this._weekIsClosed = store.reader.jsonData['is_closed_week'];
		this.closeButton.setDisabled(this._weekIsClosed);
		this.closeButton.setVisible(!this._weekIsClosed);
		this.addEntryButton.setDisabled(this._weekIsClosed);
		this.addEntryButton.setVisible(!this._weekIsClosed);
		this.deleteButton.setDisabled(this._weekIsClosed);
		this.deleteButton.setVisible(!this._weekIsClosed);
		if (this.addLeavedayButton) {
			this.addLeavedayButton.setDisabled(this._weekIsClosed);
			this.addLeavedayButton.setVisible(!this._weekIsClosed);
		}
		this.weekIsClosedField.setVisible(this._weekIsClosed);
	},this);
		
	GO.timeregistration2.TimeEntryGrid.superclass.initComponent.call(this);

},
setTimeSpan : function(timespan) {
	if(timespan=="week"){
		this.closeButton.setText(GO.timeregistration2.lang['closeWeek']);
		this.closeButton.setHandler(function(){
			GO.request({
				params:{ 
					year: this.store.baseParams['year'] ,
					week : this.store.baseParams['week'] 
				},
				url:"timeregistration2/week/close",
				success: function(response, options, result){
					this.store.reload();
					this.mainPanel.weekGrid.store.reload();
					alert(GO.timeregistration2.lang['weekClosed']);
				},
				scope:this
			});
		},this);
		
		this.mainPanel.printButton.setHandler(function(){
			window.open(GO.url('timeregistration2/week/print', {
				'week': this.store.baseParams['week'], 
				'year': this.store.baseParams['year']
				}));
		},this);
		
//		this.approveButton.setHandler(function(){
//			GO.request({
//				params:{ 
//					year: this.store.baseParams['year'] ,
//					week : this.store.baseParams['week'] 
//				},
//				url:"timeregistration2/week/approve",
//				success: function(response, options, result){
//					this.store.reload();
//					this.mainPanel.monthGrid.store.reload();
//					alert(GO.timeregistration2.lang['aprovedAllClosed']);
//				},
//				scope:this
//			});
//		},this);
	}
	else {
		this.closeButton.setText(GO.timeregistration2.lang['closeMonth']);
		this.closeButton.setHandler(function(){
			GO.request({
				params:{ 
					year: this.store.baseParams['year'] ,
					month : this.store.baseParams['month'] 
				},
				url:"timeregistration2/month/close",
				success: function(response, options, result){
					this.store.reload();
					alert(GO.timeregistration2.lang['monthClosed']);
				},
				scope:this
			});
		},this);
		
		this.mainPanel.printButton.setHandler(function(){
			window.open(GO.url('timeregistration2/month/print', {
				'month': this.store.baseParams['month'], 
				'year': this.store.baseParams['year']
				}));
		},this);
		
//		this.approveButton.setHandler(function(){
//			GO.request({
//				params:{ 
//					year: this.store.baseParams['year'] ,
//					month : this.store.baseParams['month'] 
//				},
//				url:"timeregistration2/month/approve",
//				success: function(response, options, result){
//					this.store.reload();
//					alert(GO.timeregistration2.lang['aprovedAllClosed']);
//				},
//				scope:this
//			});
//		},this);
	}
},
/**
	 * This function is called by the MonthGrd or WeekGrid
	 * It will change and reload the store and display correct time entries
	 */
loadEntries : function(timespan, key, yearnb) {
	this.setTimeSpan(timespan);
	this.store.baseParams = {
		'year': yearnb
	};
	this.store.baseParams[timespan] = key;
	this.store.reload();
},

	showEditDialog : function(id, config, record){
		if (!this._weekIsClosed || record.data.status_id==2) {
			GO.timeregistration2.TimeEntryGrid.superclass.showEditDialog.call(this,id,config,record);
		} else {
			alert(GO.timeregistration2.lang['weekIsClosed']);
		}
	}	
});