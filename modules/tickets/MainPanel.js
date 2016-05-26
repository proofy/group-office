/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: MainPanel.js 21406 2016-05-25 09:37:17Z mschering $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.MainPanel = function(config){

	config = config || {};
	
	this.centerPanel = GO.tickets.ticketsGrid = new GO.tickets.TicketsGrid({
//		title: GO.tickets.lang.tickets,
		region:'center',
		id:'ti-tickets-grid',
		border:true,
		resizable:false,
		deleteConfig:{
			scope:this,
			success:function(){
				//refresh statuses
				GO.tickets.statusesStore.load();
			}
		}
	});
		
	this.centerPanel.store.on('load',function(){
		GO.tickets.totalUnseen=this.centerPanel.store.reader.jsonData.unseen;
		}, this);
	
	this.typesGrid = GO.tickets.typesGrid = new GO.tickets.TypesGrid({
		relatedStore: this.centerPanel.store,
		region:'north',
		id:'ti-types-panel'
	});
	
	this.typesGrid.on('change', function(filterGrid, statuses, records)
	{
		this.filterPanel.store.reload();
	}, this);
	
	this.filterPanel = GO.tickets.filterPanel = new GO.tickets.TicketsFilterGrid({
		region:'center',
		id:'ti-filter-panel',
		title: GO.tickets.lang.statuses,
		store:GO.tickets.statusesStore,
		relatedStore: this.centerPanel.store,
		autoLoadRelatedStore:false,
		border:true,
		loadMask:true,
		allowNoSelection:true,
		split:true
	});
		
	var westPanel = new Ext.Panel({
		region:'west',
		layout:'border',
		id:'ti-west-panel',
		border:false,
		split:true,
		width:230,
		items:[this.typesGrid, this.filterPanel]
	});
	
	this.typesGrid.on('rowclick', function(grid, rowIndex)
	{
		this.centerPanel.selModel.clearSelections();
		this.eastPanel.reset();
		
	}, this);
	

	
	this.centerPanel.on("delayedrowselect",function(grid, rowIndex, r)
	{
		this.eastPanel.load(r.get('id'));
	}, this);

	this.centerPanel.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);
		if(record.data.level==GO.permissionLevels.manage)
			GO.tickets.showTicketDialog(record.id);
	}, this);
				
	this.eastPanel = new GO.tickets.TicketPanel({
		region:'east',
		id:'ti-ticket-panel',
		mf_id:'ti-message-form',
		mp_id:'ti-message-panel',
		width:500
//		title:GO.tickets.lang.ticket
	});

	var tbarItems = [{
		xtype:'htmlcomponent',
		html:GO.tickets.lang.name,
		cls:'go-module-title-tbar'
	},
	{
			grid: this.centerPanel,
			xtype:'addbutton',
			handler: function(b){
				this.eastPanel.reset();
				GO.tickets.showTicketDialog(0, {
					loadParams:{
						type_id: b.buttonParams.id						
					}
				});
			},
			scope: this
		},
		{
			iconCls: 'btn-refresh',
			text: GO.lang['cmdRefresh'],
			cls: 'x-btn-text-icon',
			handler: function(){
				this.refresh();
			},
			scope: this
		}];
					
	
	if(GO.settings.modules.tickets.write_permission){
		tbarItems.push(
			"-",
			{
				grid: this.centerPanel,
				xtype:'deletebutton',
				handler: function()
				{
					this.centerPanel.deleteSelected();
				},
				scope: this
			});
	
		tbarItems.push({
			iconCls: 'btn-report',
			text: GO.lang['report'],
			cls: 'x-btn-text-icon',
			menu:[{
				text:GO.tickets.lang['solvedTickets'],
				handler:function() {
					if(!this.reportSolvedDialog)
						this.reportSolvedDialog = new GO.tickets.ReportSolvedDialog();
					this.reportSolvedDialog.show();
				},
				scope: this
			},{
				text:GO.tickets.lang['averageSolvingTime'],
				handler:function() {
					if(!this.reportSolvingTimeDialog)
						this.reportSolvingTimeDialog = new GO.tickets.ReportSolvingTimeDialog();
					this.reportSolvingTimeDialog.show();
				},
				scope: this
			},{
				text:GO.tickets.lang['averageResponseTime'],
				handler:function() {
					if(!this.reportResponseTimeDialog)
						this.reportResponseTimeDialog = new GO.tickets.ReportResponseTimeDialog();
					this.reportResponseTimeDialog.show();
				},
				scope: this
			},{
				text:GO.tickets.lang['currentTickets'],
				handler:function() {
					if(!this.reportCurrentTicketsDialog)
						this.reportCurrentTicketsDialog = new GO.tickets.ReportCurrentTicketsDialog();
					this.reportCurrentTicketsDialog.show();
				},
				scope: this
			},{
				text:GO.tickets.lang['closedTicketsInMonth'],
				handler:function() {
					if(!this.reportClosedInMonthDialog)
						this.reportClosedInMonthDialog = new GO.tickets.ReportClosedInMonthDialog();
					this.reportClosedInMonthDialog.show();
				},
				scope: this
			},{
				text:GO.tickets.lang['byType'],
				handler:function() {
					if(!this.reportByTypeDialog)
						this.reportByTypeDialog = new GO.tickets.ReportByTypeDialog();
					this.reportByTypeDialog.show();
				},
				scope: this
			},{
				text:GO.tickets.lang['createdTicketsInMonth'],
				handler:function() {
					if(!this.reportCreatedInMonthDialog)
						this.reportCreatedInMonthDialog = new GO.tickets.ReportCreatedInMonthDialog();
					this.reportCreatedInMonthDialog.show();
				},
				scope: this
			},{
				text:GO.tickets.lang['createdTicketsInYearPerWeek'],
				handler:function() {
					if(!this.reportCreatedInYearWeekDialog)
						this.reportCreatedInYearWeekDialog = new GO.tickets.ReportCreatedInYearWeekDialog();
					this.reportCreatedInYearWeekDialog.show();
				},
				scope: this
			}]
		});
	}
	
	this.exportMenu = new GO.base.ExportMenu({className: 'GO\\Tickets\\Export\\CurrentGrid'});


this.exportMenu.setColumnModel(this.centerPanel.getColumnModel());

//Only show the export button when the user has manage permissions.
if(GO.settings.modules.tickets.permission_level >= GO.permissionLevels.manage){
	
	var csvWithRatesExport = new Ext.menu.Item({
				text:GO.tickets.lang.csvWithRates,
				handler:function(){
					if(!this.exportCsvDialog){
						
						var now = new Date();
						var lastMonth = now.add(Date.MONTH, -1);
						var startOfLastMonth = lastMonth.getFirstDateOfMonth();
						var endOfLastMonth = lastMonth.getLastDateOfMonth();

						var startDate = new Ext.form.DateField({
							name: 'start_time',
							format: GO.settings['date_format'],
							allowBlank:true,
							fieldLabel: GO.lang.strStart,
							value: startOfLastMonth.format(GO.settings.date_format)
						});

						var endDate = new Ext.form.DateField({
							name: 'end_time',
							format: GO.settings['date_format'],
							allowBlank:true,
							fieldLabel: GO.lang.strEnd,
							value: endOfLastMonth.format(GO.settings.date_format)
						});
						
						this.exportCsvDialog = new GO.dialog.ExportDialog({
							title:GO.tickets.lang.csvWithRates,
							exportController:'tickets/exportCsv',
							formConfig:{
								labelAlign:'top'
							},
							formItems:[
								startDate,
								endDate								
							]
						});
					}
					
					this.exportCsvDialog.show();
				}
	});
	
	this.exportMenu.insertItem(0,csvWithRatesExport);
}

tbarItems.push(this.exportMenu);

	if(GO.settings.modules.tickets.write_permission){
		tbarItems.push( this.settingsButton = new Ext.Button({
			iconCls: 'btn-settings',
			text: GO.lang.administration,
			cls: 'x-btn-text-icon',

			handler: function()
			{
				if(!this.settingsDialog)
				{
					this.settingsDialog = new GO.tickets.SettingsDialog();
					this.settingsDialog.on('update_statuses', function()
					{
						GO.tickets.statusesStore.load();
					}, this);
					this.settingsDialog.on('update_templates', function()
					{
						GO.tickets.templatesStore.load();
					}, this);
				}
				this.settingsDialog.show();
			},
			scope: this
		}));
		

		if(GO.billing){
			tbarItems.push('-',{
				iconCls:'btn-add',
				text:GO.tickets.lang.bill,
				handler:function(){
					if(!GO.tickets.invoiceDialog)
					{
						GO.tickets.invoiceDialog= new GO.tickets.InvoiceDialog({
							listeners:{
								invoice:function(){
									this.refresh();
								},
								scope:this
							}
						});
					}
					GO.tickets.invoiceDialog.show();
				},
				scope:this
			});
		}
	}

	config.tbar=new Ext.Toolbar({
		cls:'go-head-tb',
		items: tbarItems
	});
	
	config.items=[
	westPanel,
	{
		border:false,
		region:'center',
		titlebar: false,
		layout:'border',
		items: [this.centerPanel,this.eastPanel]
	}
	];   
		
	config.layout='border';
			
	GO.tickets.MainPanel.superclass.constructor.call(this, config);

}

Ext.extend(GO.tickets.MainPanel, Ext.Panel,{
	onShow : function(){
		this.refresh(true);
		//GO.tickets.notificationEl.setDisplayed(false);
		GO.tickets.MainPanel.superclass.onShow.call(this);
	},

	statuses: '',

	refresh : function(dontRefreshTickerPanel){
		GO.tickets.statusesStore.load();
		this.centerPanel.store.load();
		if(!dontRefreshTickerPanel)
			this.eastPanel.reload();
	},
	
	afterRender : function()
	{
		GO.tickets.MainPanel.superclass.afterRender.call(this);

		//GO.tickets.notificationEl.setDisplayed(false);

		GO.tickets.mainPanel = this;

		GO.dialogListeners.add('ticket',{
			scope:this,
			save:function(e, ticket_id){			
				this.refresh(true);
			}
		});

		this.typesGrid.store.load();
		this.refresh();
	}
});

//do this when Group-Office is fully rendered
GO.mainLayout.onReady(function(){
	
	//create notification icon in the top bar
//	var notificationArea = Ext.get('notification-area');
//	if(notificationArea)
//	{
//		GO.tickets.notificationEl = notificationArea.createChild({
//			id: 'ti-notify',
//			tag:'a',
//			href:'#',
//			style:'display:none'
//		});
//		GO.tickets.notificationEl.on('click', function(){
//			GO.mainLayout.openModule('tickets');
//		}, this);
//	}
	
	//register a new request to the checker. It will poll unseen tickets every two minutes
  GO.checker.registerRequest("tickets/ticket/unseen",{},function(checker, data){
	
	//get the mainpanel of the tickets module
	var tp = GO.mainLayout.getModulePanel('tickets');
	
	//compare the last unseen valie to the new unseen value
	if(data.tickets.unseen!=GO.tickets.totalUnseen && data.tickets.unseen>0)
	{
		//set the notificationEl 
//		if(!tp || !tp.isVisible())
//			GO.tickets.notificationEl.setDisplayed(true);
		
		//refresh tickets grid
		if(tp && tp.isVisible())
			tp.refresh();
	}

	//set the unseen count
//	GO.tickets.notificationEl.update(data.tickets.unseen);			
	GO.mainLayout.setNotification('tickets',data.tickets.unseen,'orange');
	GO.tickets.totalUnseen=data.tickets.unseen;		
  },this);
});

	

GO.tickets.showTicketDialog = function(ticket_id, config){

	if(!GO.tickets.ticketDialog) {
		GO.tickets.ticketDialog = new GO.tickets.TicketDialog();
//		if (GO.addressbook && GO.settings.modules.tickets.write_permission) {
//			GO.tickets.ticketDialog.on('save',function(dialog,ticket_id,refresh){
//				GO.moduleManager.getPanel('tickets').eastPanel.setCompanyId(dialog.formPanel.baseParams.company_id);
//			},this);
//		}
	}

	GO.tickets.ticketDialog.show(ticket_id, config);
}

GO.moduleManager.addModule('tickets', GO.tickets.MainPanel, 
{
	title : GO.tickets.lang.tickets,
	iconCls : 'go-tab-icon-tickets'
});

/*
 * If your module has a linkable item, you should add a link handler like this. 
 * The index (no. 1 in this case) should be a unique identifier of your item.
 * See classes/base/links.class.inc for an overview.
 * 
 * Basically this function opens a project window when a user clicks on it from a 
 * panel with links. 
 */
GO.linkHandlers["GO\\Tickets\\Model\\Ticket"]=function(ticket_id)
{
	if(!GO.tickets.linkWindow){
		var ticketPanel = new GO.tickets.TicketPanel({
			id:'ti-ticket-panel-link',
			mf_id:'ti-message-form-link',
			mp_id:'ti-message-panel-link'
		});
		GO.tickets.linkWindow = new GO.LinkViewWindow({
			title: GO.tickets.lang.ticket,
			items: ticketPanel,
			ticketPanel: ticketPanel,
			closeAction:'hide'
		});		
	}

  GO.tickets.linkWindow.ticketPanel.load(ticket_id);
	GO.tickets.linkWindow.show();
	return GO.tickets.linkWindow;
}

GO.tickets.showTicket=GO.linkHandlers["GO\\Tickets\\Model\\Ticket"].createSequence(function(){
	GO.mainLayout.openModule('tickets');
});

GO.linkPreviewPanels["GO\\Tickets\\Model\\Ticket"]=function(config){
	config = config || {};
	return new GO.tickets.TicketPanel(config);
}

/* {LINKHANDLERS} */

GO.newMenuItems.push({
	text: GO.tickets.lang.ticket,
	iconCls: 'go-model-icon-GO_Tickets_Model_Ticket',
	handler:function(item, e)
	{
		if(!GO.tickets.ticketDialog)
			GO.tickets.ticketDialog = new GO.tickets.TicketDialog();
			
		GO.tickets.ticketDialog.formPanel.form.setValues({
			type_id: ""
		});
		GO.tickets.showTicketDialog(0, {
			link_config: item.parentMenu.link_config
		});
	}
});
/* {NEWMENUITEMS} */