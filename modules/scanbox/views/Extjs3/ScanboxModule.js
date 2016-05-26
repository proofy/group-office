
GO.mainLayout.onReady(function(){
	Ext.TaskMgr.start({
		run: function(){

			GO.request({
				url: 'scanbox/scanbox/scan',
				success: function(options, response, result)
				{
					if(!result.success)
					{
						Ext.MessageBox.alert(GO.lang.strError, GO.lang.strRequestError);
					}else
					{
						if(result.filesfound){
							if(!GO.scanbox.fileFoundDialog)
								GO.scanbox.fileFoundDialog = new GO.scanbox.FileFoundDialog();

							GO.scanbox.fileFoundDialog.show();
						}
					}
				},
				scope:this
			});

		},
		scope:this,
		interval:60000 // Check every minute
	});
});