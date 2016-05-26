GO.billing.DocTemplateDialog = function(config) {

	if (!config)
	{
		config = {};
	}

	this.buildForm();

	var focusFirstField = function() {
		this.propertiesPanel.items.items[0].focus();
	};

	config.maximizable = true;
	config.layout = 'fit';
	config.modal = false;
	config.resizable = false;
	config.width = 500;
	config.height = 400;
	config.closeAction = 'hide';
	config.title = GO.billing.lang.docTemplate;
	config.items = this.formPanel;
	config.focus = focusFirstField.createDelegate(this);
	config.buttons = [{
			text: GO.lang['cmdOk'],
			handler: function() {
				this.submitForm(true);
			},
			scope: this
		}, {
			text: GO.lang['cmdApply'],
			handler: function() {
				this.submitForm();
			},
			scope: this
		}, {
			text: GO.lang['cmdClose'],
			handler: function() {
				this.hide();
			},
			scope: this
		}];

	GO.billing.DocTemplateDialog.superclass.constructor.call(this, config);

	this.addEvents({
		'save': true
	});

}

Ext.extend(GO.billing.DocTemplateDialog, Ext.Window, {
	show: function(template_id)
	{
		if (!this.rendered)
		{
			this.render(Ext.getBody());
		}

		if (!template_id)
		{
			template_id = 0;
		}

		this.setTemplateId(template_id);

		if (this.template_id > 0)
		{
			this.formPanel.load({
				url: GO.url('billing/docTemplate/load'),
				success: function(form, action)
				{
					this.downloadButton.setDisabled(false);

					GO.billing.DocTemplateDialog.superclass.show.call(this);
				},
				failure: function(form, action)
				{
					GO.errorDialog.show(action.result.feedback)
				},
				scope: this
			});
		} else
		{
			this.formPanel.form.reset();
			this.downloadButton.setDisabled(true);

			GO.billing.DocTemplateDialog.superclass.show.call(this);
		}
	},
	setTemplateId: function(template_id)
	{
		this.formPanel.form.baseParams['id'] = template_id;
		this.template_id = template_id;
	},
	submitForm: function(hide) {
		this.formPanel.form.submit(
						{
							url: GO.url('billing/docTemplate/submit'),
							waitMsg: GO.lang['waitMsgSave'],
							success: function(form, action)
							{
								this.fireEvent('save', this);
								this.uploadFile.clearQueue();

								if (hide)
								{
									this.hide();
								} else
								{
									if (action.result.id)
									{
										this.setTemplateId(action.result.id);
										this.downloadButton.setDisabled(false);
									}
								}
							},
							failure: function(form, action) {
								if (action.failureType == 'client')
								{
									Ext.MessageBox.alert(GO.lang['strError'], GO.lang['strErrorsInForm']);
								} else {
									Ext.MessageBox.alert(GO.lang['strError'], action.result.feedback);
								}
							},
							scope: this
						});
	},
	buildForm: function()
	{
		var imageInsertPlugin = new GO.plugins.HtmlEditorImageInsert();
		imageInsertPlugin.on('insert', function(plugin)
		{
			this.inline_attachments.push({
				tmp_file: plugin.selectedPath,
				url: plugin.selectedUrl
			});
		}, this);

		this.propertiesPanel = new Ext.Panel({
			border: false,
			baseParams: {
				task: 'doc_template'
			},
			cls: 'go-form-panel',
			layout: 'form',
			autoScroll: true,
			items: [{
					xtype: 'box',
					cls: 'go-form-text',
					html: GO.billing.lang.docTemplateText
				}, {
					xtype: 'textfield',
					name: 'name',
					anchor: '100%',
					allowBlank: false,
					fieldLabel: GO.lang.strName
				},
				new GO.form.HtmlComponent({
					html: '<br />'
				}),
				this.uploadFile = new GO.form.UploadFile({
					inputName: 'import_file',
					max: 1
				}),
				new GO.form.HtmlComponent({
					html: '<br />'
				}),
				this.downloadButton = new Ext.Button({
					handler: function()
					{
						window.open(GO.url('billing/docTemplate/download', {id: this.template_id}));
					},
					disabled: true,
					text: GO.lang.download,
					scope: this
				})]
		});

		this.formPanel = new Ext.form.FormPanel({
			border: false,
			baseParams: {
				task: 'doc_template'
			},
			waitMsgTarget: true,
			fileUpload: true,
			items: this.propertiesPanel
		});
	}

});