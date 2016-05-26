
GO.hoursapproval2.MainPanel = function(config){

	config = config || {};
	
	var now = new Date();

	config.layout='border';
	config.border=false;
 
	this.navPanel = new GO.hoursapproval2.WeekGrid({
		title: '',

		region:'west',
		listeners: {
			delayedrowselect: function(sm, i, record) {
				this.approvalGrid.setWeek(this.navPanel.getYear(), record.data.weeknb);
			},
			scope:this
		},
		split:true,
		width: 200
	});

	this.approvalGrid = new GO.hoursapproval2.ApprovalGrid({
		region:'center',
		weekgrid: this.navPanel
	});

//	this.approvalGrid.store.on('load', function(){
//
//		var closed = this.approvalGrid.store.findBy(function(r){
//			return r.get('status')!=1;
//		}, this) >-1 ? 0 : 1;
//
//		var i = this.navPanel.store.findBy(function(r){
//			return r.get('value')==this.approvalGrid.store.baseParams.date;
//		}, this);
//
//		if(i>-1){
//			var r = this.navPanel.store.getAt(i);
//			r.set('closed', closed);
//		}
//
//	}, this);

	config.items=[this.approvalGrid,this.navPanel];

	config.tbar= {
		cls:'go-head-tb',
		items:[{
			xtype:'htmlcomponent',
			html:GO.hoursapproval2.lang.hoursapproval,
			cls:'go-module-title-tbar'
		},{
			iconCls: 'btn-refresh',
			text: GO.lang.cmdRefresh,
			cls: 'x-btn-text-icon',
			handler: function(){
				this.navPanel.store.reload();
				this.approvalGrid.store.reload();
			},
			scope: this
	}]}

	GO.hoursapproval2.MainPanel.superclass.constructor.call(this, config);
};


Ext.extend(GO.hoursapproval2.MainPanel, Ext.Panel, {

	afterRender : function(){

		this.navPanel.store.load();

		GO.hoursapproval2.MainPanel.superclass.afterRender.call(this);
	}

});


GO.moduleManager.addModule('hoursapproval2', GO.hoursapproval2.MainPanel, {
	title : GO.hoursapproval2.lang.hoursapproval,
	iconCls : 'go-tab-icon-hoursapproval2'
});