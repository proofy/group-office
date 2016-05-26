GO.leavedays.LeavedayDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
		
	enableApplyButton: false,
		
	initComponent : function(){
		
		Ext.apply(this, {
			//autoHeight:true,
			titleField:'user_name',
			height: 300,
			width: 700,
			updateAction: 'update',
			createAction: 'create',
			goDialogId:'leaveday',
			title:GO.leavedays.lang['leaveday'],
			formControllerUrl: 'leavedays/leaveday'
		});
		
		GO.leavedays.LeavedayDialog.superclass.initComponent.call(this);
		
	},
	
	afterLoad : function(remoteModelId, config, action){
		
		this.yearField.setValue(GO.leavedays.activeYear);
		this.userIdField.setValue(GO.leavedays.activeUserId);
//		this.setTitle(config['user_name']+': '+GO.leavedays.lang['leaveday']);
		
		if (!(remoteModelId>0)) {
			var now = new Date();
			var theDate = new Date(GO.leavedays.activeYear,now.getMonth(),now.getDate());
			this.firstDateField.setValue(theDate);
			this.lastDateField.setValue(theDate);
		}
		
		this._checkDateInput(true);

	},

	
	buildForm : function () {
		this.propertiesPanel = new Ext.Panel({
			layout: 'column',
			items: [new Ext.Panel({
				columnWidth: .7,
				border: false,
				cls:'go-form-panel',
				layout:'form',
				waitMsgTarget:true,			
				items:[this.userIdField = new Ext.form.NumberField({
					hidden: true,
					decimals: 0,
					name: 'user_id'
				}),{
					xtype:'plainfield',
					name:'user_name',
					fieldLabel:GO.leavedays.lang.employee
				},
				this.yearField = new GO.form.PlainField({
					fieldLabel: GO.leavedays.lang['year'],
					decimals: 0,
					name: 'year'
				}),
				this.firstDateField = new Ext.form.DateField({
					fieldLabel : GO.leavedays.lang['firstDate'],
					name : 'first_date',
					width : 100,
					format : GO.settings['date_format'],
					allowBlank : false,			
					listeners : {
						change : {
							fn : this._checkDateInput,
							scope : this
						}
					}
				}), this.lastDateField = new Ext.form.DateField({
					fieldLabel : GO.leavedays.lang['lastDate'],
					name : 'last_date',
					width : 100,
					format : GO.settings['date_format'],
					allowBlank : false,			
					listeners : {
						change : {
							fn : this._checkDateInput,
							scope : this
						}
					}
				}),
				
				this.hoursCompositeField = new Ext.form.CompositeField({
					fieldLabel:GO.leavedays.lang['leaveHours'],
					items:[
						this.hoursField = new GO.form.NumberField({
							fieldLabel : GO.leavedays.lang['leaveHours'],
							name : 'n_hours',
							width : 50,
							decimals: 2,
							maxValue: 8784,
							allowBlank : true
						}), 
						this.fromTimeField = new GO.form.TimeField({
							boxLabel : GO.leavedays.lang['from'],
							name : 'from_time',
							width : 70
						}),
						this.fromTimeFieldLabel = new Ext.form.Label({
							text:GO.leavedays.lang.starttimeForCalendar
						})
					]
				}),
				
				this.nationalHolidayHoursField = new GO.form.NumberField({
					fieldLabel : GO.leavedays.lang['nationalHoliday'],
					name : 'n_nat_holiday_hours',
					width : 50,
					decimals: 2,
					maxValue: 8784
//					, readOnly: true
				}), this.commentsField = new Ext.form.TextField({
					fieldLabel : GO.leavedays.lang['strDescription'],
					name : 'description',
					width : 300,
					maxLength : 50
				}),
				this.type = new GO.form.ComboBox({
					fieldLabel: GO.leavedays.lang['type'],
					hiddenName: 'ld_credit_type_id',
					anchor: '100%',
					emptyText: GO.lang.strPleaseSelect,
					store: new GO.data.JsonStore({
						url:GO.url("leavedays/creditType/store"),
						fields:['id','name', 'description'],
						remoteSort:true
					}),
					pageSize: parseInt(GO.settings.max_rows_list),
					valueField: 'id',
					displayField: 'name',
					mode: 'remote',
					triggerAction: 'all',
					editable: false,
					selectOnFocus: true,
					forceSelection: true,
					allowBlank: false,
					tpl: new Ext.XTemplate(
						'<tpl for=".">',
						'<div ext:qtip="{description}" class="x-combo-list-item">{name}</div>',
						'</tpl>'
				 )
				})
				
			]
			}),new Ext.Panel({
				columnWidth: .3,
				border: false,
				cls:'go-form-panel',
				layout:'form',
				waitMsgTarget:true,			
				items:[{
						xtype: 'plainfield',
						hideLabel: true,
						value: '<span class="x-panel-header-text">'+GO.leavedays.lang['workingHours']+'</span>'
					},this.wwMoField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: GO.leavedays.lang['weekMo'], 
						name:'mo_work_hours'
					}),this.wwTuField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: GO.leavedays.lang['weekTu'], 
						name:'tu_work_hours'
					}),this.wwWeField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: GO.leavedays.lang['weekWe'], 
						name:'we_work_hours'
					}),this.wwThField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: GO.leavedays.lang['weekTh'], 
						name:'th_work_hours'
					}),this.wwFrField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: GO.leavedays.lang['weekFr'], 
						name:'fr_work_hours'
					}),this.wwSaField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: GO.leavedays.lang['weekSa'], 
						name:'sa_work_hours'
					}),this.wwSuField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: GO.leavedays.lang['weekSu'], 
						name:'su_work_hours'
					})]
			})]
		});

		this.addPanel(this.propertiesPanel);
	},
					
	_checkDateInput : function(loading) {
		
		loading = loading || false;

		var eD = this.lastDateField.getValue();
		var sD = this.firstDateField.getValue();

		if (!GO.util.empty(sD) && sD.getFullYear()!=this.yearField.getValue()) {
			Ext.MessageBox.alert('',GO.leavedays.lang['mustBeCurrentYear'].replace('%y',this.yearField.getValue()));
			this.firstDateField.reset();
		} else if (!GO.util.empty(eD) && eD.getFullYear()!=this.yearField.getValue()) {
			Ext.MessageBox.alert('',GO.leavedays.lang['mustBeCurrentYear'].replace('%y',this.yearField.getValue()));
			this.lastDateField.reset();
		}

		if (!GO.util.empty(sD) && GO.util.empty(eD)) {
			this.lastDateField.setValue(sD);
		}

		if (!GO.util.empty(sD) && !GO.util.empty(eD)) {		
			
			if (sD > eD)
				this.lastDateField.setValue(sD);

			eD = this.lastDateField.getValue();
			sD = this.firstDateField.getValue();
			
		}
		
		if(loading === true) return;
		
		GO.request({
			url: 'leavedays/leaveday/defaultWorkingHours',
			params: {
				'leaveday_id' : this.remoteModelId,
				'user_id': this.userIdField.getValue(),
				'first_date' : sD.format(GO.settings.date_format),
				'last_date' : eD.format(GO.settings.date_format)
			},
			success: function(options, response, result) {
				if (!GO.util.empty(result.feedback))
					Ext.MessageBox.alert('', result.feedback);

				this.hoursField.setValue(result.data['n_leave_hours']);
				this.nationalHolidayHoursField.setValue(result.data['national_holiday_hours']);
			},
			scope: this
		});

	}
	
});