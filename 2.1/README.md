# Feature Detection

## html
### SVG
inline svg wordt niet ondersteund door oude browsers.
[svg fallbacks](http://developersdev.blogspot.nl/2014/10/svg-fallback-pure-css-can-i-use-part-5.html).

[svg voorbeeld](/html/svg.html)
getest in ie8. Deze methode haalt maar een van de 2 mogelijkheden op.

### srcset
Srcset laat responsive images toe. Maar wordt in veel oudere browser niet ondersteunt. Maar door het gebruik van src attribute is er een makkelijke fallback.

## css

### viewport units
vh en vw worden niet overal ondersteunt. Een makkelijke fallback is om eerst te declareren in eenheden die wel bergrepen worden en deze vervolgens overschijven met een viewport eenheid. 
voorbeeld:
height:20px; 
height:4vh;

### flexbox
flexbox wordt ook niet altijd ondersteund. De meest gebruikte functie van flexbox om elementen naast elkaar te zetten kan worden opgevangen doormiddel van inline-block. dit kan gedeclareert worden zonder flexbox te storen. Inline block is minder fancy maar behoud in de meeste gevallen de bedoelde layout.  