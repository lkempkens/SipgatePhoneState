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
userConfig.username = 'username@example.org';
userConfig.password = 'password';

// Das Blockobjekt erzeugen wir mit einer Vorschlagsgröße,
// um dann später mit besseren Werten weiterrechnen zu 
// können...
var block = new BlockControl();

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
	form.username.value = userConfig.username;
	form.password.value = userConfig.password;
	form.autologin.checked = true;
	
	// Nun loggen wir uns direkt ein...
	form.submit();
}



/*
 * toPx
 * Gibt einen Wert als Pixel-String für die 
 * Styleangaben wieder zurück
 */
function toPx(value) {
	return value.toString() + "px";
}


/* 
 * buildOverview
 * wir bauen jetzt eine eigene Übersicht über alle
 * vorhandenen Telefone auf, in dem wir uns nach
 * Objekten umschauen, die vom Typ LI sind und die
 * von der ID auf die von uns gesuchte ID passen.
 * Diese Einträge kopieren wir dann mit einer anderen
 * Kennung. Wahrscheinlich wird das dann auch dazu führen,
 * dass die Darstellung automatisch angepasst wird.	 
 */
function buildOverview() {
	// Die Status der Telefone liegen direkt hierdrin
	var phoneStateId = "phoneState-";
	
	// Die Telefonnummern sind in einzelne SPAN Feldern enthalten,
	// die wir nun stück für stück ausblenden...
	var elements = document.getElementsByTagName('span');
	var relElements = new Array();
	
	for (var i=0; i < elements.length; i++) {
		if (phoneStateId == elements[i].id.substring(0,phoneStateId.length)) {
			var element = elements[i];
			// Elemente ohne Namen ignorieren
			if(element.parentNode.textContent == element.textContent) {
				continue;
			}
			// Nun löschen wir als erstes den Eintrag mit dieser Id und setzen 
			// einen neuen Eintrag ein, welcher als DIV Eintrag auf dem nächsten 
			// Objekt passt.
			relElements.push(element);
		}
	}

	// Nun bereiten wir zunächst unsere Blockverteilung auf die
	// Anzahl der zu bearbeitenden Elemente vor
	block.setNumberOfBlocks(relElements.length);

	for (var i=0; i < relElements.length; i++) {
		exchangeElement(relElements[i], i);
	}
	

	// Das bereits bestehende Logo müssen wir nun
	// noch direkt unter das Bodyelement schieben,
	// da es nur da noch angezeigt wird. 
	var logo = document.getElementById('logo');
	logo.parentNode.removeChild(logo);
	document.getElementsByTagName('body')[0].appendChild(logo);

	var header = document.getElementById('header');
	header.parentNode.removeChild(header);
};
 
 
/*
 * Austausch der Elemente. Da die Elemente direkt durch Javascript
 * beim Klingeln ihre neue Klasse erhalten, tauschen wir die ursprünglichen
 * Elemente anhand ihrer ID gegen unsere neuen Elemente aus.
 */
function exchangeElement(element, count) {
	// Zunächst lesen wir den ursprünglichen Inhalt des Elements aus, 
	// dieses enthült nämlich die relevanten Nummer.
	var phoneNumber = element.firstChild.data;
	var id = element.id;
	// Das Elternelement ist eine Link (<a>) mit der Telefonnummer (Durchwahl)
	// und dem eigentlichen Namen des Ziels
	var parent = element.parentNode;
	
	// Im nächsten Schritt löschen wir das Element, welches bereits 
	// vorhanden war:
	parent.removeChild(element);

	if(parent.firstChild == null)
	{
		return;
	}

	var userName = parent.firstChild.data;
	
	var nElement = document.createElement("div");
	nElement.id 		= id;
	nElement.className 	= "okaPhoneState";

	var currentRow = Math.ceil( (count+1) / block.getColumnCount() );
	var currentColumn = count - ((currentRow-1) * block.getColumnCount());

	var textElement		= document.createElement("div");
	textElement.className = "okaPhoneStateText";
	var nTextElement 	= document.createTextNode(phoneNumber);
	textElement.appendChild(nTextElement);
	nElement.appendChild(textElement);
	document.getElementsByTagName("body")[0].appendChild(nElement);
	
	// Nun erzeugen wir noch ein span Objekt, in das wir den Namen packen:
	var nameElement = document.createElement("div");
	nameElement.className = "okaPhoneStateName";
	nameElement.style.fontSize = toPx(block.getNameFontSize());
	nameElement.appendChild(document.createTextNode(userName));
	nElement.appendChild(nameElement);

	var marginLeft = parseInt(document.defaultView.getComputedStyle(nElement, null).getPropertyValue("margin-left"), 10);
	var marginTop = parseInt(document.defaultView.getComputedStyle(nElement, null).getPropertyValue("margin-top"), 10);

	nElement.style.width	= toPx(block.getColumnSize() - marginLeft);
	nElement.style.height 	= toPx(block.getRowSize() - marginTop);
	nElement.style.left 	= toPx(currentColumn * block.getColumnSize());
	nElement.style.top  	= toPx((currentRow-1) * block.getRowSize());
	nElement.style.fontSize = toPx(block.getRowSize() / 2);
}

// Wir warten noch einmal fünf Sekunden, bis wir sicher sind, dass 
// auch wirklich alles komplett übernommen wurde und alle Anfangsskripte
// der Seite durchgelaufen sind.
// Erst danach sind wir sicher, dass auch wirklich alles funktioniert
// hat.
var loadedTimer = window.setTimeout(checkLoaded, 100);
function checkLoaded() {
	if (document.getElementById('standardlogin')) {
		// In diesem Fall müssen wir versuchen uns einzuloggen:
		console.log("Login...");
		login();
	}

	if(document.getElementById("pulldown_list_internal").getElementsByClassName("numberrow").length > 0)
	{
		console.log("Building...");
		buildOverview();
	} else {
		loadedTimer = window.setTimeout(checkLoaded, 5000);
	}
};

