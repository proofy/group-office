GO.pr2analyzer.HoursGrid = function(config) {

	

	config = config || {};
	config.store = new GO.data.JsonStore({
		url: GO.url('pr2analyzer/time/entries'),
		root: 'results',
		totalProperty: 'total',
		id: 'id',
		fields: ['id', 'duration', 'user_name', 'date', 'fee_name', 'comments', 'project_name', 'internal_fee', 'external_fee', 'invoice_id', 'payout_invoice_id', 'ctime', 'mtime', 'status'],
		remoteSort: true
	});

	if (config.project_id)
	{
		this.setProjectId(config.project_id);
	}

	config.stateId = 'pr2-hours-table';
	config.paging = true;

	var columns = [
		{
			header: GO.projects2.lang.units,
			dataIndex: 'duration',
			renderer: function(v, metaData, record) { return this.reportGrid.formatTime(v);  },
			scope:  this,
			width: 50,
			align: 'right'
		},
		{
			header: GO.projects2.lang.project,
			dataIndex: 'project_name',
			width: 120
		},
		{
			header: GO.lang.strUser,
			dataIndex: 'user_name',
			width: 120,
			sortable: false
		},
		{
			header: GO.lang.strDate,
			dataIndex: 'date',
			width: 80
		},
		/*{
			header: GO.projects2.lang.fee,
			dataIndex: 'fee_name',
			width: 120
		},*/
		{
			header: GO.lang.strCtime,
			dataIndex: 'ctime',
			hidden: true,
			width: 110
		},
		{
			header: GO.lang.strMtime,
			dataIndex: 'mtime',
			hidden: true,
			width: 110
		}
	];

	if (GO.settings.modules.projects2.write_permission)
	{
		columns.splice(columns.length, 0, {
			header: GO.projects2.lang.internalFee,
			dataIndex: 'internal_fee',
			sortable: false,
			align: 'right'
		}, {
			header: GO.projects2.lang.externalFee,
			dataIndex: 'external_fee',
			sortable: false,
			align: 'right'
		}/*, {
			header: GO.projects2.lang.profit,
			dataIndex: 'profit',
			renderer : function(v, metaData, record) { return '-'; },
			sortable: false,
			align: 'right'
		}, {
			header: GO.projects2.lang.invoiceId,
			dataIndex: 'invoice_id',
			sortable: true
		}*/, {
			header: GO.projects2.lang.payoutInvoiceId,
			dataIndex: 'payout_invoice_id',
			sortable: true
		});
	}

	if (GO.hoursapproval2) {
		columns.push({
			header: GO.hoursapproval2.lang.approved,
			dataIndex: 'status',
			sortable: true,
			width: 30
		});
	}

	var columnModel = new Ext.grid.ColumnModel({
		defaults: {
			sortable: true
		},
		columns: columns
	});

	config.cm = columnModel;

	config.view = new Ext.grid.GridView({
		emptyText: GO.projects2.lang.noHours,
		enableRowBody: true,
		showPreview: true,
		getRowClass: function(record, rowIndex, p, store) {
			if (this.showPreview) {
				p.body = '<p class="pr2-hours-comments">' + record.data.comments + '</p>';
				return 'x-grid3-row-expanded';
			}
			return 'x-grid3-row-collapsed';
		}
	}),
			config.sm = new Ext.grid.RowSelectionModel();
	config.loadMask = true;

	config.tbar = [{
			iconCls: 'btn-delete',
			text: GO.lang['cmdDelete'],
			cls: 'x-btn-text-icon',
			handler: function() {
				this.deleteSelected();
			},
			scope: this
		}/*,{
			iconCls: 'btn-export',
			text: GO.lang.cmdExport,
			scope: this,
			handler: function() {
				if (!this.exportDialog)
				{
					this.exportDialog = new GO.ExportQueryDialog({
						query: 'timeregistration'
					});
				}
				this.exportDialog.show({
					colModel: this.getColumnModel(),
					title: this.ownerCt.title
							//searchQuery: this.centerPanel.searchField.getValue()
				});
			}
		}*/];
	config.listeners = {
		rowdblclick: function(grid, rowClicked, e) {
			if (!this.hoursDialog)
			{
				this.hoursDialog = new GO.projects2.TimeEntryDialog();
				this.hoursDialog.on('save', function() {
					this.store.reload();
				}, this);
			}
			this.hoursDialog.show(grid.selModel.selections.keys[0]);
		},
		show: function() {
			if (this.loaded_project_id != this.project_id)
			{
				this.loaded_project_id = this.project_id;
				this.store.load();
			}
		},
		scope: this
	};

	GO.pr2analyzer.HoursGrid.superclass.constructor.call(this, config);

};

Ext.extend(GO.pr2analyzer.HoursGrid, GO.grid.GridPanel, {
	project_id: 0,
	loaded_project_id: 0,
	setProjectId: function(project_id)
	{
		this.project_id = project_id;
		this.store.baseParams.project_id = project_id;
	}
});
