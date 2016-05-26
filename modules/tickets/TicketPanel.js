/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TicketPanel.js 21269 2016-03-22 16:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.TicketPanel = Ext.extend(GO.DisplayPanel,{

	model_name : "GO\\Tickets\\Model\\Ticket",
	
	stateId : 'ti-ticket-panel',

	editGoDialogId : 'ticket',
	
	is_claimed: false,
	
	is_claimed_by_user : 0,

	status_id: 0,

	user_id:0,

	company_id:0,
	
	/**
	 * Use this to add extra detail to the dispaly panel
	 */
	template_extra:'',

	editHandler : function(){
		GO.tickets.showTicketDialog(this.link_id);		
	},

	initComponent : function(){	
		this.template ='';

		this.messageForm = new GO.tickets.MessageForm();
		this.messageForm.on('save', function(){		
			var tp = GO.mainLayout.getModulePanel('tickets');
			if(tp){
				if(this.messageForm.statusChanged){
					tp.refresh();
				}else
				{
					tp.centerPanel.store.reload();
					this.reload();
				}
			}else
			{
				this.reload();
			}
			
			
		}, this);

	this.openButton = new Ext.Button({
			iconCls:"btn-reply",
			text:GO.tickets.lang.reopen,
			tooltip:GO.tickets.lang.reopenTooltip,
			handler: function()
			{
				this.reopen();
			},
			hidden:true,
			scope:this
		});
//		this.reopenButton = new Ext.Button({
//			iconCls:"btn-reply",
//			text:GO.tickets.lang.reopen,
//			tooltip:GO.tickets.lang.reopenTooltip,
//			handler: function()
//			{
//				this.reopen();
//			},
//			hidden:true,
//			scope:this
//		});

		this.buttons = [
//			 this.reopenButton,
			this.openButton,
			this.closeButton = new Ext.Button({
				hidden:true,
				text: GO.tickets.lang['closeTicket'],
				handler:function(){
					GO.request({
						url:'tickets/ticket/close',
						params:{
							id:this.data.id
						},
						success:function(){
							this.reload();
							GO.tickets.ticketsGrid.store.reload();
						},
						scope:this
					});
				},
				scope:this
			}),
			this.newMessageButton = new Ext.Button({
				disabled:true,
				text:GO.tickets.lang.newMessage,
				handler:function(){
					this.messageForm.show(0,this.data);
				},
				scope:this
			})
		];


		this.store  = new GO.data.JsonStore({
			url:GO.url('tickets/ticket/display'),
			baseParams:{
				hiddenSections:''
			},
			root:'data',
			totalProperty:'total',
			fields:[
			'id',
			'agent_id',
			'ticket_number',
			'contact',
			'contact_id',
			'subject',
			'email',
			'phone',
			'ctime',
			'create_by_name',
			'mtime',
			'type_name',
			'status_name',
			'status_id',
			'agent_name',
			'files_folder_id',
			'files',
			'acl_id',
			'priority',
			'reload_ticketsgrid',
			'user_id',
			'muser_name',
			'user_name',
			'company_id',
			'company',
			'comments',
			'customfields',
			'panelId',
			'events',
			'tasks',
			'completed_tasks',
			'is_note',
			'links',
			"permission_level",
			'model_name',
			'unseen',
			'workflow',
			'type_id',
			'group_name'			
			//'link_type'
		,{
				name: 'rate_totals'
			}
			,{
				name:'messages'
			}
			]
		});

		this.store.on('beforeload',function(){
			this.getEl().mask(GO.lang.waitMsgLoad);
		}, this);
		this.store.on('load', function(){
			this.getEl().unmask();
			//this.setCompanyId(this.store.getAt(0).data.company_id);
		}, this);

		this.template_summary =
		'<div class="wrapper">'+
		//'<div class="display-panel-heading">'+ GO.tickets.lang['ticketDetails'] +': <b>#{ticket_number}</b></div>'+
	
		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
		'<tr>'+
			'<td colspan="2" class="display-panel-heading">'+GO.tickets.lang.ticket+': #{ticket_number} {subject}</td>'+
		'</tr>'+
		'<tr>'+
		'<td style="vertical-align:top">'+
		'<table cellpadding="0" cellspacing="0" border="0">'+
		/*'<tr>'+
		'<td class="column_def">' + GO.lang['strSubject'] + ':</td><td>{subject}</td>'+
		'</tr>'+*/

		'<tr>'+
		'<td class="column_def">' + GO.tickets.lang.ticketId + ':</td><td>'+
		'#{ticket_number}'+
		'</td>'+
		'</tr>'+

		'<tpl if="company !=\'\'">'+
		'<tr>'+
		'<td class="column_def">' + GO.lang['strCompany'] + ':</td><td>'+
		'<tpl if="company_id &gt; 0">';
		this.template_summary += (GO.addressbook) ? '<a href="#" onclick="GO.linkHandlers[\'GO\\\\\\\\Addressbook\\\\\\\\Model\\\\\\\\Company\'].call(this, {company_id});">{company}</a>' : '{company}';
		this.template_summary += '</tpl>'+
		'<tpl if="company_id == 0">'+
		'{company}'+
		'</tpl>'+
		'</td>'+
		'</tr>'+
		'</tpl>'+

		'<tr>'+
		'<td class="column_def">' + GO.tickets.lang['contact'] + ':</td><td>'+
		'<tpl if="contact_id &gt; 0">';            
		this.template_summary += (GO.addressbook) ? '<a href="#" onclick="GO.linkHandlers[\'GO\\\\\\\\Addressbook\\\\\\\\Model\\\\\\\\Contact\'].call(this, {contact_id});">{contact}</a>' : '{contact}';
		this.template_summary += '</tpl>'+
		'<tpl if="contact_id == 0">'+
		'{contact}'+
		'</tpl>'+
		'</td>'+
		'</tr>'+
		'<tr>'+
		'<td class="column_def">' + GO.lang['strOwner'] + ':</td><td>';
		this.template_summary += '{user_name}';
		this.template_summary += '</td>'+
		'</tr>'+
		'<tr>'+
		'<td class="column_def">' + GO.lang['strEmail'] + ':</td><td>{[this.mailTo(values.email, values.contact)]}</a></td>'+
		'</tr>'+
		'<tpl if="phone.length">'+
		'<tr>'+
		'<td class="column_def">' + GO.lang['strPhone'] +':</td><td>{[GO.util.callToLink(values.phone)]}</td>'+
		'</tr>'+
		'</tpl>'+		
		'</table>'+
		'</td>'+

		'<td style="vertical-align:top">'+
		'<table cellpadding="0" cellspacing="0" border="0">'+
		'<tr>'+
		'<td class="column_def">' + GO.tickets.lang['agent'] + ':</td><td>{agent_name}</td>'+
		'</tr>'+
		'<tr>'+
		'<td class="column_def">' + GO.lang['strCtime'] + ':</td><td>{ctime}</td>'+
		'</tr>'+
		'<tr>'+
			'<td class="column_def">'+GO.lang['createdBy']+':</td>'+'<td>{create_by_name}</td>'+
		'</tr>'+
		'<tr>'+
		'<td class="column_def">' + GO.lang['strMtime'] + ':</td><td>{mtime}</td>'+
		'</tr>'+
		'<tr>'+
			'<td class="column_def">'+GO.lang['mUser']+':</td>'+'<td>'+'{muser_name}'+'</td>'+
		'</tr>'+
		'<tr>'+
		'<td class="column_def">' + GO.lang['strType'] + ':</td><td>{type_name}</td>'+
		'</tr>'+
		
		'<tr>'+
		'<td class="column_def">' + GO.tickets.lang['ticketGroup'] + ':</td><td>{group_name}</td>'+
		'</tr>'+
		
		'<tr>'+
		'<td class="column_def">' + GO.lang['strStatus'] + ':</td><td>{status_name}</td>'+
		'</tr>'+
		'<tr>'+
		'<td class="column_def">' + GO.tickets.lang['priority'] + ':</td><td>{priority}</td>'+
		'</tr>'+
		'</table>'+
		'</td>'+
		'</tr>'+
		'</table>';
		
		if(GO.customfields)
		{
			this.template_summary +=GO.customfields.displayPanelTemplate;
		}
		
		
		this.template_summary +=this.template_extra+'<div class="display-panel-heading">' + GO.tickets.lang.messages + '</div>'+
		'</div>';

		
		var tpl =
		'<tpl for=".">'+
		this.template_summary+
		'<tpl for="messages">'+
			'<div class="msg-wrap<tpl if="user_id==GO.settings.user_id && !is_note"> to</tpl><tpl if="user_id!=GO.settings.user_id && !is_note"> from</tpl><tpl if="is_note"> note</tpl>" id="{message_id}">'+
			'<tpl if="user_id==GO.settings.user_id && !is_note"><div class="ti-msg to" style="background-image: url({agent_image})"><div class="arrow"></div></div></tpl>'+
			'<tpl if="user_id!=GO.settings.user_id && !is_note"><div class="ti-msg from" style="background-image: url({agent_image})"><div class="arrow"></div></div></tpl>'+
			'<div class="msg-head"><span class="msg-left">{from_name}'+
			'</span>'+
			'<span class="msg-right light">{ctime}</span></div>'+
			'<tpl if="content">'+
			'<div class="msg-content">{content}</div>'+
			'</tpl>'+
			'<div class="msg-foot">'+
				'<tpl if="values.template_name">'+
					'<span class="msg-right light">'+
					'{template_name}' +
					'</span>'+
				'</tpl>'+
				'<tpl if="!Ext.isEmpty(status) || !Ext.isEmpty(type)">'+
					'<span class="msg-left">'+
					'<tpl if="status.length">'+
					GO.tickets.lang['statusChange']+': {status}' +
					'</tpl><tpl if="!Ext.isEmpty(type)"><tpl if="!Ext.isEmpty(status)"><br></tpl>'+
					GO.tickets.lang['typeChange']+': {type}' +
					'</tpl>'+
					'</span>'+
				'</tpl>'+
			'</div>'+
			'<tpl if="rate_name!=\'\'">'+
				'<div class="ti-rate">{rate_name}: {rate_hours}</div>'+
			'</tpl>'+
			'<tpl if="num_files">'+
				'<div class="msg-attachements">' + 
				'<div title="'+GO.tickets.lang.attachments+'" class="ti-icon-attach"></div>&nbsp;'+
				'<tpl for="files">'+
					'<a class="go-grid-icon filetype filetype-{extension}" target="_blank" href="#files_{index}">{name}</a>'+
		//		if(GO.files)
		//			tpl += 'href="#" onclick="{handler"';
		//		else
		//			tpl += 'href="'+GO.url("files/file/download",{id:'_id_'}).replace('_id_','{id}')+'"';
				'</tpl></div>'+
			'</tpl>'+
			'<div class="x-clear"></div>'+
			'</div>'+
			
		'</tpl>'+
			'<tpl if="rate_totals.length">'
			+ '<div class="display-panel-heading">' + GO.tickets.lang.rateTotals + '</div>'
			+ '<table class="ti-rate-totals" cellpadding="0" cellspacing="0">'
			+ '<tpl for="rate_totals">'
			+ '<tr><td>{name}</td><td>: {amount}</td></tr>'
			+ '</tpl>'
			+ '</table>'
			+ '</tpl>';


		var tplConfig={};

		
		if(GO.tasks)
			tpl +=GO.tasks.TaskTemplate;

		if(GO.calendar)
			tpl += GO.calendar.EventTemplate;


		tpl += GO.linksTemplate;
		
		if(GO.files)
		{
			Ext.apply(this.templateConfig, GO.files.filesTemplateConfig);
			tpl += GO.files.filesTemplate;
		}

		if(GO.workflow)
			tpl += GO.workflow.WorkflowTemplate;

		tplConfig= Ext.apply(tplConfig, GO.linksTemplateConfig);


		if(GO.comments)
		{
			tpl += GO.comments.displayPanelTemplate;
		}
				
		
		tpl += '</tpl>';

		tplConfig.panel=this;

		tplConfig.collapsibleSectionHeader = function(title, id, dataKey){
			this.panel.collapsibleSections[id]=dataKey;

			return '<div class="collapsible-display-panel-header">'+title+'<div class="x-tool x-tool-toggle" style="float:right;cursor:pointer" id="toggle-'+id+'">&nbsp;</div></div>';
		}
		
		tplConfig = this.extraConfig(tplConfig);

		tplConfig = Ext.apply(tplConfig, {
			addSlashes : function(str)
			{
				str = GO.util.html_entity_decode(str, 'ENT_QUOTES');
				str = GO.util.add_slashes(str);
				return str;
			},
			mailTo : function(email, name)
			{
				if(GO.email && GO.settings.modules.email.read_permission)
				{
					return '<a href="#" onclick="GO.email.showAddressMenu(event, \''+this.addSlashes(email)+'\',\''+this.addSlashes(name)+'\');">'+email+'</a>';
				}else {
					return '<a href="mailto:'+email+'">'+email+'</a>';
				}
			}
		});
			
		this.deleteContextMnuItem = new Ext.menu.Item({
			iconCls: 'btn-delete',
			text: GO.lang.cmdDelete,
			scope:this,
			handler: function()
			{
				if(confirm(GO.lang.strDeleteSelectedItem)){
					GO.request({
						url:'tickets/message/delete',
						params:{
							id:this.messageContextMnu.record.id
						},
						success:function(){
							this.reload();
						},
						scope:this
					});
				}
			}
		});
		
		this.editContextMnuItem = new Ext.menu.Item({
			iconCls: 'btn-edit',
			text: GO.lang.cmdEdit,
			scope:this,
			handler: function()
			{
				this.messageForm.show(this.messageContextMnu.record.id,this.data);
			}
		});
		
		
		this.messageContextMnu = new Ext.menu.Menu({
			scope:this,
			items:[
				this.editContextMnuItem,
				this.deleteContextMnuItem
			]
	});
		
	

		this.messagesView =  new Ext.DataView(
		{
			store:this.store,
			singleSelect:true,
			scope:this,
			/*overClass:'x-view-over',*/
			itemSelector:'div.msg-wrap',
			//emptyText:GO.lang['strNoItems'],
			tpl: new Ext.XTemplate(
				tpl,tplConfig),
			listeners :
			{
//				dblclick:
//				{
//					scope:this,
//					fn: function(dv,nodes)
//					{
//						if (this.isAgent() &&	dv.getSelectionCount() > 0)
//						{
//							var items = this.store.data.items[0];
//
//							var index = dv.getSelectedIndexes();
//							var message_id = items.data.messages[index].id;
//							this.messageForm.show(message_id, this.data);							
//						}
//					}
//				}
			}
		});
		
		this.messagesView.on("contextmenu", function(dv, index, node, e){
			e.stopEvent();		

			if((this.data.messages[index].user_id == GO.settings.user_id || GO.settings.modules.tickets.permission_level >= GO.permissionLevels.manage)){
				this.editContextMnuItem.setDisabled(false);
			} else {
				this.editContextMnuItem.setDisabled(true);
			}
	
			if(GO.settings.modules.tickets.permission_level >= GO.permissionLevels.manage){
				this.deleteContextMnuItem.setDisabled(false);
			} else {
				this.deleteContextMnuItem.setDisabled(true);
			}
	
			if(this.isAgent()){
				this.messageContextMnu.record = this.data.messages[index];
				this.messageContextMnu.showAt(e.xy);
			}
		}, this);

		this.items = [this.messagesView];


		this.on('afterbodyclick', function(panel, target, e, href){
			
			if(href!='#'){
				e.preventDefault();
				window.open(href);
			}
		}, this);

		GO.tickets.TicketPanel.superclass.initComponent.call(this);
	},

	extraConfig : function(config) {
		return config;
	},
	createTopToolbar : function(){


		var tbar = GO.tickets.TicketPanel.superclass.createTopToolbar.call(this);


		tbar.push('-');
		tbar.push(this.claimButton = new Ext.Button({
			iconCls:"btn-reply-all",
			text:GO.tickets.lang.claim,
			tooltip:GO.tickets.lang.claimTooltip,
			handler: function()
			{
				this.toggleClaim(1);
			},
//			hidden:true,
			scope:this
		}));
		tbar.push(this.unclaimButton = new Ext.Button({
			iconCls:"btn-forward",
			text:GO.tickets.lang.unclaim,
			tooltip:GO.tickets.lang.unclaimTooltip,
			handler: function()
			{
				this.toggleClaim(0);
			},
//			hidden:true,
			scope:this
		}));
	
		
		
		tbar.push(this.readButton = new Ext.Button({
			iconCls:"ti-btn-read",
			tooltip:GO.tickets.lang.read,
			text:GO.tickets.lang.read,
			enableToggle:true,
			toggleHandler: function(button, enabled)
			{
				GO.mainLayout.openModule("tickets").centerPanel.flagTickets([this.data.id], enabled ? '0' : '1');
			},
			scope:this
		}));
		
		return tbar;
		
	},


	load : function(id, reload)
	{
		if(this.collapsed){
			this.collapsedLinkId=id;
		}else if(this.link_id!=id || reload)
		{
			this.ticket_id = this.link_id  = this.model_id = id;

			if(!GO.tickets.statusesStore.loaded)
			{
				GO.tickets.statusesStore.load();
			}
			if(!GO.tickets.templatesStore.loaded)
			{
				GO.tickets.templatesStore.load();
			}

			this.store.baseParams.id = this.ticket_id;
			this.store.baseParams.hidden_sections=Ext.encode(this.hiddenSections);
			this.store.load({
				callback:function(){
						this.data = this.store.getAt(0).data;
						this.data.model_name=this.model_name;
						this.data.panelId=this.getId();
												
//						var title = GO.tickets.lang.ticket+': #'+this.data.ticket_number+' '+this.data.subject;
//						this.setTitle('<div style="height:15px"><span style="overflow:hidden" title="'+title+'">'+title+'</span></div>');

						this.updateToolbar();
						
						this.readButton.toggle(GO.util.empty(this.data.unseen), true);

						//this.messageForm.prepareForm(this.data.id, this.data.status_id, this.data.status_name);
						for(var id in this.collapsibleSections){
							if(this.hiddenSections.indexOf(this.collapsibleSections[id])>-1){
								this.toggleSection(id, true);
							}
						}
						
						this.afterLoad();
				},
				scope:this
			});
		}
	},
	getLinkName : function(){
		return this.data.ticket_number;
	},
	
	reset : function(){
		this.store.removeAll();
		var tbar = this.getTopToolbar();

		if(tbar)
			this.getTopToolbar().setDisabled(true);

		this.newMessageButton.setDisabled(true);
		
		this.link_id=0;		
		this.data={};
		this.ticket_id=0;
	},	
	isClaimedByMe : function(){
		return this.data.agent_id==GO.settings.user_id;
	},
	isClaimed : function(){
		return this.data.agent_id>0;
	},
	isAgent : function(){	
		var isAgent = this.data.permission_level==GO.permissionLevels.manage;	
		return isAgent;
	},
	
	isCustomer : function(){
		return !this.isAgent() && this.data.user_id==GO.settings.user_id;
	},
	
	updateToolbar : function()
	{
		this.getTopToolbar().setDisabled(false);
		
		this.newMessageButton.setDisabled(this.data.status_id == -1 || ((!this.isAgent() || !this.isClaimed()) && !this.isCustomer()));
		this.closeButton.setVisible(this.data.status_id != -1);
//		this.reopenButton.setVisible(this.data.status_id == -1 && this.isAgent());
		
		this.unclaimButton.setVisible(this.isClaimedByMe() && this.data.status_id != -1);
		this.claimButton.setVisible(!this.isClaimed() && this.data.status_id != -1);
		this.openButton.setVisible(this.data.status_id == -1);

		this.unclaimButton.setDisabled(!this.isClaimedByMe());
		this.claimButton.setDisabled(this.isClaimed() || !this.isAgent());
		this.openButton.setDisabled(this.data.status_id == -1 && !this.isAgent());
		this.editButton.setDisabled(!this.isAgent() || this.data.status_id == -1);
		
		
		
		
		this.linkBrowseButton.setDisabled(!this.isAgent());
		

		if(this.fileBrowseButton){
			if(this.isAgent())
				this.fileBrowseButton.setId(this.data.id);
			else
				this.fileBrowseButton.setId(0);			
		}

		this.newMenuButton.setLinkConfig({
				model_id:this.data.id,
				model_name:this.model_name,
				text: this.data.ticket_number+': '+this.data.subject,
				callback:this.reload,
				scope:this
			});
		
		this.newMenuButton.setDisabled(!this.isAgent());
		
		this.readButton.setDisabled(this.data.permission_level<GO.permissionLevels.manage);
		
		// check buttons stil fit on te toolbar
		this.getTopToolbar().layout.fitToSize(this.getTopToolbar().getEl());
		
	},
	reopen : function()
	{
		GO.request({
			url: 'tickets/message/submit',
			params: {
				ticket_id: this.ticket_id,
				status_id: 0
			},
			scope: this,
			success: function(options, response, result)
			{				
				if (!result.success)
				{
					GO.errorDialog.show(result.feedback)
				} else
				{
					this.reload();

					GO.tickets.ticketsGrid.store.reload();
				}
			}
		});
	},

	toggleClaim : function(claimed)
	{
		GO.request({
			url: 'tickets/ticket/claim',
			params: {
				id: this.ticket_id,
				agent_id: claimed ? GO.settings.user_id : 0
			},
			scope: this,
			success: function(options, response, result)
			{			
				if (!result.success)
				{
					GO.errorDialog.show(result.feedback)
					this.store.reload();
				} else {
					
					this.data.agent_id=result.agent_id;
					this.updateToolbar();

					var store = this.store.data.items[0].data;
					store.agent_name = GO.settings.name;
					store.mtime = new Date().format(GO.settings.date_format+' '+GO.settings.time_format);

					GO.tickets.mainPanel.centerPanel.store.reload();
					this.messagesView.refresh();
				}
			}
		});
	}
});