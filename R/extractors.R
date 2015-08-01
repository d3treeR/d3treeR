#' Extract Legends from Treemap
#'
#' @importFrom grid grid.grep
#' @importFrom gridSVG grid.export
#' @importFrom XML saveXML xpathSApply

extract_legend <- function( ){
  # assume that the current grid is our treemap
  #  this should not be too far-fetched considering the treemap
  #  is redrawn with d3tree( treemap(...) )

  # let's first check to see if a legend was drawn by treemap
  if(!is.null(grid::grid.grep(".*legend.*",viewports=T,grep=T,no.match=NULL))) {
    suppressWarnings(
      XML::xpathSApply(
        gridSVG::grid.export(name=NULL)$svg
        ,"*/*/*[local-name()='g' and starts-with(@id,'legend')]"
        ,XML::saveXML
      )
    )
  }
}
