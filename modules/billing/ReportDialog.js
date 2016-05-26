/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: ReportDialog.js 18398 2014-02-28 09:35:42Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */


GO.billing.ReportDialog = function(config) {


	if (!config)
	{
		config = {};
	}

	this.yearField = new Ext.form.DisplayField({
		name: 'year',
		hideLabel: true
	})


	this.previousButton = new Ext.Button({
		text: GO.lang['cmdPrevious'],
		handler: function() {
			this.yearField.setValue(parseInt(this.yearField.getValue()) - 1);

			var thisYear = parseInt(this.yearField.getValue());
			var first_day_year = new Date(thisYear, 0, 1);
			var last_day_year = new Date(thisYear + 1, 0, 0);
			this.startDate.setValue(first_day_year.format(GO.settings.date_format));
			this.endDate.setValue(last_day_year.format(GO.settings.date_format));
			this.changeDate(this.startDate);
		},
		scope: this
	});

	this.nextButton = new Ext.Button({
		text: GO.lang['cmdNext'],
		handler: function() {
			this.yearField.setValue(parseInt(this.yearField.getValue()) + 1);

			var thisYear = parseInt(this.yearField.getValue());
			var first_day_year = new Date(thisYear, 0, 1);
			var last_day_year = new Date(thisYear + 1, 0, 0);
			this.startDate.setValue(first_day_year.format(GO.settings.date_format));
			this.endDate.setValue(last_day_year.format(GO.settings.date_format));
			this.changeDate(this.startDate);
		},
		scope: this
	});

	var booksCheckColumn = new GO.grid.CheckColumn({
		header: '&nbsp;',
		dataIndex: 'report_checked',
		width: 30
	});

	var booksPanel = new GO.grid.GridPanel({
		store: GO.billing.writableBooksStore,
		columns: [
			booksCheckColumn,
			{
				header: GO.lang.strName,
				dataIndex: 'name'
			}
		],
		title: GO.billing.lang.books,
		plugins: booksCheckColumn,
		autoHeight: true,
		cls: 'go-grid3-hide-headers',
		loadMask: true
	});



	var expenseBooksCheckColumn = new GO.grid.CheckColumn({
		header: '&nbsp;',
		dataIndex: 'report_checked',
		width: 30
	});

	this.expenseBooksPanel = new GO.grid.GridPanel({
		store: GO.billing.writableExpenseBooksStore,
		columns: [
			expenseBooksCheckColumn,
			{
				header: GO.lang.strName,
				dataIndex: 'name'
			}
		],
		title: GO.billing.lang.expenseBooks,
		plugins: expenseBooksCheckColumn,
		autoHeight: true,
		cls: 'go-grid3-hide-headers',
		loadMask: true
	});

	var applyButton = new Ext.Button({
		text: GO.lang.cmdApply,
		handler: function() {

			var books = [];

			for (var i = 0; i < GO.billing.writableBooksStore.data.items.length; i++)
			{
				var checked = GO.billing.writableBooksStore.data.items[i].get('report_checked');
				if (checked == "1")
				{
					books.push(GO.billing.writableBooksStore.data.items[i].get('id'));
				}
			}
			GO.billing.writableBooksStore.commitChanges();

			var expense_books = [];

			for (var i = 0; i < GO.billing.writableExpenseBooksStore.data.items.length; i++)
			{
				var checked = GO.billing.writableExpenseBooksStore.data.items[i].get('report_checked');
				if (checked == "1")
				{
					expense_books.push(GO.billing.writableExpenseBooksStore.data.items[i].get('id'));
				}
			}

			GO.billing.writableExpenseBooksStore.commitChanges();

			this.reportGrid.store.baseParams.books = Ext.encode(books);
			this.reportGrid.store.baseParams.expense_books = Ext.encode(expense_books);
			this.reportGrid.store.load();
			delete this.reportGrid.store.baseParams.books;
			delete this.reportGrid.store.baseParams.expense_books;

			this.customerReportGrid.store.baseParams.books = Ext.encode(books);
			this.customerReportGrid.store.baseParams.expense_books = Ext.encode(expense_books);
			this.customerReportGrid.store.load();
			delete this.customerReportGrid.store.baseParams.books;
			delete this.customerReportGrid.store.baseParams.expense_books;

		},
		scope: this
	});

	var now = new Date();
	var thisYear = parseInt(now.format("Y"));
	var first_day_year = new Date(thisYear, 0, 1);
	var last_day_year = new Date(thisYear + 1, 0, 0);
	this.startDate = new Ext.form.DateField({
		width: 130,
		name: 'start_date',
		format: GO.settings['date_format'],
		allowBlank: true,
		fieldLabel: GO.lang.strStart,
		listeners: {
			change: {
				fn: this.changeDate,
				scope: this
			}
		}
	});

	this.endDate = new Ext.form.DateField({
		width: 130,
		name: 'end_date',
		format: GO.settings['date_format'],
		allowBlank: true,
		fieldLabel: GO.lang.strEnd,
		value: last_day_year,
		listeners: {
			change: {
				fn: this.changeDate,
				scope: this
			}
		}
	});

	this.formPanel = new Ext.form.FormPanel({
		region: 'west',
		height: 50,
		labelWidth: 50,
		width: 230,
		split: true,
		waitMsgTarget: true,
		url: GO.url('billing/report/yearReport'),
		border: true,
		baseParams: {task: 'report'},
		autoScroll: true,
		defaults: {border: false},
		items: [{
				xtype: 'compositefield',
				hideLabel: true,
				items: [this.previousButton, this.yearField, this.nextButton]
			},
			this.datePanel = new Ext.Panel({
				layout: 'form',
				defaults: {border: false, cls: 'go-form-panel'},
				items: [this.startDate, this.endDate]
			}),
			booksPanel,
			this.expenseBooksPanel,
			new Ext.Panel({
				cls: 'go-form-panel', waitMsgTarget: true,
				items: applyButton
			})

		]
	});


	this.reportGrid = new GO.billing.ReportGrid({
		region: 'center',
		title: GO.billing.lang.yearReport
	});

	this.reportGrid.on('show', function() {
		this.expenseBooksPanel.setVisible(true);
		this.datePanel.setVisible(false);
	}, this);

	this.customerReportGrid = new GO.billing.CustomerReportGrid({
		region: 'center',
		title: GO.billing.lang.customerReport
	});

	this.customerReportGrid.on('show', function() {
		this.expenseBooksPanel.setVisible(false);
		this.datePanel.setVisible(true);
	}, this);

	this.reportTab = new Ext.TabPanel({
		region: 'center',
		items: [this.reportGrid, this.customerReportGrid],
		activeTab: 0
	});



	var focusFirstField = function() {
		this.formPanel.items.items[0].focus();
	};

	config.collapsible = true;
	config.maximizable = true;
	config.layout = 'border';
	config.modal = false;
	config.resizable = true;
	config.border = false;
	config.width = 700;
	config.height = 500;
	config.closeAction = 'hide';
	config.title = GO.billing.lang.report;
	config.items = [this.formPanel, this.reportTab];
	config.focus = focusFirstField.createDelegate(this);

	GO.billing.ReportDialog.superclass.constructor.call(this, config);
	this.addEvents({'save': true});
}
Ext.extend(GO.billing.ReportDialog, GO.Window, {
	changeDate: function(field)
	{
		if (this.startDate.getValue() > this.endDate.getValue())
		{
			if (field.name == 'end_date')
			{
				this.startDate.setValue(this.endDate.getValue());
			} else
			{
				this.endDate.setValue(this.startDate.getValue());
			}
		}
		this.reportGrid.store.baseParams.start_date = this.startDate.getValue().format(GO.settings.date_format);
		this.reportGrid.store.baseParams.end_date = this.endDate.getValue().format(GO.settings.date_format);
		this.reportGrid.store.load();
		this.customerReportGrid.store.baseParams.start_date = this.startDate.getValue().format(GO.settings.date_format);
		this.customerReportGrid.store.baseParams.end_date = this.endDate.getValue().format(GO.settings.date_format);
		this.customerReportGrid.store.load();
	},
	show: function(book_id) {
		if (!this.rendered)
		{
			this.render(Ext.getBody());
		}

		if (!GO.billing.writableExpenseBooksStore.loaded)
			GO.billing.writableExpenseBooksStore.load();

		var now = new Date();
		var thisYear = parseInt(now.format("Y"));
		var first_day_year = new Date(thisYear, 0, 1);
		var last_day_year = new Date(thisYear + 1, 0, 0);
		this.reportGrid.store.baseParams.start_date = first_day_year.format(GO.settings.date_format);
		this.reportGrid.store.baseParams.end_date = last_day_year.format(GO.settings.date_format);
		this.customerReportGrid.store.baseParams.start_date = first_day_year.format(GO.settings.date_format);
		this.customerReportGrid.store.baseParams.end_date = last_day_year.format(GO.settings.date_format);
		this.startDate.setValue(this.reportGrid.store.baseParams.start_date);
		this.endDate.setValue(this.reportGrid.store.baseParams.end_date);
		this.yearField.setValue(thisYear);
		this.reportGrid.store.load();
		this.customerReportGrid.store.load();

		GO.billing.ReportDialog.superclass.show.call(this);

},
	submitForm: function() {

		this.formPanel.form.submit(
		{
			url: GO.url('billing/report/yearReport'),
			params: {'task': 'report'},
			waitMsg: GO.lang.waitMsgSave,
			success: function(form, action) {


			},
			failure: function(form, action) {
				if (action.failureType == 'client')
				{
					Ext.MessageBox.alert(GO.lang['strError'], GO.lang['strErrorsInForm']);
				} else {
					Ext.MessageBox.alert(GO.lang['strError'], action.result.feedback);
				}
			},
			scope: this
		});

	}
});