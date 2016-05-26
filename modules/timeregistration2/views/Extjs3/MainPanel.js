/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: MainPanel.js 20762 2015-08-24 07:27:42Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.MainPanel = Ext.extend(Ext.Panel, {
  
	initComponent: function() {

		//Setup main top toolbar
		var toolbar = new Ext.Toolbar({		
			cls:'go-head-tb',
			items: [	
			{
				xtype:'htmlcomponent',
				html:GO.projects2.lang.timeTracking,
				cls:'go-module-title-tbar'
			},
//			{
//				iconCls:'btn-settings',
//				text:GO.lang.administration,
//				hidden: !GO.settings.modules.timeregistration2.write_permission,
//				handler:function(){
//					if(!this.settingsDialog)
//					{
//						this.settingsDialog = new GO.timeregistration2.SettingsDialog();
//					}
//					this.settingsDialog.show();
//				//var settingsDialog = new GO.timeregistration2.SettingsDialog();
//				//settingsDialog.show();
//				},
//				scope:this
//			},{
//				iconCls:'btn-actions',
//				text:GO.timeregistration2.lang['notifications'],
//				hidden: !GO.settings.modules.timeregistration2.write_permission,
//				handler:function(){
//					var notificationDialog = new GO.timeregistration2.NotificationDialog();
//					notificationDialog.show();
//				},
//				scope:this
//			},'-',
			this.selectUser = new GO.projects2.SelectEmployee({
				
				includeInactive:true,
				hidden: !GO.settings.modules.timeregistration2.write_permission,
				store:new GO.data.JsonStore({
					url:GO.url('projects2/employee/store'),
					fields:['user_id','name'],
					id:'user_id'
				}),
				valueField: 'user_id',
				listeners:{
					select:function(cb, r){
						GO.request({
							url: 'timeregistration2/settings/changeUser',
							params: {
								user_id: r.data.user_id
							},
							success: function(options, response, result) {
								if(this.timeEntryGrid.isVisible())
									this.timeEntryGrid.store.reload();						
								
								if(GO.leavedays){
									GO.leavedays.activeUserId=r.data.user_id;
								}
								
//								if(this.yearOverview.isVisible())
//									this.yearOverview.store.reload();
								
								if(this.weekGrid.isVisible())
									this.weekGrid.store.reload();
								if(this.monthGrid.isVisible())
									this.monthGrid.store.reload();
								
								GO.projects2.selectBookableProjectStore.load();
								
							},
							scope: this
						});
					},
					scope: this
				}
			})
			]
		}); 
		

		toolbar.add(GO.projects2.timerButton = new GO.projects2.TimerButton({
			startTime: GO.projects2.timerStartTime,
			listeners:{
				scope:this,
				beforestoptimer:function(btn){
					return confirm(GO.projects2.lang['timerSure']);
				}
	//			stoptimer:function(btn, elapsed, startTime){
	//				this.projectsView.projectPanel.addFromTimerMenuItem.setVisible(false);
	//			},
	//			starttimer:function(){
	//				this.projectsView.projectPanel.addFromTimerMenuItem.setVisible(true);
	//			}
			}
		}));
		
		
		this.exportMenu = new GO.base.ExportMenu({className:'GO\\Timeregistration2\\Export\\CurrentGrid'});		
		toolbar.add(this.exportMenu);
		
		this.printButton = new Ext.Button({
			iconCls: 'btn-print',
			text: GO.lang.cmdPrint,
			handler: function(){
				window.open(GO.url('timeregistration2/week/print', {
					'week': '15', 
					'year': '2013'
				}));
			},
			scope: this
		});
		
		toolbar.add(this.printButton);
		

		this.timeEntryGrid = new GO.timeregistration2.TimeEntryGrid({mainPanel: this});
//		this.yearOverview = new GO.timeregistration2.YearOverviewGrid();

		Ext.apply(this, {
			layout : 'border',
			collapsable: false,
			listeners:{
				scope:this,
				render:function(){
					this.weekGrid.store.load();
				}
			},
			items : [
			new Ext.TabPanel({
				id:'tr-west',
				region:'west',
				border:false,
				activeTab: 0,
				split:true,
				collapsible:false,
				width:200,
				items:[
				this.weekGrid = new GO.timeregistration2.WeekGrid({
					mainPanel: this
				}),
				this.monthGrid = new GO.timeregistration2.MonthGrid({
					mainPanel: this
				})
//				,
//				new GO.timeregistration2.YearGrid({
//					mainPanel: this
//				})

				
				
				]
			}),
			this.cardPanel = new Ext.Panel({
				id:'tr-center',
				region:'center',
				border:false,
				layout : 'card',
				collapsible:false,
				items: [
				this.timeEntryGrid
//				this.yearOverview
			
				]
			})
			],
			tbar : toolbar
		});

		GO.timeregistration2.MainPanel.superclass.initComponent.call(this);
	}
  
});

// This will add the module to the main tabpanel filled with all the modules
GO.moduleManager.addModule('timeregistration2', GO.timeregistration2.MainPanel, {
	title : GO.projects2.lang.timeTracking,  //Module name in startmenu
	iconCls : 'go-tab-icon-timeregistration2' //The css class with icon for startmenu
});