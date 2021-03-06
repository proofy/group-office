GO.billing.SelectProduct = function(config){
	
	Ext.apply(this, config);

	if(!this.displayField)
		this.displayField='name';
	
	this.store = new GO.data.JsonStore({
		url: GO.settings.modules.billing.url+ 'json.php',
		baseParams: {
			task: 'products'
		},
		root: 'results',
		id: 'id',
		totalProperty:'total',
		fields: ['id', 'name', 'description', 'cost_price', 'list_price', 'vat', 'total_price', 'article_id', 'full_name'],
		remoteSort: true
	});
	
	this.store.setDefaultSort('name', 'asc');

	GO.billing.SelectProduct.superclass.constructor.call(this,{
		valueField: 'id',
		triggerAction: 'all',
		selectOnFocus:true,
		pageSize: parseInt(GO.settings['max_rows_list'])
	});
	
}
Ext.extend(GO.billing.SelectProduct, GO.form.ComboBox);
