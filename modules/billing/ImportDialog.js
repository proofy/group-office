GO.billing.ImportDialog = Ext.extend(Ext.Window, {
	
	initComponent : function(){
		
		this.title=GO.lang.cmdImport;
		
		this.width=500;
		this.autoHeight=true;
		this.modal=true;
		
		this.closeAction='hide';
		
		this.uploadFile = new GO.form.UploadFile({
			inputName : 'importfile',
			max:1  				
		});				
		
		this.upForm = new Ext.form.FormPanel({
			labelWidth:150,
			fileUpload:true,
			waitMsgTarget:true,
			items: [new GO.form.HtmlComponent({
				html: GO.billing.lang.importText+'<br /><br />'
			}),
			this.selectAddressbook = new GO.form.ComboBoxReset({
				hiddenName:'addressbook_id',
				displayField: 'name',
				valueField: 'id',
				triggerAction:'all',
				mode:'remote',
				editable: true,
				selectOnFocus:true,
				forceSelection: true,
				typeAhead: true,
				emptyText:GO.billing.lang.useAny,
				pageSize: parseInt(GO.settings.max_rows_list),
				fieldLabel: GO.billing.lang.suppliersAddressbook,
				store: GO.addressbook.writableAddressbooksStore,				
				anchor:'100%'
			}),
			this.newSuppliersAddressbook = new GO.form.ComboBoxReset({
				hiddenName:'new_suppliers_addressbook_id',
				displayField: 'name',
				valueField: 'id',
				triggerAction:'all',
				mode:'remote',
				editable: true,
				selectOnFocus:true,
				forceSelection: true,
				typeAhead: true,
				emptyText:GO.billing.lang.useAny,
				pageSize: parseInt(GO.settings.max_rows_list),
				fieldLabel: GO.billing.lang.newSuppliersAddressbook,
				store: GO.addressbook.writableAddressbooksStore,				
				anchor:'100%',
				allowBlank: false
			}),
			new Ext.form.TextField({
				fieldLabel: GO.lang['delimiter'],
				name: 'delimiter',
				allowBlank: false,
				maxLength: 1,
				value: ';'
			}),
			new Ext.form.TextField({
				fieldLabel: GO.lang['enclosure'],
				name: 'enclosure',
				allowBlank: false,
				maxLength: 1,
				value: '"'
			}),
			this.uploadFile],
			cls: 'go-form-panel'
		});
		
				
		this.items=[this.upForm];
		
		this.buttons=[
		{
			text:GO.lang.cmdOk,
			handler: this.uploadHandler, 
			scope: this
		},
		{
			text:GO.lang['cmdClose'],
			handler: function()
			{
				this.hide()
			},
			scope: this
		},{
			text:GO.billing.lang.downloadSampleCSV,
			handler: function()
			{
				window.open(GO.settings.modules.billing.url+'download_importsample.php');
			},
			scope:this			
		}];
		
		this.addEvents({
			'import': true
		});
		
		GO.billing.ImportDialog.superclass.initComponent.call(this);
	},
	uploadHandler : function(){
		this.upForm.form.submit({
			waitMsg:GO.lang.waitMsgUpload,
			url: GO.url('billing/catalogImport/import'),//GO.settings.modules.billing.url+'action.php',
//			params: {
//				task: 'import'
//			},
			success:function(form, action){
				this.uploadFile.clearQueue();						
				this.hide();
				
				this.fireEvent('import');
				
//				var fb = action.result.feedback.replace(/BR/g,'<br />');
//				
//				Ext.MessageBox.alert(GO.lang.strSuccess, fb);
			},
			failure: function(form, action) {	
				if(action.failureType == 'client')
				{					
					Ext.MessageBox.alert(GO.lang['strError'], GO.lang['strErrorsInForm']);			
				} else {
					
					var fb = action.result.feedback.replace(/BR/g,'<br />');
					
					Ext.MessageBox.alert(GO.lang['strError'], fb);
				}
			},
			scope: this
		});			
	}
});
