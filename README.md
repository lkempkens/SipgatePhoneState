# SipgatePhoneState # 

## Wichtiger Hinweis ##

Dies ist keine offizielle Software von Sipgate!

## Beschreibung ##

Ermittelt den aktuellen Status (wird angerufen, telefoniert) der angeschlossenen Telefone an 
einer virtuellen Telefonanlage von Sipgate.

## Hintergrund ##

Als Kunde von Sipgate mit dem Produkt Sipgate Team wünschten wir uns eine Übersicht über den Status 
aller angeschlossenen Telefone - so, wie es zuvor bei unserer lokalen Telefonanlage auch möglich war.
In dem Portal, welches Sipgate jedem Benutzer zur Verfügung stellt, ist eine solche Übersicht vorhanden,
die auch in Echtzeit den Status der Durchwahlen anzeigt.
Die vorhandene API bietet eine solche Anzeige derzeit leider noch nicht. Hieraus wuchs die Idee,
das Portal f�r alle Mitarbeiter so darzustellen, dass der Fokus auf den Telefonstatus liegt.

## Aufbau ##

Als Basis dient ein ausgemustertes Notebook, welches mit einer aktuellen Ubuntu Desktopversion 
versehen wurde. Statt Firefox wurde Chrome installiert. 
Unity wurde so konfiguriert, dass der (einzige) Benutzer direkt angemeldet wird und beim Hochfahren
chrome im Kioskmodus mit der Sipgate Login Seite gestartet wird:

  chrome --kiosk https://secure.live.sipgate.de
  
Die hier im Repository angehängte css Datei wird in das Verzeichnis "User Stylesheets" von chrome eingefügt (sie ersetzt oder ergänzt die Datei Custom.css), welches normalerweise unter 
  
  ~<benutzername>/.config/google-chrome/Default/User\ StyleSheets
  
liegt.

Die im Repository beiligende Javascript Datei ergänzt das User Stylesheet und kümmert sich um das automatische Einloggen und das Plazieren der Elemente. Es handelt sich dabei um eine Javascript-Datei, die als Extension nach Chrome installiert wird (hierzu die Javascript Datei einfach auf die Adresszeile von Chrome ziehen und den Abfragen folgen). Vor der Installation ist es auf jeden Fall notwendig, dass die Logindaten des Abfragebenutzers in das Skript eingetragen werden.
(Siehe folgenden Auszug aus der JavaScriptdatei)


[...]

/*
 * UserInformation
 * !!!!! Die folgenden Informationen müssen ausgetauscht werden !!!!!!
 * Da sich das Skript selbst einloggen muss,
 * (und ich keine bessere Lösung gefunden habe)
 * müssen hier BenutzerId und Passwort einge-
 * tragen werden.
 */
userConfig ## {};
userConfig.mainUserId = '1234567';
userConfig.username = 'anybody@unknown.org';
userConfig.password = 'wirklich_schwieriges_passwort';

[...]

Hierbei steht 
- userConfig.mainUserId für die eigene SipGate Kundennummer
- userConfig.username   für den Loginnamen eines eigenen Benutzers, mit dem der Telefonstatus überwacht werden soll
- userConfig.password   Passwort des Benutzers, der den Telefonstatus überwachen soll.

Viel Spa�!