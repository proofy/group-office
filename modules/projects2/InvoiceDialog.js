GO.projects2.InvoiceDialog = Ext.extend(Ext.Window, {

	actionUrls : {
		'payout_timeregistration_users' : GO.url('projects2/invoice/payout'),
		'company_id' : GO.url('projects2/invoice/sales'),
		'contact_id' : GO.url('projects2/invoice/sales'),
		'responsible_user_id' : GO.url('projects2/invoice/sales')
	},

	initComponent : function(){

		this.title=GO.projects2.lang.bill;

		this.width=500;
		this.autoHeight=true;

		this.closeAction='hide';


		var now = new Date();
		var lastMonth = now.add(Date.MONTH, -1);
		var startOfLastMonth = lastMonth.getFirstDateOfMonth();
		var endOfLastMonth = lastMonth.getLastDateOfMonth();

		this.recipientCombo = new Ext.form.ComboBox({
			anchor:'-20',
			fieldLabel : GO.projects2.lang.recipient,
			hiddenName : 'recipient',
			store : new Ext.data.SimpleStore({
				fields : ['value', 'text'],
				data : [
				['company_id', GO.lang.customer],
				['contact_id', GO.projects2.lang.contact],
				['responsible_user_id', GO.projects2.lang.projectManager],
				['payout_timeregistration_users', GO.projects2.lang.payoutTimeregistrationUsers]
				]

			}),
			value : 'company_id',
			valueField : 'value',
			displayField : 'text',
			mode : 'local',
			triggerAction : 'all',
			editable : false,
			selectOnFocus : true,
			forceSelection : true
		});

		this.startDate = new Ext.form.DateField({
			name: 'start_date',
			format: GO.settings['date_format'],
			allowBlank:true,
			fieldLabel: GO.lang.strStart,
			value: startOfLastMonth.format(GO.settings.date_format)
		});

		this.endDate = new Ext.form.DateField({
			name: 'end_date',
			format: GO.settings['date_format'],
			allowBlank:true,
			fieldLabel: GO.lang.strEnd,
			value: endOfLastMonth.format(GO.settings.date_format)
		});

		this.selectBook = new GO.form.ComboBox({
			fieldLabel: GO.billing.lang.bookId,
			hiddenName:'book_id',
			anchor:'-20',
			emptyText:GO.lang.strPleaseSelect,
			store: new GO.data.JsonStore({
				url: GO.settings.modules.billing.url+ 'json.php',
				baseParams: {
					task: 'books',
					auth_type: 'write'
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
			url: GO.url('projects2/invoice/sales'), //this could be changed in this.submitForm()
			baseParams:{
//				task:'invoice',
				project_id:0
			},
			bodyStyle:'padding:5px',
			waitMsgTarget:true,
			items:[
			this.recipientCombo,
			{
				layout:'table',
				border:false,
				defaults:{
					border:false,
					layout:'form'
				},
				items:[
				{
					items:this.startDate
				},{
					bodyStyle:'padding-left:5px',
					items:new Ext.Button({
						text: GO.projects2.lang.previousMonth,
						handler: function(){
							this.changeMonth(-1);
						},
						scope:this
					})
				}]
			}, {
				layout:'table',
				border:false,
				defaults:{
					border:false,
					layout:'form'
				},
				items:[
				{
					items:this.endDate
				},{
					bodyStyle:'padding-left:5px',
					items:new Ext.Button({
						text: GO.projects2.lang.nextMonth,
						handler: function(){
							this.changeMonth(1);
						},
						scope:this
					})
				}]
			},
			this.selectBook,
			{
				xtype: 'radiogroup',
				hideLabel: true,
				itemCls: 'x-check-group-alt',
				columns: 1,
				items: [
					this.togetherCheck = new Ext.form.Radio({
						boxLabel: GO.projects2.lang.invoiceTogether,
						name: 'invoice_sub_projects',
						inputValue: 0,
						checked: true
					}),
					this.separateCheck = new Ext.form.Radio({
						boxLabel: GO.projects2.lang.invoiceSeparately,
						name: 'invoice_sub_projects',
						inputValue: 1					
					})
				]
			},
			{
				xtype:'checkbox',
				hideLabel:true,
				boxLabel:GO.projects2.lang.billAlreadyBilled,
				name:'bill_already_billed'
			},this.summaryItemTemplate = new Ext.form.TextArea({
				name:'summary_item_template',
				fieldLabel: GO.projects2.lang.summaryItemTemplate,
				value: GO.projects2.summary_bill_item_template,
				anchor : '100%'
			}),this.detailedCheckbox = new Ext.form.Checkbox({
				hideLabel:true,
				boxLabel:GO.projects2.lang.detailedItems,
				name:'detailed_items',
				checked: GO.projects2.detailed_printout_on
			}),this.itemTemplate = new Ext.form.TextArea({
				name:'item_template',
				fieldLabel: GO.projects2.lang.itemTemplate,
				value: GO.projects2.bill_item_template,
				anchor : '100%',
				disabled: !GO.projects2.detailed_printout_on
			}),this.singleCheckbox = new Ext.form.Checkbox({
//				disabled:this.recipientCombo.getValue()!='payout_timeregistration_users',
				boxLabel: GO.projects2.lang.createSingleOrderDoc,
				labelSeparator: '',
				name: 'single',
				allowBlank: true,
				hideLabel:true
			}),this.selectUser = new GO.form.SelectUser({
				fieldLabel: GO.projects2.lang.orderDocFor,
				typeAhead: true,
//				disabled: true,
				disabled: this.recipientCombo.getValue()!='payout_timeregistration_users' || !this.singleCheckbox.getValue(),
//				hidden: true,
				allowBlank: false,
				anchor:'100%'
			}),this.selectProject = new GO.projects2.SelectProject({
				fieldLabel: GO.projects2.lang.orderDocFor,
				typeAhead: true,
				disabled: this.recipientCombo.getValue()=='payout_timeregistration_users' || !this.singleCheckbox.getValue(),
				hidden: this.recipientCombo.getValue()=='payout_timeregistration_users',
				allowBlank: false,
				storeBaseParams: {'parent_project_id':0,'ignoreStatus':true},
				anchor:'100%'
			})
			]
		});

		this.singleCheckbox.on('check', function(checkbox,checked){
			if (this.selectUser.isVisible())
				this.selectUser.setDisabled(!checked);
			if (this.selectProject.isVisible())
				this.selectProject.setDisabled(!checked);
		},this);
		this.detailedCheckbox.on('check', function(checkbox,checked){
			this.itemTemplate.setDisabled(!checked);
		},this);

		this.recipientCombo.on('change', function(combobox,newValue,oldValue){
			if (newValue=='payout_timeregistration_users') {
				this.itemTemplate.setValue(GO.projects2.payout_item_template);
				this.summaryItemTemplate.setValue(GO.projects2.summary_payout_item_template);
				
				this.selectUser.setDisabled(!this.singleCheckbox.getValue());
				this.selectUser.setVisible(true);
				this.selectProject.setDisabled(true);
				this.selectProject.setVisible(false);
				
			} else if (newValue=='abonnementsgeld') {				
				this.itemTemplate.setValue(GO.projects2.bill_item_template);
				this.summaryItemTemplate.setValue(GO.projects2.summary_bill_item_template);
				
				this.selectUser.setDisabled(!this.singleCheckbox.getValue());
				this.selectUser.setVisible(true);
				this.selectProject.setDisabled(true);
				this.selectProject.setVisible(false);
			} else {
				this.itemTemplate.setValue(GO.projects2.bill_item_template);
				this.summaryItemTemplate.setValue(GO.projects2.summary_bill_item_template);
				this.selectUser.setDisabled(true);
				this.selectUser.setVisible(false);
				this.selectProject.setDisabled(!this.singleCheckbox.getValue());
				this.selectProject.setVisible(true);
				
			}
		}, this);

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

		this.formPanel.form.timeout=300;

		GO.projects2.InvoiceDialog.superclass.initComponent.call(this);
	},
	submitForm : function(){
		
		if (GO.util.empty(this.actionUrls[this.recipientCombo.getValue()])) {
			Ext.MessageBox.alert(GO.lang['strError'],'Please inform the administrator the following: server request path not found for '+this.recipientCombo.getValue()+'.');
		} else {
			this.formPanel.form.url = this.actionUrls[this.recipientCombo.getValue()];
			this.formPanel.form.submit({
				waitMsg:GO.lang.waitMsgSave,
				success:function(form, action){

					if (this.recipientCombo.getValue()=='payout_timeregistration_users') {
						GO.projects2.payout_item_template = this.itemTemplate.getValue();
						GO.projects2.summary_payout_item_template = this.summaryItemTemplate.getValue();
					} else {
						GO.projects2.bill_item_template = this.itemTemplate.getValue();
						GO.projects2.summary_bill_item_template = this.summaryItemTemplate.getValue();
					}

					//if(GO.util.empty())
					//this.hide();

					this.fireEvent('import');

					Ext.MessageBox.alert(GO.lang.strSuccess, action.result.feedback);
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
		}
				
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

		this.formPanel.baseParams.project_id=config.project_id;

		this.separateCheck.setValue(config.project_id==0);
		this.togetherCheck.setValue(config.project_id>0);

		this.togetherCheck.setDisabled(config.project_id==0);
		this.separateCheck.setDisabled(config.project_id==0);

		GO.projects2.InvoiceDialog.superclass.show.call(this);
		this.selectUser.setVisible(this.recipientCombo.getValue()=='payout_timeregistration_users');
	}
});

