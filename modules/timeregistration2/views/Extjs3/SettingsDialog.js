/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * This is the dialog that shows up when double clicking a template
 * Was converted to a TabbedFormDialog at Nov 14 2012
 *
 * @version $Id: SettingsDialog.js 17032 2013-10-13 09:20:48Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.SettingsDialog = Ext.extend(GO.dialog.TabbedFormDialog, {
  initComponent: function() {

    Ext.apply(this, {
      goDialogId: 'tr-settings-dialog',
      layout: 'fit',
      title: GO.lang['administration'],
      width: 700,
      height: 500,
      resizable: false,
      formControllerUrl: 'timeregistration2/settings'
    });

    GO.timeregistration2.SettingsDialog.superclass.initComponent.call(this);
  },
  
  buildForm: function() {
	
	this.propertiesPanel = new Ext.Panel({
		title:GO.lang.cmdSettings,
		layout: 'form',
		cls:'go-form-panel',
		items:[new Ext.form.ComboBox({
			fieldLabel : GO.timeregistration2.lang.roundMinutes,
			hiddenName : 'tr_roundMinutes',
			triggerAction : 'all',
			editable : false,
			selectOnFocus : true,
			width : 148,
			forceSelection : true,
			mode : 'local',
			value : GO.timeregistration2.roundMinutes,
			valueField : 'value',
			displayField : 'text',
			store : new Ext.data.SimpleStore({
				fields : ['value', 'text'],
				data : [ [0, GO.timeregistration2.lang.noRound],
				[5, '5 '+GO.timeregistration2.lang.minutes],
				[6, '6 '+GO.timeregistration2.lang.minutes],
				[10, '10 '+GO.timeregistration2.lang.minutes],
				[15, '15 '+GO.timeregistration2.lang.minutes],
				[20, '20 '+GO.timeregistration2.lang.minutes],
				[30, '30 '+GO.timeregistration2.lang.minutes] ]
			})
		}),{
			hideLabel:true,
			xtype:'checkbox',
			boxLabel: GO.timeregistration2.lang.roundUp,
			checked:GO.timeregistration2.roundUp=='1',
			name:'tr_roundUp'
		},{
		  xtype: 'fieldset',
		  title: GO.timeregistration2.lang['notificationOptions'],
		  labelWidth: 200,
		  items: [
			{ 
			  xtype: 'compositefield', 
			  fieldLabel: GO.timeregistration2.lang['daysToFinishMonth'],
			  items: [
				{xtype: 'numberfield', decimals: 0, width: 40, name: 'tr_daysToFinishMonth'},
				{xtype: 'displayfield', value: GO.timeregistration2.lang['days']}
			  ]
			},{ 
			  xtype: 'compositefield', 
			  fieldLabel: GO.timeregistration2.lang['dailyHourLimit'],
			  items: [
				{xtype: 'numberfield', decimals: 0, width: 40, name: 'tr_dailyHourLimit'},
				{xtype: 'displayfield', value: GO.timeregistration2.lang['hours']}
			  ]
			},{ 
			  xtype: 'compositefield', 
			  fieldLabel: GO.timeregistration2.lang['weeklyOvertime'],
			  items: [
				{xtype: 'numberfield', decimals: 0, width: 40, name: 'tr_weeklyOvertime'},
				{xtype: 'displayfield', value: '%'}
			  ]
			},{ 
			  xtype: 'compositefield', 
			  fieldLabel: GO.timeregistration2.lang['maxHoursTillBreak'],
			  items: [
				{xtype: 'numberfield', decimals: 0, width: 40, name: 'tr_maxHoursTillBreak'},
				{xtype: 'displayfield', value: GO.timeregistration2.lang['hours']}
			  ]
			},{ 
			  xtype: 'compositefield', 
			  fieldLabel: GO.timeregistration2.lang['minBreaktime'],
			  items: [
				{xtype: 'numberfield', decimals: 0, width: 40, name: 'tr_minBreakTime'},
				{xtype: 'displayfield', value: GO.timeregistration2.lang['minutes']}
			  ]
			}
		  ]
		}]
	});
	

    this.addPanel(this.propertiesPanel);
//	this.addPanel(new GO.projects2.StandardTaskGrid());
	
//	this.addPanel(new GO.timeregistration2.EmployeeGrid());
//	this.addPanel(new GO.timeregistration2.NonBusinessDaysGrid());
    
  }

});