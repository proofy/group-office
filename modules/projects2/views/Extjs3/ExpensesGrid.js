/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ExpensesGrid.js 20125 2015-01-12 14:48:54Z wvbeusekom $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 * @author Michael de Hart <msdhart@intermesh.nl>
 */


GO.projects2.ExpensesGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		this.summary = new Ext.grid.GridSummary();

		this.store = new GO.data.JsonStore({
			url:GO.url("projects2/expense/store"),
			fields:['id','project_id','nett','vat','date','description','expense_budget']
		})
		this.store.on('load', function(me, records, options){ 
			if(records.length===0)
				this.summary.view.summary.update();
		},this);

		Ext.apply(this,{
			plugins: [this.summary],
			title:GO.projects2.lang.expenses,
			disabled:true,
			tbar: [{
				itemId:'add',
				iconCls: 'btn-add',							
				text: GO.lang['cmdAdd'],
				cls: 'x-btn-text-icon',
				handler: this.btnAdd,
				disabled:false,
				scope: this
			},{
				itemId:'delete',
				iconCls: 'btn-delete',
				text: GO.lang['cmdDelete'],
				cls: 'x-btn-text-icon',
				disabled:false,
				handler: function(){
					this.deleteSelected();
				},
				scope: this
			},
			'-',
			{
				itemId:'duplicate',
				iconCls: 'btn-add',
				text: GO.projects2.lang['duplicate'],
				cls: 'x-btn-text-icon',
				disabled: false,
				handler: function() {
					this.queryDuplicate();
				},
				scope: this
			}],
			store: this.store,
			border: false,
			paging:true,
			editDialogClass: GO.projects2.ExpenseDialog,
			listeners:{
				show:function(){
					this.store.load();
				},
				scope:this
			},
			cm:new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:[{
					header: GO.projects2.lang.expenseBudget,
					dataIndex: 'expense_budget'
				},{
					header: GO.lang.strDescription,
					dataIndex: 'description'
				},{
					header: GO.projects2.lang.amount,
					dataIndex: 'nett',
					summaryType: 'sum',
					editor: new GO.form.NumberField({
						allowBlank: false
					}),
					align:'right'
//					renderer:function(v){
//						var number = GO.util.unlocalizeNumber(v);
//						return GO.util.numberFormat(number);
//					}
				},{
					header: GO.projects2.lang.vat,
					dataIndex: 'vat',
					
					editor: new GO.form.NumberField({
						allowBlank: false
					}),
					align:'right'
				},{
					header: GO.lang.strDate,
					dataIndex: 'date',
					editor: new Ext.form.DateField({
						format:GO.settings.date_format
					}),

					renderer: function(value){
						return typeof(value.dateFormat)=='undefined' ? value : value.dateFormat(GO.settings.date_format);
					},
					summaryRenderer:function(){
						return '&nbsp;';
					}
				}]
			})
		});
		
		GO.projects2.ExpensesGrid.superclass.initComponent.call(this);		
	},

	
	setProjectId : function(project_id){
		this.store.baseParams.project_id=project_id;
		this.setDisabled(GO.util.empty(project_id));
	},
	btnAdd : function(){
		if(this.editDialogClass){
			this.showEditDialog(0,{
				values:{
					project_id:this.store.baseParams.project_id
					}
			});
		}
	},
	queryDuplicate: function() {
		Ext.Msg.show({
			title: GO.projects2.lang.duplicateQuestionTitle,
			icon: Ext.MessageBox.QUESTION,
			msg: GO.projects2.lang.duplicateQuestionMsg,
			buttons: Ext.Msg.YESNO,
			scope:this,
			fn: function(btn) {
				if (btn=='yes') {
					var selectedRecords = this.getSelectionModel().getSelections();
					
					var selectedIds = new Array();
					for (var i=0; i<selectedRecords.length; i++) {
						selectedIds.push(selectedRecords[i].data.id);
					}
					
					GO.request({
//						timeout:300000,
						maskEl:Ext.getBody(),
						url:'projects2/expense/duplicate',
						params:{
							expenseIds:Ext.encode(selectedIds)
						},
						success: function() {
							this.store.load();
						},
						scope:this
					});
				}
			}
		});
	}
});
