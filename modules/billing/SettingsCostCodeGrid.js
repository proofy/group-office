/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: SettingsCostCodeGrid.js 20057 2014-12-09 15:40:34Z wsmits $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.billing.SettingsCostCodeGrid = Ext.extend(GO.grid.GridPanel, {
	initComponent: function () {

		this.store = new GO.data.JsonStore({
			url: GO.url('billing/costcode/store'),
			baseParams: {
				book_id: 0
			},
			root: 'results',
			id: 'id',
			totalProperty: 'total',
			fields: ['id','code','name','description'],
			remoteSort: true
		});

		Ext.apply(this, {
			title: GO.billing.lang.costCodes,
			layout: 'fit',
			standardTbar:true,
			editDialogClass: GO.billing.CostCodeDialog,
			relatedGridParamName:'book_id',
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
						header: GO.billing.lang.costCode,
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

		GO.billing.SettingsCostCodeGrid.superclass.initComponent.call(this);
	},
	afterRender : function()
	{
		GO.billing.SettingsCostCodeGrid.superclass.afterRender.call(this);
		
		if(this.isVisible())
		{
			this.onGridShow();
		}
	},
	
	onGridShow : function(){
		if(!this.store.loaded && this.rendered)
		{
			this.store.load();
		}
	},
	setBookId : function(book_id){
		if(this.store.baseParams.book_id!=book_id){
			this.store.baseParams.book_id=book_id;
			if(book_id == 0){
				this.store.baseParams.global=1;
			}else{
				this.store.baseParams.global=0;
			}
			this.store.load();
		}
	}
});