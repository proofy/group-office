/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: ExpenseBudgetsGrid.js 20508 2015-05-11 11:58:19Z mdhart $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 

GO.projects2.ExpenseBudgetsGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		Ext.apply(this,{
			title:GO.projects2.lang.expenseBudgets,
			disabled:true,
			standardTbar:true,
			store: new GO.data.JsonStore({
				url:GO.url("projects2/expenseBudget/store"),
				fields:['id','description','supplier_name','nett','gross','vat','comments']
			}),
			border: false,
			deleteConfig: {
				extraWarning: GO.projects2.lang['deleteExpenseBudget']+'\n'
				},
			paging:true,
			listeners:{
				show:function(){
					this.store.load();
				},
				scope:this
			},
			cm:new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:[
				{
					header: 'ID', 
					dataIndex: 'id',
					width: 20
				},{
					header: GO.lang.strDescription, 
					dataIndex: 'description'
				},{
					header: GO.projects2.lang['supplier'], 
					dataIndex: 'supplier_name'
				},{
					header: GO.projects2.lang['comments'], 
					dataIndex: 'comments'
				},{
					header: GO.projects2.lang.nett, 
					dataIndex: 'nett',
					align:"right",
					renderer: GO.util.format.valuta
				}	
				]
			})
		});
		
		GO.projects2.ExpenseBudgetsGrid.superclass.initComponent.call(this);		
	},
	
	dblClick : function(grid, record, rowIndex){
		this.showExpenseBudgetDialog(record.id);
	},
	
	btnAdd : function(){				
		this.showExpenseBudgetDialog();	  	
	},
	showExpenseBudgetDialog : function(id){
		if(!this.expenseBudgetDialog){
			this.expenseBudgetDialog = new GO.projects2.ExpenseBudgetDialog();

			this.expenseBudgetDialog.on('save', function(){   
				this.store.load(); 			    			
			}, this);	
		}
		this.expenseBudgetDialog.show(id,{
			values:{
				project_id:this.store.baseParams.project_id
				}
		});	  
	},
	
	setProjectId : function(project_id){
		this.store.baseParams.project_id=project_id;
		this.setDisabled(GO.util.empty(project_id));
	}
});