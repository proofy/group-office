/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ApprovalGrid.js 21269 2016-03-22 16:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.hoursapproval2.ApprovalGrid = Ext.extend(GO.grid.GridPanel,{

	weekgrid: null,

	initComponent : function(){ 
		
		
		var summary = new Ext.grid.GroupSummary();
		this.totalSummary = new Ext.grid.JsonSummary();
		
		Ext.apply(this,{
//			disableSelection:true,
			plugins:[summary,this.totalSummary],
			id: 'ha2-approve-grid',
			cls: 'go-white-bg',
			tbar: [{
					text:GO.hoursapproval2.lang.approve,
					handler:function(b){
						this.approve(true);
					},
					scope:this
				},{
					text:GO.hoursapproval2.lang.disapprove,
					handler:function(b){
						if(!this.disapproveDialog) {
							this.disapproveDialog = new GO.hoursapproval2.DisapproveDialog({});
						}
						var selectedRows = this.selModel.getSelections();
						var ids = [];
						for(var i=0;i<selectedRows.length;i++) {
							ids.push(selectedRows[i].id);
						}
						this.disapproveDialog.show(null, {list:ids});
					},
					scope:this
				}
			],
			loadMask: true,
			store: new Ext.data.GroupingStore({
				url : GO.url('hoursapproval2/approve/store'),
				baseParams : {
					year : '',
					week : ''
				},
//				sortInfo:{field: 'user_name', direction: "ASC"},
				id : 'id',
				reader:new Ext.data.JsonReader({
					root: 'results',
					totalProperty: 'total',
					id: 'id',
					fields : ['id', 'user_name', 'day','hours', 'project_name', 'task_name', 'user_id','duration', 'status', 'statusText','comments','activity_type_name']
				}),
				groupField:'user_name',
				remoteSort:true,
				remoteGroup:true
			}),
			cm: new Ext.grid.ColumnModel({
				columns:[{
					header : GO.projects2.lang['status'],
					dataIndex : 'statusText',
					width : 100,
					renderer:function(v, meta, record){
						switch(record.get('status')){
							case 2:
								meta.css='go-icon-cross';
							break;

							case 1:
								meta.css='go-icon-ok';
							break;
//							case 0:
//							case 3:
//								meta.css='go-icon-empty';
//							break;
							default:
								meta.css='go-icon-unknown';
								break;
						}

						return v;
					},
					summaryRenderer:function(){
						return GO.lang.total;
					}
				},{
					header : GO.lang['date'],
					dataIndex : 'day',
					width:150
				},{
					header : GO.timeregistration2.lang['duration'],
					dataIndex : 'hours',
					summaryType:'sum',
					width:80,
					summaryRenderer:function(v, meta, r){
						return v;
					}
				}, {
					header : GO.lang.strUser,
					dataIndex : 'user_name',
					width:200
				},{
					header : GO.projects2.lang['project'],
					dataIndex : 'project_name',
					width:200
				},{
					header : GO.projects2.lang['task'],
					dataIndex : 'task_name',
					width:200
				},{
					header : GO.projects2.lang['activityType'],
					dataIndex : 'activity_type_name',
					width:200
				}]
			}),
			view: new Ext.grid.GroupingView({
				showGroupName: false,
				enableNoGroups:false, // REQUIRED!
				hideGroupedColumn: true,
				emptyText: GO.timeregistration2.lang.noHours,
				enableRowBody:true,
				showPreview:true,
				getRowClass : function(record, rowIndex, p, store){
						if(this.showPreview){
								p.body = '<p class="go-row-body">'+record.data.comments+'</p>';
								return 'x-grid3-row-expanded';
						}
						return 'x-grid3-row-collapsed';
				}
			})
		});
		
		GO.hoursapproval2.ApprovalGrid.superclass.initComponent.call(this);
	},
	
	approve: function(approve) {
		var url = (approve) ? 'hoursapproval2/approve/approve' : 'hoursapproval2/approve/disapprove';
		
		var selectedRows = this.selModel.getSelections();
		var ids = [];
		for(var i=0;i<selectedRows.length;i++) {
			ids.push(selectedRows[i].id);
		}
		GO.request({
			url: url,
			params:{ ids:Ext.encode(ids) },
			callback:function(){
				this.store.reload();
			},
			scope:this
		});
		this.weekgrid.selectedRecord = this.weekgrid.getSelectionModel().getSelected();
		this.weekgrid.store.reload();
	},

	setWeek : function(year, week){
		this.store.baseParams['year'] = year;
		this.store.baseParams['week'] = week;
		this.store.load();
	}
});