/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: PaymentsGrid.js 19881 2014-10-27 13:45:58Z wsmits $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.billing.PaymentsGrid = Ext.extend(GO.grid.GridPanel, {
	
	orderDialog: null,
	
	initComponent: function () {
		
		this.store = new GO.data.JsonStore({
			url: GO.url('billing/payment/store'),
			root: 'results',
			id: 'id',
			totalProperty: 'total',
			fields: ['id','date','amount','description'],
			remoteSort: true
		});
		
		this.summary = new Ext.grid.JsonSummary();

		Ext.apply(this, {
			title: GO.billing.lang.payments,
			layout: 'fit',
			standardTbar:true,
			editDialogClass: GO.billing.PaymentDialog,
			hideSearchField:true,
			autoScroll: true,
			plugins: this.summary,
			sm: new Ext.grid.RowSelectionModel(),
			store: this.store,
			border: false,
			paging: true,
			view: new Ext.grid.GridView({
				emptyText: GO.lang['strNoItems'],
				autoFill:true
//				,
//				getRowClass: this.rowRenderer
			}),
			cm: new Ext.grid.ColumnModel({
				defaults: {
					sortable: true
				},
				columns: [
					{
						header: GO.lang.strDate,
						dataIndex: 'date',
						id: 'date',
						width:100,
						align:'left'
					},{
						header: GO.billing.lang.moneyAmount,
						dataIndex: 'amount',
						align: 'left',
						id: 'amount',
						width: 80,
						sortable: true
					},{
						header: GO.lang.strDescription,
						dataIndex: 'description',
						id: 'description',
						width:400,
						align:'left'
					}
				]
			})			
		});

		GO.billing.PaymentsGrid.superclass.initComponent.call(this);
	},
	
	setOrderId : function(order_id){
		this.order_id = order_id;
		this.store.baseParams.order_id=order_id;
		this.store.load();
	},
		
	showEditDialog : function(id, config, record){
    config = config || {};
		if(!this.editDialog){
			this.editDialog = new this.editDialogClass(this.editDialogConfig);

			this.editDialog.on('save', function(){   
				this.store.reload();
//				this.orderDialog.totalPaidField.setValue();
			}, this);	
		}
		
		this.editDialog.setOrderId(this.order_id);
		this.editDialog.show(id, config);
	}
});