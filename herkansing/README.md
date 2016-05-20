# Browser Technologie

## Use Case: Ik wil samen met mijn vriendin, Roxy achter de Proxy, een spelletje pong spelen.
Het doel is om vermaakt te worden doormiddel van een spelletje pong. Waarbij de enhanced versie Multi touch gebruikt.

## HTML
Een game vereist interactiviteit om te spelen maar op het web is hieroor javascript nodig. Dus zette ik een stap terug met de html only pagina. Hoe kan ik de gebruikers helpen om pong te spelen en hoe zorg ik ervoor dat ze vermaakt worden. Mijn oplossing hiervoor was om een lachwekkend Imaginary Pong Formulier te maken. Hierop kan de gebruiker zijn score bijhouden en via radio buttons de positie van de bal. En met de sleepbare text area een positie van het batje. 

De text area zijn niet uit te schuiven in IE en de radiobuttons doen het ook niet goed. In andere browsers gaat dit wel goed.

Andere mogelijkheid die ik te laat bedacht was een turnbased pong met behulp van php en html formulieren.

## CSS
Met css erbij komen er al wat meer mogelijkheden. Voorgaande Html wordt verwijderd en vervangen door een pong veldt. Helaas is deze nog niet interactief. Er bestaan we enige mogelijkheidheden voor interactie met behulp van keyframe animaties en hovers. [css only pong](https://www.sitepoint.com/css3-pong-insane-things-to-do-with-css/) Dit artikel heb ik uitgebreid bekeken en mee geexperimenteerd om te kijken of ik de problemen met deze versie kon oplossen. Uiteindelijk heb ik besloten dat deze gelimiteerde versie van pong te veel problemen had om zoveel moeite in te stoppen en het niet gebruiksvriendelijker gemaakt kon worden.

## Javascript
Als javascript het doet kan er toch echt pong gespeeld worden. Met multitouch op apparaten die dat kunnen. Touch wordt door niet veel browsers ondersteund. Daarom heb ik meerdere systemen om de batjes te besturen. Zo ook multi keyboard ondersteuning. De standaard keyboard events kunnen maar een keypress tegelijk aan. De functie die ik gevonden heb slaat de keydown events op en verwijderd ze na een key up. Op deze manier kunnen meerdere keypreses gebruikt worden om de twee batjes te besturen. Er kan ook met muisevents worden bestuurd. Muisclicks zetten een target voor de batjes om naar toe te gaan. Door te kijken aan welke kant van het veld de click plaats vindt bepaal ik welke speler het was. Voor de multitouch wordt ook elk event opgeslagen dit is omdat safari de touch events niet goed ondersteunt.  
![alt](/canitouch.png)


[live versie](http://jaimiederijk.nl/browsertech/)

## Andere interresante pong
[browser pong](http://stewd.io/pong/)