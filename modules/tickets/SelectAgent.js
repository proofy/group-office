GO.tickets.SelectAgent = Ext.extend(GO.form.ComboBoxReset, {	
	hiddenName:'agent_id',
	fieldLabel:GO.tickets.lang.agent,
	emptyText:GO.tickets.lang.nobody,
	valueField:'id',
	displayField:'name',
	store:GO.tickets.agentsStore,
	mode:'remote',
	triggerAction:'all',
	editable:false,
	selectOnFocus:true
});