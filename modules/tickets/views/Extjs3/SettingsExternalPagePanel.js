/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: SettingsExternalPagePanel.js 20049 2014-12-08 08:22:07Z wsmits $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.tickets.SettingsExternalPagePanel = Ext.extend(Ext.Panel, {
	title:GO.tickets.lang.ExternalPage,			
	cls:'go-form-panel',
	layout:'form',
	labelWidth: 30,
	
	initComponent : function(){
		
		this.buildForm();
		
		GO.tickets.SettingsExternalPagePanel.superclass.initComponent.call(this);
	},
	
	buildForm : function(params) {
		
		this.useAlternativeUrlCheckbox = new Ext.ux.form.XCheckbox({
			name: 'use_alternative_url',
			width:300,
			anchor: '100%',
			maxLength: 100,
			allowBlank:false,
			boxLabel: GO.tickets.lang.useAlternativeUrl,
			hideLabel:true
		});
		
		this.alternativeUrlField = new Ext.form.TextField({
			name: 'alternative_url',
			anchor: '100%',
			maxLength: 100,
			allowBlank:true,
			fieldLabel: GO.tickets.lang.url
		});
		
		
		this.enableExternalPageCheckbox = new Ext.ux.form.XCheckbox({
			name: 'enable_external_page',
			width:300,
			anchor: '100%',
			maxLength: 100,
			allowBlank:false,
			boxLabel: GO.tickets.lang.enableExternalPage,
			hideLabel:true
		});

		this.enableAnonymousTicketsCheckbox = new Ext.ux.form.XCheckbox({
			name: 'allow_anonymous',
			width:300,
			anchor: '100%',
			maxLength: 100,
			allowBlank:false,
			boxLabel: GO.tickets.lang.enableAnonymousTickets,
			hideLabel:true,
			disabled:true
		});
		
		this.customCssTextarea = new Ext.form.TextArea({
			name: 'external_page_css',
			anchor: '100%',
			allowBlank:true,
			fieldLabel:GO.tickets.lang.customTicketPageCss,
			disabled:true,
			hideLabel:true,
			height:200
		});
		
		this.customCssText = new GO.form.HtmlComponent({
			html: GO.tickets.lang.customTicketPageCssText,
			anchor: '100%',
			style: 'margin-bottom:10px;'
		});
		
		this.customCssFieldSet = new Ext.form.FieldSet({
			title: GO.tickets.lang.customTicketPageCss,
			labelWidth: 140,
			autoHeight: true,
			border: true,
			layout:'form',
			collapsed: false,
			items:[
				this.customCssText,
				this.customCssTextarea
			]
		});
		
		this.goToSiteButton = new Ext.Button({
			text:GO.tickets.lang.goToExternalPage,
			disabled:true,
			handler:function(){
				var url = GO.settings.config.host + 'modules/site/index.php?r=tickets/externalpage/newTicket';
				window.open(url,'_blank');
			},
			scope:this
		});
		
		this.enableExternalPageCheckbox.on('check', function(comp, checked){
			if(!this.tabbedFormDialog.loading){
				GO.request({
					url: 'tickets/settings/enableExternalPage',
					params: {
						checked:checked
					},
					success: function(options, response, result)
					{
						if(this.enableExternalPageCheckbox.checked && (result.defaultSiteInstalled === false || result.siteInstalled === false)){
							var answer = confirm(GO.tickets.lang.installExternalSite);

							if(answer){
								GO.request({
									url: 'defaultsite/installation/installModules',
									success: function(options, response, result)
									{									
										this.enableAnonymousTicketsCheckbox.setDisabled(false);
										this.customCssTextarea.setDisabled(false);
										this.goToSiteButton.setDisabled(false);
									},
									fail:function(){
										this.enableExternalPageCheckbox.reset();
									},
									scope: this
								});
							} else {
								this.enableExternalPageCheckbox.setValue(false);
							}
						}
						
						this.enableAnonymousTicketsCheckbox.setDisabled(!this.enableExternalPageCheckbox.checked);
						this.customCssTextarea.setDisabled(!this.enableExternalPageCheckbox.checked);
						this.goToSiteButton.setDisabled(!this.enableExternalPageCheckbox.checked);
						
						// Set the external link textbox value
						var url = GO.settings.config.full_url + 'modules/site/index.php?r=tickets/externalpage/ticket';
						this.alternativeUrlField.setValue(url);
						
					},
					scope: this
				});
			}else
			{
				this.enableAnonymousTicketsCheckbox.setDisabled(!this.enableExternalPageCheckbox.checked);
				this.customCssTextarea.setDisabled(!this.enableExternalPageCheckbox.checked);
				this.goToSiteButton.setDisabled(!this.enableExternalPageCheckbox.checked);
			}
			
			// Set the checkbox of "Use external link"
			this.useAlternativeUrlCheckbox.setValue(this.enableExternalPageCheckbox.checked);			
		}, this);
		
		this.items = [
			this.enableExternalPageCheckbox,
			this.enableAnonymousTicketsCheckbox,
			this.useAlternativeUrlCheckbox,
			this.alternativeUrlField,
			this.customCssFieldSet,
			this.goToSiteButton
		];
	}
});