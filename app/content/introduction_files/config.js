/* **************************************************

This file holds any customized code -- mostly variables, but possibly
also functions -- for a particular instance of an ebook.  This file
should be loaded BEFORE any of the various APIs, which will use the
stuff here to customize things for the ebook.

Another file, "defaults.js", exists in the ebookAPIs directory.  defaults.js
declares the variables assigned here, and contains default values them.  
That way, if we later find need to change one of the APIs to
customize a new book, the API will still work with older ebooks, which will

************************************************** */

// Include a file for custom code for this book
document.write('<script language="JavaScript" src="' + urlStartBookID + 'config/bookconfig.js" type="text/javascript"></script>');

// where are these used?
bookTitle = "Psychology 10e";
bookEdition = "10";

// highlighting of current section in left TOC 
leftHighlightBgdColor = "#EC9444";

// Style settings for note divs
var notePadding = "10px";
var noteMarginBottom = "5px";
var noteBackgroundColor = "#a3bc04";

var goToPage = null; // this means we're using Go to Section functionality

var suppLinksRightMargin = "0";


chapterStartSectionOffset = 1;

defaultFontSize = "14px";
defaultFontFace = "Verdana";

// KC: though, there will be a glossary eventually
var noGlossary = 1;

// Note that the following (up to "BM_END") is written out by the production console
// so don't change it
var bm = new Array();
bm[20] = '<option value="20">Prologue: The Story of Psychology</option>';
bm[1] = '<option value="1">1. Thinking Critically With Psychological Science</option>';
bm[2] = '<option value="2">2. The Biology of Mind</option>';
bm[3] = '<option value="3">3. Consciousness and the Two-Track Mind</option>';
bm[4] = '<option value="4">4. Nature, Nurture, and Human Diversity</option>';
bm[5] = '<option value="5">5. Developing Through the Life Span</option>';
bm[6] = '<option value="6">6. Sensation and Perception</option>';
bm[7] = '<option value="7">7. Learning</option>';
bm[8] = '<option value="8">8. Memory</option>';
bm[9] = '<option value="9">9. Thinking and Language</option>';
bm[10] = '<option value="10">10. Intelligence</option>';
bm[11] = '<option value="11">11. Motivation and Work</option>';
bm[12] = '<option value="12">12. Emotions, Stress, and Health</option>';
bm[13] = '<option value="13">13. Personality</option>';
bm[14] = '<option value="14">14. Social Psychology</option>';
bm[15] = '<option value="15">15. Psychological Disorders</option>';
bm[16] = '<option value="16">16. Therapy</option>';
bm[17] = '<option value="17">Appendix A: Subfields of Psychology</option>';
bm[18] = '<option value="18">Appendix B: Complete Chapter Reviews</option>';
bm[19] = '<option value="19">References</option>';
// BM_END

// stuff for writing notebook

// they don't want this after all
// var dqpromptStart = "<b>Writing Notebook:</b> ";

function WriteDQLinks(win, n) {
	/*
	win.document.write('<div style="margin:2px 0 5px 0">'
		, '<a class="ba" href="Javascript:top.RegisterDQAnswer(', CurrentChapter(), ', \'', n, '\', document.getElementById(\'ta', n, '\'))"" title="Save This Entry"><img src="../pics/saveentry.gif" border=0></a> '
		, '<a class="ba" href="Javascript:top.printText(document.getElementById(\'ta', n, '\').value)" title="Print This Window"><img src="../pics/print.gif" border=0></a> '
		, '<a class="ba" href="Javascript:top.ShowDQPrintable()" title="Show your responses for this chapter\'s Writing Notebook in a printable window."><img src="../pics/view.gif" border=0></a>'
		, '</div>');
	*/
	
	win.document.write('<div style="margin:2px 0 5px 0">'
		, '<a class="ba" href="Javascript:top.RegisterDQAnswer(', CurrentChapter(), ', \'', n, '\', document.getElementById(\'ta', n, '\'))"" title="Save This Answer">[Save Answer]</a> '
		, '<a class="ba" href="Javascript:top.printText(document.getElementById(\'ta', n, '\').value)" title="Print This Answer">[Print Answer]</a> '
		, '<a class="ba" href="Javascript:top.ShowDQPrintable()" title="Show your responses for all this chapter\'s questions in a printable window.">[Show All Answers]</a>'
		, '</div>');
}

function ShowChapterNotebook() {
	// need to change rw6e to rules6e when putting this on ebooks server
	var win = window.open(top.urlStart + "rw6e/allanswers.php?chapter=" + top.CurrentChapter() + "&accountId=" + top.accountId, "NotebookAnswers", "top=10,left=10,width=650,height=600,menubar,resizable,scrollbars,status", true);
}

// WCM_END is for use by production console; don't remove it
function WriteChapterMenu() {

	// For guest chapter(s)
 	var gca = "2";
        if (username == "guest" || username == "Guest") {
		for (i = 0; i < gca.length; i++) {
			cgc = gca.substr(i, 1);
                	bannerrightF.document.write(bm[cgc]);
		}
                return;
        }
	// first write front matter, if there
	for (var c = 16 + 0 + 0 + 3 + 1; c <= 100; ++c) {
		bannerrightF.document.write(bm[c]);
	}
	for (var c = 1; c <= 16; ++c) { 		
		bannerrightF.document.write(bm[c]);
		
	} // close for-loop
	// write final part review, if there	// now write appendices
	for (var c = 16 + 0 + 1; c <= 16 + 0 + 3; ++c) {
		bannerrightF.document.write(bm[c]);
	}

} // close function
// WCM_END






function ShowSolution(n, d) {
	if (d == null) {
		d = main.document;
	}
	SetDisplay(d.getElementById('sl' + n), 'none');
	SetDisplay(d.getElementById('sa' + n), 'block');
}

function ToggleSolution(n, d) {
	if (d == null) {
		d = main.document;
	}
	var newD = SetDisplay(d.getElementById('sa' + n));
	
	var newsrc;
	if (newD == 'block') {
		newsrc = "hide_answer";
	} else {
		newsrc = "show_answer";
	}
	d.getElementById('solLinkImg' + n).src = "../pics/" + newsrc + ".gif";
}




// Write book-specific stuff for profs in the left-side TOC
function WriteBookSpecificLeftSideStuff() {
	return;

	chaptercontentsF.document.write('<div class="t1" style="margin-top:10px"><a class="tutorial" href="http://bcs.whfreeman.com/thelifewire/pages/bcs-main.asp?v=category&s=00520&n=99000&i=99520.01" target="_blank" style="font-weight:bold; color:#d4472a">» Online Quiz Gradebook</a></div>');
	
}


// For stats books
function ShowDataSets(title, id, url) {
   
    // add a '/' to end of url if needed
    if (url.charAt(url.length-1) != "/") {
        url = url + "/";
    }

    var file_name = id;
    var ti_calc_ext = "83m"; // default file extension for TI-Calc
    // if the id passed in has an extension, then we need to grab the file name and ext
    if (id.match(/(.*)\.(.*)/)) {
        file_name = RegExp.$1;
        ti_calc_ext = RegExp.$2;
    }

    var dsbody = '<div class="dataset"><table>'

        + '<tr><th><b>File Format</b></th></tr>'

        + '<td><a href="' + url + 'mac_text/' + file_name +'.txt" target="_blank">ASCII</a></td></tr>'

        + '<td><a href="' + url + 'Excel/' + file_name +'.xls" target="_blank">Excel</a></td></tr>'

        // The file capitalization is inconsistant for psls1e. This fix is only for the demo chapter
        + '<td><a href="' + url + 'Minitab/' + file_name + '.MTP" target="_blank">MiniTab</a></td></tr>'

        + '<td><a href="' + url + 'SPSS/' + file_name + '.por" target="_blank">SPSS</a></td></tr>'

        + '<td><a href="' + url + 'TI-Calc/' + file_name + '.' + ti_calc_ext + '" target="_blank">TI-83 matrix</a></td></tr>'
        + '<td><a href="' + url + 'SPLUS/' + file_name + '.sdd" target="_blank">SPLUS</a></td></tr>'

        + '<td class="last"><a href="' + url + 'JMP/' + file_name +'.JMP" target="_blank">JMP</a></td></tr>'
        + '</table>';

    ShowPopInWindow(title, dsbody, null, '210px');
}

