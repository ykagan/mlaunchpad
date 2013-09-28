// this script will be included by the eBook page. So we don't know what server we'll be on
// therefore we have to specify an absolute url below.
//var cia_base_url = "http://pepperwilliams.com/cia_final/";
var cia_base_url = "http://courses.bfwpub.com/arga/concepts_in_action/";
var angel_server = "http://angel.bfwpub.com";	// note that this one *doesn't* have the final "/"

document.write('<script src="' + cia_base_url + 'jquery.js" type="text/javascript" language="Javascript"></script>');

function ScrollToElement(theElement){
	var selectedPosY = 0;
	if(theElement != null){
		selectedPosY += theElement.offsetTop;
	}
	self.scrollTo(0,selectedPosY);
}

// LO-specific info: Make these arrays in case we have more than one on a page
// loDir should be, e.g., "030_opponent_process"; it's not used anymore (11/30/2009)
// loAbbrev should be, e.g., "opponent_proc"
// loTitle should be, e.g., "Opponent Processes in Vision"
loDir = new Array();
loAbbrev = new Array();
loTitle = new Array();

function InitLO() {
	// we don't need to do any initialization in this version, but legacy
	// ebooks will include a call to InitLO().
}

function WriteLODefinition(i, this_loDir, this_loAbbrev, this_loTitle) {
	// Fill in the names for this LO
	loDir[i] = this_loDir;	// no longer used
	loAbbrev[i] = this_loAbbrev;	// this is the cia_id
	loTitle[i] = this_loTitle;
	
	// angel_server is listed above; we need that for the iframe url
	
	// if there is a variable called cia_id_page_id_mappings defined,
	// use that to get the page_id from the cia_id
	var page_id
	if (window.cia_id_page_id_mappings != null) {
		page_id = cia_id_page_id_mappings[this_loAbbrev];

	// else assume we're using the "standard" page id of "cia_" + this_loAbbrev
	} else {
		// e.g. "cia_cone_responses"
		page_id = "cia_" + this_loAbbrev;
	}

	var i = PopIn_Include.InitializeItem({
		  index: i
		, type:'ARGA'
		, width:600
		, height:600
		, page_id: page_id
		, server_url: angel_server
		, remove_on_close: true
	});
	
	// compose extra html to cover cadre's close icon
	// var html = '<div style="position:absolute; right:12px; top:9px; background-color:#000; color:#fff; z-index:1000; height:35px;"><div style="padding-top:5px;"><a href="JavaScript:PopIn_Include.CloseItem(' + i + ');"><img src="' + cia_base_url + 'images/lo_close_x.jpg" border="0" width="28" height="28"></a></div></div>';
	// PopIn_Include.AddToDefinition(i, {extra_html_after_iframe: html});
	
//	PopIn_Include.RenderItem(i, {write_now:true});
}

function WriteLOPlaceholder(i) {
	// close previous bodyHolder2 tag
	document.write('</div>');

	document.write('<div style="clear:both; width:480px; border:1px solid black; padding:10px; margin: 5px 0 10px 20px; background-color:#cfc">');
	document.write('<table border="0" cellspacing="0" cellpadding="0"><tr><td style="padding-right:10px; vertical-align:middle">');
	document.write('<a href="JavaScript:ShowLO(' + i + ');"><img src="' + cia_base_url + 'images/icon.jpg" width="36" height="36" border="0" align="absmiddle"></a>');
	document.write('</td><td style="padding-right:10px; vertical-align:middle">');
	document.write('<b>Concepts in Action:</b><br>' + loTitle[i]);
	document.write('</td><td style="vertical-align:middle">');
	document.write('<a href="JavaScript:ShowLO(' + i + ');"><img src="' + cia_base_url + 'images/' + loAbbrev[i] + '_icon.jpg" width="240" border="0"></a>');
	document.write('</td></tr></table></div>');
	
	// open next bodyHolder2 tag
	document.write('<div class="bodyHolder2">');
}

function WriteLOIcon(i) {
	document.write('<a href="JavaScript:ShowLO(' + i + ');"><img src="' + cia_base_url + 'images/icon.jpg" width="36" height="36" border="0" align="left" style="padding-right:5px"></a>');
}

function ShowLO(i) {
	PopIn_Include.RenderItem(i);	// RenderItem() won't rerender if it's already there
	PopIn_Include.ShowItem(i);
}

// now the popin-include script
var PopIn_Include = function() {
	// PRIVATE VARS AND FUNCTIONS
	var controls_height = 25;
	var default_width = 600;
	var default_height = 600;
	var default_top_margin = 10;		// popin offset from top of window
	
	var item_index = 0;
	var item_data = new Array();
	
	// note that cia_base_url is defined above
	var overlay_file_url = cia_base_url + 'images/overlay.png';
	
	function DefaultStringValue(arg, def) {
		if (arg == null) {
			return def;
		} else {
			return arg;
		}
	}
	
	function DefaultNumberValue(arg, def) {
		if (arg == null) {
			arg = def;
		} else {
			arg *= 1;
			if (isNaN(arg)) {
				arg = def;
			}
		}
		return arg;
	}

	function ScrollPosition() {
		// ff and safari seem to return different things, so return the biggest of the following two values
		var st1 = $("html,body").scrollTop() * 1;
		var st2 = $("body").scrollTop() * 1;
		if (st1 > st2) return st1;
		else return st2;
	}
	
	function ButtonHTML(title, js) {
		var html = "<input type='button' value='" + title + "'"
			+ " style='color:#fff; border-width:0px; background-color:#600; cursor:pointer; font-size:12px; font-weight:bold; font-family:Arial, Verdana, sans-serif;'"
			+ " onclick='" + js + "'"
			+ ">"
			;
		return html;
	}
	
	// PUBLIC VARS AND FUNCTIONS
	return {
	
	// Initialize an item -- anything that needs to be done before the user clicks it
	// required arguments: 
	//     url or page_id
	InitializeItem: function(args) {
		var index = args.index;
		if (index == null) {
			index = item_index;
			++item_index;
		}
		
		var a = item_data[index] = new Object();
		
		// transfer arguments
		for (var i in args) {
			a[i] = args[i];
		}

		// default values
		// type
		a.type = DefaultStringValue(a.type, "ARGA");	// other possible values are "image" and "quiz"
		
		// title
		a.title = DefaultStringValue(a.title, "");
		
		// width
		a.width = DefaultNumberValue(a.width, default_width);
		
		// height
		a.height = DefaultNumberValue(a.height, default_height);

		// top margin
		a.top_margin = DefaultNumberValue(a.top_margin, default_top_margin);
		
		// allow for page_id and send to special content manager if that
		if (a.page_id != null) {
			a.url = '/bfw/bfw_site_items_v3/bsi_content.asp?page_id=' + a.page_id;
			
			// prepend server_url if we got one
			if (a.server_url != null) {
				a.url = a.server_url + a.url;
			}
			
			// add a flag to indicate that this is coming from the popin window
			a.url += "&flags=from_popin";

		// if we didn't get a page_id, look for a url
		} else {
			a.url = DefaultStringValue(a.url, "http://www.google.com");
		}
		
		// return the index for this item
		return index;
	},
	
	// add arguments to an item's definition
	AddToDefinition: function(index, args) {
		var a = item_data[index];
		
		for (var i in args) {
			a[i] = args[i];
		}
	},	
	
	// Render the html for the item in the page
	RenderItem: function(index, args) {
		if (index == null) {
			alert("Error in RenderItem: index is null");
			return;
		}
		
		// make sure we have some kind of args object
		if (args == null) {
			args = new Object();
		}
		
		// get the specified item data
		var a = item_data[index]
		
		// If the item is already rendered, don't re-render -- unless forced to
		if (a.rendered == true && args.force_rerender != true) {
			alert('already rendered');
			return;
		}
		
		// build the html for the iframe and controls
		var html = "";
		
		html += ('<div id="popin_holder_' + index + '" style="position:absolute; z-index:5002; top:50px; display:none; width:' + (a.width) + 'px; height:' + (a.height + controls_height) + 'px;">');
		
		html += ('<div id="popin_controls_' + index + '" style="height:' + controls_height + 'px; width:' + (a.width) + 'px; background-color:#000; color:#fff">');
		html += ('<table border="0" cellspacing="0" cellpadding="0" height="100%"><tr><td style="width:90%; vertical-align:bottom; font-family:Verdana, sans-serif; font-size:14px; padding:0 10px 0 10px;"><b>' + a.title + '</b></td>');
		html += '<td style="padding-right:5px; vertical-align:middle">' + ButtonHTML("New Window", "PopIn_Include.NewWindow(" + index + ")", null, "secondary", true, "medium", "") + '</td>'
		
		// report button for activities
		if (a.type == "ARGA") {
			// this will be initially hidden; it can be shown later if this is an instructor
			html += '<td id="arga_popin_report_button_td_' + index + '" style="padding-right:5px; vertical-align:middle; display:none">' + ButtonHTML("Report", "PopIn_Include.ShowReport(" + index + ")", null, "secondary", true, "medium", "") + '</td>'
		}
		
		html += ('<td style="padding-right:5px; vertical-align:middle">' + ButtonHTML("Close", "PopIn_Include.CloseItem(" + index + ")", null, "secondary", true, "medium", "") + '</td>');
		html += ('</tr></table>');
		html += ('</div>');
		
		html += ('<div id="popin_holder_inner_' + index + '" style="position:relative; height:' + (a.height) + 'px; width:' + (a.width) + 'px">');

		// if the item has extra html for before the iframe, include it
		if (a.extra_html_before_iframe != null) {
			html += a.extra_html_after_iframe;
		}

		html += ('<iframe scrolling="no" frameborder="0" allowTransparency="true" style="background-color:transparent; height:' + (a.height) + 'px; width:' + (a.width) + 'px; border:0px; margin:0px; padding:0px;" src="' + a.url + '"></iframe>');
		
		// if the item has extra html for after the iframe, include it
		if (a.extra_html_after_iframe != null) {
			html += a.extra_html_after_iframe;
		}

		html += ('</div>');
		
		html += ('</div>');
		
		// if write_now:true is sent in, document.write the html
		if (args.write_now == true) {
			document.write(html);

		// otherwise insert the html at the end of body
		} else {
			$("body").append(html);
		}
		
		// note that the item has now been rendered
		a.rendered = true;
	},
	
	RemoveItem: function(id) {
		$("#popin_holder_" + id).remove();
		var a = item_data[id];
		a.rendered = false;
	},
	
	ShowItem: function(id) {
		var a = item_data[id];
		// show overlay if necessary
		if (!$("#popin_overlay").length) {
			var html = '<div id="popin_overlay" style="display:none; position:absolute; z-index:5000; top:-10px; left: 0px; width:100%; height:' + ($(document).height() + 100) + 'px; background-image: url(' + overlay_file_url + ');">&nbsp;</div>';
			$("body").prepend(html);
		}
				
		// make sure the item is centered and positioned off the top of the screen
		// and show it
		$("#popin_holder_" + id).css("left", Math.round(($(window).width() - a.width) / 2))
			.css("top", (ScrollPosition() + a.top_margin) + "px")
			.fadeIn(500)
		$("#popin_overlay").show();
	},
	
	ShowReportButton: function(id) {
		$('#arga_popin_report_button_td_' + id).show();
	},
	
	CloseItem: function(id) {
		var a = item_data[id];

		// hide the item and the overlay
		$("#popin_holder_" + id).fadeOut(500, function(){$("#popin_overlay").hide()});
		
		// If the item is supposed to be cleared out, do it
		// This seems to be necessary to deal with multiple items on a page in IE.
		if (a.remove_on_close != null && a.remove_on_close == true) {
			PopIn_Include.RemoveItem(id);
		}
	},
	
	NewWindow: function(id) {
		var a = item_data[id];
		
		if (a.type == "ARGA") {
			var msg = "Note: If you have started completing the activity here, your work may be lost if you open the activity in a new window.\n\nAre you sure you want to open the activity in a new window?";
			if (!confirm(msg)) {
				return;
			}
		}
		
		// If the item is specified by page_id, we want to open to
		// processPageRequest.asp in a new window
		var url;
		if (a.page_id != null) {
			url = '/processPageRequest.asp?page_id=' + a.page_id;
			
			// prepend server_url if we got one
			if (a.server_url != null) {
				url = a.server_url + url;
			}
		} else {
			url = a.url;
		}
		
		window.open(url, "arga_report", "width=900,height=600,menubar,resizeable,scrollbars", true);
		
		// close the item in the page, since it's now open in a new window
		this.CloseItem(id);
	},
	
	ShowReport: function(id) {
		var a = item_data[id];
		
		// construct the url for the item report
		var url;
		
		// we might need to do a different report for quizzes
		url = "/bfw/reports_g3/activity_report.asp?";
		if (a.page_id != null) {
			url += "page_id=" + a.page_id;
		}
		
		if (a.server_url != null) {
			url = a.server_url + url;
		}
		
		// pop the report up in a new window.
		window.open(url, "arga_report", "width=900,height=600,menubar,resizeable,scrollbars", true);
	}

		// Remember: no comma after last item
	};	// end return for public vars and functions
}();

