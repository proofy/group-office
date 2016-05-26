/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: SettingsDialog.js 19875 2014-10-24 12:13:02Z wsmits $
 * @author Merijn Schering <mschering@intermesh.nl>
 */


 
GO.billing.SettingsDialog = function(config){
	
	
	if(!config)
	{
		config={};
	}
		
	this.booksGrid = new GO.billing.SettingsBooksGrid();
	this.expenseBooksGrid = new GO.billing.SettingsExpenseBooksGrid();
	this.costCodeGrid = new GO.billing.SettingsCostCodeGrid();
	this.taxRateGrid = new GO.billing.SettingsTaxRateGrid();

	var items = [
			this.booksGrid,			
			this.expenseBooksGrid
			];
	if(GO.settings.modules.billing.write_permission)
	{
		this.languagesGrid = new GO.billing.LanguagesGrid();
		items.push(this.languagesGrid);
	}
	items.push(this.costCodeGrid);
	items.push(this.taxRateGrid);
	
	this.tabPanel = new Ext.TabPanel({
		activeTab:0,
		border:false,
		items:items 
	});

	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=false;
	config.width=800;
	config.height=500;
	config.closeAction='hide';
	config.title= GO.lang.cmdSettings;					
	config.items=this.tabPanel;
	config.buttons=[{
			text: GO.lang['cmdClose'],
			handler: function(){
				/*if(this.categoriesGrid.changed)
				{
					this.fireEvent('change');
					this.categoriesGrid.changed=false;
				}*/
				this.hide();
				
			},
			scope:this
		}					
	];
	

	
	GO.billing.SettingsDialog.superclass.constructor.call(this, config);
	
	this.addEvents({'change':true});
};

Ext.extend(GO.billing.SettingsDialog, GO.Window,{
	
	show : function(){
		
		if(!this.booksGrid.store.loaded)
		{
			this.booksGrid.store.load();
		}
		GO.billing.SettingsDialog.superclass.show.call(this);
	
	}

});