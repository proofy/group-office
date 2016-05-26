/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TicketsGrid.js 21406 2016-05-25 09:37:17Z mschering $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.TicketsGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
//	config.title = GO.tickets.lang.tickets;
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.paging=true;
	config.noDelete = !GO.settings.modules.tickets.write_permission;

	var fields ={
		fields:['id','ticket_number','priority','priority_name','agent_id','agent_name','contact_name','subject','ctime','mtime','status','status_id','type','unseen','email','phone','company','level','late','type_id'],
		columns:[
		{
			header: '&nbsp;',
			id:'first_column',
			dataIndex: 'unseen',
			hideInExport:true,
			width:30,
			renderer : function(value, cell, record) {
				var str = '';

				if(value=='1')
				{
					str += '<div class="tickets-grid-icon btn-unseen ti-status-' + record.data.status_id  + '"></div>';
				}else
				{
					str += '<div class="tickets-grid-icon btn-seen ti-status-' + record.data.status_id  + '"></div>';
				}
				return str;
			}
		},{
			header: GO.tickets.lang.ticketId, 
			dataIndex: 'ticket_number',
			width:110,
			hidden:true
		},{
			header: GO.lang.strSubject, 
			dataIndex: 'subject',
			width:280
		},{
			header: GO.tickets.lang.status, 
			dataIndex: 'status',
			width:80
		},{
			header: GO.tickets.lang.type,
			dataIndex: 'type',
			hidden:true,
			width:110,
			groupable:true
		},{
			header: GO.tickets.lang.priority,
			dataIndex: 'priority_name',
			width:70,
			hidden:true
		},{
			id:'agent_name',
			header: GO.tickets.lang.agent,
			dataIndex: 'agent_name',
			width:150,
			sortable:true
		},{
			header: GO.tickets.lang['contact'],
			dataIndex: 'contact_name',
			width:150
		},{
			header: GO.lang['strCompany'],
			dataIndex: 'company',
			width:150,
			hidden:true
		},{
			header: GO.lang.strEmail,
			dataIndex: 'email',
			hidden:true,
			width:110
		},{
			header: GO.lang.strPhone,
			dataIndex: 'phone',
			hidden:true,
			width:110
		},{
			header: GO.lang.strCtime, 
			dataIndex: 'ctime',
			hidden:true,
			width:110
		},{
			header: GO.lang.strMtime, 
			dataIndex: 'mtime',			
			width:110
		}
		]
		};

	if(GO.customfields)
	{
		GO.customfields.addColumns("GO\\Tickets\\Model\\Ticket", fields);
	}
	config.store = new GO.data.JsonStore({
		url: GO.url('tickets/ticket/store'),
		baseParams:{},
		root: 'results',
		id: 'id',
		totalProperty:'total',
		fields: fields.fields,
		remoteSort: true
	});
	
	config.store.on('load', function()
	{
		if(config.store.reader.jsonData.feedback)
		{
			alert(config.store.reader.jsonData.feedback);
		}
	},this)

	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true,
			groupable:false
		},
		columns:fields.columns
	});
	config.cm=columnModel;

	config.view=new Ext.grid.GridView({
		emptyText: GO.lang.strNoItems,
		getRowClass:function(row, index, rowParams) 
		{                                        
			var cls = '';
			
			if(row.data.late){
				cls+='ti-late ';
			}else if (row.data.unseen == true)
			{                                
				cls+= 'ti-unseen ';
			}else{
				cls+= 'ti-seen ';
			}			
			
			if(row.data.priority=="0"){
				cls += 'ti-low-priority ';
			}else if(row.data.priority=="2"){
				cls += 'ti-high-priority ';
			}

			return cls;
		}		
	});
			
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	
	this.searchField = new GO.form.SearchField({
		store: config.store,
		width:320
	});
	var changeAgent = function () {
		var showForAgent = this.agentField.getValue();
		this.store.load({
			params: {showForAgent: showForAgent || 0}
		});
	};

	this.agentField = new GO.tickets.SelectAgent({
		emptyText: '',
		listeners: {
			select: changeAgent,
			clear: changeAgent,
			//change: changeAgent,
			scope: this
		}
	});

	config.tbar = [GO.lang['strSearch'] + ':', this.searchField, GO.tickets.lang['agent'] + ':', this.agentField];

	GO.tickets.TicketsGrid.superclass.constructor.call(this, config);

	this.on('rowcontextmenu', this.onContextClick, this);

};

Ext.extend(GO.tickets.TicketsGrid, GO.grid.GridPanel,{

	mtime: 0,
	total: 0,
	
	checkGrid : function(total, mtime, reload)
	{
		//todo uitzxoeken
//		if(!this.store.baseParams.query && ((this.total != total) || (this.mtime != mtime) || reload))
//		{		
//			if(this.total != total)
//			{
//				GO.tickets.filterPanel.store.reload();
//			}
//			this.store.reload();
//		}
	},
	setVars : function(mtime, total)
	{
		this.mtime = (mtime) ? mtime : 0;
		this.total = (total) ? total : 0;
	},
	flagTickets : function(tickets, unseen)
	{
		if(tickets.length){
			this.store.baseParams['flag_tickets'] = Ext.encode(tickets);
			this.store.baseParams['unseen'] = unseen;
			this.store.reload();

			this.selModel.clearSelections();

			delete this.store.baseParams.flag_tickets;
			delete this.store.baseParams.unseen;
		}
	},
	onContextClick : function(grid, index, e)
	{
		if(!this.menu)
		{
			this.menu = new Ext.menu.Menu({
				id:'grid-ctx',
				items: [
				{
					text:GO.tickets.lang.markAsRead,
					scope:this,
					handler: function(){

						var records = grid.selModel.getSelections();
						var selectedRows = [];
						for(var i=0;i<records.length;i++){
							if(records[i].get('unseen')=='1'){// && records[i].get('agent_id')==GO.settings.user_id){
								selectedRows.push(records[i].id);
								GO.tickets.totalUnseen--;
							}
						}
						this.flagTickets(selectedRows, 0);
					}
				},{
					text:GO.tickets.lang.markAsUnread,
					scope:this,
					handler: function(){

						var records = grid.selModel.getSelections();
						var selectedRows = [];
						for(var i=0;i<records.length;i++){
							if(records[i].get('unseen')=='0'){// && records[i].get('agent_id')==GO.settings.user_id){
								selectedRows.push(records[i].id);
								GO.tickets.totalUnseen++;
							}
						}

						this.flagTickets(selectedRows, 1);
					}
				}, this.setAgentMenuItem = new Ext.menu.Item({
					text: GO.tickets.lang['setAgent'],
					menu: {
						items: []
					},
					multiple:true,
					scope: this,
					listeners: {
						'activate' : function(menuItem) {
							var records = grid.selModel.getSelections();
							var selectedRowIds = [];
							for (var i=0;i<records.length;i++) {
								selectedRowIds.push(records[i].id);
							}
							this.selectedRowIds = selectedRowIds;
							GO.request({
								url: "tickets/ticket/possibleAgents",
//								maskEl: Ext.getBody(),
								params: {
									ticketIds: Ext.encode(this.selectedRowIds)
								},
								success: function(options, response, result)
								{			
									this.setAgentMenuItem.menu.removeAll();
									for (var i=0; i<result.results.length; i++) {
										var name = result.results[i].name;
										var id = result.results[i].id;
										var subMenuItem = new Ext.menu.Item({
											text: name,
											agentId: id,
											listeners: {
												scope: this,
												'click' : function(item,event) {
//													console.log('TODO: change to agent ID '+item.agentId);
													GO.request({
														url: 'tickets/ticket/setAgent',
														params: {
															agentId: item.agentId,
															ticketIds: Ext.encode(this.selectedRowIds)
														},
														success: function(options, response, result) {
															this.store.load();
//															console.log(result);
														},
														scope: this
													})
												},
												scope: this
											},
											scope: this
										});
										this.setAgentMenuItem.menu.add(subMenuItem);
									}
//									this.setAgentMenuItem.menu.show(this.setAgentMenuItem.el);
								},
								scope: this
							});
						},
						scope: this
					}
				})
				]
			});
   		if(GO.settings.modules.tickets.write_permission){
				this.menu.add({
					text: GO.lang.batchEdit,
					scope:this,
					handler: function()
					{
						this.showBatchEditDialog(grid);
					}
				});
			}

			this.menu.on('hide', this.onContextHide, this);
		}
        
		e.stopEvent();

		this.ctxRecord = this.store.getAt(index);
		this.menu.items.each(function(item){
			item.setDisabled(this.ctxRecord.data.level<GO.permissionLevels.manage);
		},this);
		

		this.menu.showAt(e.getXY());
        
	}, 
	onContextHide : function()
	{
		if(this.selectedRows)
		{
			this.selectedRows = null;
		}
	},
	showBatchEditDialog : function(grid) {
		var ids = [];
		var selected = grid.selModel.getSelections();
		for (var i = 0; i < selected.length; i++) {
			if (!GO.util.empty(selected[i].data.id))
				ids.push(selected[i].data.id);
		}
		
		// Delete the acl_id baseParam in case that it's set
		delete GO.tickets.agentsStore.baseParams.acl_id;
		
		if(!GO.tickets.writableTypesStore.loaded)
			GO.tickets.writableTypesStore.load();
		

		GO.base.model.showBatchEditModelDialog("GO\\Tickets\\Model\\Ticket", ids,	'id', {
			company_id	:	GO.addressbook.SelectCompany,
			contact_id	:	GO.addressbook.SelectContact,
			status_id		:	GO.tickets.SelectStatus,
			agent_id		:	GO.tickets.SelectAgent,
			priority		: GO.form.SelectPriority,
			type_id			:	GO.tickets.SelectType,
			unseen			: Ext.ux.form.XCheckbox
		},
		['id,ticket_verifier,ticket_number,muser_id,order,last_response_time,cc_addresses,files_folder_id,order_id,group_id']
		).on('submit', function () {
			grid.getStore().reload();
		});
	}
    
});