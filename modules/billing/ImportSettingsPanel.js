GO.billing.ImportSettingsPanel = Ext.extend(Ext.Panel,{
	title:GO.billing.lang['payments'],
	labelWidth:200,
	layout:'form',
	cls:'go-form-panel',
	initComponent : function(){
		this.items=[
		this.importStatusId = new GO.form.ComboBox({
			hiddenName: 'import_status_id',
			fieldLabel: GO.billing.lang.paidStatus,
			store:new GO.data.JsonStore({
				url: GO.url('billing/status/store'),
				baseParams: {
					book_id: 0
				},
				fields: ['id','name'],
				remoteSort: true
			}),
			valueField:'id',
			displayField:'name',
			mode: 'remote',
			triggerAction: 'all',
			anchor: '-20',
			editable: false
		}),{
			xtype:'xcheckbox',
			boxLabel: GO.billing.lang.notifyCustomer,
			labelSeparator: '',
			name: 'import_notify_customer',		
			allowBlank: true,
			hideLabel:true
		},this.newBookField = new GO.form.ComboBoxReset({
			hiddenName: 'import_duplicate_to_book',
			fieldLabel: GO.billing.lang.copyToBook,
			store: GO.billing.writableBooksStore,
			emptyText:GO.lang.strNA,
			valueField:'id',
			displayField:'name',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			editable: false,
			anchor: '-20'
		})
		,
		this.duplicateStatusId = new GO.form.ComboBox({
			hiddenName: 'import_duplicate_status_id',
			fieldLabel: GO.billing.lang.copyStatus,
			store:new GO.data.JsonStore({
				url: GO.url('billing/status/store'),
				baseParams: {
					book_id: 0
				},
				fields: ['id','name'],
				remoteSort: true
			}),
			valueField:'id',
			displayField:'name',
			mode: 'remote',
			triggerAction: 'all',
			anchor: '-20',
			editable: false
		}),
		this.autoPaidStatus = {
			xtype:'xcheckbox',
			boxLabel: GO.billing.lang['autoPaidStatus'],
			labelSeparator: '',
			name: 'auto_paid_status',		
			allowBlank: true,
			hideLabel:true
		}
	];
	
		this.newBookField.on('select', function(combo, record, index){			
			this.duplicateStatusId.store.baseParams.book_id=record.data.id;
			this.duplicateStatusId.store.removeAll();
			this.duplicateStatusId.clearLastSearch();
			
		}, this);
		
		
		GO.billing.ImportSettingsPanel.superclass.initComponent.call(this);
	},
	
	setBookId : function(book_id){
		this.importStatusId.store.baseParams.book_id=book_id;
		this.importStatusId.store.removeAll();
		this.importStatusId.clearLastSearch();
		
		this.setDisabled(book_id==0);
		
	}
				
});