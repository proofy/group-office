/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: TrackingCodeGrid.js 19840 2014-10-17 14:54:43Z wsmits $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.billing.TrackingCodeGrid = Ext.extend(GO.grid.GridPanel, {
	
	costcode_id : 0,

	initComponent: function () {

		this.store = GO.billing.trackingCodeStore;

		Ext.apply(this, {
			title: GO.billing.lang.trackingCodes,
			layout: 'fit',
			standardTbar:true,
			editDialogClass: GO.billing.TrackingCodeDialog,
			hideSearchField:true,
			autoScroll: true,
			sm: new Ext.grid.RowSelectionModel(),
			store: this.store,
			border: false,
			paging: true,
			view: new Ext.grid.GridView({
				emptyText: GO.lang['strNoItems']
//				,
//				getRowClass: this.rowRenderer
			}),
			cm: new Ext.grid.ColumnModel({
				defaults: {
					sortable: true
				},
				columns: [
					{
						header: GO.billing.lang.trackingCode,
						dataIndex: 'code',
						align: 'left',
						id: 'code',
						width: 80,
						sortable: true
					},{
						header: GO.lang.strName,
						dataIndex: 'name',
						width:200,
						align:'left'
					},{
						header: GO.lang.strDescription,
						dataIndex: 'description',
						width:200,
						align:'left'
					}
				]
			})			
		});

		GO.billing.TrackingCodeGrid.superclass.initComponent.call(this);
	},
	setCostcode : function(costcode_id){
		this.costcode_id = costcode_id;
		this.store.baseParams.costcode_id = this.costcode_id;
		this.store.load();
	},
	showEditDialog : function(id, config, record){
    config = config || {};
		if(!this.editDialog){
			this.editDialog = new this.editDialogClass(this.editDialogConfig);

			this.editDialog.on('save', function(){   
				this.store.reload();   
			}, this);	
		}
		
		this.editDialog.setCostcode(this.costcode_id);
		this.editDialog.show(id, config);
	}
});