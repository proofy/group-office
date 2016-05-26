/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: WeekGrid.js 20040 2014-12-04 10:23:55Z mdhart $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.hoursapproval2.WeekGrid = Ext.extend(GO.grid.GridPanel, {
	mainPanel: false, //thestore to reload when a week is selected

	selectedRecord : false,

	getYear: function() {
		return this.store.baseParams.year;
	},
	initComponent: function() {

		var now = new Date();

		var toolbar = [this.leftArrow = new Ext.Button({
				iconCls: 'btn-left-arrow',
				handler: function() {
					this.store.baseParams.year--;
					this.yearPanel.body.update(this.store.baseParams.year);
					this.store.load();
				},
				scope: this
			}), this.yearPanel = new Ext.Panel({
				html: now.format('Y') + "",
				plain: true,
				border: true,
				cls: 'cal-period'
			}), this.rightArrow = new Ext.Button({
				iconCls: 'btn-right-arrow',
				handler: function() {
					this.store.baseParams.year++;
					this.yearPanel.body.update(this.store.baseParams.year);
					this.store.load();
				},
				scope: this
			})]



		Ext.applyIf(this, {
			title: GO.lang.strWeek,
			region: 'west',
			tbar: toolbar,
			sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
			store: new GO.data.JsonStore({
				url: GO.url('hoursapproval2/approve/weeks'),
				fields: ['weeknb', 'closed', 'name', 'start_time'],
				baseParams: {year: now.format('Y')},
				listeners: {
					load: function(records, operation, success) {
						var onejan = new Date((new Date()).getFullYear(), 0, 1);
						var weeknb = Math.ceil((((new Date() - onejan) / 86400000) + onejan.getDay() + 1) / 7);
						if(this.selectedRecord) {
							weeknb = this.selectedRecord.data.weeknb;
						}
						var index = this.store.findBy(function(record) {
							return record.data.weeknb == weeknb;
						});

						this.getSelectionModel().selectRow(index, true);
						this.getView().focusRow(index);
					},
					scope: this
				}
			}),
			cm: new Ext.grid.ColumnModel({
				columns: [
					{
						header: GO.lang.strWeek,
						dataIndex: 'name',
						renderer: function(v, meta, record) {
							switch (record.get('closed')) {

								case true:
									meta.css = 'go-icon-ok';
									break;

								default:
									meta.css = 'go-icon-empty';
									break;
							}

							return v;
						}
					}
				]
			})
		});

		GO.hoursapproval2.WeekGrid.superclass.initComponent.call(this);

		this.on('delayedrowselect', function(sm, i, record) {
			if (this.mainPanel) {
				this.mainPanel.timeEntryGrid.startTime = record.get('start_time');
				this.mainPanel.cardPanel.layout.setActiveItem(0);
				this.mainPanel.timeEntryGrid.setTitle(record.get('name'));
				this.mainPanel.timeEntryGrid.loadEntries('week', record.get('weeknb'), this.store.baseParams.year);
			}
		}, this);
	}
});