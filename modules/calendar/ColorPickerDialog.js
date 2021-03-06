GO.calendar.ColorPickerDialog = function(config){

	if(!config)
	{
		config = {};
	}

	this.buildForm();

	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};

	config.layout='fit';
	config.title=GO.calendar.lang.calendarColor;
	config.modal=false;
	config.border=false;
	config.width=420;
	config.autoHeight=true;
	config.resizable=false;
	config.plain=true;
	config.shadow=false,
	config.closeAction='hide';
	config.items=this.formPanel;
	config.focus=focusFirstField.createDelegate(this);
	config.buttons=[{
		text:GO.lang['cmdOk'],
		handler: function()
		{
			this.submitForm(true)
		},
		scope: this
	},{
		text:GO.lang['cmdApply'],
		handler: function()
		{
			this.submitForm(false)
		},
		scope: this
	},{
		text:GO.lang['cmdClose'],
		handler: function()
		{
			this.hide()
		},
		scope: this
	}];

	GO.calendar.ColorPickerDialog.superclass.constructor.call(this,config);

	this.addEvents({'save' : true});
}

Ext.extend(GO.calendar.ColorPickerDialog, Ext.Window, {

	show : function ()
	{
		if(!this.rendered)
			this.render(Ext.getBody());

		this.formPanel.form.reset();
		this.editorGrid.store.load();

		GO.calendar.ColorPickerDialog.superclass.show.call(this);
	},
	submitForm : function(hide)
	{
		this.formPanel.form.submit(
		{
			url : GO.url('calendar/calendar/submitColors'),
			params: {
				griddata: Ext.encode(this.getGridData())
			},
			waitMsg:GO.lang['waitMsgSave'],
			success:function(form, action)
			{
				this.fireEvent('save');
				this.editorGrid.store.commitChanges();
				if(hide)
				{
					this.hide();
				}
			},
			failure: function(form, action)
			{
				var error = '';
				if(action.failureType=='client')
				{
					error = GO.lang['strErrorsInForm'];
				}
				else
				{
					error = action.result.feedback;
				}
				Ext.MessageBox.alert(GO.lang['strError'], error);
			},
			scope:this
		});
	},

	getGridData : function(){

		var data = {};

		for (var i = 0; i < this.editorGrid.store.data.items.length;  i++)
		{
			var r = this.editorGrid.store.data.items[i].data;

			data[i]={};

			for(var key in r)
			{
				data[i][key]=r[key];
			}
		}

		return data;
	},
	buildForm : function ()
	{
		var fields ={
		fields:['id','name','color'],
		columns:[	{
			header: GO.calendar.lang.calendar,
			dataIndex: 'name'
		},{
			header: GO.calendar.lang.calendarColor,
			dataIndex: 'color',
			width: 30,
			renderer: function(value,meta,record) {
				return '<div style="background-color: #'+record.data.color+';border: 1px solid #666;width:70px;height:9px;margin-right:4px;float:left;"></div>';
			},
			editor: 
				new GO.form.ColorField({
					value : "EBF1E2"
//					fieldLabel : GO.lang.color,
//					value : GO.calendar.defaultBackground,
//					anchor:'50%',
//					name : 'color',
				})
			}]
		};


		var columnModel =  new Ext.grid.ColumnModel({
			defaults:{
				sortable:true
			},
			columns:fields.columns
		});

		var store = new GO.data.JsonStore({
			url : GO.url('calendar/calendar/loadColors'),
			fields: fields.fields,
			remoteSort: true
		});

		this.editorGrid = new Ext.grid.EditorGridPanel({
			height: 300,
			store: store,
			bbar: new Ext.PagingToolbar({
							cls: 'go-paging-tb',
							store: store,
							pageSize: parseInt(GO.settings['max_rows_list']),
							displayInfo: true,
							displayMsg: GO.lang['displayingItems'],
							emptyMsg: GO.lang['strNoItems']
						}),
			cm: columnModel,
			sm: new Ext.grid.RowSelectionModel(),
			view: new Ext.grid.GridView({
				autoFill: true,
				forceFit: true,
				emptyText: GO.lang['strNoItems']
			}),
			loadMask: true,
			clicksToEdit: 1
		});
		
		this.formPanel = new Ext.FormPanel({
//			cls:'go-form-panel',
			anchor:'100% 100%',		
			defaultType:'textfield',
			autoHeight:true,
			waitMsgTarget:true,
			labelWidth:75,
			items: this.editorGrid
		});
	}
});