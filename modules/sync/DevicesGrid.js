/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: DevicesGrid.js
 * @copyright Copyright Intermesh
 * @author Wilmar van Beusekom <@>
 */
GO.sync.DevicesGrid = function(config){
	if(!config)
	{
		config = {};
	}

	var action = new Ext.ux.grid.RowActions({
		header:''
		,
		keepSelection:true
		,
		actions:[{
			qtipIndex:'qtip1'
			,
			iconCls:'btn-delete'
		}]
		,
		width: 30
	/*,
		callbacks:{
			'icon-plus':function(grid, record, action, row, col) {
				Ext.ux.Toast.msg('Callback: icon-plus', 'You have clicked row: <b>{0}</b>, action: <b>{0}</b>', row, action);
			}
		}*/
	});

	action.on({
		action:function(grid, record, action, row, col) {

			if(confirm(GO.lang.strDeleteSelectedItem)){
				GO.request({
					url: "syncml/device/delete",
					params: {						
						'id' : record.data.id
					},
					success: function(response,options) {
						grid.store.remove(record);						
					},
					scope: this
				});
			}
		}
	});

	config.store = new GO.data.JsonStore({
		url: GO.url("syncml/device/store"),
		fields:['id', 'man', 'mod', 'swv','dev_id','UTC'],
		remoteSort: true
	});

	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[{
		header: GO.sync.lang.manufacturer,
		id: 'manuCol',
		dataIndex: 'man'
	},{
		header: GO.sync.lang.model,
		id: 'modelCol',
		dataIndex: 'mod'
	},{
		header: 'URI',
		id: 'uriCol',
		dataIndex: 'dev_id'
	},{
		header: 'swv',
		dataIndex: 'swv'
	},
	action
	]
	});
	
	config.cm=columnModel;
	config.view=new Ext.grid.GridView({
		emptyText: GO.lang['strNoItems'],
		autoFill:true,
		forceFit:true
	});
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	config.plugins = [action];

	GO.sync.DevicesGrid.superclass.constructor.call(this, config);
};
Ext.extend(GO.sync.DevicesGrid, GO.grid.GridPanel,{

	getGridData : function(){
		var data = {};
		data['def']=false
		for (var i = 0; i < this.store.data.items.length;  i++)
		{
			var r = this.store.data.items[i].data;

			data[i]={};

			for(var key in r)
			{
				data[i][key]=r[key];
				if(key == 'default_tasklist' && r[key] == 1)
					data['def'] = true;
			}
		}
		return data;
	}
});

GO.sync.DefaultRadioColumn = function(config) {
	if(!config)
	{
		config={};
	}
	GO.sync.DefaultRadioColumn.superclass.constructor.call(this, config);
};

Ext.extend(GO.sync.DefaultRadioColumn, GO.grid.RadioColumn,{

});