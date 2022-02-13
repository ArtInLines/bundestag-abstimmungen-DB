# Bundestags Abstimmungen Datenbank

Eine Datenbank für alle Abstimmungen des Bundestag und dazugehörenden Auswertungen der Daten.

Die Daten wurden via Webscraping von [bundestag.de](https://www.bundestag.de) genommen. Diese Daten wurden von den ursprünglichen Excel-Dateien zu einer großen CSV-Datei geschmelzt, die alle Daten hält.

Es gibt 2 Ideen, diese Daten zu nutzen

1. Netzwerkanalyse
2. Datenbank + Nutzerinterface

## Netzwerkanalys

Für eine Netzwerkanalyse, könnte untersucht werden, wie oft spezielle Personen gleich abgestimmt haben. Weiter könnte auch eine relative Angabe über die Ähnlichkeit der Abstimmungsverhlaten unterschiedlicher Parteien gemacht werden.

Für eine solche Netzwerkanalyse, wäre eine "Edgelist" / "Adjacency-Node-List" sinnvoll. Eine solche EdgeList würde das folgende Format annehmen:

```CSV
Abgeordnete(r)1, Abgeordnete(r)2, n=Anzahl der Übereinstimmenden Wahlen
Abgeordnete(r)1, Abgeordnete(r)3, n=Anzahl der Übereinstimmenden Wahlen
Abgeordnete(r)2, Abgeordnete(r)3, n=Anzahl der Übereinstimmenden Wahlen
.
.
.
```

## Datenbank + Nutzerinterface

Die Datenbank würde die Daten genereller seperieren. Dementsprechend würde es Sinn ergeben mehrere Daten "schemas" zu haben, z.B. zu Abgeordneten, Parteien, Abstimmungen. Um Datendopplung zu vermeiden, würde sich eine "relational" Datenbank besonders anbieten.

Manuell könnte noch eine weitere Kategorie in die Daten eingefügt werden, bezüglich der groben Tehemenbereiche der Abstimmungen. Das würde es ermöglichen aus den Daten zu erlesen, in welchen Bereichen speziell, Parteien/Abgeordnete besonders häufig gleich abstimmen.

Ein Interface könnte Nutzern die Möglichkeit geben spezifische Parteien bzw. Abgeordnete miteinander zu vergleichen.
