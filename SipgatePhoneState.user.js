// ==UserScript==
// @name 		SipgatePhoneState
// @namespace 	http://www.okadis.de/
// @description	Führt ein automatisches Login durch und zeigt den Telefonstatus als großen Block von Objekten an.
// @version		1.0
// @include		https://secure.live.sipgate.de/
// @match 		https://secure.live.sipgate.de/*
// @author		Lars Kempkens, okadis Consulting GmbH
// ==/UserScript==


/*
 * UserInformation
 * Da sich das Skript selbst einloggen muss,
 * (und ich keine bessere Lösung gefunden habe)
 * müssen hier BenutzerId und Passwort einge-
 * tragen werden.
 */
var userConfig = {};
chrome.extension.sendRequest({method: "getCredentials"}, function(response) {
	userConfig.username = response.email;
	userConfig.password = response.password;
});

// Das Blockobjekt erzeugen wir mit einer Vorschlagsgröße,
// um dann später mit besseren Werten weiterrechnen zu 
// können...
var block = new BlockControl();

var phonestate = {
	
	listOfNodes: null,
	blockControl: null,

	run: function() {
		this.blockControl = new BlockControl();
		this.fixStyles();
		this.loadNodes();
		this.blockControl.setNumberOfBlocks(this.listOfNodes.length);
		this.blockControl.calculate();
		this.setNodePositions();
	},

	fixStyles: function() {
		$('.phoneState_unavailable').removeClass('phoneState_unavailable');
		$('.phoneState_ringing').removeClass('phoneState_ringing');
		$('#internal_pulldown').addClass('open');
		$.each($('div.pulldown_body #pulldown_list_internal li.numberrow a span'), function(i, node) {
			$(node).css('float', 'none');
		});
	},

	loadNodes: function() {
		this.listOfNodes = $('div.pulldown_body #pulldown_list_internal li.numberrow');
	},

	setNodePositions: function() {
		$.each(this.listOfNodes, function(index, node) {
			var jNode = $(node);

			var currentRow = Math.ceil( (index+1) / phonestate.blockControl.getColumnCount() );
			var currentColumn = index - ((currentRow-1) * phonestate.blockControl.getColumnCount());
			var marginLeft = 5;
			var marginTop = 5;

			//move content of LI into container DIV
			jNode.append("<div></div>");
			var container = jNode.children('div');
			jNode.find('a').appendTo(container);

			//give the container the ID of the span
			var numberSpan = jNode.find('div a span'); 
			var id = numberSpan.attr('id');
			numberSpan.removeAttr('id');
			container.attr('id', id);

			jNode.css('position', 'fixed');
			jNode.css('width',phonestate.blockControl.getColumnSize() - marginLeft);
			jNode.css('height', phonestate.blockControl.getRowSize() - marginTop);
			jNode.css('left', currentColumn * phonestate.blockControl.getColumnSize());
			jNode.css('top', (currentRow-1) * phonestate.blockControl.getRowSize());
			jNode.find('div a span').css('font-size', phonestate.blockControl.getRowSize() / 2);
			jNode.find('div a').css('font-size', phonestate.blockControl.getRowSize() / 6);
		});
		
	}
}

/* 
 * Die Klasse kontrolliert die Größe
 * der Blöcke und erlaubt eine Positionierung
 * aller Blöcke mit bestmöglicher Größe
 * in dem gesamten Fenster.
 * Da wir Quader haben wollen, muss nur eine Größe
 * übergeben werden, die für Breite und Höhe in 
 * gleichem Maße gilt. Die Buchstabengröße ist
 * davon ebenfalls abhängig.
 * @param size{int} Breite und Höhe der Blöcke (als Ausgangswert)
 * @param margin{int} Abstand zwischen den Blöcken
 */
function BlockControl() {

	// Anfangswert festlegen
	this.width			= 10;
	this.height			= 10;
	this.fontSize		= 0;
	this.nameFontSize	= 0;

	this.numOfBlocks	= 0;

	this.columns		= 0;
	this.rowSize		= 0;
	this.rowOffset		= 0;

	this.rows			= 0;
	this.columnSize		= 0;
	this.columnOffset	= 0;

	this.viewPortWidth	= document.documentElement.clientWidth;
	this.viewPortHeight	= document.documentElement.clientHeight;

	// Get-Methoden
	this.getWidth		= function() { return this.width; };
	this.getHeight		= function() { return this.height; };
	this.getFontSize	= function() { return this.fontSize; };
	this.getNameFontSize = function() { return this.nameFontSize; };
	this.getColumnCount	= function() { return this.columns; };
	this.getRowOffset	= function() { return this.rowOffset; };
	this.getColumnOffset	= function() { return this.columnOffset; };
	this.getRowSize		= function() { return this.rowSize; };
	this.getColumnSize	= function() { return this.columnSize; };
	this.getRowCount		= function() { return this.rows; };
	this.getViewPortHeight	= function() { return this.viewPortHeight; };
	this.getViewPortWidth	= function() { return this.viewPortWidth; };
	this.getNumberOfBlocks	= function() { return this.numOfBlocks; };


	// Setzt die Anzahl der Blocks, die relevant sind. Diese
	// Anzahl wird dann genutzt, um die Größe und ähnliche 
	// Werte zu berechnen.
	this.setNumberOfBlocks	= function(numOfBlocks) { 
		// Anzahl der Blocks setzen und Neuberechnung der Größe
		// durchführen
		this.numOfBlocks = numOfBlocks;

		// Neuberechnung der abhängigen Daten
		this.calculate(this.getWidth());
	};

	// Berechnung der abhängigen Größen auf Basis
	// der aktuellen Breite/Länge und der Größe
	// des Bildschirms. Wichtig: Die Größe muss
	// bereits den Abstand enthalten
	this.calculate	= function() {
		// Berechnen der Anzahl Spalten und Reihen
		this.calculateGrid();

		// Berechnen der tatsächlichen Länge der Zeile
		this.columnSize = Math.floor(this.getViewPortWidth() / this.getColumnCount());

		// Offset für eine saubere Zentrierung (vertikal)
		this.columnOffset = Math.floor( this.getViewPortWidth() / 2 - this.getColumnSize() / 2);
		
		// Berechnen der tatsächlichen Länge der Zeile
		this.rowSize = Math.floor(this.getViewPortHeight() / this.getRowCount());

		// Offset der Spalten für eine saubere Zentrierung
		// ermitteln
		this.rowOffset = this.getViewPortHeight() / 2 
			       			 - this.getRowSize() / 2;

		// Berechnen der Schriftgröße
		this.fontSize	= Math.floor(this.columnSize * 0.80);
		this.nameFontSize = Math.floor(this.columnSize * 0.10);
	}


	// Berechnet die Anzahl von Spalten, die pro Reihe
	// geliefert werden. Hierfür ist jedoch auch die
	// Anzahl der Blöcke insgesamt interessant.
	this.calculateGrid = function() {
		// Bei einem oder weniger Blöcken ist die 
		// Verteilung klar...
		if (this.getNumberOfBlocks() <= 2) {
			this.columns = 1;
			this.rows = 1;
			return;
		}

		this.columns = Math.ceil( Math.sqrt( this.numOfBlocks ) );
		this.rows = Math.ceil( this.numOfBlocks / this.columns );
	};
}


/* 
 * login
 * Führt ein automatisches Login in der Seite durch. Dieses
 * ist notwendig, wenn es zu einem Autoausuloggen kommt.
 */
function login() {
	// Wir füllen per Skript nun die einzelnen Felder aus:
	var form = document.getElementById('standardlogin');
	if (userConfig.username == undefined || userConfig.password == undefined) { alert('Please set email and password in extension settings'); return;};
	form.username.value = userConfig.username;
	form.password.value = userConfig.password;
	form.autologin.checked = true;
	
	// Nun loggen wir uns direkt ein...
	form.submit();
}

function isLoginForm() {
	return (document.getElementById('standardlogin'));
}

function loginFailed() {
	return (document.getElementsByClassName('failed_login').length > 0);
}

// Wir warten noch einmal fünf Sekunden, bis wir sicher sind, dass 
// auch wirklich alles komplett übernommen wurde und alle Anfangsskripte
// der Seite durchgelaufen sind.
// Erst danach sind wir sicher, dass auch wirklich alles funktioniert
// hat.
var loadedTimer = window.setTimeout(checkLoaded, 100);
function checkLoaded() {
	if (isLoginForm()) {
		if(loginFailed()) {
			alert('Credentials wrong. Please check in settings');
			return;
		}
		// In diesem Fall müssen wir versuchen uns einzuloggen:
		console.log("Login...");
		login();
	}

	if(document.getElementById("pulldown_list_internal").getElementsByClassName("numberrow").length > 0)
	{
		console.log("Building...");
		phonestate.run();
		console.log("Build finished");
//		buildOverview();
	} else {
		loadedTimer = window.setTimeout(checkLoaded, 5000);
	}
};

