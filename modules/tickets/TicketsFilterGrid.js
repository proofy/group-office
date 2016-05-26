/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TicketsFilterGrid.js 21406 2016-05-25 09:37:17Z mschering $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.TicketsFilterGrid = function(config)
{
	if(!config)
		config = {};			
	

	config.store.on('load', function () {
		var tp = GO.mainLayout.getModulePanel("tickets");
		if (tp) {
			var agent = this.store.reader.jsonData.showForAgent;
			tp.centerPanel.agentField.store.load({callback: function (rs, opt, s) {
					tp.centerPanel.agentField.setValue(agent);
				}});
		}
	}, this);

	GO.tickets.TicketsFilterGrid.superclass.constructor.call(this, config);
}

Ext.extend(GO.tickets.TicketsFilterGrid, GO.grid.MultiSelectGrid);