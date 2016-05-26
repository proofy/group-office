GO.zpushadmin.DevicePanel = Ext.extend(GO.DisplayPanel,{
	model_name : "GO\\Zpushadmin\\Model\\Device",
	stateId : 'zpa-device-panel',
	noFileBrowser : true,
	newMenuButton : false,
	
	createTopToolbar : function(){	
		var tbar=[];
	
		tbar.push({            
	      iconCls: "btn-refresh",
	      tooltip:GO.lang.cmdRefresh,      
	      handler: this.reload,
	      scope:this
	  });
	  tbar.push({            
	      iconCls: "btn-print",
	      tooltip:GO.lang.cmdPrint,
	 			handler: function(){
					this.body.print({title:this.getTitle()});
				},
				scope:this
	  });
	  
	  return tbar;
	},
	
	initComponent : function(){
		
		this.loadUrl=('zpushadmin/device/display');
	
		this.template = 			
				'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
					'<tr>'+
						'<td colspan="2" class="display-panel-heading">'+GO.zpushadmin.lang.device+': {device_id}</td>'+
					'</tr>'+
					'<tr>'+
						'<td>'+GO.zpushadmin.lang.deviceName+':</td>'+
						'<td>'+
							'<tpl if="deviceName != null">{deviceName}</tpl>'+
							'<tpl if="deviceName == null">-</tpl>'+
						'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>'+GO.zpushadmin.lang.deviceType+':</td>'+
						'<td>'+
							'<tpl if="device_type != null">{device_type}</tpl>'+
							'<tpl if="device_type == null">-</tpl>'+
						'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>'+GO.zpushadmin.lang.deviceModel+':</td>'+
						'<td>'+
							'<tpl if="deviceModel != null">{deviceModel}</tpl>'+
							'<tpl if="deviceModel == null">-</tpl>'+
						'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>'+GO.zpushadmin.lang.deviceImei+':</td>'+
						'<td>'+
							'<tpl if="deviceImei != null">{deviceImei}</tpl>'+
							'<tpl if="deviceImei == null">-</tpl>'+
						'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>'+GO.zpushadmin.lang.deviceOS+':</td>'+
						'<td>'+
							'<tpl if="deviceOS != null">{deviceOS}</tpl>'+
							'<tpl if="deviceOS == null">-</tpl>'+
						'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>'+GO.zpushadmin.lang.deviceOSLanguage+':</td>'+
						'<td>'+
							'<tpl if="deviceOSLanguage != null">{deviceOSLanguage}</tpl>'+
							'<tpl if="deviceOSLanguage == null">-</tpl>'+
						'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>'+GO.zpushadmin.lang.deviceOperator+':</td>'+
						'<td>'+
							'<tpl if="deviceOperator != null">{deviceOperator}</tpl>'+
							'<tpl if="deviceOperator == null">-</tpl>'+
						'</td>'+
					'</tr>'+
//					'<tr>'+
//						'<td>'+GO.zpushadmin.lang.deviceOutboundSMS+':</td>'+
//						'<td>'+
//							'<tpl if="deviceOutboundSMS != null">{deviceOutboundSMS}</tpl>'+
//							'<tpl if="deviceOutboundSMS == null">-</tpl>'+
//						'</td>'+
//					'</tr>'+
					'<tr>'+
						'<td>'+GO.zpushadmin.lang.devicePhoneNumber+':</td>'+
						'<td>'+
							'<tpl if="devicePhoneNumber != null">{devicePhoneNumber}</tpl>'+
							'<tpl if="devicePhoneNumber == null">-</tpl>'+
						'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>'+GO.zpushadmin.lang.remoteAddr+':</td>'+
						'<td>'+
							'<tpl if="remote_addr != null">{remote_addr}</tpl>'+
							'<tpl if="remote_addr == null">-</tpl>'+
						'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>'+GO.zpushadmin.lang.deviceASVersion+':</td>'+
						'<td>'+
							'<tpl if="deviceASVersion != null">{deviceASVersion}</tpl>'+
							'<tpl if="deviceASVersion == null">-</tpl>'+
						'</td>'+
					'</tr>'+
//					'<tr>'+
//						'<td>'+GO.zpushadmin.lang.deviceWiperequestOn+':</td>'+
//						'<td>'+
//							'<tpl if="deviceWiperequestOn != null">{deviceWiperequestOn}</tpl>'+
//							'<tpl if="deviceWiperequestOn == null">-</tpl>'+
//						'</td>'+
//					'</tr>'+
//					'<tr>'+
//						'<td>'+GO.zpushadmin.lang.deviceWiperequestBy+':</td>'+
//						'<td>'+
//							'<tpl if="deviceWiperequestBy != null">{deviceWiperequestBy}</tpl>'+
//							'<tpl if="deviceWiperequestBy == null">-</tpl>'+
//						'</td>'+
//					'</tr>'+
//					'<tr>'+
//						'<td>'+GO.zpushadmin.lang.deviceWiped+':</td>'+
//						'<td>'+
//							'<tpl if="deviceWiped != null">{deviceWiped}</tpl>'+
//							'<tpl if="deviceWiped == null">-</tpl>'+
//						'</td>'+
//					'</tr>'+
					'<tr>'+
						'<td>'+GO.zpushadmin.lang.deviceErrors+':</td>'+
						'<td>'+
							'<tpl if="deviceErrors != null">{deviceErrors}</tpl>'+
							'<tpl if="deviceErrors == null">-</tpl>'+
						'</td>'+
					'</tr>';
						
		Ext.apply(this.templateConfig, GO.linksTemplateConfig);
		
		GO.zpushadmin.DevicePanel.superclass.initComponent.call(this);
	}
});			