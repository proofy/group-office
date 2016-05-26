/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: RatesGrid.js 20369 2015-03-26 16:15:52Z wvbeusekom $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */



GO.tickets.RatesGrid = function(config){
	if(!config)
	{
		config = {};
	}

	config.layout='fit';
	config.autoScroll=true;
	config.split=true;

	config.title=GO.tickets.lang.rates;

	if (typeof(config.objectType)=='undefined') {
		config.store=GO.tickets.ratesStore;
	} else if (config.objectType=='company') {
		config.store= GO.tickets.companyRatesStore;
	}

	config.bbar = new Ext.PagingToolbar({
		cls: 'go-paging-tb',
		store: config.store,
		pageSize: parseInt(GO.settings['max_rows_list']),
		displayInfo: true,
		displayMsg: GO.lang['displayingItems'],
		emptyMsg: GO.lang['strNoItems']
	});

	var columns = [	{
			header: GO.lang.strName,
			dataIndex: 'name',
			editor: new Ext.form.TextField({
				allowBlank: false
			})
		},{
			header: GO.tickets.lang.amount,
			dataIndex: 'amount',
			editor: new GO.form.NumberField({
				allowBlank: false
			}),
			align:'right'
		}];



	if (GO.billing){
		
			this.costCodeCombo = new GO.form.ComboBoxReset({
					name : 'cost_code',
					hideLabel: true,
					store: new GO.data.JsonStore({
						url: GO.url('billing/costcode/store'),
						baseParams : {
							permissionLevel : GO.permissionLevels.read
						},
						fields : ['id','code'],
						root : 'results',
						id : 'id',
						totalProperty : 'total',
						setBookId : function(book_id){
							if(this.baseParams.book_id!=book_id){
								this.baseParams.book_id=book_id;
								this.reload();
							}
						}
					}),
					displayField:'code',
					valueField: 'code',
					mode:'local',
					triggerAction:'all',
					selectOnFocus:true,
					forceSelection: true,
					anchor:'-20',
					value:''
				});
		
		columns.push({
			header: GO.billing.lang['costCode'],
			dataIndex: 'cost_code',
			editor: this.costCodeCombo
		});
	}

	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns: columns
	});

	config.cm=columnModel;
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: GO.lang['strNoItems']
	});
	config.sm=new Ext.grid.RowSelectionModel({
	    singleSelect : true
	});
	config.loadMask=true;

	config.clicksToEdit=1;



	var recordFields = [
	{
		name: 'id',
		type: 'int'
	},
	{
		name: 'name',
		type:'string'
	},{
		name: 'amount',
		type: 'string'
	}
	];
	
	if (GO.billing)
		recordFields.push({
			name: 'cost_code',
			type: 'string'
		});

	var Rate = Ext.data.Record.create(recordFields);


	config.tbar=[{
		iconCls: 'btn-add',
		text: GO.lang['cmdAdd'],
		cls: 'x-btn-text-icon',
		handler: function(){
			var e = new Rate({
				id: '0',
				name:'',
				amount: GO.util.numberFormat("0")
			});
			this.stopEditing();
			this.store.insert(0, e);
			this.startEditing(0, 0);
		},
		scope: this
	},{
		iconCls: 'btn-delete',
		text: GO.lang['cmdDelete'],
		cls: 'x-btn-text-icon',
		handler: function(){
		    if (typeof(this.selectedIndex)!='undefined') {
					if (this.store.getAt(this.selectedIndex).data.id!='0') {
							Ext.Ajax.request({
							url : GO.url('tickets/rate/delete'),
							params : {
									'id' : this.store.getAt(this.selectedIndex).data.id
							},
							callback:function(options, success, response){
								var result = Ext.decode(response.responseText);
								if (!success || !result.success) {
									if (result.responseText.feedback) {
										Ext.MessageBox.alert(GO.lang.strError,result.responseText.feedback);
							}
								}
						},
						scope:this
							});
					}
					this.store.removeAt(this.selectedIndex);
		    }
		},
		scope: this
	}];

	config.listeners={
		render:function(){
		    if(GO.settings.modules.tickets.write_permission && !this.store.loaded)
			this.store.load();
		},
		rowclick: function(sm,i,record) {
		    this.selectedIndex = i;
		},
		scope:this
	}

	GO.tickets.RatesGrid.superclass.constructor.call(this, config);

	this.on('show',function(){
		if (this.costCodeCombo)
			this.costCodeCombo.store.load();
	},this);

};
Ext.extend(GO.tickets.RatesGrid, Ext.grid.EditorGridPanel,{
	
	setCompanyId : function(company_id) {
	    this.store.baseParams.company_id = this.company_id = company_id;
	},
	
	getGridData : function(){

		var data = {};

		for (var i = 0; i < this.store.data.items.length;  i++)
		{
			var r = this.store.data.items[i].data;

			data[i]={};

			for(var key in r)
			{
				data[i][key]=r[key];
			}
		}

		return data;
	},
	setIds : function(ids)
	{
		for(var index in ids)
		{
			if(index!="remove")
			{
				this.store.getAt(index).set('id', ids[index]);
			}
		}
	},
	save : function(maskEl){
		if (this.company_id) {
			var params = {
				task:'rates',
				rates:Ext.encode(this.getGridData()),
				company_id: this.company_id
			}
		} else {
			var params = {
				task:'rates',
				rates:Ext.encode(this.getGridData())
			}
		}

		if(this.store.getModifiedRecords().length>0 || this.deletedRecords){

			if (!this.company_id)
				maskEl.mask(GO.lang.waitMsgSave);
			
			Ext.Ajax.request({
			    url : GO.url('tickets/rate/submitRates'),
			    params:params,
			    callback:function(options, success, response){
				this.store.commitChanges();
				var result = Ext.decode(response.responseText);
				if(result.new_rates)
				{
				    this.setIds(result.new_rates);
				}
				this.deletedRecords=false;
				if (!this.company_id)
				    maskEl.unmask();
			    },
			    scope:this
			});
			
		}
	}
});
