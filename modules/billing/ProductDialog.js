/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: ProductDialog.js 19876 2014-10-24 13:14:18Z wsmits $
 * @author Merijn Schering <mschering@intermesh.nl>
 */


GO.billing.ProductDialog = Ext.extend(GO.dialog.TabbedFormDialog,{
	
	customFieldType : "GO\\Billing\\Model\\Product",
	
	initComponent : function(){
		
		this.tbar = [];

		if (GO.files) {
			this.tbar.push(this.fileBrowseButton = new GO.files.FileBrowserButton({
				model_name:"GO\\Billing\\Model\\Product"
			}));
		}
		
		this.tbar.push(this.exportButton=new Ext.Button({
			iconCls: 'btn-export',
			text: GO.billing.lang.salesPerMonth,			
			scope:this,		
			disabled:true,
			handler: function()
			{
				window.open(GO.url('billing/exportProductSales/export',{product_id:this.remoteModelId}))
			}
		}));
		
		this.tbar.push(this.exportButton2=new Ext.Button({
			iconCls: 'btn-export',
			text: "Sales",			
			scope:this,		
			disabled:true,
			handler: function()
			{
				window.open(GO.url('billing/exportProductSalesOrders/export',{product_id:this.remoteModelId}))
			}
		}));
		
		Ext.apply(this, {
			tbar: this.tbar,
			title:GO.billing.lang.product,
			formControllerUrl: 'billing/product',
			maximizable: true,
			layout: 'fit',
			modal: false,
			resizable: false,
			width: 850,
			height: 550,
			closeAction: 'hide',
			loadOnNewModel: true,
			fileUpload: true,
			buttons:[{
				text: GO.lang['cmdOk'],
				handler: function(){
					this.submitForm(true);
				},
				disabled: !GO.settings.modules.billing.write_permission,
				scope: this
			},{
				text: GO.lang['cmdApply'],
				handler: function(){
					this.submitForm();
				},
				disabled: !GO.settings.modules.billing.write_permission,
				scope:this
			},{
				text: GO.lang['cmdClose'],
				handler: function(){
					this.hide();
				},
				scope:this
			}
			]
		});
		
		this.addEvents({
			'save' : true
		});
		
		GO.billing.ProductDialog.superclass.initComponent.call(this);	
		
	},
	
	afterLoad : function(remoteModelId,config,action) {
		this.formPanel.baseParams.category_id=action.result.data.category_id;

		this._setPhoto(action.result.data.photo_url);
		//this.deleteImageCB.setDisabled(action.result.data.image=='');

		this.unformattedExclPrice=action.result.data.list_price;
		this.unformattedInclPrice=action.result.data.total_price;

		this.unformattedSpecialExclPrice=action.result.data.special_list_price;
		this.unformattedSpecialInclPrice=action.result.data.special_total_price;

		if(this.fileBrowseButton)
			this.fileBrowseButton.setId(remoteModelId);
		
		
		this.exportButton.setDisabled(!remoteModelId);
		this.exportButton2.setDisabled(!remoteModelId);
		
		if (GO.util.empty(remoteModelId))
			this.vatField.setValue(GO.util.numberFormat(GO.billing.defaultVAT));
		
		this.costCodeCombo.store.load();
	},
	
	getSubmitParams : function() {
		return {
			'list_price' : this.unformattedExclPrice,
			'total_price' : this.unformattedInclPrice,
			'special_list_price' : this.unformattedSpecialExclPrice,
			'special_total_price' : this.unformattedSpecialInclPrice
		};
	},
	
	afterSubmit : function(action) {
		if (!GO.util.empty(action.result.success)) {
			this.fireEvent('save', this);
			this.uploadFile.clearQueue();
			if(action.result.product_id)
			{
				this.setRemoteModelId(action.result.product_id);
			}

			if(!GO.util.empty(action.result.photo_url))
				this._setPhoto(Ext.util.Format.htmlDecode(action.result.photo_url));
			else
				this._setPhoto("");
			
		} else {
			if(action.failureType == 'client')
			{					
				Ext.MessageBox.alert(GO.lang['strError'], GO.lang['strErrorsInForm']);			
			} else {
				Ext.MessageBox.alert(GO.lang['strError'], action.result.feedback);
			}
		}
	},
		
	buildForm : function () {
		
		
		var items = [];
		
		var records = GO.billing.languagesStore.getRange();
		
		for(var i=0;i<records.length;i++)
		{
			var textfield = new Ext.form.TextField({
				fieldLabel:GO.lang.strName+' ('+records[i].get("name")+')',
				name:"name_"+records[i].get("id"),
				anchor:'-20',
				allowBlank: false
			});
			
			items.push(textfield);	
			
			var descriptionField = new Ext.form.TextArea({
				fieldLabel:GO.lang.strDescription+' ('+records[i].get("name")+')',
				name:"description_"+records[i].get("id"),
				anchor:'-20'
			});
			
			items.push(descriptionField);	
			
			var shortDescriptionField = new Ext.form.TextArea({
				fieldLabel:GO.billing.lang.shortDescription+' ('+records[i].get("name")+')',
				name:"short_description_"+records[i].get("id"),
				anchor:'-20'
			});
			
			items.push(shortDescriptionField);	
		}


		items.push({
			xtype: 'textfield',
			name: 'article_id',
			anchor: '-20',
			fieldLabel: GO.billing.lang.articleNumber
		});

		items.push(this.selectCompany = new GO.addressbook.SelectCompany ({
			hiddenName: 'supplier_company_id',
			anchor: '-20',
			fieldLabel: GO.billing.lang.supplier,
			triggerAction:'all'
		}));
		items.push({
			xtype: 'textfield',
			name: 'supplier_product_id',
			anchor: '-20',
			fieldLabel: GO.billing.lang.supplierProductId
		});

//		this.costCodeCombo = new GO.form.ComboBoxReset({
//			name : 'cost_code',
//			fieldLabel: GO.billing.lang.costCode,
//			store: new GO.data.JsonStore({
//				url : GO.url('billing/costCode/store'),
//				baseParams : {
//					task : 'cost_codes',
//					book_id: '0'
//				},
//				fields : ['id','code'],
//				root : 'results',
//				id : 'id',
//				totalProperty : 'total',
//				setBookId : function(book_id){
//					if(this.baseParams.book_id!=book_id){
//						this.baseParams.book_id=book_id;
//						this.reload();
//					}
//				}
//			}),
//			displayField:'code',
//			valueField: 'code',
//			mode:'local',
//			triggerAction:'all',
//			selectOnFocus:true,
//			forceSelection: true,
//			anchor:'-20',
//			value:''
//		});

		
		this.costCodeCombo = new GO.billing.SelectCostCode({
			displayField:'code',
			name : 'cost_code',
			anchor:'-20',
			fieldLabel: GO.billing.lang.costCode
		});
		
		this.trackingCodeCombo = new GO.billing.SelectTrackingCode({
			name : 'tracking_code',
			anchor:'-20',
			fieldLabel: GO.billing.lang.trackingCode
		});

		this.costCodeCombo.on('change',function(combo, newval, oldval){
			this.trackingCodeCombo.clearValue();
		},this);
		
		this.trackingCodeCombo.on('change',function(combo, newval, oldval){
			var record = combo.findRecord('code', newval);
					
			if(GO.util.empty(record)){
				// Do nothing
			} else {						
				this.costCodeCombo.setValue(record.data.costcode);
			}
		},this);

		items.push(this.costCodeCombo);
		items.push(this.trackingCodeCombo);
		
		
		this.propertiesPanel = new Ext.Panel({
			columnWidth: .65,
			border: false,		
			cls:'go-form-panel',			
			layout:'form',			
			labelWidth:120,
			items:items				
		}); 
		
		GO.billing.ProductImage = Ext.extend(Ext.BoxComponent, {
			autoEl : {
				tag: 'img',
				src:Ext.BLANK_IMAGE_URL
			},

			setPhotoSrc : function(url)
			{
				var now = new Date();
				if (this.el)
					this.el.set({
						src: GO.util.empty(url) ? Ext.BLANK_IMAGE_URL : url+'&mtime='+now.format('U')
					});
				this.setVisible(true);
			}
		});

//		GO.billing.ProductImage = Ext.extend(Ext.BoxComponent, {
//			onRender : function(ct, position){
//				this.el = ct.createChild({
//					tag: 'img'
//				});
//				this.setVisible(false);
//			},
//			setSrc : function(src)
//			{
//				this.el.set({
//					src: src
//				});
//				this.setVisible(true);
//			}
//		});
		
		
		this.productImage = new GO.billing.ProductImage();
		
		this.deleteImageCB = new Ext.form.Checkbox({
			boxLabel: GO.billing.lang.deleteImage,
			labelSeparator: '',
			name: 'delete_image',
			allowBlank: true,
			hideLabel:true,
			disabled:true
		});
		
		this.pricePanel = new Ext.Panel({
			columnWidth: .35,
			border: false,		
			cls:'go-form-panel',			
			layout:'form',			
			labelWidth:120,
			items:[{
				xtype: 'numberfield',
				name: 'formatted_cost_price',
				anchor: '-20',
				fieldLabel: GO.billing.lang.costPrice,
				value: GO.util.numberFormat("0")
			},this.listPriceField = new GO.form.NumberField({
				name: 'formatted_list_price',
				anchor: '-20',
				fieldLabel: GO.billing.lang.listPrice,
				value: GO.util.numberFormat("0")
			}),
			this.vatField = new GO.billing.SelectTaxRate({
				name:'vat',
				anchor: '-20',
				fieldLabel: GO.billing.lang.vat,
				value: GO.util.numberFormat("19")
			}),
//			this.vatField = new GO.form.NumberField({
//				name: 'vat',
//				anchor: '-20',
//				fieldLabel: GO.billing.lang.vat,
//				value: GO.util.numberFormat("19")
//			}),
			this.totalPriceField = new GO.form.NumberField({
				name: 'formatted_total_price',
				anchor: '-20',
				fieldLabel: GO.billing.lang.totalPrice
			}),
			//			this.specialCB = new Ext.form.Checkbox({
			//				xtype: 'checkbox',
			//			  name: 'special',
			//			  hideLabel: true,
			//			  boxLabel: GO.billing.lang.special
			//			}),this.specialListPriceField = new GO.form.NumberField({
			//				xtype: 'numberfield',
			//			  name: 'formatted_special_list_price',
			//				anchor: '-20',
			//			  fieldLabel: GO.billing.lang.specialListPrice,
			//			  disabled:true,
			//			  value: GO.util.numberFormat("0")
			//			}),
			//			this.specialTotalPriceField = new GO.form.NumberField({
			//				xtype: 'numberfield',
			//			  name: 'formatted_special_total_price',
			//				anchor: '-20',
			//			  fieldLabel: GO.billing.lang.specialTotalPrice,
			//			  disabled:true,
			//			  value: GO.util.numberFormat("0")
			//			}),
			//			{
			//				xtype: 'checkbox',
			//			  name: 'charge_shipping_costs',
			//				anchor: '-20',
			//			  hideLabel: true,
			//			  boxLabel: GO.billing.lang.chargeShippingCosts
			//			},
			{
				xtype: 'numberfield',
				name: 'stock',
				decimals:0,
				anchor: '-20',
				fieldLabel: GO.billing.lang.stock
			},{
				xtype: 'numberfield',
				name: 'stock_min',
				decimals:0,
				anchor: '-20',
				fieldLabel: GO.billing.lang.minStock
			},{
				xtype: 'textfield',
				name: 'unit',
				anchor: '-20',
				fieldLabel: GO.billing.lang.unit
			},{
				xtype: 'textfield',
				name: 'unit_stock',
				anchor: '-20',
				fieldLabel: GO.billing.lang.unitStock
			},
			//			,{
			//				xtype: 'numberfield',
			//			  name: 'bonus_points',
			//			  decimals:0,
			//				anchor: '-20',
			//			  fieldLabel: GO.billing.lang.bonusPoints
			//			},{
			//				xtype: 'checkbox',
			//			  name: 'allow_bonus_points',
			//			  hideLabel: true,
			//			  boxLabel: GO.billing.lang.allowBonusPoints
			//			},
			this.uploadFile = new GO.form.UploadFile({
				inputName : 'image',
				max: 1
			}),
			this.productImage,
			this.deleteImageCB]				
		}); 
		
		//		this.specialCB.on('check', function(cb, checked){
		//			this.specialListPriceField.setDisabled(!checked);
		//			this.specialTotalPriceField.setDisabled(!checked);
		//		}, this);
		//
		
		this.listPriceField.on('change', this._calculateInclusivePrice,this);
		this.vatField.on('change', this._calculateInclusivePrice,this);
		this.totalPriceField.on('change', this._calculateExclusivePrice,this);
		//
		//  	this.specialListPriceField.on('change', this._calculateSpecialInclusivePrice,this);
		//  	this.specialTotalPriceField.on('change', this._calculateSpecialExclusivePrice,this);
		
		if(GO.email)
		{
			var panelTbar=[{
				text: GO.billing.lang.emailBuyers,
				iconCls: 'btn-message',
				handler: function(){
					GO.request({
						url: 'billing/product/emailBuyers',
						params: {						
							product_id: this.remoteModelId
						},
						success: function(options, success, result)
						{
//							var result = Ext.decode(response.responseText);

							GO.email.showComposer({
								values : {
									to: GO.settings.email,
									bcc: result.addresses
									}
							});

						},
						scope: this			
					});

				},
				scope: this	
			}];
		} else {
			var panelTbar = [];
		}
		
		var panel = new Ext.Panel({
			waitMsgTarget:true,
//			url: GO.settings.modules.billing.url+'action.php',
			border: false,
			fileUpload: true,
			tbar : panelTbar,
			title: GO.lang.strProperties,
			baseParams: {
//				task: 'product',
				category_id: 0
			},
			layout:'column',
			autoScroll:true,
			items:[this.propertiesPanel, this.pricePanel]			
		});
		
		this.productOptionGrid = new GO.billing.ProductOptionGrid();

		this.addPanel(panel);
		this.addPanel(this.productOptionGrid,'product_id');
    
	},
	
	_setPhoto : function(url)
	{
		this.productImage.setPhotoSrc(url);
		this.deleteImageCB.setValue(false);
		this.deleteImageCB.setDisabled(GO.util.empty(url));
	},
	
	_calculateInclusivePrice : function(){  	
		this.unformattedExclPrice = GO.util.unlocalizeNumber(this.listPriceField.getValue());
		var vat = GO.util.unlocalizeNumber(this.vatField.getValue());
		this.unformattedInclPrice = this.unformattedExclPrice*(1+(vat/100));
		this.totalPriceField.setValue(GO.util.numberFormat(this.unformattedInclPrice));
	},
  
	_calculateExclusivePrice : function(){
		this.unformattedInclPrice = GO.util.unlocalizeNumber(this.totalPriceField.getValue());
		var vat = GO.util.unlocalizeNumber(this.vatField.getValue());
		this.unformattedExclPrice = this.unformattedInclPrice / (1+(vat/100));
		this.listPriceField.setValue(GO.util.numberFormat(this.unformattedExclPrice ));
	},
  
	_calculateSpecialInclusivePrice : function(){  	
		this.unformattedSpecialExclPrice = GO.util.unlocalizeNumber(this.specialListPriceField.getValue());
		var vat = GO.util.unlocalizeNumber(this.vatField.getValue());
		this.unformattedSpecialInclPrice = this.unformattedSpecialExclPrice*(1+(vat/100));
		this.specialTotalPriceField.setValue(GO.util.numberFormat(this.unformattedSpecialInclPrice));
	},
  
	_calculateSpecialExclusivePrice : function(){
		this.unformattedSpecialInclPrice = GO.util.unlocalizeNumber(this.specialTotalPriceField.getValue());
		var vat = GO.util.unlocalizeNumber(this.vatField.getValue());
		this.unformattedSpecialExclPrice = this.unformattedSpecialInclPrice / (1+(vat/100));
		this.specialListPriceField.setValue(GO.util.numberFormat(this.unformattedSpecialExclPrice ));
	}
});