# SipgatePhoneState

## Wichtiger Hinweis

Dies ist keine offiziell supportete Software von Sipgate!

## Beschreibung

Ermittelt den aktuellen Status (wird angerufen, telefoniert) der angeschlossenen Telefone an 
einer virtuellen Telefonanlage von Sipgate.

## Hintergrund

Als Kunde von Sipgate mit dem Produkt Sipgate Team wünschten wir uns eine Übersicht über den Status 
aller angeschlossenen Telefone - so, wie es zuvor bei unserer lokalen Telefonanlage auch möglich war.
In dem Portal, welches Sipgate jedem Benutzer zur Verfügung stellt, ist eine solche Übersicht vorhanden,
die auch in Echtzeit den Status der Durchwahlen anzeigt.
Die vorhandene API bietet eine solche Anzeige derzeit leider noch nicht. Hieraus wuchs die Idee,
das Portal für alle Mitarbeiter so darzustellen, dass der Fokus auf den Telefonstatus liegt.

## Installation

Noch ist die Extension keine offiziell supportete Extension, und somit nicht über die Google Extensionsuche zu finden.

Installation ist nur über die Developerübersicht in Chrome möglich:

* Über Tools->Extensions die Extensionsübersicht öffnen
* Im oberen Teil der Seite "Developer mode" aktivieren
* Über den Button "Load unpacked extension..." den Ordner der Extension aussuchen.
* Beim ersten Start öffnet sich das optionsmenü. Hier müssen zwingend die Usercredentials eingetragen werden.
* Beim besuch der sipgate Team Seite wird jetzt der Account automatisch eingeloggt und das Besetztlampengfeld gestartet.

## TODO

* Settings