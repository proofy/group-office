

GO.moduleManager.onModuleReady('users',function(){
	Ext.override(GO.users.UserDialog,{
		
//$l['year'] = 'Jaar';
//$l['leaveHours'] = 'Verlofuren';
				
		_leavedaysActive : false,
				
		buildForm : GO.users.UserDialog.prototype.buildForm.createSequence(function(){
			
			//this.yearCreditsGrid = new GO.leavedays.YearCreditsGrid({region: 'south'});
			
			this.workWeekPanel = new Ext.Panel({				
				title: GO.leavedays.lang['workingWeek'],
				layout: 'border',
				border: false,
				items:[{
					region: 'center',
					layout: 'form',
					cls: 'go-form-panel',
					border: false,
					labelWidth: 140,
					items: [{
						xtype: 'fieldset',
						title: GO.leavedays.lang['workingHours'],
						items: [this.wwMoField = new GO.form.NumberField({
								xtype: 'textfield',
								fieldLabel: GO.leavedays.lang['weekMo'], 
								name:'mo_work_hours',
								maxValue: 24,
								minValue: 0,
								decimals: 2
							}),this.wwTuField = new GO.form.NumberField({
								xtype: 'textfield',
								fieldLabel: GO.leavedays.lang['weekTu'], 
								name:'tu_work_hours',
								maxValue: 24,
								minValue: 0,
								decimals: 2
							}),this.wwWeField = new GO.form.NumberField({
								xtype: 'textfield',
								fieldLabel: GO.leavedays.lang['weekWe'], 
								name:'we_work_hours',
								maxValue: 24,
								minValue: 0,
								decimals: 2
							}),this.wwThField = new GO.form.NumberField({
								xtype: 'textfield',
								fieldLabel: GO.leavedays.lang['weekTh'], 
								name:'th_work_hours',
								maxValue: 24,
								minValue: 0,
								decimals: 2
							}),this.wwFrField = new GO.form.NumberField({
								xtype: 'textfield',
								fieldLabel: GO.leavedays.lang['weekFr'], 
								name:'fr_work_hours',
								maxValue: 24,
								minValue: 0,
								decimals: 2
							}),this.wwSaField = new GO.form.NumberField({
								xtype: 'textfield',
								fieldLabel: GO.leavedays.lang['weekSa'], 
								name:'sa_work_hours',
								maxValue: 24,
								minValue: 0,
								decimals: 2
							}),this.wwSuField = new GO.form.NumberField({
								xtype: 'textfield',
								fieldLabel: GO.leavedays.lang['weekSu'], 
								name:'su_work_hours',
								maxValue: 24,
								minValue: 0,
								decimals: 2
							})]
					}]
				}
				//,this.yearCreditsGrid
				]
			});
			
			this.addPanel(this.workWeekPanel);
		})
		
//		,afterLoad : GO.users.UserDialog.prototype.afterLoad.createSequence(function(remoteModelId,config,action){
//
//			var response = Ext.decode(action.response.responseText);
//			this._setWorkWeekTabDisabled(response.data['uses_leavedays_module']=='0');
//
//		}),
						
//		afterSubmit : GO.users.UserDialog.prototype.afterLoad.createSequence(function(action){
//			
//			var response = Ext.decode(action.response.responseText);
//			this._setWorkWeekTabDisabled(response.data['uses_leavedays_module']=='0');
//			
//		}),
											
//		_setWorkWeekTabDisabled : function(disable) {
//			
//			this.wwMoField.setDisabled(disable);
//			this.wwTuField.setDisabled(disable);
//			this.wwWeField.setDisabled(disable);
//			this.wwThField.setDisabled(disable);
//			this.wwFrField.setDisabled(disable);
//			this.wwSaField.setDisabled(disable);
//			this.wwSuField.setDisabled(disable);
//			this.workWeekPanel.setDisabled(disable);
//			
//			if(disable)
//				this._tabPanel.hideTabStripItem(this.workWeekPanel);
//			else
//				this._tabPanel.unhideTabStripItem(this.workWeekPanel);
//			
//			this._leavedaysActive = !disable;
//			
//		}
		
	});
}, this);