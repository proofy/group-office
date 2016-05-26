/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: DetailedReportDialog.js 18399 2014-02-28 10:17:53Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.billing.DetailedReportDialog = function(config){
	
	if(!config)
	{
		config={};
	}
	
	this.reportPanel = new Ext.Panel({
		autoScroll:true
	});
	
	
	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=true;
	config.collapsible=true;
	config.width=400;
	config.height=500;
	config.closeAction='hide';
	config.title= GO.billing.lang.report;					
	config.items= this.reportPanel;	
	
	GO.billing.DetailedReportDialog.superclass.constructor.call(this, config);
}
Ext.extend(GO.billing.DetailedReportDialog, Ext.Window,{
	
	template: new Ext.XTemplate('<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
	'<tr>'+
		'<td colspan="3" class="display-panel-heading">'+GO.billing.lang.turnOver+' {period}</td>'+
	'</tr>'+
	'<tr>'+
			'<td class="table_header_links"></td>'+
			'<td class="table_header_links">'+GO.billing.lang.moneyAmount+'</td>'+
			'<td class="table_header_links">'+GO.billing.lang.vat+'</td>'+
		'</tr>'+
	'<tpl if="abroad.length">'+
		'<tr><td>'+GO.billing.lang.abroad+':</td><td>{abroad}</td><td></td></tr>'+
	'</tpl>'+
	'<tpl if="intracommunity.length">'+
		'<tr><td>'+GO.billing.lang.intracommunity+':</td><td>{intracommunity}</td><td></td></tr>'+
	'</tpl>'+
	'<tpl if="vat_types.length&gt;0">'+
		'<tpl for="vat_types">'+
			'<tr><td>'+GO.billing.lang.vat+' {vat}:</td><td>{turnover}</td><td>{vat_amount}</td>'+
		'</tpl>'+
	'</tpl>'+
	'<tr><td>'+GO.billing.lang.total+':</td><td <tpl if="vat_types.length&gt;1">style="border-top:1px solid black"</tpl>>{total}</td><td <tpl if="vat_types.length&gt;1">style="border-top:1px solid black"</tpl>>{total_vat}</td></tr>'+
	'</table>'+
	
	'<tpl if="eu_customers.length">'+
		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
		'<tr>'+
			'<td colspan="4" class="display-panel-heading">'+GO.billing.lang.EUCustomers+'</td>'+
		'</tr>'+
		'<tr>'+
			'<td class="table_header_links">'+GO.lang.strCountry+'</td>'+
			'<td class="table_header_links">'+GO.billing.lang.customerVatNo+'</td>'+
			'<td class="table_header_links">'+GO.billing.lang.customer+'</td>'+
			'<td class="table_header_links">'+GO.billing.lang.amount+'</td>'+
		'</tr>'+
		'<tpl for="eu_customers">'+
			'<tr>'+
				'<td>{customer_country}</td>'+
				'<td>{customer_vat_no}</td>'+
				'<td>{customer_name}</td>'+
				'<td>{subtotal}</td>'+
			'</tr>'+	
		'</tpl>'+
		'<tr>'+
				'<td colspan="3">'+GO.billing.lang.total+'</td>'+
				'<td style="border-top:1px solid black">{eu_customers_total}</td>'+
			'</tr>'+
		'</table>'+
	'</tpl>'+
	
	
	'<tpl if="expenses.length">'+
		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
		'<tr>'+
			'<td colspan="3" class="display-panel-heading">'+GO.billing.lang.expenses+'</td>'+
		'</tr>'+
		'<tr>'+
			'<td class="table_header_links">'+GO.billing.lang.category+'</td>'+
			'<td class="table_header_links">'+GO.billing.lang.subtotal+'</td>'+
			'<td class="table_header_links">'+GO.billing.lang.vat+'</td>'+
		'</tr>'+
		'<tpl for="expenses">'+
			'<tr>'+
				'<td>{name}</td>'+
				'<td>{subtotal}</td>'+
				'<td>{vat}</td>'+
			'</tr>'+	
		'</tpl>'+
		'<tr>'+
				'<td>'+GO.billing.lang.total+'</td>'+
				'<td style="border-top:1px solid black">{total_expense_subtotal}</td>'+
				'<td style="border-top:1px solid black">{total_expense_vat}</td>'+
			'</tr>'+
		'</table>'+
	'</tpl>'
	
	)
	
	
	,
	
	loadReport : function(month, year)
	{
		GO.request({
			maskEl: this.body,
			url: 'billing/report/yearReportDetails',
			params: {				
				month: month,
				year: year
			},
			success: function(options, success, result)
			{			
				this.setData(result);
			},
			scope: this			
		});
		
	},
	
	setData : function(data)
	{
		this.data=data;		
		this.template.overwrite(this.reportPanel.body, data);	
	}
});