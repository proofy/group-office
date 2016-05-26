/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: IncomeGrid.js 20558 2015-06-01 12:05:56Z mdhart $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */


GO.projects2.IncomeGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		this.summary = new Ext.grid.GridSummary();

		this.store = new GO.data.JsonStore({
			url:GO.url("projects2/income/store"),
			fields:['id','project_id','description','reference_no','amount','is_invoiced','invoiceable', 'invoice_at','invoice_number','type','comments','is_contract','contract_repeat_amount','contract_repeat_freq'],
			baseParams: {
				forProjectTabPanel: true
			}
		});

		var action = new Ext.ux.grid.RowActions({
			header:'',
			hideMode:'display',
			keepSelection:true,
			actions:[{
				qtipIndex:'qtip1',
				iconCls:'btn-read',
				tooltip:GO.projects2.lang['searchFiles'],
				tooltipType: 'title'
			}],
			width: 50
		});

		action.on({
			action:function(grid, record, action, row, col) {

				switch(action){
					case 'btn-read':
						
						if (!GO.files) {
							Ext.Msg.alert(GO.lang.strError,'This button requires the Files module to be activated.');
						}
						GO.request({
							url:'files/folder/checkModelFolder',
							maskEl:this.ownerCt.ownerCt.getEl(),
							params:{								
								mustExist:true,
								model:'GO\\Projects2\\Model\\Income',
								id:record.data.id
							},
							success:function(response, options, result){														
								GO.files.openFolder(result.files_folder_id);
							},
							scope:this

						});
						break;
				}
			},
			scope: this
		}, this);

		Ext.apply(this,{
			plugins: [this.summary, action],
			title:GO.projects2.lang.income,
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
			editDialogClass: GO.projects2.IncomeDialog,
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
					dataIndex:'invoiceable',
					header: GO.projects2.lang['invoiceable'],
					renderer: function(v,m,r) { 
						if(r.data.invoiceable){
							return '<div title="'+GO.projects2.lang['invoiceable']+'" class="go-icon-exclamation"><div class="x-grid3-cell-inner" style="height:16px; width: 16px;"></div<</div>';
						}
					},
					width: 10
				},{
					dataIndex: 'is_invoiced',
					renderer: function(v,m,r) { 
						if(r.data.is_invoiced){
							return '<div title="'+GO.projects2.lang['invoiced']+'" class="tasks-complete-icon"></div>';
						}
					},
					width: 10
				},{
					dataIndex: 'is_contract',
					header: GO.projects2.lang.contract,
					renderer: function(v,m,r) { 
						if(r.data.is_contract){
							return GO.lang.yes;
							//return '<div title="'+GO.projects2.lang['contract']+'" class="tasks-complete-icon"></div>';
						} else {
							return GO.lang.no;
						}
					},
					width: 80
				},{
					dataIndex: 'contract_repeat_freq',
					header: GO.projects2.lang.repeat,
					renderer: function(v,m,r) { 
						if(r.data.contract_repeat_freq){
							
							var langKey = 'str'+GO.util.format.capitalize(r.data.contract_repeat_freq);
							return r.data.contract_repeat_amount +' '+ GO.lang[langKey];
						}
					},
					width: 110,
					sortable:false
				},{
					header: GO.lang.strDescription,
					dataIndex: 'description'
				},{
					header: GO.projects2.lang['referenceNo'],
					dataIndex: 'reference_no'
				},{
					header: GO.projects2.lang['amount'],
					dataIndex: 'amount',
					align: 'right',
					renderer: GO.util.format.valuta
				}/*,{
					header: GO.projects2.lang['invoiced'],
					dataIndex: 'is_invoiced',
					renderer: GO.util.format.yesNo
				}*/,{
					header: GO.projects2.lang['invoiceAt'],
					dataIndex: 'invoice_at',
					renderer: function(value){
						return !value.dateFormat ? value : value.dateFormat(GO.settings.date_format);
					},
					summaryRenderer:function(){
						return '&nbsp;';
					}
				},{
					header: GO.projects2.lang['invoiceNo'],
					dataIndex: 'invoice_number'
				},{
					header: GO.lang.strType,
					dataIndex: 'type',
					renderer: function(v) {
						if(v==1)
							return GO.projects2.lang['contractPrice'];
						else
							return GO.projects2.lang['postCalculation'];
					}
				},{
					header: GO.lang['strComment'],
					dataIndex: 'comments',
					sortable: true,
					hidden: true
				},action]
			})
		});
		
		GO.projects2.IncomeGrid.superclass.initComponent.call(this);		
	},

	
	setProjectId : function(project_id){
		this.store.baseParams.project_id=project_id;
		this.setDisabled(GO.util.empty(project_id));
	},
	btnAdd : function(){
		if(this.editDialogClass){
			this.showEditDialog(0,{
				project_id:this.store.baseParams.project_id,
				loadParams: { project_id : this.store.baseParams.project_id }
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
						url:'projects2/income/duplicate',
						params:{
							incomeIds:Ext.encode(selectedIds)
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
