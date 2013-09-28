/*****************************************************

sellwood_px.js

version 1.2.2
14 May 2013
Pepper Williams (pepper.williams@macmillan.com)

This file includes a small proportion of the javascript code that controls the Sellwood e-book platform 
(both in the "standalone" Sellwood ebook and in the version of the ebook pages that runs in the Angel Portal)
, modified to function as part of the Launch Pad Portal.

One over-arching shift from standalone-sellwood/Angel to PX is that previously, all of this javascript code 
was loaded into the top frameset, then called from the ebook pages as "top.xxx". In Launch Pad, much of the
functionality that used to be handled by the sellwood code is handled by native PX code (which still lives
in the top frameset), but what remains here has to be handled by code in the ebook window itself.

Here are the functions that we handle here:

- Loading and displaying some "supplemental links" that are loaded via the "RegisterSuppLink" method
  (not all books use this, but some -- e.g. many stats books -- depend on it)

- Displaying glossary definitions

- Displaying footnotes

Note that some books have additional custom functionality that is handled in the book's config.js code.
For example, see:

http://ebooks.bfwpub.com/bps6e/config/config.js

where "ShowDataSets", a crucial piece of functionality for stats books, is defined.  (The links that call
ShowDataSets() will be inserted via DrawSuppLinks below; ShowDataSets itself is defined in config.js.)
Thus the config.js must also be included in the head element of the ebook page html, just below
this file (sellwood_px.js).  suppLinks.js (see e.g. http://ebooks.bfwpub.com/bps6e/config/suppLinks.js )
must also be included in the ebook page html (suppLinks.js won't be used in every book, but we need the file
to be included just in case it is used.)

Note that in the code below I've done only a minimum of "cleaning", so that, if necessary, it will hopefully be easier
to compare this code to the original Sellwood code in the future.

CHANGE LOG
1.1.1 2013-03-05 PW: fixed regexp that gets sectionFn; it wasn't working for chapters >= 10

*****************************************************/

// ===========================
// variables defined in index.php
var sessionId = 9396722; 
var bookId = ''; // set below
var bookVariant = ''; 
var logoutFileName = ""; 
var ra_userId = unescape('-1'); 
var chaptersInStandardVersion = 0; 
var co = new Array();
var usingRA = 0;
var lastTrueSectionIndex = 10000;

// Establish the bookId, BH bookId path,  and sectionFn for this section
// The url of the page should be something like this:
// http://origin.proxy.whfreeman.com/beta/secure/Highlight/ProxyPage?Url=http%3a%2f%2fwww.whfreeman.com%3a80%2fBrainHoney%2fResource%2f6710%2febooks.bfwpub.com%2fbps6e%2fsections%2f1_3.html&ExternalUrl=http%3a%2f%2febooks.bfwpub.com%2fbps6e%2fsections%2f1_3.html&ItemId=Copy__1__bps6e_1_3&HighlightDescription=Quantitative+variables%3a+histograms&AllowComments=True&e=1359582359&h=9e74c95405b639a1ccdbfc95a6e4062a&xdm_e=http%3A%2F%2Fwww.whfreeman.com&xdm_c=default9027&xdm_p=1
// (or, unescaped:)
//http://origin.proxy.whfreeman.com/beta/secure/Highlight/ProxyPage?Url=http://www.whfreeman.com:80/BrainHoney/Resource/6710/ebooks.bfwpub.com/bps6e/sections/1_3.html&ExternalUrl=http://ebooks.bfwpub.com/bps6e/sections/1_3.html&ItemId=Copy__1__bps6e_1_3&HighlightDescription=Quantitative+variables:+histograms&AllowComments=True&e=1359582359&h=9e74c95405b639a1ccdbfc95a6e4062a&xdm_e=http://www.whfreeman.com&xdm_c=default9027&xdm_p=1
var bookId_path = '';
var href = decodeURIComponent(document.location.href);
if (href.search(/Url=(.*?ebooks.bfwpub.com\/(.*?)\/)(sections|figures|exercises|examples|tables)/) >= 0) {
	bookId = RegExp.$2;
	// e.g. bps6e
	bookId_path = RegExp.$1;
	// e.g. http://www.whfreeman.com:80/BrainHoney/Resource/6710/ebooks.bfwpub.com/bps6e/
} else if (href.search(/(.*?ebooks.bfwpub.com\/(.*?)\/)(sections|figures|exercises|examples|tables)/) >= 0) {
	bookId = RegExp.$2;
	bookId_path = RegExp.$1;
}

// PW 5/13/2013: "www." at the start seems to give us problems???
bookId_path = bookId_path.replace(/\/\/www\./, "//");

// so we should be able to get the sectionFn with this regexp:
var sectionFn = null;
if (href.search(/(\d+_[\d_]+)\.htm/) >= 0) {
	sectionFn = RegExp.$1;
} else {
	try {
		console.log("RegisterSuppLink: couldn't identify sectionFn from url " + document.location.href);
	} catch(e) {}
}

// In Sellwood, all js code lives in "top."; here we are running in this window...
// So the migration script must change all references of "javascript:top\." to "javascript:"
// also define "main", which in Sellwood would be the frame where the ebook page appears, to window
var main = window;

// some files have links to "opener"; define that as window too
var opener = window;

// ===========================
// ebookGlobalsAPI.js
var urlStart = bookId_path.substr(0,bookId_path.indexOf(bookId));
var urlStartBookID = bookId_path;	// see above

var username = null;

function EncodeProblemCharacters(s) { console.log("sellwood_px: EncodeProblemCharacters called; this function is not defined in px."); }
function DecodeProblemCharacters(s) { console.log("sellwood_px: DecodeProblemCharacters called; this function is not defined in px."); }
var scQ = new Array();
var scRunning = false;
function Servercom(data) { console.log("sellwood_px: Servercom called; this function is not defined in px."); }
function ServercomLoad(data) { console.log("sellwood_px: ServercomLoad called; this function is not defined in px."); }
function ServercomDone() { console.log("sellwood_px: ServercomDone called; this function is not defined in px."); }
var altBookData = null;
var multiBookVars = new Array();
function StashBookVars(bookIdToStash) { console.log("sellwood_px: StashBookVars called; this function is not defined in px."); }
function ClearBookVars() { console.log("sellwood_px: ClearBookVars called; this function is not defined in px."); }
function RetrieveBookVars(bookIdToRetrieve) { console.log("sellwood_px: RetrieveBookVars called; this function is not defined in px."); }

function SetVisibility(l, v) {
	if (l != null) {
		if (v == null) {
			v = (l.style.visibility == "hidden") ? "visible" : "hidden";
		}
		l.style.visibility = v;
	}
	return v;
}

function SetDisplay(l, d) {
	if (l != null) {
		if (d == null) {
			d = (l.style.display == "block") ? "none" : "block";
		}
		l.style.display = d;
	}
	return d;
}

// Scroll to an element (adapted from http://www.quirksmode.org/js/findpos.html)
function ScrollToElement(win, obj, offset) {
	if (obj.offsetParent) {		// Should be true for any v5+ browser
		var top = 0;
		while (obj.offsetParent) {
			top += obj.offsetTop;
			obj = obj.offsetParent;
		}
		
		// And scroll to it
		win.scrollTo(0, top + offset);
	}
}

function StoreCookie(name, val) { console.log("sellwood_px: StoreCookie called; this function is not defined in px."); }
function GetCookieVal(name) { console.log("sellwood_px: GetCookieVal called; this function is not defined in px."); }
function ClearCookie(name) { console.log("sellwood_px: ClearCookie called; this function is not defined in px."); }
function GetFilename(fn) { console.log("sellwood_px: GetFilename called; this function is not defined in px."); }
function GetSearchString(win) { console.log("sellwood_px: GetSearchString called; this function is not defined in px."); }

// ===========================
// defaults.js

var bookTitle = "";
var edition = "";
var commentMode = "none";
var commentWindowWidth="";
var commentDFheight="";
var noteUploadSizeLimit = "50 MB (megabytes)";
var leftHighlightBgdColor = "#000000";
var leftHighlightPartBorderColorNormal = "#666666";
var leftHighlightPartBorderColorHighlighted = "#ffffff";
var defaultReturnToPageValue = 0;
var chapterStartSectionOffset = 1;
var defaultFontSize = "12px";
defaultFontFace = "Verdana";
var textFarRight = 535;
var fixedTextWidth = true;		// does the text have a fixed width?
var eBookToolsBgcolor = '#000000';
var chapterType = "Chapter";
var defaultPopInBgColor = "#dddddd";
var chapterContentsBlockType = "TR";
var dqpromptStart = "";
var definitionWidth = null;
var windowTop = null;
var windowLeft = null;
var dqlinks1 = null;
var dqlinks2 = null;
var addCommentRefs = null;
var hideCommentTOC = null;
function pa(p) { console.log("sellwood_px: pa called; this function is not defined in px."); }
function WriteChapterMenu() { console.log("sellwood_px: WriteChapterMenu called; this function is not defined in px."); }
function WriteBookSpecificLeftSideStuff() { console.log("sellwood_px: WriteBookSpecificLeftSideStuff called; this function is not defined in px."); }
var selfQuizStart = '<br><form style="margin:0px; padding:10px; background-color:#ffcc66">';
var WriteDQLinks = null;
var noGlossary = null;
var printOptionInEbookTools = null;
var commentStyle = null;
var startPage = null;
var initialAlert = null;
var suppLinksRightMargin = null;
var wikiUser = null;
var showSuppCategory = true;
var angelStyle = null;
var noHlTags = new Array();
var noHlClasses = new Array();
var useNewHighlighting = 0;
var xmlEditing = null;
var useBtTitle = false;
var useSectionAnchors = false;
var customHelp = false;

// ===========================
// ebookBookmarksAPI.js

var bookmarkWarningIssued = false;
function Bookmark() { console.log("sellwood_px: Bookmark called; this function is not defined in px."); }
function RegisterBookmark(s) { console.log("sellwood_px: RegisterBookmark called; this function is not defined in px."); }
function BookmarkMenuRef(where) { console.log("sellwood_px: BookmarkMenuRef called; this function is not defined in px."); }
var bookmarkMenuWritten = false;		// set to true in the bannerbookmarks frame when the menu is done writing
function UpdateBookmarkMenu() { console.log("sellwood_px: UpdateBookmarkMenu called; this function is not defined in px."); }
function SetBookmarkIcon() { console.log("sellwood_px: SetBookmarkIcon called; this function is not defined in px."); }
var bookmarktitle_wo_sectnum = false; //sm: global var set in WriteBookmarkMenu() used in BookmarkMenu()
function WriteBookmarkMenu() { console.log("sellwood_px: WriteBookmarkMenu called; this function is not defined in px."); }
function BookmarkMenu(where) {	 console.log("sellwood_px: BookmarkMenu called; this function is not defined in px."); }
function JumpToBookmark(where) { console.log("sellwood_px: JumpToBookmark called; this function is not defined in px."); }

// ===========================
// ebookHighlightingAPI.js

var hlChanged;
var hlColor = "#FFCC66";	// "#CCCCFF";		
var hlSpans = new Array();
var hlWarningIssued = false;
var startCode = "@".charCodeAt(0);
var hlCodeString, hlSection;
function InitializeHighlighting () { console.log("sellwood_px: InitializeHighlighting called; this function is not defined in px."); }
function hl(index) { console.log("sellwood_px: hl called; this function is not defined in px."); }
function IndexToHLCode(i) { console.log("sellwood_px: IndexToHLCode called; this function is not defined in px."); }
function HLCodeToIndex(code) { console.log("sellwood_px: HLCodeToIndex called; this function is not defined in px."); }
function RecordHighlighting() { console.log("sellwood_px: RecordHighlighting called; this function is not defined in px."); }
function ImportHighlighting(section, code) { console.log("sellwood_px: ImportHighlighting called; this function is not defined in px."); }
function ClearHighlighting() { console.log("sellwood_px: ClearHighlighting called; this function is not defined in px."); }

// ===========================
// ebookNavigation.js

function Load_Sellwood_sections(fn, arg1, arg2) {
	// define objects/arrays in case script doesn't load properly
	window.completedChapters = new Array();
	window.sections = new Array();
	window.pages = new Array();
	
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	// ie 7/8 event handler (not sure if it's needed for 8 or not)
	script.onreadystatechange= function () {
		if (this.readyState == 'complete') {
			window.lastTrueSectionIndex = sections.length;
			fn(arg1, arg2);
		}
	}
	// other browsers
	script.onload = function() {
		window.lastTrueSectionIndex = sections.length;
		fn(arg1, arg2);
	};
	
	var url = bookId_path + "sections.js";
	script.src = url;
	head.appendChild(script);
}

function LoadSection(newSection, hash) {
	// if we're not in the PX frame, don't allow this
	if (top.PxPage == null) {
		alert("Navigation to different sections of the e-book isn't supported when the section is opened in a separate window.");
		return;
	}
	
	if (newSection == "prev") {
		top.$(top.PxPage.switchboard).trigger("fneclickPreviousNodeTitle");
	} else if (newSection == "next") {
		top.$(top.PxPage.switchboard).trigger("fneclickNextNodeTitle");
	} else if (newSection == "reload") {
		location.reload();
	} else {
		// if we haven't loaded the sections array, do so now
		if (window.sections == null) {
			Load_Sellwood_sections(LoadSection, newSection, hash);
			return;
		}

		// construct url for the page and open it in a new window
		// e.g. http://www.whfreeman.com:80/BrainHoney/Resource/6710/ebooks.bfwpub.com/bps6e/
		var url = bookId_path + "sections/" + sections[newSection].fn + ".html";	// ?linksdisabled
		// var url = "http://qa.whfreeman.com/BrainHoney/Resource/6710/ebooks.bfwpub.com/bps6e/sections/bps6e_new_5_1.html?linksdisabled";
		window.open(url, "popup_section", "location=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=yes");
	}
}

function JumpToPageNumber(p, hash) {
	// if we haven't loaded the sections array, do so now
	if (window.sections == null) {
		Load_Sellwood_sections(JumpToPageNumber, p, hash);
		return;
	}
	
	// If p includes .'s or -'s or _'s, it's a section number, so...
	if (String(p).indexOf(".") != -1 || String(p).indexOf("-") != -1 || String(p).indexOf("_") != -1) {
		// Change .'s and -'s to _'s
		sec = p.replace(/[\.-]/g, "_");
		
		// Some books now (e.g. dtu8e) use "5_1_0" for 5.1; create an alt
		// to check for this.  Note this won't work with parts; but don't 
		// worry about that for now
		var sec_alt = sec + "_0";
		
		// Part 1's don't have the part numbers in the filenames, so take these out if necessary
		sec = sec.replace(/\/1/g, "");
		sec = sec.replace(/__1/g, "");
		
		// Change / or -- to -
		sec = sec.replace(/\//g, "-");
		sec = sec.replace(/__/g, "-");
		
		// Make sure the section exists
		var s;
		for (s = 0; s < lastTrueSectionIndex; ++s) {
			if (sections[s] != null && (sections[s].fn == sec || sections[s].fn == sec_alt)) {
				break;
			}
		}
		
		if (s != lastTrueSectionIndex) {
			LoadSection(s, hash);
		
		// The specified section isn't in the sections[] array, so...
		} else {
			alert("Section " + p + " does not exist.");
		}
		
	// Else it's a page number. Try to find the page directly in the pages array
	} else {
		// KC: Find last page number
		var lastPageNo = pages.length-1;

		// KC: e.g. "page 47" or "Page 47"
		if (isNaN(p)) {
			if ((p.substr(0,4) == "page" || p.substr(0,4) == "Page") && p.substr(5) * 1 > 0) {
				p = p.substr(5) * 1;
			}
		}
	
		if (pages[p] != null) {
			LoadSection(pages[p], hash);

		// If we can't, search backwards until we find one or reach 0
		} else {
			for (var i = p; i > 0; --i) {
				if (pages[i] != null) {
					break;
				}
			}
			if (i > 0) {
				if (p > lastPageNo) {
					alert("Outside page range. You will be sent to the last eBook page.");
				}
				LoadSection(pages[i], hash);
			} else {
				alert("Page " + p + " is not available.");
			}
		}
	}
}

// PW: TODO: implement JumpToChapter using PX functionality
function JumpToChapter(c,frame) {
	LoadSection(c * 100 + chapterStartSectionOffset);
	// PW: Note that chapterStartSectionOffset is defined above and may be overridden by config.js
}

// KC: function for jumping to glossary defs in historybooks
// PW: no harm in re-implementing this just in case it gets called
function JumpToTerm(sectionId, hash, searchTerms) {
	// KC: as of 7/8/2008, they just want to go to top of specified page
	LoadSection(sectionId);
}

// PW: PreInitializeSection just needs to write the prefs stylesheet
function PreInitializeSection(newBannerTitle, mainWin, thisPageBookId) {
	SetDefaultPrefs();
	WritePrefStyleSheet();
	document.write('<base href="' + bookId_path + 'sections/' + sectionFn + '.html" />');
	console.log('<base href="' + bookId_path + 'sections/' + sectionFn + '.html" />');
}

// PW: Redefine InitializeSection too
function InitializeSection() { 
	// only allow this window to be open when in the PX frameset or opened by PX???
	
	// if "linksdisabled" is in the URL string, disable all links
//	if (location.href.search(/linksdisabled/) > -1) {
		// ...
		
//	} else {
		InitializePopInWindow_ebook();
		DrawSuppLinks();
//	}
}


var ebooksBaseURL = "";
var TITLE_PAGE = 1;
var MAIN_TOC = 2;
var firstPageLoaded = false;
var curSection = null;

function LoadMainTextWindow() { console.log("sellwood_px: LoadMainTextWindow called; this function is not defined in px."); }
function UnloadMainTextWindow() { console.log("sellwood_px: UnloadMainTextWindow called; this function is not defined in px."); }
function GetChapterFromSID(n) { console.log("sellwood_px: GetChapterFromSID called; this function is not defined in px."); }
function SectionAvailable(sid) { console.log("sellwood_px: SectionAvailable called; this function is not defined in px."); }
function SectionNotAvailableAlert(id) { console.log("sellwood_px: SectionNotAvailableAlert called; this function is not defined in px."); }
function PrepareForNewSection(newSection) {	 console.log("sellwood_px: PrepareForNewSection called; this function is not defined in px."); }
function SectionFilename(s) { console.log("sellwood_px: SectionFilename called; this function is not defined in px."); }
function CurrentSectionFilename() { console.log("sellwood_px: CurrentSectionFilename called; this function is not defined in px."); }
function SectionNumberFromFilename(fn) { console.log("sellwood_px: SectionNumberFromFilename called; this function is not defined in px."); }
function SectionURL(s, hash) { console.log("sellwood_px: SectionURL called; this function is not defined in px."); }
function GetPreviousSection() { console.log("sellwood_px: GetPreviousSection called; this function is not defined in px."); }
function GetNextSection() { console.log("sellwood_px: GetNextSection called; this function is not defined in px."); }
function ReturnToLastVisited() { console.log("sellwood_px: ReturnToLastVisited called; this function is not defined in px."); }
function ParseGet(win) { console.log("sellwood_px: ParseGet called; this function is not defined in px."); }
var wlbTries = 0;
function WriteLeftBanner() { console.log("sellwood_px: WriteLeftBanner called; this function is not defined in px."); }
function CurrentSectionNumber() { console.log("sellwood_px: CurrentSectionNumber called; this function is not defined in px."); }
function SectionNumber(s) { console.log("sellwood_px: SectionNumber called; this function is not defined in px."); }
function CurrentChapter() { console.log("sellwood_px: CurrentChapter called; this function is not defined in px."); }
function NumberOfSectionsAvailable() { console.log("sellwood_px: NumberOfSectionsAvailable called; this function is not defined in px."); }
function Logout() { console.log("sellwood_px: Logout called; this function is not defined in px."); }
function EasterEgg() { console.log("sellwood_px: EasterEgg called; this function is not defined in px."); }
function BrowserDetect() { console.log("sellwood_px: BrowserDetect called; this function is not defined in px."); }
var expAlrtCookieName = bookId + '-' + username + '-expalrt';
function Check_Expiration() { console.log("sellwood_px: Check_Expiration called; this function is not defined in px."); }
function Show_Expiration_Alert() { console.log("sellwood_px: Show_Expiration_Alert called; this function is not defined in px."); }
function OpenGradebook() { console.log("sellwood_px: OpenGradebook called; this function is not defined in px."); }
var curDroppedChapter = -1;
function DropDownLeftChapter() { console.log("sellwood_px: DropDownLeftChapter called; this function is not defined in px."); }
var curLeftHighlightedDiv = null;
var curLeftHighlightedPart = null;
function LeftHighlight(div) { console.log("sellwood_px: LeftHighlight called; this function is not defined in px."); }
function ClearLeftHighlight() { console.log("sellwood_px: ClearLeftHighlight called; this function is not defined in px."); }
var leftDropped = new Object();
var bulrt = new Image(); bulrt.src = urlStartBookID + "pics/dropSmallRight.gif";
var buldn = new Image(); buldn.src = urlStartBookID + "pics/dropSmallDown.gif";
function DropDownLeftSections(div, newState) { console.log("sellwood_px: DropDownLeftSections called; this function is not defined in px."); }
function CollapseAllSections() { console.log("sellwood_px: CollapseAllSections called; this function is not defined in px."); }
function WriteSpecialTOCLinks() { console.log("sellwood_px: WriteSpecialTOCLinks called; this function is not defined in px."); }
function DismissInitialAlert() { console.log("sellwood_px: DismissInitialAlert called; this function is not defined in px."); }
function doHighlight(bodyText, searchTerm, highlightStartTag, highlightEndTag) { console.log("sellwood_px: doHighlight called; this function is not defined in px."); }
function highlightSearchTerms(searchText, treatAsPhrase, warnOnFailure, highlightStartTag, highlightEndTag) { console.log("sellwood_px: highlightSearchTerms called; this function is not defined in px."); }
var loadedFromSearch = null;
function ParseSearchString(terms) { console.log("sellwood_px: ParseSearchString called; this function is not defined in px."); }
function DropDownChapter(chapter) { console.log("sellwood_px: DropDownChapter called; this function is not defined in px."); }
open_ebook_in_new_window = function(win, page_id) { console.log("sellwood_px: open_ebook_in_new_window called; this function is not defined in px."); }

// ===========================
// ebookNotesAPI.js

var correctionStatus = null;
var firstStatus = null;
var secondStatus = null;
var firstStatusTypes = new Array ("Correction/bug Category","eBook text does not match printed text, but should: typo/missing content","eBook text needs to vary from printed text, but doesn't: needs editorial input","Misplaced figure, box, or margintext","Style/design issue","TOC issue","Broken link to supplemental activity","Broken internal link (e.g. to section or chapter)","Page number link goes to wrong content","Missing link");
var secondStatusTypes = new Array ("Correction/bug Severity","Major error/bug -- must be fixed","Minor error/bug -- should be fixed","Suggestion/Question");
var PUBLIC_NOTE = 0;
var PRIVATE_NOTE = 1;
var WIKI_NOTE = 2;
var USER_OWNED = 1;
var SUBSCRIBED_TO = -1;
var INSTRUCTOR_SET = -2;
var GHOST_SET = -9;
var CORRECTIONS_SET = 9;
var noteSets = new Array();
var noteStyle = "padding:10px; margin-bottom:5px";
var listen6e_chapname = new Array ("Unit I","Unit II","Unit III","Unit IV","Unit V","Prelude","Interlude A","Interlude B");   			  
var elrod2_chapname = new Array ("","Chapter 1","Chapter 2.1","Chapter 2.2","Chapter 2.3");
var modifiableSets = 0;
var firstModifiable = -1;
var noteWarningIssued = false;
var noteEditorTA;
var noteIndexBeingEdited;
var noteBeingEdited = null;
var notePrefix;
var submitterName;
var addedPrefix = false;
var editorTextToBeLoaded = null;
var lastNoteSetUsed = 0;
var lastNoteTypeUsed = 0;
var noteColorNames = new Array("blue", "green", "yellow", "orange", "pink", "purple", "gray", "white");
var noteColorVals = {blue:"ccccff", green:"b2ffa1", yellow:"fef49c", orange:"FFCC66", pink:"ffc7c7", purple:"cc66ff", gray:"dddddd", white:"ffffff"};
var noteTitleVals = {blue:"666699", green:"529941", yellow:"ffcc00", orange:"ff6600", pink:"cc3300", purple:"663366", gray:"777777", white:"000000"};
var btnHeight = 27;		// 25 + 2 margin
var btnExtraMargin = 5;
var btnWidth = 82;	// 80 + 2 margin
var textAreaToEdit = null;
var customSectionOffset = 100000;	// Should allow for 1000 chapters
var newCS;
var registeredCustomSections = new Array();
var stickyNoteBeingEstablished = false;
var defaultStickyNoteWidth = 280;
var defaultStickyNoteHeight = 160;
var stickyNoteCollapsedWidth = 150;
var stickyNoteResizerSize = 15;
var stickyNoteRightPadding = 5;
var stickyNoteHash = new Object();
var stickyNoteIndex, stickyNotesForPage, currentlyFocusedStickyNote, stickyNoteZIndex;
var stickyNoteBaseHTML = "";
function AddNoteSet(setId, setNumber, setName, type) { console.log("sellwood_px: AddNoteSet called; this function is not defined in px."); }
function RemoveNoteSet(setId) { console.log("sellwood_px: RemoveNoteSet called; this function is not defined in px."); }
function ChangeNoteSetName(setId, newName) { console.log("sellwood_px: ChangeNoteSetName called; this function is not defined in px."); }
function NoteSetServerError(err) { console.log("sellwood_px: NoteSetServerError called; this function is not defined in px."); }
function GetNoteSetInfo() { console.log("sellwood_px: GetNoteSetInfo called; this function is not defined in px."); }
function GetNoteSetSelect(selected) { console.log("sellwood_px: GetNoteSetSelect called; this function is not defined in px."); }
function IsCorrectionsNote(note) { console.log("sellwood_px: IsCorrectionsNote called; this function is not defined in px."); }
function CreateNote(stuckTo, sposx, sposy) { console.log("sellwood_px: CreateNote called; this function is not defined in px."); }
function EditNoteClear() { console.log("sellwood_px: EditNoteClear called; this function is not defined in px."); }
function EditNoteDelete() { console.log("sellwood_px: EditNoteDelete called; this function is not defined in px."); }
function ShowNoteEditor(editor) { console.log("sellwood_px: ShowNoteEditor called; this function is not defined in px."); }
function SetNoteEditorText(text) { console.log("sellwood_px: SetNoteEditorText called; this function is not defined in px."); }
function EditNoteStop(ok, correctionStatus, firstStatus, secondStatus) { console.log("sellwood_px: EditNoteStop called; this function is not defined in px."); }
function SaveCorrectionsNote(noteIndex, correctionStatus, firstStatus, secondStatus) { console.log("sellwood_px: SaveCorrectionsNote called; this function is not defined in px."); }
function SaveNote() { console.log("sellwood_px: SaveNote called; this function is not defined in px."); }
function SetNoteId(noteId) { console.log("sellwood_px: SetNoteId called; this function is not defined in px."); }
function NoteSubmitDone() { console.log("sellwood_px: NoteSubmitDone called; this function is not defined in px."); }
function ModifyNote(noteIndex) { console.log("sellwood_px: ModifyNote called; this function is not defined in px."); }
function ShiftPrintableAnswersDiv() { console.log("sellwood_px: ShiftPrintableAnswersDiv called; this function is not defined in px."); }
function GetNote(i, s) { console.log("sellwood_px: GetNote called; this function is not defined in px."); }
function GetNoteIndex(s, noteId) { console.log("sellwood_px: GetNoteIndex called; this function is not defined in px."); }
function NoteHeader(noteIndex, note, format) { console.log("sellwood_px: NoteHeader called; this function is not defined in px."); }
function NoteTypeMenuChanged(menu) { console.log("sellwood_px: NoteTypeMenuChanged called; this function is not defined in px."); }
function NoteColorMenuChanged(menu) { console.log("sellwood_px: NoteColorMenuChanged called; this function is not defined in px."); }
function FormatNote(text) { console.log("sellwood_px: FormatNote called; this function is not defined in px."); }
function RegisterNote(noteId, setIndex, section, noteText, noteType, stuckTo, colorName) { console.log("sellwood_px: RegisterNote called; this function is not defined in px."); }
function WriteRadioButtonCode (noteIndex, correctionStatus, firstStatus, secondStatus) { console.log("sellwood_px: WriteRadioButtonCode called; this function is not defined in px."); }
function WriteCorrexDropDowns(noteIndex, firstStatus, secondStatus) { console.log("sellwood_px: WriteCorrexDropDowns called; this function is not defined in px."); }
function noteorder(a,b) {  console.log("sellwood_px: noteorder called; this function is not defined in px."); }

function WriteNotes() { 
	// Start the bodyholder div for the notes and the rest of the page
	main.document.write('<div class="bodyHolder2">');
	// In PX, this is *all* we need it to do
}

function NoteHTML(s, j) { console.log("sellwood_px: NoteHTML called; this function is not defined in px."); }
function WriteAllNotes(c, newWindow) { console.log("sellwood_px: WriteAllNotes called; this function is not defined in px."); }
function NoteColor(n) { console.log("sellwood_px: NoteColor called; this function is not defined in px."); }
function NoteTitleColor(n) { console.log("sellwood_px: NoteTitleColor called; this function is not defined in px."); }
function GetFCKEditor() { console.log("sellwood_px: GetFCKEditor called; this function is not defined in px."); }
function ShowPageOptions() { console.log("sellwood_px: ShowPageOptions called; this function is not defined in px."); }
function ModifyNoteStart() { console.log("sellwood_px: ModifyNoteStart called; this function is not defined in px."); }
function AddNoteStart() { console.log("sellwood_px: AddNoteStart called; this function is not defined in px."); }
function ShowHighlightingInstructions() { console.log("sellwood_px: ShowHighlightingInstructions called; this function is not defined in px."); }
function GetCustomSectionOptions() { console.log("sellwood_px: GetCustomSectionOptions called; this function is not defined in px."); }
function WriteBtn(type, text, fn, left, top, jsFrame, width) { console.log("sellwood_px: WriteBtn called; this function is not defined in px."); }
function WriteRightEditorBtns(fnPrefix) { console.log("sellwood_px: WriteRightEditorBtns called; this function is not defined in px."); }
function ChangeNoteEditorRevertButton(val) { console.log("sellwood_px: ChangeNoteEditorRevertButton called; this function is not defined in px."); }
function ChangeNoteEditorDeleteButton(val) { console.log("sellwood_px: ChangeNoteEditorDeleteButton called; this function is not defined in px."); }
function AddBold() { console.log("sellwood_px: AddBold called; this function is not defined in px."); }
function AddItalic() { console.log("sellwood_px: AddItalic called; this function is not defined in px."); }
function AddLink() { console.log("sellwood_px: AddLink called; this function is not defined in px."); }
function AddImage() { console.log("sellwood_px: AddImage called; this function is not defined in px."); }
function AddPhoto() { console.log("sellwood_px: AddPhoto called; this function is not defined in px."); }
function AddVideo() { console.log("sellwood_px: AddVideo called; this function is not defined in px."); }
function Upload(type) { console.log("sellwood_px: Upload called; this function is not defined in px."); }
function WriteUploadFormStuff() { console.log("sellwood_px: WriteUploadFormStuff called; this function is not defined in px."); }
function ContinueUpload() { console.log("sellwood_px: ContinueUpload called; this function is not defined in px."); }
function CancelUpload(type) { console.log("sellwood_px: CancelUpload called; this function is not defined in px."); }
function InsertText(text) { console.log("sellwood_px: InsertText called; this function is not defined in px."); }
function CreateCustomSection() { console.log("sellwood_px: CreateCustomSection called; this function is not defined in px."); }
function RegisterCustomSection(addToCCNow, csId, setId, attacheeSection, relativeLocation, csType, csTitle) { console.log("sellwood_px: RegisterCustomSection called; this function is not defined in px."); }
function CreateCustomSectionReturn(csId, justCreated) { console.log("sellwood_px: CreateCustomSectionReturn called; this function is not defined in px."); }
function AddRegisteredCSsToTOC(frame) { console.log("sellwood_px: AddRegisteredCSsToTOC called; this function is not defined in px."); }
function AddCustomSectionToTOC(frame, theCS) { console.log("sellwood_px: AddCustomSectionToTOC called; this function is not defined in px."); }
function AddToTOC(tocEntry, frame, itemFn, attacheeSection, relativeLocation, tdClass) { console.log("sellwood_px: AddToTOC called; this function is not defined in px."); }
function UpdateCustomSectionCCTitle(csId, csTitle) { console.log("sellwood_px: UpdateCustomSectionCCTitle called; this function is not defined in px."); }
function RemoveCustomSection(csId, jumpToAttachee) { console.log("sellwood_px: RemoveCustomSection called; this function is not defined in px."); }
function CSSectionsIndex(csId) { console.log("sellwood_px: CSSectionsIndex called; this function is not defined in px."); }
function IsCustomSection(s) { console.log("sellwood_px: IsCustomSection called; this function is not defined in px."); }
function CustomSectionTitle(s) { console.log("sellwood_px: CustomSectionTitle called; this function is not defined in px."); }
function CustomSectionAttachee(s) { console.log("sellwood_px: CustomSectionAttachee called; this function is not defined in px."); }
function RemoveFromArray(a, val) { console.log("sellwood_px: RemoveFromArray called; this function is not defined in px."); }
function IsStickyNote(n) { console.log("sellwood_px: IsStickyNote called; this function is not defined in px."); }
function InitializeStickyNoteSettings(n) { console.log("sellwood_px: InitializeStickyNoteSettings called; this function is not defined in px."); }
function SetStickyNoteCoordinates(noteId, closed, width, height, dright, dtop) { console.log("sellwood_px: SetStickyNoteCoordinates called; this function is not defined in px."); }
function InitiateStickyNote() { console.log("sellwood_px: InitiateStickyNote called; this function is not defined in px."); }
function CancelStickyNoteEventHandler() { console.log("sellwood_px: CancelStickyNoteEventHandler called; this function is not defined in px."); }
function StickyNoteModifyStuff() { console.log("sellwood_px: StickyNoteModifyStuff called; this function is not defined in px."); }
function StickyNoteEditStopStuff() { console.log("sellwood_px: StickyNoteEditStopStuff called; this function is not defined in px."); }
function PlaceStickyNote(e) { console.log("sellwood_px: PlaceStickyNote called; this function is not defined in px."); }
function GetStickyNoteAnchor(sanchor) { console.log("sellwood_px: GetStickyNoteAnchor called; this function is not defined in px."); }
function EngageStickyNotePopInWindow(e) { console.log("sellwood_px: EngageStickyNotePopInWindow called; this function is not defined in px."); }
function EngageStickyNoteResize(e) { console.log("sellwood_px: EngageStickyNoteResize called; this function is not defined in px."); }
function GetEventTargetId(e) { console.log("sellwood_px: GetEventTargetId called; this function is not defined in px."); }
function WriteStickyNotes() { console.log("sellwood_px: WriteStickyNotes called; this function is not defined in px."); }
function WriteStickyNote(noteIndex, thisStickyNoteIndex) { console.log("sellwood_px: WriteStickyNote called; this function is not defined in px."); }
function JumpToStickyNote(i, index) { console.log("sellwood_px: JumpToStickyNote called; this function is not defined in px."); }
function WriteStickyNoteLinks() { console.log("sellwood_px: WriteStickyNoteLinks called; this function is not defined in px."); }
function RemoveStickyNoteLink(noteIndex) { console.log("sellwood_px: RemoveStickyNoteLink called; this function is not defined in px."); }
function SetStickyNoteSize(noteIndex, newWidth, newHeight) { console.log("sellwood_px: SetStickyNoteSize called; this function is not defined in px."); }
function PositionStickyNote(noteIndex, dright, dtop) { console.log("sellwood_px: PositionStickyNote called; this function is not defined in px."); }
function RepositionStickyNotes() { console.log("sellwood_px: RepositionStickyNotes called; this function is not defined in px."); }
function ToggleStickyNote(noteIndex, toggleTo) { console.log("sellwood_px: ToggleStickyNote called; this function is not defined in px."); }
function StickyNoteTitleBarHeight(noteIndex) { console.log("sellwood_px: StickyNoteTitleBarHeight called; this function is not defined in px."); }
function SaveStickyNoteCoordinates(inner) { console.log("sellwood_px: SaveStickyNoteCoordinates called; this function is not defined in px."); }
function SubmitNoteCoordinates(n) {	 console.log("sellwood_px: SubmitNoteCoordinates called; this function is not defined in px."); }
function FocusStickyNote(noteIndex) { console.log("sellwood_px: FocusStickyNote called; this function is not defined in px."); }
function SwapInnerHTML(oldChild, innerHTML) { console.log("sellwood_px: SwapInnerHTML called; this function is not defined in px."); }
function StickyNoteBetaMessage() { console.log("sellwood_px: StickyNoteBetaMessage called; this function is not defined in px."); }

// ========================
// ebookSupplementalLinksAPI.js

// XXX changed top.OpenSupp to top.PxPage.openContent

// Array to hold all suppLinks in the book
// we make one attribute per page that has links...
var suppLinks = new Object();

function SuppLinkObjectIndex(fn) {
	// replace "-" with "dd", to make it a valid object 
	if (fn != null) {
		return "sl_" + fn.replace(/-/g, "dd");
	}
}

// Keep track of total number of supp links added as the ebook is loading
var numSuppLinks = 0;
function RegisterSuppLink(atts, suppLinkId) {
	// if the supplink doesn't go with this section, return
	if (atts.sectionFn != sectionFn) {
		return;
	}

	// If we didn't get a suppLinkId, we're adding as the ebook is loading, so count up
	if (suppLinkId == null) {
		suppLinkId = numSuppLinks;
		++numSuppLinks;
	}
	
	// Get index value from sectionFn
	var index = SuppLinkObjectIndex(sectionFn);
	
	// Create an array for this section if necessary
	var slarr;
	if (suppLinks[index] != null) {
		slarr = suppLinks[index];
	} else {
		slarr = suppLinks[index] = new Array();
	}
	
	// If the link already existed, replace it
	for (var i = 0; i < slarr.length; ++i) {
		if (slarr[i].suppLinkId == suppLinkId) {
			break;
		}
	}
	
	// If we made it all the way through the above loop, i = slarr.length, and this is a new sl
	// otherwise we want to replace slarr[i]
	var sl = slarr[i] = new Object();
	
	// And copy in the attributes
	for (var i in atts) {
		// except the "targ" attribute
		if (i != 'targ') {
			sl[i] = atts[i];
		}
	}
	
	// Add the suppLinkId (have to do this after the fact because -1 might be in atts)
	sl.suppLinkId = suppLinkId;
	
	// Change in toc if necessary?
	//AddSuppToTOC(sl, chaptercontentsF);
}

// XXX removed all code

// Note: this should be added like this: 
// "<a href=\"" + SuppLinkURL(sl) + "\"'>"
function SuppLinkURL(sl) {
	// KC: 3 cases
	// 1. portal pageId supplied for DCTM resource
	// 2. no portal pageId supplied, no quiz session ID supplied: 'bcs'-type link
	// 3. quiz (session ID supplied) 
	// MZ 01172012: 4. type=crunchit&bid=$BOOKID&dataset=$DATASET --> OpenSupp('crunchit','bookid','dataset')
	
	// only dealing in PX (for now) with things that have urls
	// unfortunately, pageids are currently useless in PX.
	if (sl.url != null && sl.url != '') {
		// crunchit
		if (sl.url.search(/type=crunchit&bid=(\w+)&dataset=([^&]*)/) > -1) {
			// only return a crunchit link if we have access to top.PxPage
			if (top.PxPage == null) {
				return null;
			} else {
				return "javascript:px_crunchitlink('crunchit','" + RegExp.$1 + "','" + RegExp.$2 + "')";
			}
		
		// else call px_opensupp, defined below, which will just open the url
		} else {
			return "javascript:px_opensupp('" + sl.url + "')";
			// Note: this doesn't seem to work
			// return "JavaScript:top.PxPage.openContent({xUrl:'" + sl.url + "'})";
		}
	}
}

function DrawSuppLinks() {
	var index = SuppLinkObjectIndex(sectionFn);
	
	var slarr = suppLinks[index];
	if (slarr != null) {
		// First find the places ...
		for (var i = 0; i < slarr.length; ++i) {
			var sl = slarr[i];
			
			// Get all els of the target type
			var els;
			if (sl.containerType == "P") {
				els = main.document.getElementsByTagName("P");
			} else {
				els = main.document.getElementsByTagName("DIV");
			}
			
			// Then go through each of these els
			for (var j = 0; j < els.length; ++j) {
				var el = els[j];
				if (sl.containerType == "P" || (sl.containerType == "caption" && el.className.indexOf("caption") > -1)) {
					// get transformed innerhtml of the div
					var ih = ContainerLocatorTransform(el.innerHTML);
					
					// if it starts with the containerLocator text, we've found the target
					if (ih.indexOf(sl.containerLocator) == 0) {
						sl.targ = el;
						break;
					}
				}
			}
			
			if (j == els.length) {
				//alert('couldn\'t find supplemental link: ' + sl.containerLocator);
			}
		}
		
		// Then insert the innerHTML (we can't do this in one step, because of the possibility of having
		// multiple supplementals attached to the same paragraph
		var cl_array = new Object;
    		var suppLinkNum;
		for (var i = 0; i < slarr.length; ++i) {
			var sl = slarr[i];


			// calculate suppLinkId
        		if (cl_array[sl.containerLocator] == undefined) {
            			cl_array[sl.containerLocator] = 1;
        		} else {
            			cl_array[sl.containerLocator]++;
        		}
        		suppLinkNum = cl_array[sl.containerLocator];

			// KC: we want to be able to support multiple icon types; we can change the filenames
			// based on the link category
			var iconClass = sl.category;
			iconClass = iconClass.replace(/ /ig, "");

			// construct innerHTML for item
			// This is the div we want to insert into the page
			var new_el = main.document.createElement('div');

			// We've introduced a suppLinksRightMargin variable to config.js, to account for (mostly stats') use of 
			// supp links in right margin, as opposed to float left
			if (suppLinksRightMargin == "1") {
				new_el.setAttribute('class',"modMarker suppLink" + suppLinkNum);
        			new_el.setAttribute('className', "modMarker suppLink" + suppLinkNum);
			} else {
				new_el.setAttribute('class','modMarker');
				new_el.setAttribute('className','modMarker');
			}
			
			// MZ: We want to name links, say, Activty 2.3 or Tutorial 1.8 but 
			// don't want to have an icon image for every differently numbered icon.
			var iconClassImg = iconClass;
			iconClassImg = iconClassImg.replace( /(\d+\.)?\d+$/ig, "" );
			
			var newInner;
/*
			newInner = "<a id='suppLink_" + sl.suppLinkId + "' class='modLink' href=\"" + SuppLinkURL(sl) + "\" title='" + sl.title.replace(/'/g, "\\'") + "'><img src='../pics/modicon" + iconClassImg + ".gif' border='0'>";
			if (window.showSuppCategory == null || window.showSuppCategory == false) {
                                newInner += "</a>";
                        } else {
                                newInner += "<br>" + sl.category + "</a>";
                        }
		
			//alert(newInner);

			new_el.innerHTML = newInner;
*/

			// DataSets will have a different url than the rest of the resources.
        		// DataSets call ShowDataSets(), defined in config.js.  All other resources can use
        		// SuppLinkURL() to get their url.
			var link_url = SuppLinkURL(sl);
			if (sl.category.match(/DataSet/i)) {
				link_url = "JavaScript:ShowDataSets('" + sl.title + "','" + sl.pageId + "','" + sl.url + "')";
			}
			
			// if we don't have a link_url, continue
			if (link_url == null) {
				continue;
			}
      
			newInner = "";
			if (link_url != "") {	
				newInner = "<a class='modLink' href=\"" + link_url + "\" title='" + sl.title.replace(/'/g, "\\'") + "'><img class='modImg' src='../pics/modicon" + iconClassImg + ".gif'>";
				if (window.showSuppCategory == null || window.showSuppCategory == false) {
					newInner += "</a>";
				} else {
					newInner += "<br>" + sl.category + "</a>";
				}		
			}

			new_el.innerHTML = newInner;
			// If we couldn't find a place for it above...
			if (sl.targ == null) {

			} else {
			    // we want to add it directly in front of the target element
			    // unless "link" attribute is "leftonly" (default is "normal")
				if (sl.link == 'leftonly') {

				} else {
                	
                	var parent_node = sl.targ.parentNode;
  					parent_node.insertBefore(new_el, sl.targ);
  					
  				}
			}
			
			sl.targ = null;
		}

	}
}

function ContainerLocatorTransform(s) {
	// take out other supp marker tags
	s = s.replace(/<div class=.modMarker.>.*?<\/div>/ig, "");
	s = s.replace(/<[\s\S]*?>/g, "");
	s = s.replace(/\W/g, "");
	s = s.toLowerCase();
	
	return s;
}

var suppLinkBeingPlaced = null;
function crunchItOpenSupp (sl_url) { console.log("sellwood_px: crunchItOpenSupp called; this function is not defined in px."); }
function SupplementLinkOptionText() { console.log("sellwood_px: SupplementLinkOptionText called; this function is not defined in px."); }
function AddSupplementalLinkStart() { console.log("sellwood_px: AddSupplementalLinkStart called; this function is not defined in px."); }
function CancelSuppLinkEventHandler() { console.log("sellwood_px: CancelSuppLinkEventHandler called; this function is not defined in px."); }
function PlaceSuppLink(e) { console.log("sellwood_px: PlaceSuppLink called; this function is not defined in px."); }
function CancelSuppLink() { console.log("sellwood_px: CancelSuppLink called; this function is not defined in px."); }
function DeleteSuppLink() { console.log("sellwood_px: DeleteSuppLink called; this function is not defined in px."); }
function SubmitSuppLink() { console.log("sellwood_px: SubmitSuppLink called; this function is not defined in px."); }
function SubmitSuppLinkCallback(suppLinkId) { console.log("sellwood_px: SubmitSuppLinkCallback called; this function is not defined in px."); }
function RemoveSupplementalLinkStart() { console.log("sellwood_px: RemoveSupplementalLinkStart called; this function is not defined in px."); }
function SwapInnerHTMLForSupp(oldChild, InnerHTML) {         console.log("sellwood_px: SwapInnerHTMLForSupp called; this function is not defined in px."); }

// ===========================
// from ebookPopInAPI.js
// needed for dataset links in stats titles

// *************************************************************
// Functions for "pop-in" windows (DHTML simulations of pop-up windows)
// *************************************************************


// *************************************************************
// The functions below implement a simulated "pop-in" window 
// for glossary definitions, web links, etc.

// Convenience variables to keep track of the DOM elements we need to manipulate

// This will get set to the popInWindow we're currently moving when EngagePopInWindow_ebook is called
// It has to be set to something so that ShiftPopInWindow works
var popInWindow_ebook;

// Convenience variables for structures in the "main" pop-in window
var popInContent_ebook;
var popInTitle_ebook;
var popInLinkHolder_ebook;
var popInLink_ebook;

// function can be called when Disengage_ebook() is called
var disengageFunction_ebook;

// Global variables for moving the window around
var startX_ebook, startY_ebook;		// position of mouse the last time we executed MovePopInWindow_ebook
var mouseX_ebook, mouseY_ebook;		// current position of mouse
var lastScrollY_ebook = 0;	// scroll position the last time we moved
var popInWindowX_ebook, popInWindowY_ebook;	// current position of the popInWindow div

// Default width for pop-in window, and default background color
var defaultWidth_ebook = 325;

// Add the following constant to the width value sent in to ShowPopInWindow_ebook
// for an image
popinMarginOffset_ebook = 10;

// Hold a function to run when the pop-in window is closed
var cleanUpFunction_ebook = null;

// Return a handle to the "main" popin window (as opposed to sticky notes and potentially
// other future pop-ins)
function MainPopInWindow() {
	return main.document.getElementById("popInWindow_n");
}

function SuppPopInWindow() { console.log("sellwood_px: SuppPopInWindow called; this function is not defined in px."); }

// Initialize the def window.  This has to be done every time we load a new section
function InitializePopInWindow_ebook(inSuppWindow) {
	// XXX Have to get the popInHTML_ebook in place (it's done via document.write in sellwood/angel)
	var elem = document.createElement("div");
	elem.innerHTML = popInHTML_ebook;
	document.body.insertBefore(elem, document.body.childNodes[0]);
	
	// We're now writing the PopIn window dynamically
	// But we can't be sure yet that old sections files with the pop-in window
	// hard-coded don't exist.  So for now all the id's have _n pasted onto the end.
 	if (inSuppWindow == true) {
		popInContent_ebook = document.getElementById("popInContent");
		popInTitle_ebook = document.getElementById("popInTitle");
		popInLinkHolder_ebook = document.getElementById("popInLinkHolder");
		popInLink_ebook = document.getElementById("popInLink");
    } else {
		popInContent_ebook = main.document.getElementById("popInContent_n");
		popInTitle_ebook = main.document.getElementById("popInTitle_n");
		popInLinkHolder_ebook = main.document.getElementById("popInLinkHolder_n");
		popInLink_ebook = main.document.getElementById("popInLink_n");
	}

	popInWindowX_ebook = 10;	// initial values set according to the hard-coded DIV values
	popInWindowY_ebook = 10;	// PW 9/2007: Now overwritten in EngagePopInWindow_ebook, but keep these here for now...

	// Set up event handlers to allow the window to be dragged
	if (popInTitle_ebook != null) {
		if ( typeof(inSuppWindow) != 'undefined' && inSuppWindow == true) {
			popInTitle_ebook.onmousedown = EngagePopInWindow_ebook;
		} else {
			popInTitle_ebook.onmousedown = EngagePopInWindow_ebook;
		}

	}
	if (inSuppWindow == null) {
                main.document.onmouseup = Disengage_ebook;
    } else if (inSuppWindow == true) {
                document.onmouseup == Disengage_ebook;
    }
	
	
}


// Shift the popInWindow.  If absolute = true, go to x, y (but don't shift to a -1 location). 
// If absolute = false or undefined, move by x, y
function ShiftPopInWindow_ebook(x, y, absolute, adjusting) {
	var oldLeft = popInWindowX_ebook;
	var oldTop = popInWindowY_ebook;

	if (absolute) {
		if (x != -1) {
			popInWindowX_ebook = x;
		}
		if (y != -1) {
			popInWindowY_ebook = y;
		}
	} else {
		popInWindowX_ebook += x;
		popInWindowY_ebook += y;
	}
	
	// Now calculate dx/dy, even if we are doing things absolutely
	var dx = popInWindowX_ebook - oldLeft;
	var dy = popInWindowY_ebook - oldTop;	// moving from oldTop = 200 to piy = 100, dy is 100-200 = -100
	
	// See where this is going to take us, and
	// Don't let it move off the left/top of the screen
	// offsetLeft/offsetTop are (hopefully) always absolute, not relative
	// to the div the window is attached to.
	var doL = (popInWindow_ebook.offsetLeft + popInWindow_ebook.offsetWidth) + dx;
	var doT = popInWindow_ebook.offsetTop + dy;	// continuing example above, if oT was 10, doT would be 10 + (-100) = -90
	if (doL < 50) {
		popInWindowX_ebook -= (doL - 50);
	}
	if (doT < 0) {
		popInWindowY_ebook -= doT;	// continuing example above, piy becomes 100 + (-90) = 10 -- we move so that offsetTop is 0
	}
	
	// Technically, the style should be "10px", not just "10".
	popInWindow_ebook.style.left = popInWindowX_ebook + "px";
	popInWindow_ebook.style.top = popInWindowY_ebook + "px";

}

// Get the current mouse position, taking account off any scrolling
function SetMousePositions_ebook(e) {
	// Netscape-compatible browsers send the event in as a parameter to the function,
	// but Explorer-compatible browsers require us to get the event.
	// Note that we need the main.window event, which will localize the mouse relative
	// to the main frame
	if (!e) var e = main.window.event;
	
	// See the bottom of http://www.quirksmode.org/index.html?/js/events_compinfo.html
	// for a version of this code that will work with all browsers; we only care about IE, NS, and Safari

	mouseX_ebook = e.clientX + main.document.body.scrollLeft;
	mouseY_ebook = e.clientY + main.document.body.scrollTop;
}

// This function is set as an event handler that's called
// when the user first clicks on the definition window
function EngagePopInWindow_ebook(e, piw, dfn, inSuppWindow) {
	// PW 9/2007: to allow for sticky notes, we now allow an optional piw argument. 
	// If set, popInWindow_ebook is set to this value. If not set, popInWindow_ebook gets the "normal"
	// popin window.
	if (piw != null) {
		popInWindow_ebook = piw;
	} else {
		// XXX removed code
		popInWindow_ebook = MainPopInWindow();
	}
	
	// PW 9/2007: allow for a function to be called on disengage
	disengageFunction_ebook = dfn;
	
	// Register an onmousemove event handler at the document level to move the window
	main.document.onmousemove = MovePopInWindow_ebook;
	
	// Cancel selection on body and title for remainder of move
	DisableSelection_ebook(main.document.body);
	DisableSelection_ebook(popInTitle_ebook);

	// Get the mouse event (see note in SetMousePositions_ebook)
	if (!e) var e = main.window.event;
	
	// set the initial values of startX/Y
	SetMousePositions_ebook(e);
	startX_ebook = mouseX_ebook;
	startY_ebook = mouseY_ebook;
	
	// and popInWindowX_ebook/popInWindowY_ebook
	popInWindowX_ebook = popInWindow_ebook.offsetLeft;
	popInWindowY_ebook = popInWindow_ebook.offsetTop;
	
	// Also set the values for lastScrollY_ebook
	// Note that we don't bother with X scrolling
	if (document.documentElement && document.documentElement.scrollTop) {
		lastScrollY_ebook = main.document.documentElement.scrollTop;
	} else {
		lastScrollY_ebook = main.document.body.scrollTop;
	}
	
	return StopEvent_ebook(e);
}

function DisableSelection_ebook(el) {
    el.onselectstart = function() {
        return false;	// IE
    };
    el.unselectable = "on";	// IE?
    el.style.MozUserSelect = "none";	// mozilla
    el.style.KhtmlUserSelect = "none";	// safari?
}

function EnableSelection_ebook(el) {
    el.onselectstart = null;
    el.unselectable = "off";	// IE?
    el.style.MozUserSelect = "";	// mozilla
    el.style.KhtmlUserSelect = "";	// safari?
}

// MovePopInWindow_ebook: called when the mouse is moved after engaging the window
function MovePopInWindow_ebook(e, inSuppWindow) {
	// Get the mouse event	
	var e;
	if (!e) {
		if (inSuppWindow == true) {
			e = window.event;
		} else {
			e = main.window.event;
		}
	}

	// Get the new mouse position
	SetMousePositions_ebook(e);
	
	// Move the window
	if (inSuppWindow == true) {
		ShiftPopInWindow_ebook(mouseX_ebook - startX_ebook, mouseY_ebook - startY_ebook, false);
	} else {
		ShiftPopInWindow_ebook(mouseX_ebook - startX_ebook, mouseY_ebook - startY_ebook, false);
	}


	// Set startX/Y so that the next time this function is called we'll move appropriately
	startX_ebook = mouseX_ebook;
	startY_ebook = mouseY_ebook;

	return StopEvent_ebook(e);
}


// Disengage_ebook: called when the mouse button is released
function Disengage_ebook() {
	// Clear the onmousemove event handler
	main.document.onmousemove = null;
	
	// Enable text selection
	EnableSelection_ebook(main.document.body);
	EnableSelection_ebook(popInTitle_ebook);
	
	// Call the disengageFunction_ebook if one was specified
	if (disengageFunction_ebook != null) {
		disengageFunction_ebook(popInWindow_ebook);
	}
	
	// Have to reset this function now; otherwise other mouseUps call it too
	disengageFunction_ebook = null;
}

// Stop the event e from bubbling up to higher layers of the DOM
// see http://www.quirksmode.org/index.html?/js/events_compinfo.html
function StopEvent_ebook(e) {
	e.cancelBubble = true;		// IE
	if (e.stopPropagation) 		// everyone else
		e.stopPropagation();
	
	// In NS, we (also?) have to return false to cancel the default action from occurring.
	// StopEvent_ebook returns false so that the caller can say "return StopEvent_ebook(e);"
	// to cover all eventualities.
	return false;
}

// Show something in the main popin window
				// 1	2	3	4    5    6      7      8        9
function ShowPopInWindow_ebook(title, content, link, width, top, left, bgcolor, fn, inSuppWindow) {
	// PW 9/07: make sure popInWindow is not set to a sticky note popIn
 	// KC: for popins in supp windows
	//alert("inSuppWindow in ShowPopInWindow_ebook: " + inSuppWindow);
	// XXX removed code
    popInWindow_ebook = MainPopInWindow()

	 // KC if we have ShowFootnote in the content and we're in a supp window, make sure to adjust the call
        if (inSuppWindow == true) {

                content = content.replace(/ShowFootnote\(([^\)]*)\)/, "ShowFootnote($1, true)");

        }

	// Remember what we're showing
	popInTitleShowing = title;
	
	// If the popInContent_ebook span hasn't yet been recognized (this is an issue when
	// in IE6, at least), call InitializePopInWindow again
	if (popInContent_ebook == null) {
		InitializePopInWindow_ebook(inSuppWindow);
	}
	// GUARD AGAINST USER CLICKING ON A TERM BEFORE GLOSSARY.JS HAS LOADED??
	
	// Set the title, content, and link
	popInTitle_ebook.innerHTML = "<b>" + title + "</b>";
	popInContent_ebook.innerHTML = content;
	
	// If link is null, there isn't one, so hide the div
	if (link == null) {
		SetDisplay(popInLinkHolder_ebook, "none");
	} else {
		SetDisplay(popInLinkHolder_ebook, "block");
		popInLink_ebook.innerHTML = link;
	}

	// Position the popInWindow in the same position as it was last left,
	// relative to the current scroll position

	// Find out what the current scroll position is
	// Note: in px F&E we have to look at main.parent.document.getElementById('fne-content')
	// instead of main.body.  Also we assume we have jquery available, 
	// and that it's scrollTop() will work
	var el = parent.document.getElementById('fne-content');
	var currentScrollY;
	if (el == null) {
    	if (main.document.documentElement && main.document.documentElement.scrollTop) {
        	currentScrollY = main.document.documentElement.scrollTop;
        } else {
            currentScrollY = main.document.body.scrollTop;
        }
	} else {
		currentScrollY = $(el).scrollTop();
	}
	
	/*	
	var d = parent.document.getElementById('fne-content');
	if (d == null) {
		d = main.document.body;
	}
	// this top line is for IE; not sure if it will work...
	if (d.documentElement && d.documentElement.scrollTop) {
		currentScrollY = d.documentElement.scrollTop;
	} else {
		currentScrollY = d.scrollTop;
	}

	var currentScrollY;
	if (main.document.documentElement && main.document.documentElement.scrollTop) {
		currentScrollY = main.document.documentElement.scrollTop;
	} else {
		currentScrollY = main.document.body.scrollTop;
	}
	*/
	
	// If top/left are set, scroll to that position
	// If left is null set it to -1, meaning that we'll stay wherever we were
	if (left == null) {
		left = -1;
	}
	// If top is null, shift so that it's near the top of the screen, regardless of scrolling
	if (top == null) {
		top = currentScrollY + 25;
	}
	
	ShiftPopInWindow_ebook(left, top, true);

	// Alternatively, we COULD:
	// Shift the window to compensate for any scrolling that happened since
	// the last time the window moved.
	// If, for example, the window was scrolled to 0, 0 before
	// and now is scrolled to 100, 0, we want to move down 100 pixels
	// ShiftPopInWindow_ebook(0, currentScrollY - lastScrollY_ebook);
	
	// Record the current scroll position
	lastScrollY_ebook = currentScrollY;
	
	// Set width to provided or default width
	if (width != null) {
   		if ((width.toString()).indexOf("px") != -1) {
			popInWindow_ebook.style.width = width;
		} else {
			popInWindow_ebook.style.width = width + "px";
		}

	} else {
		popInWindow_ebook.style.width = defaultWidth_ebook + "px";
	}	
	
	// Set background color to provided or default color
	if (inSuppWindow == null) {
    	if (bgcolor != null) {
        	main.document.getElementById('popInBody_n').style.backgroundColor = bgcolor;
         } else {
            main.document.getElementById('popInBody_n').style.backgroundColor = defaultPopInBgColor;        // set in defaults.js
         }
    }

	// Show the popInWindow
	SetVisibility(popInWindow_ebook, "visible");

	// Record the clean up function, if one was sent.
	cleanUpFunction_ebook = fn;
}

// Hide the popin window
function ClosePopInWindow_ebook(inSuppWindow) {

	// XXX removed code
   	SetVisibility(MainPopInWindow(), "hidden");

	// Set lastDefinedTermId to null
	lastDefinedTermId = null;
	
	// Remember that we're not showing any popin window now
	popInTitleShowing = null;

	// run cleanUpFunction_ebook if it was sent
	if (cleanUpFunction_ebook != null) {
		cleanUpFunction_ebook();
	}
}

// -----------------------------------------
// Resize a pop-in window

var popInWindowW_ebook, popInWindowH_ebook;	// current width/height of the popInWindow div
var innerPopInDivW_ebook, innerPopInDivH_ebook, innerPopInDivWComp_ebook, innerPopInDivHComp_ebook;
var innerPopInDiv_ebook;

function EngagePopInResize_ebook(e, piw, innerDiv, innerDivWComp, innerDivHComp, dfn) {
	popInWindow_ebook = piw;
	innerPopInDiv_ebook = innerDiv;
	innerPopInDivWComp_ebook = innerDivWComp;
	innerPopInDivHComp_ebook = innerDivHComp;

	// allow for a function to be called on Disengage_ebook
	disengageFunction_ebook = dfn;
	
	// Register an onmousemove event handler at the document level to resize the window
	main.document.onmousemove = ResizePopInWindow_ebook;

	// Get the mouse event (see note in SetMousePositions_ebook)
	if (!e) var e = main.window.event;
	
	// set the initial values of startX_ebook/Y
	SetMousePositions_ebook(e);
	startX_ebook = mouseX_ebook;
	startY_ebook = mouseY_ebook;
	
	// and popInWindowW_ebook/popInWindowH_ebook
	popInWindowW_ebook = popInWindow_ebook.offsetWidth;
	popInWindowH_ebook = popInWindow_ebook.offsetHeight;
	innerPopInDivW_ebook = innerPopInDiv_ebook.offsetWidth;
	innerPopInDivH_ebook = innerPopInDiv_ebook.offsetHeight;
	
	return StopEvent_ebook(e);
}

function ResizePopInWindow_ebook(e) {
	// Get the mouse event	
	if (!e) var e = main.window.event;

	// Get the new mouse position
	SetMousePositions_ebook(e);
	
	// Resize the window
	popInWindowW_ebook += (mouseX_ebook - startX_ebook);
	popInWindowH_ebook += (mouseY_ebook - startY_ebook);
	
	popInWindow_ebook.style.width = popInWindowW_ebook + "px";
	popInWindow_ebook.style.height = popInWindowH_ebook + "px";

	// And the inner div
	//innerPopInDivW_ebook += (mouseX_ebook - startX_ebook);
	//innerPopInDivH_ebook += (mouseY_ebook - startY_ebook);
	
	innerPopInDiv_ebook.style.width = (popInWindowW_ebook + innerPopInDivWComp_ebook) + "px";
	innerPopInDiv_ebook.style.height = (popInWindowH_ebook + innerPopInDivHComp_ebook) + "px";

	// Set startX_ebook/Y so that the next time this function is called we'll move appropriately
	startX_ebook = mouseX_ebook;
	startY_ebook = mouseY_ebook;

	return StopEvent_ebook(e);
}

//----------------------------------------------------------------
// Functions for particular pop-ins follows
// ---------------------------------------------------------------

// only load the glossary once the user has clicked on a term
function Load_Glossary(termId) {
	// define T_ID in case script doesn't load properly
	window.T_ID = {};
	
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	// ie 7/8 event handler (not sure if it's needed for 8 or not)
	script.onreadystatechange= function () {
		if (this.readyState == 'complete') Define(termId);
	}
	// other browsers
	script.onload = function() {
		Define(termId);
	};
	
	var url = bookId_path + 'glossary/definitions.js';
	script.src = url;
	head.appendChild(script);
}

// var lastDefinedTermId		// defined in ebookSuppWinAPI.js
// Show the given term's definition in the definition window
function Define(termId) {	
	// Decide on the content
	var content;
	// XXX: only load the glossary once the user has clicked on a term
	if (window.T_ID == null) {
		Load_Glossary(termId);
		return
	}
	if (T_ID[termId] == null) {
		content = 'Not defined...';
	} else {
		content = T_ID[termId];
	}
	
	// Extract the full term and add other links if possible
	var start = content.indexOf("<b>") + 3;
	var end = content.indexOf("</b>");
	var morelinks;
	if (start != -1 && end != -1) {
		var term = content.substring(start, end);
		// Remove : if there
		term = term.replace(/[:]/g, "");

		// Remove entities if there
		term = term.replace(/\&\w+;/g, "");

		// remove parentheticals
		term = term.replace(/ *\([^)]+\)/g, "");

		// replace spaces with + for google
		var googleTerm = term.replace(/ /g, "+");

		// And add quotes around the whole thing
		googleTerm = '"' + googleTerm + '"';

		// replace spaces with _ for wikipedia
		//var wikiTerm = term.replace(/ /g, "_");
		
		// Add wikipedia and google links	
		// morelinks = ' | <a class="ba" href="http://en.wikipedia.org/wiki/' + wikiTerm + '" target="_blank">Wikipedia</a> | <a class="ba" href=\'http://www.google.com/search?q=' + googleTerm + '\' target="_blank">Google</a>';
		// XXX removed : | at start
		morelinks = '<a class="ba" href=\'http://www.google.com/search?q=' + googleTerm + '\' target="_blank">Google</a>';
	} else {
		morelinks = "";
	}
	
	// definitionWidth can be set in config.js;
	// if it's not set, it will be null, which is fine.
	// windowTop, windowLeft can be set in config.js; set to null in defaults.js
	ShowPopInWindow_ebook("Glossary Definition"
					, content
					, morelinks
					, null
					, null
					, null
	);

	// Record the term, so that if we jump to the glossary we'll go to this place
	// If we do so, use the first four letters of the termId, in hopes of getting some
	// additional helpful entries.
	// KC: Unfortunately, in IE, &para and &cent in the query string get rendered as a paragraph and cents symbol respectively, throwing an
	// error 
	if (termId.substr(0,4) == "para" || termId.substr(0,4) == "cent") {
		lastDefinedTermId = termId.substr(0, 5);
	} else {
		lastDefinedTermId = termId.substr(0, 4);
	}
}

// XXX only load the footnotes once the user has clicked on one
function Load_Footnotes(footnoteId) {
	// define F_ID in case script doesn't load properly
	window.F_ID = {};
	
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	// ie 7/8 event handler (not sure if it's needed for 8 or not)
	script.onreadystatechange= function () {
		if (this.readyState == 'complete') ShowFootnote(footnoteId);
	}
	// other browsers
	script.onload = function() {
		ShowFootnote(footnoteId);
	};

	var url = bookId_path + 'footnotes.js';
	script.src = url;
	head.appendChild(script);
}


// Show the given footnote in a popin window
function ShowFootnote(footnoteId) {
	// XXX: only load the footnote once the user has clicked on one
	if (window.F_ID == null) {
		Load_Footnotes(footnoteId);
		return
	}

	// Decide on the content
	var content;
	if (F_ID[footnoteId] == null) {
		content = 'No footnote...';
	} else {
		content = F_ID[footnoteId];
	}
	
	// replace any references to "top\."
	content = content.replace(/top\.(\w)/g, "$1");
	
	ShowPopInWindow_ebook("Footnote", content
                                        , null
                                        , null
                                        , null
                                        , null
                                        , null
                                        , null
                                        , null
	);
}

/* 
// I don't think we're doing "web links" or "comments" or "equations" or "whatif answers"
// in any books that we would do launch pad portals for
*/
function ShowLinks(linkId) { console.log("sellwood_px: ShowLinks called; this function is not defined in px."); }
function ShowComment(commentId) { console.log("sellwood_px: ShowComment called; this function is not defined in px."); }
function ShowEquation(eqn) { console.log("sellwood_px: ShowEquation called; this function is not defined in px."); }
function ShowWhatIfAnswer(chapter, number) { console.log("sellwood_px: ShowWhatIfAnswer called; this function is not defined in px."); }
function PopInAlert(title, content, link) { console.log("sellwood_px: PopInAlert called; this function is not defined in px."); }


var popInHTML_ebook = 
	'<div id="popInWindow_n" style="visibility:hidden; position:absolute; left:10; top:10; border:1px solid #000000; background-color:#dddddd; width:325; font-size:12px; text-align:left; z-index:1000">'
	+ '    <table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin:0px; padding:0px"><tr>'
	+ '        <td id="popInTitle_n" class="popInTitleS" style="font-size:11px; font-family:Verdana, sans-serif; padding:2px 3px 4px 3px; cursor:move; width:95%; border-width:0px; ">Title</td>'
	+ '        <td class="popInTitleS" style="font-size:11px; font-family:Verdana, sans-serif; padding:2px 3px 4px 3px; cursor:pointer; text-align:right; border-width:0px"><a href="Javascript:ClosePopInWindow_ebook()" class="popInCloseLinkS" style="font-weight:bold; cursor:pointer">[X]</a></td>'
	+ '    </tr></table>'
	+ '    <div style="padding:5px" id="popInBody_n">'
	+ '        <div id="popInContent_n">content</div>'
	+ '        <div id="popInLinkHolder_n" style="margin-top:5px"><b>&raquo;</b> <span id="popInLink_n">link</span></div>'
	+ '    </div>'
	+ '</div>'
	;

// XXX removed code

// Keep track of the title we're currently showing in the pop-in window
var popInTitleShowing = null;
function PopInShowing_ebook() {
	return popInTitleShowing;
}

function WritePopInWindow_ebook() { console.log("sellwood_px: WritePopInWindow_ebook called; this function is not defined in px."); }
function PopInFigure(img, width, caption, imgwidth, type, captionstyle) { console.log("sellwood_px: PopInFigure called; this function is not defined in px."); }
function PopInShowing_ebook() { console.log("sellwood_px: PopInShowing_ebook called; this function is not defined in px."); }
function ToolWindowShowing() { console.log("sellwood_px: ToolWindowShowing called; this function is not defined in px."); }

// PW: On 11/18/2008, I replaced all calls to ShowPopInWindow() with ShowPopInWindow_ebook()
// to eliminate a conflict in v3 Portal with the ShowPopInWindow function used by other parts of the portal.
// But just in case some ebook pages are calling ShowPopInWindow directly,
// write alternate versions of the public functions in this file.
// v3 Portal will just overwrite these versions
function ShowPopInWindow(title, content, link, width, top, left, bgcolor, fn) {
	ShowPopInWindow_ebook(title, content, link, width, top, left, bgcolor, fn);
}

function ClosePopInWindow() {
	ClosePopInWindow_ebook();
}

function PopInShowing() {
	PopInShowing_ebook();
}

function WritePopInWindow() {
	WritePopInWindow_ebook();
}

function MovePopInWindow(e) {
	MovePopInWindow_ebook(e);
}

// ===========================
// ebookPrefsAPI.js

var prefStyles = new Object();

function SetPref(att, val) { console.log("sellwood_px: SetPref called; this function is not defined in px."); }
function GetPref(att) { console.log("sellwood_px: GetPref called; this function is not defined in px."); }
function SetDefaultPrefs() {
	prefStyles.fontSize = defaultFontSize;	// config.js
	prefStyles.fontFace = defaultFontFace;	// config.js
	prefStyles.textAlign = "left";
	
	// asg has different default
	if (bookId == 'speakersguide3e') {
		prefStyles.termColor = "#006600";
	// so does SMG
	} else if (bookId == 'theguide8e') {
		prefStyles.termColor = "#229de5";
	} else {
		prefStyles.termColor = "#000066";
	}
	
	prefStyles.returnToPage = defaultReturnToPageValue;	// Not really a style, but we keep it in this array; see defaults.js
	prefStyles.initialMessageDismissed = 0;	// Not really a style, but we keep it in this array; see defaults.js
	prefStyles.isWikiEditable = "no";// KT: this was = "yes" on ugly...

}

function WritePrefStyleSheet() {
	main.document.write('<style type="text/css">'
		, 'a.term {color:' , prefStyles.termColor, '} '
		, 'a:link.term {color:', prefStyles.termColor, '} '
		, 'a:active.term {color:', prefStyles.termColor, '} '
		, 'a:visited.term {color:', prefStyles.termColor, '} '
		, 'a:hover.term {color:', prefStyles.termColor, '} '
		, 'body {font-size:', prefStyles.fontSize, '; font-family:', prefStyles.fontFace, '; text-align:', prefStyles.textAlign, '} '
		, 'td, th {font-size:', prefStyles.fontSize, '; font-family:', prefStyles.fontFace, '; text-align:', prefStyles.textAlign, '} '
		, '</style>');
}

function RecordPrefs() { console.log("sellwood_px: RecordPrefs called; this function is not defined in px."); }
function SetNewPassword(newPass) { console.log("sellwood_px: SetNewPassword called; this function is not defined in px."); }
function SetNewEmail(newEmail) { console.log("sellwood_px: SetNewEmail called; this function is not defined in px."); }
function VersionChanged(OK) { console.log("sellwood_px: VersionChanged called; this function is not defined in px."); }
function RevertAllWikiEdits() { console.log("sellwood_px: RevertAllWikiEdits called; this function is not defined in px."); }

// ===========================
// ebookQuestionsAPI.js

// PW: I'm not sure if these are used anymore, but there's no reason we can't leave them here to work if they're called
// we just want to disable anything that's causing server-side calls

// *************************************************************
function ______TEXT_QUERIES______() {}

var queryLetter = new Array("", "a", "b", "c", "d", "e", "f", "g");

var query;
var queryCorrect = new Array();
function WriteQuery() {
	// Initialize the query object
	query = new Object();
	
	// Sometimes we will just have 1 query, in which case the first argument will be 0.
	// Other times we will have more than 1, in which case the first argument will be a number.
	var number = arguments[0];
	// If number is 0 or 1, initialize the queryCorrect array
	// otherwise, we'll store queryCorrect[2-10] in the already-initialized array
	//if (number == 0 || number == 1) {
	//	queryCorrect = new Array();
	//}
	
	// Some sections have multiple questions, but we don't want them numbered.
	// So if number < 0, use the number as the index, but don't show the number.
	if (number < 0) {
		number *= -1;
		arguments[0] = 0;	// we check arguments[0] below to decide whether or not to show the number
	}
	
	// Read the other arguments: question is always arg 1; answers follow
	query.question = arguments[1];
	query.answers = new Array ();
	var j = 1;
	for (var i = 2; i < arguments.length; ++i) {
		// The "correct" arg indicates that the NEXT answer is the correct one
		if (arguments[i] == "correct") {
			queryCorrect[number] = j;
		} else {
			query.answers[j] = arguments[i];
			++j;
		}
	}
	
	// Now write the query
	main.document.write(selfQuizStart);		// config.js
	main.document.write('<div style="padding-bottom:5px">');
	// Check arguments[0] in the following, to allow for multiple unnumbered questions
	if (arguments[0] == 0) {
		main.document.write('<b>Self-Quiz:</b><br>', query.question);
	} else {
		main.document.write('<table border="0" cellspacing="0" cellpadding="0"><tr><td valign="top"><b>', number, '.</b>&nbsp;</td><td>', query.question, '</td></tr></table>');
	}
	main.document.write('</div>');
	
	// To fix vertical alignment problems, we have to insert the following text on the top
	// line of each cell.  For the answer, to be safe, we put it at the end of the answer
	// and try to substitute it for the first space in the answer
	var spacer = '<span class="super">&nbsp;</span>';
	
	main.document.write('<table cellspacing="0" cellpadding="0" border="0">');
	for (var i = 1; i < query.answers.length; ++i) {
		var modAns = query.answers[i].replace(/([^n<>]) /, '$1<span class="super">&nbsp;</span>');
		main.document.write ('<tr><td valign="top"><nobr><input type="radio" name="queryAnswers" onclick="CheckQueryAnswer(', number, ',', i, ')">', spacer, '</nobr></td>'
			, '<td valign="top"><nobr>', queryLetter[i], '.', spacer, '</nobr></td>'
			, '<td valign="top" width="95%">', modAns, spacer, '</td></tr>');
	}

	main.document.writeln('</table>'
		, '<div id="queryCorrect', number, '" style="display:none; color:#006600; font-weight:bold"><b>Correct!</b></div>'
		, '<div id="queryIncorrect', number, '" style="display:none; color:#990000; font-weight:bold">Incorrect</div>'
		, '</form>');
}

function CheckQueryAnswer(number, response) {
	if (response == queryCorrect[number]) {
		main.document.getElementById('queryIncorrect' + number).style.display = "none";
		main.document.getElementById('queryCorrect' + number).style.display = "block";
	} else {
		main.document.getElementById('queryCorrect' + number).style.display = "none";
		main.document.getElementById('queryIncorrect' + number).style.display = "block";
	}
}

// *************************************************************
function ______CHAPTER_SUMMARIES______() {}


var csIndex = 0;
var csAnswers = new Array();

function InitializeCS() {
	csIndex = 0;
	csAnswers = new Array();
}

function WriteCSBlank(answer) {
	// Start a nobr tag for the item
	main.document.write('<nobr>');

	main.document.write('<span id="csInp', csIndex, '"><input onclick="ShiftCheckLink(this)" type="text" name="csq', csIndex, '" size="', (answer.length + 2), '"></span>');
	FinishCSItem(answer);
	
	csAnswers[csIndex] = answer;	
	++csIndex;
}

function WriteCSMC(answerString) {
	// answer string should be something like "3, choice 1, choice2, correct choice"
	var answers = answerString.split(/,\s*/);
	var correctChoice = answers[0] * 1;
	
	// Start a nobr tag for the item
	main.document.write('<nobr>');

	main.document.write('<span id="csInp', csIndex, '"><select onclick="ShiftCheckLink(this)" name="csq', csIndex, '" style="font-family:Verdana,sans-serif;font-size:12px">');
	main.document.write('<option value="-1">--------</option>');
	for (var j = 1; j < answers.length; ++j) {
		main.document.write('<option value="', j, '">', answers[j], '</option>');
	}
	main.document.write('</select></span>');
	FinishCSItem(answers[correctChoice]);
	
	csAnswers[csIndex] = correctChoice;	
	++csIndex;
}

function FinishCSItem(answer) {
	// Write the correct answer next to the form element, in a hidden span
	main.document.write('<span id="csCor', csIndex, '" style="color:#009900; font-weight:bold; display:none">', answer, '</span>');
	
	// Also write the red X image, also in a hidden span
	main.document.write('<a title="Click to show the correct answer." id="csInc', csIndex, '" style="display:none" href="Javascript:FillinCSAnswer(', csIndex, ');"><img alt="Click to show the correct answer." src="', urlStart, 'pics/cswrong.gif" width="15" height="18" border="0" align="top"></a>');
	
	// Close off the nobr tag for the item
	main.document.write('</nobr>');
}

// Write a link to check or show the items
function WriteCSCheck() {
	main.document.write('<div id="checkDiv" style="position:absolute; left:' + (textFarRight + 5) + '; text-align:center"><a href="Javascript:CheckCSAnswers()" title="Check your answers" class="rightMarginLink">[Check]</a>&nbsp;<a href="Javascript:ShowCSAnswers()" title="Show correct answers" class="rightMarginLink">[Show]</a><br><a href="Javascript:LoadSection(\'reload\')" title="Reset the blanks and pull-downs" class="rightMarginLink">[Reset]</a></div>');
}

// Shift the "Check" link to a position just to the right of the clicked-on input
function ShiftCheckLink(inp) {
	// Find scroll position of the input (adapted from http://www.quirksmode.org/js/findpos.html)
	if (inp.offsetParent) {		// Should be true for any v5+ browser
		var obj = inp;
		var top = 0;
		while (obj.offsetParent) {
			top += obj.offsetTop;
			obj = obj.offsetParent;
		}
		
		// And move the link appropriately
		main.document.getElementById("checkDiv").style.top = top + "px";
	}
}

function CheckCSAnswers(start, end) {
	// If no start, check all
	if (start == null) {
		start = 0;
		end = csIndex;
	}
	
	// Go through the range of questions
	for (var i = start; i < end; ++i) {
		// An already-filled-in question
		if (typeof csAnswers[i] != "string" && csAnswers[i] == -1) {
			continue;
			
		// A fill-in
		} else if (typeof csAnswers[i] == "string") {
			var ans = main.document.csForm["csq" + i].value;
			// answer check needs to be case-insensitive
			var CIuserAns = ans.toLowerCase();
			var CIrightAns = csAnswers[i].toLowerCase();
			GiveCSFeedback(i, ans == "", CIuserAns == CIrightAns);

		// Or a multiple choice
		} else {
			var ans = main.document.csForm["csq" + i].options[main.document.csForm["csq" + i].selectedIndex].value;
			GiveCSFeedback(i, ans == -1, ans == csAnswers[i]);
		}
	}
}

function GiveCSFeedback(index, blank, correct) {
	// Blank: hide the X (couldn't be blank if the correct answer was showing!)
	if (blank) {
		main.document.getElementById("csInc" + index).style.display = "none";
	// Correct: show the correct answer; hide the form element and X
	} else if (correct) {
		FillinCSAnswer(index);
	// Incorrect: show the X
	} else {
		main.document.getElementById("csInc" + index).style.display = "inline";
	}
}

function FillinCSAnswer(index) {
	main.document.getElementById("csInp" + index).style.display = "none";
	main.document.getElementById("csInc" + index).style.display = "none";
	main.document.getElementById("csCor" + index).style.display = "inline";
	
	// Once the answer is filled in, make sure it doesn't get marked incorrect later
	csAnswers[index] = -1;
}

function ShowCSAnswers(start, end) {
	// If no range, check all
	if (start == null) {
		start = 0;
		end = csIndex;
		
		// If we're showing all answers, hide the check/show link
		// NO - because now we have a "reset" link
		// main.document.getElementById("checkDiv").style.display = "none";
	}
	
	// Go through the range of questions
	for (var i = start; i < end; ++i) {
		FillinCSAnswer(i);
	}
}

// *************************************************************
function ______DISCUSSION_QUESTIONS______ () {}

var dqs = new Array();

// Convert a given dq number, which could include spaces or other characters
// (e.g. "CYA 2-1.1a") into a valid object attribute name
function DQNumberId(n) {
	// convert to string
	n = "" + n;

	// replace non-word characters with _
	n = n.replace(/\W/g, "_");
	
	// PW: was starting with a word char, but turns out that's not necessary and
	// is problematic for backwards-compatibility
	// n = "dq_" + n;
	
	return n;
}

// Establish a dqs record, if it needs to be established
function CreateDQRecord(c, n) {
	// Establish the chapter array if necessary
	if (dqs[c] == null) {
		// PW: this used to be a numeric array, but to accommodate
		// non-numeric question "numbers", I've made it an object (associative array)
		dqs[c] = new Object();
	}

	// Establish the individual question array if necessary
	var nid;
	
	// Krugman method; now used by others
	nid = DQNumberId(n);
	if (dqs[c][nid] == null) {
		dqs[c][nid] = new Object();
		// Record the untransformed number
		dqs[c][nid].n = n;
	}

	return nid;
}

function WriteDQShowLink(showInline) {
	// PW: don't show this link
	return;
}

function WriteDQField(n, printShowLink, win, prompt, givenAnswer) {
	// By default, use main of this window
	if (win == null) {
		win = main;
	}
	
	var c = CurrentChapter();
	var nid = CreateDQRecord(c, n);	// n may be transformed to deal with non-word chars
	// for now, unless this is Krugman, n=nid

	// If we already have a user answer, put it in the text field and display it.
	var answer = "";
	var style = ' style="display:block"';
	if (dqs[c][nid].answer != null && dqs[c][nid].answer != "") {
		answer = dqs[c][nid].answer;
	// If we don't have an answer, don't initially show the answer field
	// -- unless we have a prompt, in which case we'll assume that we always want to show it
	} else if (prompt == null) {
		style = ' style="display:none"'
	}
	
	var rrSmall = false;
	
	// KC: this is if we want to seed text field with arg from WriteDQField
	if (answer == null || answer == "") {
		// KT: need to stop from showing givenAnswer field in R&R when I overload the var.
		if (givenAnswer == "rrTextareaSmall"){ // some weird string nobody will ever type
			answer = "";
		} else if (givenAnswer != null) {
			answer = givenAnswer;
		}
	}
	
	//KT - determine if this is a small box or not.
	//     not done above because there may be an answer and then the comparison wont be made.
	if(givenAnswer == "rrTextareaSmall"){
		rrSmall = true;
	}
	
	// Show a link to view the answer field
	// -- unless we have a prompt, in which case it'll always be showing
	if (prompt == null) {
		win.document.write('<div id="dqtl"', nid, '" class="dqtl"><a class="ba" href="JavaScript:ShowDQField(\'', n, '\')">[Answer Field]</a></div>');
	}
	
	if (win == main) {
		;
	} else {
		// win.document.write('<div class="dqtl"><b>Answer Field:</b></div>');
		win.document.write('<input type="hidden" id="dqtanum" value="',nid,'">');
	}
	
	win.document.write('<div id="q', nid, '" class="dqtad"', style, '>');
	// write prompt, if given
	// dqpromptStart is defined as "" in defaults.js, and can be overridden in config.js
	if (prompt != null && prompt != false) {
		win.document.write('<div class="dqprompt">', dqpromptStart, prompt, '</div>');
	}

	// PW: remove onblur event to RegisterDQAnswer
	// onblur="RegisterDQAnswer(', CurrentChapter(), ',\'', n, '\',this)"
	win.document.write('<textarea id="ta', nid, '" class="dqta" onclick="ShiftDQShowLink(this)" onfocus="ShiftDQShowLink(this)" rows="2" cols="40" autocomplete="off" >');
	win.document.write(answer);	
	win.document.write('</textarea>');
	if (printShowLink == true) {
		// alert(printShowLink);
		// PW: don't show this link
		// win.document.write('<div style="margin:2px 0 5px 0"><a class="ba" href="Javascript:ShowDQPrintable()" title="Show your answers in a printable window.">[Show Printable Answers]</a></div>');
	}

	// if some special links are set in config.js (see, e.g., theguide8e), show them
	if (WriteDQLinks != null) {
		WriteDQLinks(win, n);
	}

	win.document.write('</div>');
}

function printText(content) {

var regExp=/\n/gi;
content = content.replace(regExp,'<br>');


w = window.open('','', 'location=no,scrollbars=no,menubar=no,toolbar=no,width=400,height=200');
w.document.open();
w.document.write('<html><body onload="print()">')
w.document.write(content);
w.document.write('</body></html>');
w.document.close();
}

function ShowDQField(n) {
	var nid = DQNumberId(n);
	SetDisplay(main.document.getElementById('q' + nid));
	var d = main.document.getElementById('ta' + nid);
	if (d != null && d.style.display == "block") {
		d.focus();
	}
}

// Shift the "Show Printable" link to a position just to the right of the clicked-on input
function ShiftDQShowLink(inp) {
	// Find scroll position of the input 
	// (adapted from http://www.quirksmode.org/js/findpos.html)
	if (inp.offsetParent) {		// Should be true for any v5+ browser
		var obj = inp;
		var top = 0;
		while (obj.offsetParent) {
			top += obj.offsetTop;
			obj = obj.offsetParent;
		}
		
		// alert("Shifting " + inp);
		
		// And move the link appropriately
		if (main.document.getElementById("showDiv") != null) {
			main.document.getElementById("showDiv").style.top = top + "px";
		}
	} else {
		// alert ("inp.offsetParent is not defined");
	}
}

function RegisterDQAnswer(c, n, inp) { console.log("sellwood_px: RegisterDQAnswer called; this function is not defined in px."); }

// This function can be called by RegisterDQAnswer above, 
// or from text.php when the book is first loading
function RecordDQAnswer(c, n, answer) {
	var nid = CreateDQRecord(c, n);	// n may be transformed to deal with non-word chars
	dqs[c][nid].answer = answer;
	return nid;
}

var monthStrings = new Array("January", "February", "March", "April", "May", "June"
	, "July", "August", "September", "October", "November", "December");
	
function ShowDQPrintable(c) { console.log("sellwood_px: ShowDQPrintable called; this function is not defined in px."); }

function SaveProfEmail(profEmail) { console.log("sellwood_px: SaveProfEmail called; this function is not defined in px."); }


// =============================
// ebookCaAPI.js
function ca() {
	return true;
}


// ============================
// ebookSuppWinAPI.js

// javascript:top.PxPage.OpenSupp('crunchit','bps6e','eg01-06.txt')
function px_crunchitlink(type, bookId, datafile) {
	top.PxPage.OpenSupp(type, bookId, datafile);
	return;
}

// just open the url
function px_opensupp(url) {
	window.open(url, "_blank");
}

// PW: The OpenSupp function is a bear, and combines with functionality in suppAPI.js.  I've combined it all here
// the strategy is to simply open the right URL in a separate window; don't worry about linking to an item within PX

/*----------------------------------------------
The suppInfos object contains the following info:
	b: The start of the banner title
	fn: The start of the file name
	
	Other items are optional:
	
	v: For most items, this is the number of variables that will be passed in for the item:
		0 = none
		1 = a chapter number only
		2 = a chapter number and item number (e.g. 3.2)
		KC: 3 = a chapter number, a section number, and an item number (e.g. 3.1.1 in calc figures)

		If there is a v item, it is assumed that:
			the banner title will be "XXX Y.Z" or "XXX - Chapter Y"
			the file name will be "xxx/y_z.html" or "xxx/y.html"
		
	bv: the number of variables to use in the banner title (see format above)
	fv: the number of variables to use in the filename (see format above)
	sc: whether or not to switch to the chapter specified in val[1]
		(if v is present, the switch will occur if v > 0)
	
	pdf: the supplement uses a pdf file, rather than a html file
----------------------------------------------*/

var suppInfos = {
	aboutebook: {b:"ABOUT THE eBOOK", fn:"loginsupps/about.html", v:0}
,	act: {b:"ACTIVITY", fn:"activities", v:2}
,	aimm: {b:"AIMM", fn:"aimms", v:2}
,	anatomyquiz: {b:"ANATOMY QUIZ", fn:"activities", v:2}
,	animatedmechanism: {b:"ANIMATED MECHANISM", fn:"animatedmechanisms", v:2}
,	animation: {b:"ANIMATION", fn:"animations", v:2}
,	animexercise: {b: "ONLINE REVIEW EXERCISE", fn:"onlinereviewex", v:2}
,	applet: {b:"APPLET", fn:"applets", v:2}
,	bedfordspeechoutliner: {b:"BEDFORD SPEECH OUTLINER"}
,	box: {b:"BOX", fn:"boxes", v:2}	// Generic box window
, 	calcfigure: {b:"FIGURE", fn:"figures", v:3} // these have 3 arguments
,	calctable: {b:"TABLE", fn:"tables", v:3} // these have 3 arguments
, 	critthink: {b:"CRITICAL THINKING", fn:"critthink", v:1} // for earth
,   demo: {b:"DEMONSTRATION", fn:"demo", v:2}
,	document: {b:"DOCUMENT", fn:"documents", v:2}
,	eesee: {b:"EESEE", fn:"eesee_content/eesee.html", v:0}
,   eq: {b:"EQUATION", fn:"eq", v:2}
,	example: {b:"EXAMPLE", fn:"examples", v:2}
,	example_wsec: {b:"EXAMPLE", fn:"examples", v:3} // 3 args, like calcfig
,	exercise: {b:"EXERCISE", fn:"exercises", v:2}
,	exercise_wsec: {b:"EXERCISE", fn:"exercises", v:3} // 3 args, like calcfig
,	exercise2: {b:"ONLINE REVIEW EXERCISE", fn:"onlinereviewex", v:2} // exercises for earth
,	experiment: {b:"CLASSIC EXPERIMENT", fn:"experiments", v:2}
	// MZ: 03/06/2011 Use optional 3rd parameter as banner title
,	figure: {b:"FIGURE", fn:"figures", v:2, fv:2}
,	flashcard: {b:"FLASHCARDS", fn:"flashcards", v:2}
,	flashpaper: {b:"FLASHPAPER", fn:"flashpaper", v:2}
, 	forinquiringminds: {b:"For Inquiring Minds", fn:"boxes", v:2}
,	fm: {b:"FRONT AND BACK MATTER", fn:"frontmatter", bv:0, fv:1, sc:false}
, 	frbox: {b:"BOX", fn:"boxes", v:3} // 3 arguments, for frankenbooks
,	frexercise: {b:"EXERCISE", fn:"exercises", v:3} // 3 arguments, for frankenbooks
,	frtable: {b:"TABLE", fn:"tables", v:3} // 3 arguments, for frankenbooks
,   gallery: {b:"PHOTO GALLERY", fn:"gallery", v:1}
,	gd: {b:"GUIDED DISCOVERY", fn:"boxes", bv:0, fv:0, sc:true}	// Guided Discovery for Disco; special case
,	historylinks: {b:"HISTORY LINKS", fn:"historylinks", v:1}
,	intex: {b:"INTERACTIVE EXERCISE", fn:"intexs", v:2}
,	intquiz: {b:"INTERACTIVE QUIZ", fn:"intquizzes/intquiz.html", bv:1, fv:0, sc:true}	// Interactive quiz for life (uses a dhtml page)
,	intquiz2: {b:"INTERACTIVE QUIZ", fn:"intquizzes", v:1}	// Interactive quiz for astronomy
,	map: {b:"MAP", fn:"maps", v:2}
,	mining: {b:"MINING GENOMES", fn:"mining", bv:2, fv:0, sc:true}	// Mining Genomes for genetics
,   moreinfo: {b: "FOR MORE INFORMATION", fn:"moreinfo", v:1}
,	moretoknow: {b:"MORE TO KNOW", fn:"moretoknow", v:2}
, 	nomex: {b:"NOMENCLATURE EXERCISE", fn:"nomex", v:2}
,	printlinks: {b:"PRINT LINKS", fn:"printlinks", v:1}
,	psychsim: {b:"PSYCHSIM", fn:"tutorials", bv:2, fv:0, sc:true}
,	psychinq: {b:"PSYCHINQUIRY", fn:"activities", bv:2, fv:0, sc:true}
,   psychquest: {b: "PSYCHQUEST", fn:"tutorials", v:2}
,	qaonline: {b:"Q&A ONLINE", fn:"qaonlines", v:1}
,	quickstart: {b:"QUICK START GUIDE", fn:"quickstart/qspage1.html", v:0}
, 	reactex: {b:"REACTION EXERCISE", fn:"reactex", v:2}
,   section: {b:"BOX", fn:"sections", v:2, fv:2 } // use sections directory
, 	selftest: {b:"CONCEPT SELF-CHECKER", fn:"selftests", v:1} // earth
,	spotlight: {b:"SPOTLIGHT", fn:"boxes", v:2}	// Spotlight window for fapp8e
,	starrynightex: {b:"Starry Night Exercises", fn:"starrynights", v:1}
,	sugreads: {b:"SUGGESTED READINGS", fn:"sugreads", bv:0, fv:1, sc:false}
,   summarychart: {b:"REACTION SUMMARY CHART", fn:"summarycharts", v:2}
,	sgsupp: {b:"STUDY GUIDE SUPPLEMENT", fn:"sgsupps", v:1, bv:0}	// special case: value has filename to open
,	supptoc: {b:"RESOURCES", fn:"supptoc.html", bv:0, fv:0, sc:true}	// KC: This is for testing old supptoc.html files for disco
	// MZ: 03/06/2011 Use optional 3rd parameter as title
,	table: {b:"TABLE", fn:"tables", v:2, fv:2}
,	template: {b:"EXAMPLE SUPPLEMENTAL WINDOW", fn:"template.html", bv:0, fv:0, sc:true}	// for use in ebook design
,	toc: {b:"RESOURCES", fn:"supptoc.php", bv:0, fv:0, sc:true}	// Resource TOC
,   tools: {b:"TOOLS", fn:"tools", v:1}
,	tut: {b: "TUTORIAL", fn:"tutorials", v:2}
,   toolbox: {b:"TOOLBOX", fn:"toolboxes", v:2}
,	unpacking: {b:"INTERACTIVE UNPACKING THE PROBLEM", fn:"unpacking", v:2}
,	video: {b:"VIDEO", fn:"videos", v:2}
,	visual: {b:"VISUAL SOURCE", fn:"visual", v:2}
,	weblinks: {b:"WEB LINKS", fn:"weblinks", v:1}
,	webreview: {b:"WEB SITE REVIEW", fn:"webreview", v:1}
,	wh: {b:"WHAT IF... ", fn:"boxes", bv:0, fv:0, sc:true}	// WHAT IF...  for Disco; (astroportal) special case
}

function OpenSupp(type) {
	// PW: Note that other arguments will be specified besides type
	// type should be case-insensitive
	type = type.toLowerCase();
	
	// if we find a url below, we'll open it
	var url = null;
	
	// PW: Most "modern" ebooks should use pageid linking, where we will simply get a URL to open
	if (type == 'pageid') {
		// First try to get the url out of suppInfo[] associative array
		// If it's there we want to override anything that's inline
		if (window.suppInfo != null && suppInfo[pageId] != null) {
			var si = suppInfo[pageId];
			px_opensupp(si['url']);
			
		// If we didn't get suppInfo out of the database, the url should be in arguments[3]
		} else {
			url = arguments[3];
			px_opensupp(url);
		}

	} else if (type == 'bcs') {
		// similarly, for a "bcs" link the url will be in arguments[2]
		var url = val[2];
		px_opensupp(url);
		
	} else if (type == 'url') {
		px_opensupp(arguments[1]);

	} else {
		// Get and parse the suppInfo
		var suppInfo = suppInfos[type];
		if (suppInfo != null) {
			var fileVars;
			if (suppInfo.v != null) {
				if (suppInfo.fv != null) {
					fileVars = suppInfo.fv;
				} else {
					fileVars = suppInfo.v;
				}
			} else {
				fileVars = suppInfo.fv;
			}
			
			// Create supp url
			var suppURL = bookId_path + suppInfo.fn;
			
			if (fileVars == 1) {
				suppURL += "/" + arguments[1] + ".html";
			} else if (fileVars == 2) {
				suppURL += "/" + arguments[1] + "_" + arguments[2] + ".html";
			} else if (fileVars == 3) {
				suppURL += "/" + arguments[1] + "_" + arguments[2] + "_" + arguments[3] + ".html";
			}
			
			px_opensupp(suppURL);
	
		// Otherwise it's an error (this shouldn't happen
		} else {
			console.log("suppAPI.js: Bad supplement type: " + type);
		}
	}

}

var glossaryHistoryArr = new Array();
var lastDefinedTermId = null;		
var indexHistoryArr = new Array();
var searchHistoryArr = new Array();
var searchType = 0;	
var sw = null;
var lastSupp = null;
var searchCalledFromMain = false;
var suppWinPos = 10;
var hw = null;
var SH = new Object();

function OpenSuppWindow(searchString, noEbookBanner) { console.log("sellwood_px: OpenSuppWindow called; this function is not defined in px."); }
function ReloadSuppWindow() { console.log("sellwood_px: ReloadSuppWindow called; this function is not defined in px."); }
function CloseSuppWindow() { console.log("sellwood_px: CloseSuppWindow called; this function is not defined in px."); }
function FocusWindow(w) { console.log("sellwood_px: FocusWindow called; this function is not defined in px."); }
function PrintSuppWindow() { console.log("sellwood_px: PrintSuppWindow called; this function is not defined in px."); }
function KeepSuppWindowOpen() { console.log("sellwood_px: KeepSuppWindowOpen called; this function is not defined in px."); }
function Help(helpURL) { console.log("sellwood_px: Help called; this function is not defined in px."); }
function BringSuppWindowToFront() { console.log("sellwood_px: BringSuppWindowToFront called; this function is not defined in px."); }
function InitializeHistory(which, fn, w) { console.log("sellwood_px: InitializeHistory called; this function is not defined in px."); }
function AddToHistory(which, entry) { console.log("sellwood_px: AddToHistory called; this function is not defined in px."); }
function ReplaceHistory(which, entry) { console.log("sellwood_px: ReplaceHistory called; this function is not defined in px."); }
function GoBack(which) { console.log("sellwood_px: GoBack called; this function is not defined in px."); }
function GoForward(which) { console.log("sellwood_px: GoForward called; this function is not defined in px."); }
function ChangeHistoryLinkState(which, dir, enabled) { console.log("sellwood_px: ChangeHistoryLinkState called; this function is not defined in px."); }
function UpdateHistoryLinks(which) { console.log("sellwood_px: UpdateHistoryLinks called; this function is not defined in px."); }

