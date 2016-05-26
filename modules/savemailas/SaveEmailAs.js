GO.mainLayout.onReady(function(){

	if(GO.email){
		GO.email.saveAsItems = GO.email.saveAsItems || [];
		
		
		
		GO.email.saveAsItems.push({
			text: GO.savemailas.lang.FileToComputer,
			iconCls: 'btn-computer',
			handler: function(){
				var record = this.messagesGrid.selModel.getSelected();
				if(record)
				{
					var win = window.open(GO.url("email/message/source",{account_id:this.account_id,mailbox:this.mailbox,uid:record.data.uid,download:true}));
					win.focus();
				}
			}
		});

		if(GO.settings.modules.files && GO.settings.modules.files.read_permission )
		{
			GO.email.saveAsItems.push({
				text: GO.savemailas.lang.FileInGO,
				iconCls: 'go-model-icon-GO_Files_Model_File',
				handler: function(item){

					//scope is the mail client
					if(!GO.files.saveAsDialog)
					{
						GO.files.saveAsDialog = new GO.files.SaveAsDialog();
					}

					var records = this.messagesGrid.getSelectionModel().getSelections();
					var r = records[0].data;

					GO.files.saveAsDialog.show({
						filename: GO.util.html_entity_decode(r.subject, 'ENT_QUOTES')+'.eml',
						handler:function(dialog, folder_id, filename){
							dialog.el.mask(GO.lang.waitMsgLoad);
							Ext.Ajax.request({
								url: GO.url("savemailas/linkedEmail/save"),
								params:{
									uid: r.uid,
									mailbox: this.mailbox,
									account_id: this.account_id,
									folder_id: folder_id,
									filename:filename
								},
								callback: function(options, success, response)
								{
									dialog.el.unmask();
									if(!success)
									{
										alert( GO.lang['strRequestError']);
									}else
									{
										var responseParams = Ext.decode(response.responseText);
										if(!responseParams.success)
										{
											alert( responseParams.feedback);
										}else
										{
											dialog.hide();
										}
									}
								},
								scope:this
							});
						},
						scope:this
					});

				}
			});
		}

		if(GO.settings.modules.calendar && GO.settings.modules.calendar.read_permission)
		{
			GO.email.saveAsItems.push({
				text: GO.calendar.lang.appointment,
				iconCls: 'go-model-icon-GO_Calendar_Model_Event',
				handler: function(item){
					var records = this.messagesGrid.getSelectionModel().getSelections();
					var r = records[0].data;

					GO.request({
						url: "email/message/view",
						params: {
							account_id: this.account_id,
							mailbox: this.mailbox,
							plaintext:1,
							create_temporary_attachments:1,
							get_contact_id:1,
							uid: r.uid
						},
						success: function(options, response, values)
						{
							values.description=values.plainbody;

							var config = {
								values: values,
								tmp_files: []
							};

							for(var i=0;i<values.attachments.length;i++)
							{
								config.tmp_files.push({
									name:values.attachments[i].name,
									tmp_file:values.attachments[i].tmp_file
								});
							}

							if(values.sender_contact_id>0)
							{
								config.link_config = {
									modelNameAndId:'GO\\Addressbook\\Model\\Contact:'+values.sender_contact_id,
									text: values.contact_name
								};
							}


//							if(!GO.calendar.eventDialogListeners)
//								GO.calendar.eventDialogListeners=[];
//
//							GO.calendar.eventDialogListeners.push({
//								show:{
//									fn:function(){
//										GO.calendar.eventDialog.participantsPanel.addParticipant({
//											name: values.from,
//											email: values.sender,
//											status: values.sender == GO.settings.email ? '1' : '0'
//										});
//
//										for(var i=0;i<values.to.length;i++)
//										{
//											GO.calendar.eventDialog.participantsPanel.addParticipant({
//												name: values.to[i].name,
//												email: values.to[i].email,
//												status: values.to[i].email == GO.settings.email ? '1' : '0'
//											});
//										}
//
//										GO.calendar.eventDialog.participantsPanel.reloadAvailability();
//									},
//									scope:this,
//									single:true
//								}
//							});

							GO.calendar.showEventDialog(config);

						},
						scope: this
					});
				}
			});
		}

		if(GO.settings.modules.notes && GO.settings.modules.notes.read_permission)
		{
			GO.email.saveAsItems.push({
				text: GO.notes.lang.note,
				iconCls: 'go-model-icon-GO_Notes_Model_Note',
				handler: function(item){
					var records = this.messagesGrid.getSelectionModel().getSelections();
					var r = records[0].data;

					GO.request({
						url: "email/message/view",
						params: {
							account_id: this.account_id,
							mailbox: this.mailbox,
							plaintext:1,
							create_temporary_attachments:1,
							get_contact_id:1,
							uid: r.uid
						},
						success: function(options, response, values)
						{					
							var config = {
								values: {
									"note.name": Ext.util.Format.htmlDecode(values.subject),
									"note.content": values.plainbody
								},
								tmp_files: []
							};

							for(var i=0;i<values.attachments.length;i++)
							{
								config.tmp_files.push({
									name:values.attachments[i].name,
									tmp_file:values.attachments[i].tmp_file
								});
							}

							if(values.sender_contact_id>0)
							{
								config.link_config = {
									modelNameAndId:'GO\\Addressbook\\Model\\Contact:'+values.sender_contact_id,
									text: values.contact_name
								};
							}

							GO.notes.showNoteDialog(0, config);

						},
						scope: this
					});
				}
			});
		}

		if(GO.settings.modules.tasks && GO.settings.modules.tasks.read_permission)
		{
			GO.email.saveAsItems.push({
				text: GO.tasks.lang.task,
				iconCls: 'go-model-icon-GO_Tasks_Model_Task',
				handler: function(item){
					var records = this.messagesGrid.getSelectionModel().getSelections();
					var r = records[0].data;

					GO.request({
						url: "email/message/view",
						params: {
							account_id: this.account_id,
							mailbox: this.mailbox,
							plaintext:1,
							create_temporary_attachments:1,
							get_contact_id:1,
							uid: r.uid
						},
						success: function(options, response, values)
						{	
							values.description=values.plainbody;
							values.name=Ext.util.Format.htmlDecode(values.subject);

							if (values.priority<3) {
								values.priority = 2;
							} else if (values.priority>3) {
								values.priority = 0;
							} else if (values.priority==3) {
								values.priority = 1;
							}

							var config = {
								values: values,
								tmp_files:[]
							};


							for(var i=0;i<values.attachments.length;i++)
							{
								config.tmp_files.push({
									name:values.attachments[i].name,
									tmp_file:values.attachments[i].tmp_file
								});
							}

							if(values.sender_contact_id>0)
							{
								config.link_config = {
									modelNameAndId:'GO\\Addressbook\\Model\\Contact:'+values.sender_contact_id,
									text: values.contact_name
								};
							}

							
							config.emailMessage = {
								uid: r.uid,
								mailbox: this.mailbox,
								account_id: this.account_id
							};
							
							GO.tasks.showTaskDialog(config);							
						},
						scope: this
					});
				}
			});
			
			GO.tasks.tasksObservable.on('save',function(dialog, task_id, loadedStore){
				if(dialog.showConfig) {
					var emailMessage;

					if (emailMessage = dialog.showConfig.emailMessage) {
						
						var uid = emailMessage.uid;
						var account_id = emailMessage.account_id;
						var mailbox = emailMessage.mailbox;
						
						
						var params = {
							account_id: account_id,
							mailbox: mailbox,
							links: Ext.encode([{
								model_name:'GO\\Tasks\\Model\\Task',
								model_id: task_id
							}]),
							uids: Ext.encode([uid]),
							total: 1
						};
						
						var emails = {account_id:{}};
						emails.account_id[account_id] = {mailbox:{}};
						emails.account_id[account_id].mailbox[mailbox] = {uids:[]};
						emails.account_id[account_id].mailbox[mailbox].uids.push(uid);
						
						params.emails = JSON.stringify(emails);

						GO.request({
							url: "savemailas/linkedEmail/link",
							params: params,
							scope: this
						});
					}
				}
			}, this);
		}

		if(GO.settings.modules.tickets && GO.settings.modules.tickets.read_permission)
		{
			GO.email.saveAsItems.push({
				text: GO.tickets.lang.ticket,
				iconCls: 'go-model-icon-GO_Tickets_Model_Ticket',
				handler: function(item){
					var records = this.messagesGrid.getSelectionModel().getSelections();
					var r = records[0].data;

					GO.request({
						url: "email/message/view",
						params: {
							account_id: this.account_id,
							mailbox: this.mailbox,
							plaintext:1,
							create_temporary_attachments:1,
							get_contact_id:1,
							uid: r.uid
						},
						success: function(options, response, values)
						{	
							delete values.priority;

							values.content=values.plainbody;

							values.subject = Ext.util.Format.htmlDecode(values.subject);
							
							var config = {
								values: values,
								tmp_files:[],
								loadParams:{}
							};

							if(values.sender_contact_id > 0)
							{
								config.loadParams.contact_id=values.sender_contact_id;
								
								config.link_config = {
									modelNameAndId:'GO\\Addressbook\\Model\\Contact:'+values.sender_contact_id,
									text: values.contact_name
								};
							}else
							{
								values.email=values.sender;
								values.first_name=values.from;
							}

							for(var i=0;i<values.attachments.length;i++)
							{
								config.tmp_files.push({
									name:values.attachments[i].name,
									tmp_file:values.attachments[i].tmp_file
								});
							}

							GO.tickets.showTicketDialog(0, config);

						},
						scope: this
					});
				}
			});
		}

		GO.email.saveAsItems.push({
			iconCls: 'btn-link',
			text: GO.lang.cmdLink,
			cls: 'x-btn-text-icon',
			multiple: true,
			handler: function(){
				if(!this.messagesGrid.selModel.selections.keys.length)
				{
					Ext.MessageBox.alert(GO.lang['strError'], GO.lang['noItemSelected']);
				}else
				{
					if(!this.linksDialog)
					{
						this.linksDialog = new GO.dialog.LinksDialog({
							messagesGrid : this.messagesGrid,
							sendLinkRequest : function(tolinks, to_folder_id){

								to_folder_id = to_folder_id || 0;
								var total = 0;

								var params = {
									links: Ext.encode(tolinks),
									to_folder_id : to_folder_id,
									description:this.grid.linkDescriptionField.getValue()
								};
								
								
								
								var emails = {account_id:{}};
								
								Ext.each(this.messagesGrid.getSelectionModel( ).getSelections( ), function(rec) {
									
									var uid = rec.get('uid')
									var account_id = rec.get('account_id')
									var mailbox = rec.get('mailbox')
									
									if(!emails.account_id[account_id]) {
										emails.account_id[account_id] = {mailbox:{}};
									}
									if(!emails.account_id[account_id].mailbox[mailbox]) {
										emails.account_id[account_id].mailbox[mailbox] = {uids:[]};
										
										
										
									}
									emails.account_id[account_id].mailbox[mailbox].uids.push(uid);
									total++;
								});
								
								params.emails = JSON.stringify(emails);
								params.total = total;
								
								
								Ext.MessageBox.progress(GO.email.lang.copyingMessages, '', '');
								Ext.MessageBox.updateProgress(0, '0%', '');
								

								var linkRequest = function(newParams){

									Ext.Ajax.request({
										url: GO.url("savemailas/linkedEmail/link"),
										params: newParams,
										callback: function(options, success, response)
										{
											if(!success)
											{
												Ext.MessageBox.alert(GO.lang.strError, response.result.errors);
											}else
											{
												var responseParams = Ext.decode(response.responseText);
												if(!responseParams.success)
												{
													alert(responseParams.feedback);
													Ext.MessageBox.hide();
												}else if(responseParams.progress && responseParams.total > responseParams.progress )
												{
													var progress = (responseParams.total - (responseParams.total - responseParams.progress)) / responseParams.total;
											
													Ext.MessageBox.updateProgress(progress, (parseInt(progress*100))+'%', '');

													linkRequest.call(this, responseParams);
												}else {
													this.grid.searchGrid.getSelectionModel().clearSelections();
													Ext.MessageBox.hide();
													this.hide();
													GO.mainLayout.getModulePanel('email').messagesGrid.focus();
												}
											}
										},
										scope: this
									});
								}
								linkRequest.call(this, params);
							}
						});
					}
					this.linksDialog.show();
				}
			},
			scope: this
		});
	}
});




GO.linkHandlers["GO\\Savemailas\\Model\\LinkedEmail"] = function(id, remoteMessage){

	if(!GO.email.linkedMessagePanel){
		GO.email.linkedMessagePanel = new GO.email.LinkedMessagePanel({
			attachmentContextMenu: new GO.email.AttachmentContextMenu({removeSaveButton:true})
		});

		GO.email.linkedMessageWin = new GO.Window({
			maximizable:true,
			collapsible:true,
			stateId:'em-linked-message-panel',
			title: GO.email.lang.emailMessage,
			height: 500,
			width: 800,
			closeAction:'hide',
			layout:'fit',
			items: GO.email.linkedMessagePanel
		});
	}
	
	if(!remoteMessage)
		remoteMessage={};
	
	GO.email.linkedMessagePanel.remoteMessage=remoteMessage;
	GO.email.linkedMessageWin.show();
	GO.email.linkedMessagePanel.load(id, remoteMessage);
	return GO.email.linkedMessageWin;
}

GO.linkPreviewPanels["GO\\Savemailas\\Model\\LinkedEmail"]=function(config){
	config = config || {};
	return new GO.email.LinkedMessagePanel(config);
}