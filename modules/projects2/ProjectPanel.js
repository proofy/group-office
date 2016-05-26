GO.projects2.ProjectPanel = Ext.extend(GO.DisplayPanel,{

	model_name: "GO\\Projects2\\Model\\Project",

//	subProjectsTemplate : '',

	stateId : 'pm-project-panel',

	editGoDialogId : 'project',
	
	template:
		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
		'<tr>'+
		'<td colspan="2" class="display-panel-heading">{template_name}: <b>{name}</b></td>'+
		'</tr>'+

		'<tpl if="!GO.util.empty(description)">'+
		'<tr>'+
		'<td colspan="2" class="display-panel-description"><p class="pm-description-label">'+GO.lang.strDescription+'</p>{description}</td>'+
		'</tr>'+
		'</tpl>'+

		'<tpl if="!GO.util.empty(parent_project_path)">'+
		'<tr>'+
		'<td>'+GO.projects2.lang.parentProject+':</td><td><a class="pm-subproject-link" href="#project-{parent_project_id}">{parent_project_path}</a></td>'+
		'</tr>'+
		'</tpl>'+

		'<tr>'+
		'<td>ID:</td><td>{id}</td>'+
		'</tr>'+

		'<tpl if="!GO.util.empty(responsible_user_name)">'+
		'<tr>'+
		'<td>'+GO.projects2.lang.projectManager+':</td><td>{responsible_user_name}</td>'+
		'</tr>'+
		'</tpl>'+

		'<tr>'+
		'<td>'+GO.projects2.lang.status+':</td><td>{status_name}</td>'+
		'</tr>'+

		'<tpl if="!GO.util.empty(use_reference_no)">'+
		'<tr>'+
		'<td>'+GO.projects2.lang.referenceNo+':</td><td>{reference_no}</td>'+
		'</tr>'+
		'</tpl>'+

		'<tpl if="!GO.util.empty(customer)">'+
		'<tr>'+
		'<td>'+GO.lang.customer+':</td><td>{customer}</td>'+
		'</tr>'+
		'</tpl>'+

		'<tpl if="!GO.util.empty(ctime)">'+
		'<tr>'+
		'<td>'+GO.lang.strCtime+':</td><td>'+
		'{ctime}'+
		'</td>'+
		'</tr>'+
		'</tpl>'+
		'<tpl if="!GO.util.empty(contact)">'+
		'<tr>'+
		'<td>'+GO.projects2.lang.contact+':</td><td>{contact}</td>'+
		'</tr>'+
		'</tpl>'+
		'<tpl if="!GO.util.empty(start_time)">'+
		'<tr>'+
		'<td>'+GO.projects2.lang.startTime+':</td><td>'+
		'{start_time}'+
		'</td>'+
		'</tr>'+
		'</tpl>'+
		'<tpl if="!GO.util.empty(due_time)">'+
		'<tr>'+
		'<td>'+GO.projects2.lang.dueAt+':</td><td class="{[this.getClass(values)]}">'+
		'{due_time}'+
		'</td>'+
		'</tr>'+
		'</tpl>'+

		'<tpl if="!GO.util.empty(is_income_enabled)">'+
			'<tpl if="!GO.util.empty(income_type_name)">'+
				'<tr>'+
				'<td>'+GO.projects2.lang.incomeType+':</td><td>'+
				'{income_type_name}'+
				'</td>'+
				'</tr>'+
				'<tr>'+
			'</tpl>'+

			'<tpl if="!GO.util.empty(budget_sum)">'+
				'<tr><td></td><th style="text-align:right;border-bottom:1px solid black;">\n\\n\
				<div style="width:20%;float:left;">'+GO.projects2.lang['income']+'</div>\n\
				<div style="width:20%;float:left;">'+GO.projects2.lang['internalFees']+'</div>\n\
				<div style="width:20%;float:left;">'+GO.projects2.lang.expenses+'</div>\n\
				<div style="width:20%;float:left;">'+GO.projects2.lang.travel_costs+'</div>\n\
				<div style="width:20%;float:left;font-weight:600;">'+GO.projects2.lang.total+'</div>\n\
				</th></tr>'+
				'<tr>'+
					'<td>'+GO.projects2.lang.budget+':</td>'+
					'<td style="text-align:right;">\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.budget_sum.budget)]}</div>\n\
						<div style="width:20%;float:left;">{[GO.util.format.valuta(values.budget_sum.internalFee)]}</div>\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.budget_sum.expenses)]}</div>\n\
						<div style="width:20%;float:left">-</div>\n\
						<div style="width:20%;float:left;font-weight:600;color:{[values.budget_sum.sum<0?"red":"green"]}">{[GO.util.format.valuta(values.budget_sum.sum)]}</div>\n\
					</td>'+
				'</tr>'+
				'<tr>'+
					'<td>'+GO.projects2.lang.realization+':</td>'+
					'<td style="text-align:right;">\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.real_sum.budget)]}</div>\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.real_sum.internalFee)]}</div>\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.real_sum.expenses)]}</div>\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.real_sum.mileage)]}</div>\n\
						<div style="width:20%;float:left;font-weight:600;color:{[values.real_sum.sum<0?"red":"green"]}">{[GO.util.format.valuta(values.real_sum.sum)]}</div>\n\
					</td>'+
				'</tr>'+


				'<tpl if="income_type!=3">'+
					'<tr>'+

					'<td>'+GO.projects2.lang['billingProgress']+':</td><td>'+
					'<div class="pm-progressbar"><div class="pm-progress-indicator" style="width:{[Math.round((100/values.invoicable_amount)*values.invoiced_amount)]}px"></div></div>'+
					//'{[GO.util.format.valuta(values.budget_sum - values.income_total)]}'+
					'</td>'+
					'</tr>'+
				'</tpl>'+

			'</tpl>'+		
		
		'</tpl>'+
		
			'<tpl if="!GO.util.empty(show_subproject_totals)">'+
				'<tr>'+
				'<td>'+GO.projects2.lang.nSubProjects+':</td><td>'+
				'{n_subprojects}'+
				'</td>'+
				'</tr>'+
				'<tr>'+
				'<tr>'+
//				'<td>'+GO.projects2.lang.subprojectsBudget+':</td><td>'+
//				'{subprojects_budget_sum}'+
				
				
				'<tpl if="!GO.util.empty(subprojects_budget_sum)">'+
				'<tr><td></td><th style="text-align:right;border-bottom:1px solid black;">\n\\n\
				<div style="width:20%;float:left;">'+GO.projects2.lang['income']+'</div>\n\
				<div style="width:20%;float:left;">'+GO.projects2.lang['internalFees']+'</div>\n\
				<div style="width:20%;float:left;">'+GO.projects2.lang.expenses+'</div>\n\
				<div style="width:20%;float:left;">'+GO.projects2.lang.travel_costs+'</div>\n\
				<div style="width:20%;float:left;font-weight:600;">'+GO.projects2.lang.total+'</div>\n\
				</th></tr>'+
				'<tr>'+
					'<td>'+GO.projects2.lang.subprojectsBudget+':</td>'+
					'<td style="text-align:right;">\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.subprojects_budget_sum.budget)]}</div>\n\
						<div style="width:20%;float:left;">{[GO.util.format.valuta(values.subprojects_budget_sum.internalFee)]}</div>\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.subprojects_budget_sum.expenses)]}</div>\n\
						<div style="width:20%;float:left">-</div>\n\
						<div style="width:20%;float:left;font-weight:600;color:{[values.subprojects_budget_sum.sum<0?"red":"green"]}">{[GO.util.format.valuta(values.subprojects_budget_sum.sum)]}</div>\n\
					</td>'+
				'</tr>'+
				'<tr>'+
					'<td>'+GO.projects2.lang.subprojectsRealization+':</td>'+
					'<td style="text-align:right;">\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.subprojects_real_sum.budget)]}</div>\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.subprojects_real_sum.internalFee)]}</div>\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.subprojects_real_sum.expenses)]}</div>\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.subprojects_real_sum.mileage)]}</div>\n\
						<div style="width:20%;float:left;font-weight:600;color:{[values.subprojects_real_sum.sum<0?"red":"green"]}">{[GO.util.format.valuta(values.subprojects_real_sum.sum)]}</div>\n\
					</td>'+
				'</tr>'+
				'</tpl>'+
		
				'</td>'+
				'</tr>'+
				'<tr>'+

//				'<tr>'+
//				'<td>'+GO.projects2.lang.subprojectsRealization+':</td><td>'+
//				'{subprojects_real_sum}'+
//				'</td>'+
//				'</tr>'+
			'</tpl>'+
		//		'</tpl>'+

		//		'<tpl if="!isNaN(values.budget_status)">'+
		//		'<tr>'+
		//		'<td>'+GO.projects2.lang.budgetStatus+':</td><td>'+
		//		'<div style="margin-top:3px;border:1px solid #000;width:8px;height:8px;border-radius:8px;background-color:<tpl if="budget_status==2">red</tpl><tpl if="budget_status==0">lime</tpl>"></div>'+
		//		'</td>'+
		//		'</tr>'+
		//		'</tpl>'+

		'</table>',
	
	timeEntriesTemplate:

		'<tpl if="values.timeentries">'+
		'{[this.collapsibleSectionHeader(GO.projects2.lang.timeEntries, "pm-timeentries-"+values.panelId, "timeentries")]}'+

		'<table class="display-panel" cellpadding="0" cellspacing="0" style="border-collapse:collapse;" border="0" id="pm-timeentries-{panelId}">'+

		'<tr>'+
		'<td class="table_header_links">' + GO.lang.strUsername + '</td>'+
		'<td class="table_header_links" style="text-align:right" width="15%">' + GO.projects2.lang.unitsBooked + '</td>'+
		'<td class="table_header_links" style="text-align:right" width="15%">' + GO.projects2.lang.unitsBudget + '</td>'+
		'<td class="table_header_links" style="text-align:right" width="15%">' + GO.projects2.lang.percentageTotal + '</td>'+
		'<td class="table_header_links" style="text-align:right" width="15%">' + GO.lang.strMtime + '</td>'+
		'</tr>'+

		'<tpl for="timeentries">'+
		'<tr class="{[this.getBudgetClass(values.status)]}">'+
		'<td style="white-space:nowrap">{user_name}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{units}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{budgeted_units}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{percentage_total}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{mtime}</td>'+
		'</tr>'+
		'</tpl>'+


		'<tpl if="timeentries_totals">'+
		'<tr class="{[this.getBudgetClass(values.timeentries_totals.status)]}" style="border-top:1px solid black">'+
		'<td style="white-space:nowrap">' + GO.projects2.lang.totals + '</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{values.timeentries_totals.units}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{values.timeentries_totals.budgeted_units}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{values.timeentries_totals.percentage_total}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{values.timeentries_totals.mtime}</td>'+
		'</tr>'+
		'</tpl>'+

		'<tpl if="!timeentries.length">'+
		'<tr><td colspan="4">'+GO.lang.strNoItems+'</td></tr>'+
		'</tpl>'+
		'</table>'+
		'</tpl>',
		
expensesTemplate:

		'<tpl if="values.expenseBudgets">'+
		'{[this.collapsibleSectionHeader(GO.projects2.lang.expenses, "pm-expenses-"+values.panelId, "expenses")]}'+

		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0" id="pm-expenses-{panelId}">'+

		'<tr>'+
		'<td class="table_header_links">' + GO.projects2.lang.expenseBudget + '</td>'+
		'<td class="table_header_links" style="text-align:right" width="15%">' + GO.projects2.lang.budgeted + '</td>'+
		'<td class="table_header_links" style="text-align:right" width="15%">' + GO.projects2.lang.actual + '</td>'+
		'<td class="table_header_links" style="text-align:right" width="15%">' + GO.projects2.lang.percentageTotal + '</td>'+
		'<td class="table_header_links" style="text-align:right" width="15%">' + GO.lang.strMtime + '</td>'+
		'</tr>'+

		'<tpl for="expenseBudgets">'+
		'<tr class="{[this.getBudgetClass(values.status)]}">'+
		'<td style="white-space:nowrap">{description}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{nett_budget}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{nett_spent}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{percentage_total}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{mtime}</td>'+
		'</tr>'+
		'</tpl>'+

		'<tpl if="expenseBudgets_totals">'+
		'<tr class="{[this.getBudgetClass(values.expenseBudgets_totals.status)]}" style="border-top:1px solid black">'+
		'<td style="white-space:nowrap">' + GO.projects2.lang.totals + '</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{values.expenseBudgets_totals.nett_budget}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{values.expenseBudgets_totals.nett_spent}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{values.expenseBudgets_totals.percentage_total}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{values.expenseBudgets_totals.mtime}</td>'+
		'</tr>'+
		'</tpl>'+

		'<tpl if="!expenseBudgets.length">'+
		'<tr><td colspan="4">'+GO.lang.strNoItems+'</td></tr>'+
		'</tpl>'+
		'</table>'+
		'</tpl>',

	incomesTemplate:

		'<tpl if="values.incomes">'+
		'{[this.collapsibleSectionHeader(GO.projects2.lang.income, "pm-incomes-"+values.panelId, "incomes")]}'+

		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0" id="pm-incomes-{panelId}">'+

		'<tr>'+
		'<td class="table_header_links">' + GO.projects2.lang.income + '</td>'+
		'<td class="table_header_links" style="text-align:right" width="15%">' + GO.projects2.lang.budgeted + '</td>'+
		'<td class="table_header_links" style="text-align:right" width="15%">' + GO.projects2.lang.invoiceAt + '</td>'+
		'<td class="table_header_links" style="text-align:right" width="15%">' + GO.projects2.lang.invoiceNo + '</td>'+
		'<td class="table_header_links" style="text-align:right" width="15%">' + GO.projects2.lang.referenceNo + '</td>'+
		'<td class="table_header_links" style="text-align:right" width="15%">' + GO.projects2.lang.invoiced + '</td>'+
		'</tr>'+

		'<tpl for="incomes">'+
		'<tr>'+
		'<td style="white-space:nowrap">{description}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{amount}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{invoice_at}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{invoice_number}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{reference_no}</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{is_invoiced}</td>'+
		'</tr>'+
		'</tpl>'+

		'<tpl if="values.income_total">'+
		'<tr style="border-top:1px solid black">'+
		'<td style="white-space:nowrap">' + GO.projects2.lang.totals + '</td>'+
		'<td style="white-space:nowrap;text-align:right" width="15%">{values.income_total}</td>'+
		'<td colspan="3" style="white-space:nowrap;text-align:right"></td>'+
		'</tr>'+
		'</tpl>'+

		'</table>'+
		'</tpl>',

	editHandler : function(){
		GO.projects2.showProjectDialog({
			project_id: this.link_id
		});
	},
	
	createTopToolbar : function(){
		var tbar = GO.projects2.ProjectPanel.superclass.createTopToolbar.call(this);

		tbar.splice(1,0,this.duplicateBtn = new Ext.Button({
			iconCls: 'btn-copy',
			text: GO.projects2.lang['duplicate'],
			cls: 'x-btn-text-icon',
			handler: function(){
				if(GO.projects2.max_projects>0 && this.treePanel.store.totalLength>=GO.projects2.max_projects)
				{
					Ext.Msg.alert(GO.lang.strError, GO.projects2.lang.maxProjectsReached);
				}else
				{
					
					if(!this.duplicateProjectDialog) {
						this.duplicateProjectDialo = new GO.projects2.DuplicateProjectDialog({})
						
					}
					
					this.duplicateProjectDialo.show({
						project_id: this.link_id,
						duplicate_id: this.link_id
					});
				}
			},
			scope: this
		}));

		return tbar;
	},

	initComponent : function(){

		this.on('afterbodyclick', function(panel, target, e, href){
			var pos = href.indexOf('#project-');
			if(pos>-1)
			{
				var project_id = href.substr(pos+9, href.length);

				this.load(project_id);
			}
		}, this);


		this.loadUrl = ('projects2/project/display');


//		this.subProjectsTemplate =  '<div id="projects2-subprojectsgrid"></div>';

//		'<tpl if="values.subprojects">'+
//		'{[this.collapsibleSectionHeader(GO.projects2.lang.subprojects, "pm-subprojects-"+values.panelId, "subprojects")]}'+
//
//		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0" id="pm-subprojects2-{panelId}">'+
//
//		'<tr>'+
//		'<td class="table_header_links">' + GO.lang['strName'] + '</td>'+
//		'<td class="table_header_links">' + GO.projects2.lang.status + '</td>'+
//		'<td class="table_header_links">' + GO.projects2.lang.dueAt + '</td>'+
//		'</tr>'+
//
//		'<tpl for="subprojects">'+
//		'<tr>'+
//		'<td><div class="go-grid-icon go-model-icon-GO_Projects2_Model_Project" style="width:auto;white-space:normal;margin-left:{margin}px;<tpl if="!GO.util.empty(icon)">background-image:url({icon}) !important;</tpl>"><a class="pm-subproject-link" href="#project-{id}">{name}</a></div></td>'+
//		'<td style="white-space:nowrap">{status_name}</td>'+
//		'<td style="white-space:nowrap" class="{[this.getClass(values)]}">{due_time}</td>'+
//		'</tr>'+
//		'</tpl>'+
//		'<tpl if="!subprojects.length">'+
//		'<tr><td colspan="4">'+GO.lang.strNoItems+'</td></tr>'+
//		'</tpl>'+
//		'</table>'+
//		'</tpl>';

		if(GO.lists)
			this.template += GO.lists.ListTemplate;

		if(GO.customfields)
			this.template +=GO.customfields.displayPanelTemplate;

		this.template += this.timeEntriesTemplate+
			this.expensesTemplate+
			this.incomesTemplate
//			+
//			this.subProjectsTemplate
			;

		//if(GO.workflow)
		//	this.template +=GO.workflow.WorkflowTemplate;

		if(GO.tasks)
			this.template +=GO.tasks.TaskTemplate;

		if(GO.calendar)
			this.template += GO.calendar.EventTemplate;

		this.template +=GO.linksTemplate;


		Ext.apply(this.templateConfig, {

			getBudgetClass : function(status){
				switch(status){
					case 2:
						return 'pm-over-budget';
						break;

					case 1:
						return 'pm-budget-warning';
						break
					default:
						return "";

						break;
				}
			},
			getClass: function(values){

				var cls = '';

				var now = new Date();
				var date = Date.parseDate(values.due_time, GO.settings.date_format);


				if(date<now)
				{
					cls = 'projects-late ';
				}

				if(values.completed=='1')
				{
					cls += 'projects-completed';
				}
				return cls;
			},
			getUnitsClass: function(values){
				var cls = '';
				if(values.units_budget>0 && values.units_booked>=values.units_budget)
				{
					cls = 'projects-late ';
				}

				return cls;
			}
		});

		if(GO.files) {
			Ext.apply(this.templateConfig, GO.files.filesTemplateConfig);
			this.template += GO.files.filesTemplate;
		}

		Ext.apply(this.templateConfig, GO.linksTemplateConfig);

		if(GO.comments)
			this.template += GO.comments.displayPanelTemplate;




		if(GO.tasks)
			this.scheduleCallItem = new GO.tasks.ScheduleCallMenuItem();

		GO.projects2.ProjectPanel.superclass.initComponent.call(this);

		this._addNewMenuButtons();
	},

	_addNewMenuButtons : function() {

		if(GO.tasks)
			this.newMenuButton.menu.add(this.scheduleCallItem);

		this.newMenuButton.menu.items.each(function(mi){
			if(mi.iconCls=='go-model-icon-GO_Projects2_Model_Project'){
				mi.hide();
			}
		});

		this.newMenuButton.menu.add('-');


		this.templatesStore = new GO.data.JsonStore({
			url : GO.url("projects2/template/menu"),
			baseParams : {
				'parent_project_id':"0"
			},
			root : 'results',
			totalProperty : 'total',
			id : 'id',
			fields : ['id', 'name','text'],
			remoteSort : true
		});

		if(GO.timeregistration2){
			this.newMenuButton.menu.add(this.addTimeEntryBtn = new Ext.menu.Item({
				iconCls:'pm-time-entry',
				text:GO.projects2.lang.timeEntry,
				handler:function(){
					if(!this.timeEntryDialog)
						this.timeEntryDialog = new GO.projects2.TimeEntryDialog({
							id: 'pm-timeentry-dialog'
						});

					this.timeEntryDialog.show(0,{
						loadParams:{
							project_id:this.data.id
						}
					});
				},
				scope:this
			}));
		}

//		this.newMenuButton.menu.add(this.addFromTimerMenuItem = new Ext.menu.Item({
//			iconCls:'pm-time-entry',
//			hidden : true,
//			text:GO.projects2.lang.timeEntry + ' (timer)' ,
//			handler:function(){
//				if(!this.timeEntryDialog)
//					this.timeEntryDialog = new GO.projects2.TimeEntryDialog({
//						id: 'pm-timeentry-dialog'
//					});
//
//				var hours = GO.projects2.timerButton.stopTimer();
//
//				this.timeEntryDialog.show(0,{
//					loadParams:{
//						project_id:this.data.id,
//						standardTaskDuration:(hours*60)
//					}
//				});
//
//				this.timeEntryDialog.startTime.setValue(GO.projects2.timeButton.startTime);
//				this.timeEntryDialog.setEndTime();
//
//			},
//			scope:this
//		}));

		this.newMenuButton.menu.add(this.addExpenseBtn = new Ext.menu.Item({
			iconCls:'pm-expense',
			text:GO.projects2.lang.expense,
			handler:function(){
				if(!this.expenseDialog){
					this.expenseDialog = new GO.projects2.ExpenseDialog();
				}
				this.expenseDialog.show(0,{
					values:{
						project_id:this.data.id
						}
				});
			},
			scope:this
		}));


				this.newMenuButton.menu.add({
					iconCls: 'go-model-icon-GO_Projects2_Model_Project',
					text: GO.projects2.lang.subproject,
					cls: 'x-btn-text-icon',
					handler: function(){
						if(GO.projects2.max_projects>0 && this.store.totalLength>=GO.projects2.max_projects)
						{
							Ext.Msg.alert(GO.lang.strError, GO.projects2.lang.maxProjectsReached);
						}else
						{
							GO.projects2.showProjectDialog({
								parent_project_id: this.data.id,
								values:{
									type_id:this.data.type_id
								}
								});
							GO.projects2.projectDialog.addListenerTillHide('save', function(){
								this.reload();
							}, this);
						}
					},
					scope: this
				});



		if(GO.projects2.has_finance_permission || GO.projects2.has_report_permission){
			this.newMenuButton.menu.add('-');
		}

		this.newMenuButton.menu.add(this.reportBtn = new Ext.menu.Item({
			iconCls: 'pm-btn-report',
			hidden: !GO.projects2.has_finance_permission&& !GO.projects2.has_report_permission,
			text: GO.projects2.lang.report,
			cls: 'x-btn-text-icon',
			handler: function(){
				if(!this.reportDialog){
					this.reportDialog = new GO.projects2.ReportDialog();
				}
				this.reportDialog.show(this.data.id);
			},
			scope: this
		}));
	},

	setData : function(data)
	{
		GO.projects2.ProjectPanel.superclass.setData.call(this, data);


		//set the default calendar id
		this.newMenuButton.menu.eventShowConfig={
			calendar_id:data.calendar_id
		};
		this.newMenuButton.menu.taskShowConfig={
			tasklist_id:data.tasklist_id
		};

		if(data.write_permission)
		{
			if(this.scheduleCallItem)
			{
				this.scheduleCallItem.setLinkConfig({
					name: this.data.contact,
					model_id: this.data.contact_id,
					model_name:"GO\\Addressbook\\Model\\Contact",
					callback:this.reload,
					scope: this
				});
			}
		}

		if(this.addTimeEntryBtn)
			this.addTimeEntryBtn.setDisabled(data.enabled_fields.indexOf('budget_fees')==-1);

		this.addExpenseBtn.setDisabled(data.enabled_fields.indexOf('expenses')==-1);
		//this.reportBtn.setDisabled(data.project_type==0);//not for container type
		
		// Disable the duplicate button if parent is not writable
		if(data.parent_project_write_permission){
			this.duplicateBtn.setDisabled(false);
		} else {
			this.duplicateBtn.setDisabled(true);
		}
	}
});


Ext.reg('projectpanel',GO.projects2.ProjectPanel);