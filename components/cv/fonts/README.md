# CV paper fonts

Static, Latin-subset instances used only by the print CV (`../CvPaper.tsx`).

| File | Source | Instance |
| --- | --- | --- |
| `archivo-700-68.woff2` | Archivo variable font | wght 700, wdth 68 (the name) |
| `archivo-700-80.woff2` | Archivo variable font | wght 700, wdth 80 (role, headings) |
| `plexsans-400.woff2` | IBM Plex Sans variable font | wght 400, wdth 100 (body) |
| `plexsans-600.woff2` | IBM Plex Sans variable font | wght 600, wdth 100 (titles) |

Why static: Chromium embeds a variable font in a PDF as Type 3 glyphs, which
some older applicant-tracking parsers cannot read. Static fonts embed as
TrueType.

The Plex instances are renamed "CV Text" inside the file: the IBM Plex licence
reserves the name "Plex" for unmodified fonts, and a subset is a modification.

Both fonts are under the SIL Open Font License 1.1 — see `OFL-Archivo.txt` and
`OFL-IBMPlexSans.txt`.

Regenerate with fontTools (`pip install fonttools brotli`) from the variable
TTFs in google/fonts (`ofl/archivo`, `ofl/ibmplexsans`):

```python
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

UNI = "U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+2010-2027,U+2030-203A,U+20A6,U+20AC,U+2122,U+2190-2193,U+2212"
font = instantiateVariableFont(TTFont("Archivo[wdth,wght].ttf"), {"wght": 700, "wdth": 68})
opts = subset.Options(); opts.flavor = "woff2"; opts.layout_features = ["*"]; opts.name_IDs = ["*"]
sub = subset.Subsetter(opts); sub.populate(unicodes=subset.parse_unicodes(UNI)); sub.subset(font)
font.flavor = "woff2"; font.save("archivo-700-68.woff2")
```
