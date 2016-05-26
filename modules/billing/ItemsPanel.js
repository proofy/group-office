/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: ItemsPanel.js 15897 2013-05-21 09:02:45Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

 
GO.billing.ItemsPanel = function(config){
	
	
	if(!config)
	{
		config={};
	}
	
	
	/*this.addItemPanel = new GO.billing.AddItemPanel({
		region:'north',
		height:200,		
		split:true,
		border:true
	});
	
	this.addItemPanel.on('save', function(){this.itemsGrid.store.reload();}, this);*/
	
	this.itemsGrid = new GO.billing.ItemsGrid({
		orderDialog:config.orderDialog,
		region:'center',
		border:true
	});
	
	GO.billing.itemsTotalField=new GO.form.PlainField({
		fieldLabel: GO.billing.lang.total,
		value: GO.util.numberFormat("0"),
		anchor: '100%'
	});
	
	GO.billing.itemsSubtotalField=new GO.form.PlainField({
		fieldLabel: GO.billing.lang.subtotal,
		value: GO.util.numberFormat("0"),
		anchor: '100%'
	});
	
	GO.billing.itemsVatField=new GO.form.PlainField({
		fieldLabel: GO.billing.lang.vat,
		value: GO.util.numberFormat("0"),
		anchor: '100%'
	});
	
	GO.billing.itemsCostsField=new GO.form.PlainField({
		fieldLabel: GO.billing.lang.costs,
		value: GO.util.numberFormat("0"),
		anchor: '100%'
	});
	
	GO.billing.itemsProfitField=new GO.form.PlainField({
		fieldLabel: GO.billing.lang.profit,
		value: GO.util.numberFormat("0"),
		anchor: '100%'
	});
	
	GO.billing.itemsMarginField=new GO.form.PlainField({
		fieldLabel: GO.billing.lang.margin,
		value: GO.util.numberFormat("0"),
		anchor: '100%'
	});
	
	
	this.totalsGrid = new Ext.Panel({
		region:'south',
		split: true,
		layout:'column',
		cls:'go-form-panel',waitMsgTarget:true,
		items:[{
			columnWidth: .5,
			layout:'form',
			border:false,
			items:[
				GO.billing.itemsCostsField,
				GO.billing.itemsProfitField,
				GO.billing.itemsMarginField				
			]
		},{
			columnWidth: .5,
			layout:'form',
			border:false,
			items:[
				GO.billing.itemsSubtotalField,
				GO.billing.itemsVatField,
				GO.billing.itemsTotalField				
			]
		}
		
		
		]
		
	});
	
	config.title=GO.billing.lang.items;
	config.layout='border';
	config.items=[this.itemsGrid, this.totalsGrid ];
	//config.disabled=true;
	config.border=false;
	GO.billing.ItemsPanel.superclass.constructor.call(this, config);	
}

Ext.extend(GO.billing.ItemsPanel, Ext.Panel,{
	setOrderId : function(order_id, loaded)
	{	
		this.itemsGrid.setOrderId(order_id);
		this.itemsGrid.store.loaded=loaded;	
		this.itemsGrid.changed=false;
		this.setDisabled(order_id<1);
	},
	onShow : function()
	{
		if(!this.itemsGrid.store.loaded)
		{
			if(this.itemsGrid.store.baseParams.order_id>0)
			{
				this.itemsGrid.store.load(/*{
					callback:function(){this.itemsGrid.addBlankRow();},
					scope:this
				}*/);
			}else
			{				
				this.itemsGrid.store.removeAll();
				//this.itemsGrid.addBlankRow();
				this.itemsGrid.store.loaded=true;
			}			
		}
		GO.billing.ItemsPanel.superclass.onShow.call(this);
	}
});