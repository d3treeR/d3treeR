# d3treeR

`d3treeR` is an R htmlwidget for [d3.js](http://d3js.org) treemaps.  It is designed to integrate seamlessly with the R [`treemap`](https://github.com/mtennekes/treemap) package or work with traditional nested JSON hierarchies.

Please see the Building Widgets post [Week 29 | d3treeR v2](http://www.buildingwidgets.com/blog/2015/7/22/week-29-d3treer-v2) for a discussion.

## Quick Examples

### Using `treemap`

```r
library(treemap)
library(d3treeR)

# example 1 from ?treemap
data(GNI2010)
d3tree2(
   treemap(
     GNI2010
     ,index=c("continent", "iso3")
     ,vSize="population"
     ,vColor="GNI"
     ,type="value"
   )
   , rootname = "World"
)
```

### Using `JSON`

```r
library(d3treeR)
d3tree2(
  "http://bl.ocks.org/mbostock/raw/4063269/flare.json"
  , celltext = "name"
)
```
