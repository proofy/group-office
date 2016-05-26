/* 
 * There is no mainpanel this will just add a button the the ProjectPanel new Menu
 */
GO.moduleManager.onModuleReady('projects2',function(){
	Ext.override(GO.projects2.MainPanel,{		

		initComponent : GO.projects2.MainPanel.prototype.initComponent.createInterceptor(function(){
			
			//add survey view to nav
			var btnAnalizer = new Ext.Button({
				cls: 'x-btn-text-icon',
				iconCls: 'pr2a-btn-report',
				text: GO.pr2analyzer.lang.analyze,
				handler : function() { this.analizeDialog.show(); },
				hidden: !GO.projects2.has_finance_permission,
				scope:this
			});
			this.tbar.add(btnAnalizer);
			
			this.reportGrid = new GO.pr2analyzer.ReportGrid({
				border: false,
				id:this.id+'-survey'
			});
			
			this.analizeDialog = new GO.Window({
				title:GO.pr2analyzer.lang.analyze,
				maximizable: true,
				height: 650,
				width: 1000,
				layout:'fit',
				listeners: {
					show: function() {
						this.reportGrid.store.reload();
					},
					scope:this
				},
				scope:this,
				items : [
					this.reportGrid
				]
			});

		})
	
	});
});