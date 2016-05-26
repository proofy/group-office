/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TypesGrid.js 17031 2013-10-13 09:20:34Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.TypesGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		Ext.apply(this,{
			title:GO.projects2.lang.types,
			standardTbar:true,
			store: new GO.data.JsonStore({
				url:GO.url("projects2/type/store"),
				fields: ['id','name','acl_id']
			}),
            editDialogClass: GO.projects2.TypeDialog,
			border: false,
			paging:true,
			listeners:{
				show:function(){
					this.store.load();
				},
				scope:this
			},
			cm:new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:[
                {
					header: GO.lang.strName, 
					dataIndex: 'name'
				}
				]
			})
		});
		
		GO.projects2.TypesGrid.superclass.initComponent.call(this);		
	}
});