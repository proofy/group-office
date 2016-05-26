GO.workflow.FolderPanel = Ext.extend(Ext.Panel, {
	
	folder_id:false,

	initComponent : function(){	
		Ext.apply(this, {
			disabled:true,
			layout:'form',
			title: GO.workflow.lang.workflow,
			cls:'go-form-panel',
			items:[
				{
					xtype: 'htmlcomponent',
					html: GO.workflow.lang.folderWorkflowText
				},
				{
					xtype: 'htmlcomponent',
					html: '<hr />'
				},
				new GO.workflow.SelectProcess({
					allowBlank:true,
					width: 200
				})
			]			
		});		
		GO.workflow.FolderPanel.superclass.initComponent.call(this);
	},
	setFolderId : function(id){
		this.folder_id = id;
		this.setDisabled(false);
	}
});