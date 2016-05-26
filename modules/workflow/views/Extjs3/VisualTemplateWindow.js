GO.workflow.VisualTemplateWindow = function(config){
	
	Ext.apply(this, config);

	
	
	this.tpl = new Ext.XTemplate(
		'<div class="wf-container">'+
			'<div class="wf-title">'+
				'<h1>'+GO.workflow.lang.visualTemplateTitle+'</h1>'+
				'<p>'+GO.workflow.lang.visualTemplateStartDate+'</p>'+
			'</div>'+

			'<tpl for="results">'+
				'<div class="wf-'+
					'<tpl if="current == 1">'+
						'active-'+
					'</tpl>'+
				'step">'+
					'<h2>'+GO.workflow.lang.visualTemplateStepTitle+'</h2>'+
					'<p></p>'+
					'<p>'+GO.workflow.lang.visualTemplateStepApprovalStart+
					'<tpl if="all_must_approve == 1">'+
						GO.workflow.lang.visualTemplateAll+
					'</tpl>'+
					'<tpl if="all_must_approve == 0">'+
						GO.workflow.lang.visualTemplateOne+
					'</tpl>'+
						GO.workflow.lang.visualTemplateStepApprovalEnd+
						GO.workflow.lang.visualTemplateStepDueAt+'</p>'+
				'</div>'+
			'</tpl>'+
			'<hr />'+
		'</div>'
	);

	GO.workflow.VisualTemplateWindow.superclass.constructor.call(this, {
		modal:false,
		layout:'fit',
		height: 460,
		width: 480,
		resizable: false,
		closeAction:'hide',
		title:GO.workflow.lang.workflow,
		items: 
			this.templatePanel = new Ext.Panel({
				layout:'fit'				
			}),		
		buttons: [
			{				
				text: GO.lang['cmdClose'],
				handler: function(){this.hide()},
				scope:this
			}
		]
    });
};

Ext.extend(GO.workflow.VisualTemplateWindow, Ext.Window, {
	show : function(workflow_id){
		this.workflow_id = workflow_id;
		
		GO.workflow.VisualTemplateWindow.superclass.show.call(this);
		GO.request({
			url:'workflow/workflow/progressStore',
			params:{
				id:workflow_id
			},
			maskEl:this.templatePanel.getEl(),
			success:function(response, options, result){
				this.tpl.overwrite(this.templatePanel.body, result);
			},
			scope:this
		});
		
	}
});
	
