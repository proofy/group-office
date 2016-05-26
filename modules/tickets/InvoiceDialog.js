GO.tickets.InvoiceDialog = Ext.extend(Ext.Window, {

	initComponent : function(){
		
		this.title=GO.tickets.lang.bill;
		this.width=500;
		this.autoHeight=true;
		this.closeAction='hide';
		
		var now = new Date();
		var lastMonth = now.add(Date.MONTH, -1);
		var startOfLastMonth = lastMonth.getFirstDateOfMonth();
		var endOfLastMonth = lastMonth.getLastDateOfMonth();

		this.startDate = new Ext.form.DateField({
			name: 'start_date',
			format: GO.settings['date_format'],
			allowBlank:false,
			value: startOfLastMonth.format(GO.settings.date_format)
		});

		this.endDate = new Ext.form.DateField({
			name: 'end_date',
			format: GO.settings['date_format'],
			allowBlank:false,
			value: endOfLastMonth.format(GO.settings.date_format)
		});

		this.selectBook = new GO.form.ComboBox({
			fieldLabel: GO.billing.lang.bookId,
			hiddenName:'book_id',
			anchor:'100%',
			emptyText:GO.lang.strPleaseSelect,
			store: new GO.data.JsonStore({
				url: GO.url('billing/book/store'),
				baseParams: {
					permissionLevel: GO.permissionLevels.write
				},
				root: 'results',
				id: 'id',
				totalProperty:'total',
				fields: ['id','name', 'user_name', 'report_checked'],
				remoteSort: true
			}),
			pageSize: parseInt(GO.settings.max_rows_list),
			valueField:'id',
			displayField:'name',
			mode: 'remote',
			triggerAction: 'all',
			editable: true,
			selectOnFocus:true,
			forceSelection: true,
			allowBlank: false
		});
		
		this.items=this.formPanel = new Ext.form.FormPanel({
			url:GO.url('tickets/ticket/invoice'),
			baseParams:{
			},
			bodyStyle:'padding:5px',
			waitMsgTarget:true,
			items:[
			this.fromStatus = new GO.tickets.SelectStatus({
				fieldLabel:GO.tickets.lang.fromStatus,
				anchor:'100%',
				emptyText:GO.lang.strPleaseSelect,
				hiddenName:'from_status_id',
				allowBlank:false
			}),
			this.toStatus = new GO.tickets.SelectStatus({
				fieldLabel:GO.tickets.lang.toStatus,
				anchor:'100%',
				emptyText:GO.lang.strPleaseSelect,
				hiddenName:'to_status_id',
				allowBlank:false
			}),
			this.toStatus = new GO.tickets.SelectStatus({
				fieldLabel:GO.tickets.lang.invoiceErrorStatus,
				anchor:'100%',
				emptyText:GO.lang.strPleaseSelect,
				hiddenName:'error_status_id',
				allowBlank:false
			}),
			this.selectBook,
			{
				xtype:'compositefield',
				fieldLabel: GO.lang.strStart,
				items:[
				this.startDate,
				new Ext.Button({
						text: GO.lang.cmdPrevious,
						width:100,
						handler: function(){
							this.changeMonth(-1);
						},
						scope:this
					})]
			}, {
				xtype:'compositefield',
				fieldLabel: GO.lang.strEnd,
				items:[
					this.endDate,
					new Ext.Button({
						text: GO.lang.cmdNext,
						width:100,
						handler: function(){
							this.changeMonth(1);
						},
						scope:this
					})]
			},{
				xtype:'checkbox',
				name:'change_tickets_without_hours_too',
				checked:true,
				hideLabel:true,
				boxLabel:GO.tickets.lang.changeTicketsWithoutHoursToo
			},{
				xtype:'textarea',
				fieldLabel:'Template',
				name:'template',
				anchor:'100%',
				value:GO.tickets.bill_item_template
			}
			]
		});

		this.buttons=[
		{
			text:GO.lang.cmdOk,
			handler: this.submitForm,
			scope: this
		},
		{
			text:GO.lang['cmdClose'],
			handler: function(){
				this.hide()
				},
			scope: this
		}];

		this.addEvents({
			'invoice': true
		});

		GO.tickets.InvoiceDialog.superclass.initComponent.call(this);
	},
	submitForm : function(){
		this.formPanel.form.submit({
			waitMsg:GO.lang.waitMsgUpload,
			success:function(form, action){
				Ext.MessageBox.alert(GO.lang.strSuccess, action.result.feedback);
				this.fireEvent('invoice');
			},
			failure: function(form, action) {
				if(action.failureType == 'client')
				{
					Ext.MessageBox.alert(GO.lang['strError'], GO.lang['strErrorsInForm']);
				} else {
					Ext.MessageBox.alert(GO.lang['strError'], action.result.feedback);
				}
			},
			scope: this
		});
	},
	changeMonth : function(increment)
	{
		var date = this.startDate.getValue();
		date = date.add(Date.MONTH, increment);
		this.startDate.setValue(date.getFirstDateOfMonth().format(GO.settings.date_format));
		this.endDate.setValue(date.getLastDateOfMonth().format(GO.settings.date_format));
	},
	show:function(config){
		config = config || {};

		GO.tickets.InvoiceDialog.superclass.show.call(this);
	}
});