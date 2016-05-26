GO.projects2.CsvImportDialog = function(config) {
	
	var config = config || {};
	
	this._buildForm();
	
	var config = config || {};
	
	config.title = GO.lang.cmdImport;
	config.layout = 'form';
	config.defaults = {anchor:'100%'};
	config.border = false;
	config.labelWidth = 150;
	config.cls = 'go-form-panel';
	config.width = 400;
	config.items = [
		this.formPanel
	];
	
	GO.projects2.CsvImportDialog.superclass.constructor.call(this,config);
	
	this.addEvents({
		'import' : true
	});
	
	this.on('show',function() {
		this.fileSelector.reset();
	}, this);
}

Ext.extend( GO.projects2.CsvImportDialog, GO.Window, {

	_buildForm : function() {

		this.fileSelector = new GO.form.UploadFile({
			inputName: 'files',
			fieldLabel: GO.lang.upload,
			max:1
		});
		
		this.downloadExampleButton = new Ext.Button({
			text: GO.projects2.lang['downloadExample'],
			handler: function() {
				window.open(GO.url('projects2/project/downloadExampleCsv'));
			}
		})
		
		this.formPanel = new Ext.form.FormPanel({
			fileUpload : true,
			items: [
				{
					xtype: 'plainfield',
					hideLabel: true,
					value: GO.projects2.lang['importProjectsByCsv']
				},
				this.fileSelector,
				this.downloadExampleButton
			],
			buttons: [{
				text: GO.lang.cmdImport,
				width: '20%',
				handler: function(){
					this._submitForm();
				},
				scope: this
			},{
				text:GO.lang.cmdClose,
				handler:function(){
					this.hide();
				},
				scope:this				
			}]
		});
		
	},
	
	_submitForm : function() {
		if (!this._loadMask)
			this._loadMask = new Ext.LoadMask(Ext.getBody(), {msg: GO.projects2.lang.importing+'...'});
		this._loadMask.show();

		this.formPanel.getForm().submit({
			url : GO.url('projects2/project/importCsv'),
			success : function( form, action ) {
				var errorsText = '';
				var result = Ext.decode(action.response.responseText);
				if (!GO.util.empty(result.summarylog)) {
					for (var i=0; i<result.summarylog.errors.length; i++) {
						if (i==0)
							errorsText = '<br />' + GO.lang.failedImportItems + ':<br />';
						errorsText = errorsText + GO.lang.item + ' ' + result.summarylog.errors[i].name + ': ' +
													result.summarylog.errors[i].message + '<br />';
					}
					//Ext.MessageBox.alert(GO.lang.strError,errorsText);
				}

				if (!result.success) {
					Ext.MessageBox.alert(GO.lang.strError,result.feedback);
				} else {
					if (result.totalCount){
						if(result.totalCount != result.successCount){
							GO.errorDialog.show(
								errorsText,
								GO.projects2.lang['importSuccessCount']+' '+result.successCount+'/'+result.totalCount
							);
						} else {
							Ext.MessageBox.alert(
								'',
								GO.projects2.lang['importSuccessCount']+' '+result.successCount+'/'+result.totalCount
								+ errorsText
							);
						}
					}else{
						Ext.MessageBox.alert(
							'',
							GO.addressbook.lang['importSuccess']
							+ errorsText
						);
					}
						
					this.fireEvent('import');
						
				}
				this._loadMask.hide();
			},
			failure : function ( form, action ) {
				var result = Ext.decode(action.response.responseText);
				if (!GO.util.empty(result.summarylog)) {
					var messageText = '';
					for (var i=0; i<result.summarylog.errors.length; i++)
						messageText = messageText + result.summarylog.errors[i].message + '<br />';
					Ext.MessageBox.alert(GO.lang.strError,messageText);
				} else if (!GO.util.empty(result.feedback)) {
					Ext.MessageBox.alert(GO.lang.strError,result.feedback);
				}
				this._loadMask.hide();
			},
			scope: this
		});
	}
	
});