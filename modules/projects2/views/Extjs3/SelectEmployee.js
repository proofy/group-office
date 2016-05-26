GO.projects2.SelectEmployee = Ext.extend(GO.form.ComboBoxReset,{
	initComponent: function(){
		
		this.store.baseParams.includeInactive = this.includeInactive;
		
		GO.projects2.SelectEmployee.superclass.initComponent.call(this);
		
		this.setRemoteText(GO.settings.name);
	},
	startBlank : this.startBlank || false,
	//allowBlank : this.allowBlank || false,
	value:GO.settings.user_id,
	hiddenName: this.hiddenName || 'id',
	fieldLabel:GO.projects2.lang.employee,
	valueField:'id',
	displayField:'name',
	store:new GO.data.JsonStore({
		url:GO.url('projects2/employee/users'),
		fields:['id','name'],
		baseParams:{
			includeInactive:0
		}
	}),
	width: this.width || 300,
	pageSize: parseInt(GO.settings['max_rows_list']),
	mode:'remote',
	triggerAction:'all',
	//editable:false,
	selectOnFocus:true,
	allowBlank:false
});		     