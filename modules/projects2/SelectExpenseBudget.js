GO.projects2.SelectExpenseBudget = Ext.extend(GO.form.ComboBoxReset, {
	constructor : function(config){
		config = config || {};
		Ext.apply(config, {
			fieldLabel: GO.projects2.lang.expenseBudget,
			store:new GO.data.JsonStore({
				url:GO.url("projects2/expenseBudget/store"),
				baseParams:{
					project_id:0
				},
				fields:['id','description']
			}),
			valueField:'id',
			displayField:'description',
			mode: 'remote',
			triggerAction: 'all',
            remoteSort: true,
			editable: true,
			forceSeleciton:false,
			emptyText:GO.projects2.lang.unclassifiedExpenses,
			hiddenName:"expense_budget_id"
		});

		GO.form.ComboBox.superclass.constructor.call(this, config);
	},

	setProjectId : function(project_id){
		if(this.store.baseParams.project_id!=project_id){
			this.store.baseParams.project_id=project_id;
			this.store.load();
		}
	}
});
