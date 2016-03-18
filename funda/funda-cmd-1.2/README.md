# funda-cmd
project1 funda

## browser technologies opdracht 1.2

## afbeeldingen
alleen afbeeldingen binnen halen die passen op het scherm. deze optie is er bij de funda api.
het draait bij deze app wel om de afbeeldingen dus geen afbeeldingen is geen optie.
Dit kan bijvoorbeeld met srcset.
```
<picture>
    <source srcset="{{ FotoLargest }}" media="(min-width: 1280px)">
    <source srcset="{{ FotoLarge }}" media="(min-width: 800px)">
    <source srcset="{{ FotoMedium }}" media="(min-width: 320px)">
    <img src="{{ Foto }}" alt="afbeelding van het huis">    
</picture>
```
## fonts
gebruik fallback fonts.
font-family:'open sans','Helvetica','Sans-Serif';

## geen javascript
zonder javascript geen data en dus geen content. gebruik waarchuwing.
In html een waarschuwing geplaatst en deze vervolgens weggehaald met javascript dus wanneer js het niet doet wordt de waarschuwing ook niet weggehaald.

```
    <section id="javascript">
        <h2>please enable Javascript</h2>
        <a href="http://www.enable-javascript.com/">How to</a>
    </section>
```

## kleur
goed contrast gebruiken. Test doormiddel van plugins die kleuren uitzetten.

## breedband
afbeeldingen komen langzaam binnen. spinner ofzo gebruiken. worden nu in een goede volgorde ingeladen.

## hotspots
https gebruiken.

## content blocker
verander beranglijke plaatjes wannneer het kan in inline svg. Deze worden dan niet geblokeerd.

## localstorage
Zet de user setting ook in een database op de server. wannneer localstorage het niet doet haal je daar de informatie vandaan.

## Screenreader
euro teken &euro; in de tekst prijs verandert.

## muis
Tabindex op de buttons en focus style en een goede html flow.



