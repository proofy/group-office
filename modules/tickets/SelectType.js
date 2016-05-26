GO.tickets.SelectType = Ext.extend(GO.form.ComboBox, {	
	hiddenName:'type_id',
	fieldLabel:GO.lang['strType'],
	valueField:'id',
	displayField:'name',
	pageSize: parseInt(GO.settings.max_rows_list),
	store:GO.tickets.writableTypesStore,
	mode:'local',
	triggerAction:'all',
	editable:false,
	selectOnFocus:true,
	allowBlank:false,
	forceSelection:true,
	emptyText: GO.lang['strPleaseSelect'],
	tpl: new Ext.XTemplate(
					 '<tpl for=".">',
					 '<tpl if="this.group_name != values.group_name">',
					 '<tpl exec="this.group_name = values.group_name"></tpl>',
					 '<h1><b>{group_name}</b></h1>',
					 '</tpl>',
					 '<div class="x-combo-list-item">{name}</div>',
					 '</tpl>',
					 '<tpl exec="this.group_name = null"></tpl>'
		 )
});