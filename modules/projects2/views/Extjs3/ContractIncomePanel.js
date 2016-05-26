GO.projects2.ContractIncomePanel = function(config) {
	
	var config = config || {};
	
	
	this.title = GO.projects2.lang.contracts;
	this.layout = 'border';
	
	this.contractIncomeGrid = new GO.projects2.ContractIncomeGrid({
			id:"pr2_contract_income",
			region: 'center'
		});
	
	this.typesMultiSelect = new GO.grid.MultiSelectGrid({
			region:'west',
			width: 250,
			id:'pr2_contract_incomes_types',
			title:GO.projects2.lang.projectType,
			loadMask:true,
			store: GO.projects2.typesStore,
			split:true,
			allowNoSelection:true,
			relatedStore: this.contractIncomeGrid.store,
			tbar: [this.showScheduledField = new Ext.form.Checkbox({
				boxLabel: GO.projects2.lang.showInvoiced,
				labelSeparator: '',
				name: 'show_invoiced',		
				allowBlank: true,
//				ctCls:'bs-scheduled-cb',
				listeners: {
					'check': function(checkbox, checked) { 
						this.contractIncomeGrid.store.baseParams['show_invoiced'] = checked;
						this.contractIncomeGrid.store.reload();
					},
					scope: this
				}
			})]
		});
	
	this.items = [
		this.typesMultiSelect,
		this.contractIncomeGrid
	];
	
	GO.projects2.ContractIncomePanel.superclass.constructor.call(this,config);
	
		this.on('show',function(){
			GO.request({
				url: 'projects2/income/getDateSettings',
				success: function(response,options,result) {
					if (result.start_date > 0) {
						this.contractIncomeGrid.from.setValue(new Date(result.start_date * 1000));
						this.contractIncomeGrid.store.baseParams['start_date'] = result.start_date;
					}
					if (result.end > 0) {
						this.contractIncomeGrid.till.setValue(new Date(result.end * 1000));
						this.contractIncomeGrid.store.baseParams['end'] = result.end;
					}
				},
				scope: this
			});
		}, this);
	
	this.contractIncomeGrid.store.on('beforeload',function(store){
		store.baseParams['pr2_all_incomes_types'] = Ext.encode(this.typesMultiSelect.getSelected());
	}, this);
	
}

Ext.extend(GO.projects2.ContractIncomePanel, Ext.Panel, {
	
	show: function(config) {
		GO.projects2.ContractIncomePanel.superclass.show.call(this,config);
		GO.projects2.typesStore.load();
		this.contractIncomeGrid.store.load();
	}
	
});