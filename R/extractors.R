#' Extract Legends from Treemap
#'
#' @importFrom gridSVG grid.export
#' @importFrom XML saveXML xpathSApply

extract_legend <- function( ){
  # assume that the current grid is our treemap
  #  this should not be too far-fetched considering the treemap
  #  is redrawn with d3tree( treemap(...) )
  suppressWarnings(
    XML::xpathSApply(
      gridSVG::grid.export(name=NULL)$svg
      ,"*/*/*[local-name()='g' and starts-with(@id,'legend')]"
      ,XML::saveXML
    )
  )
}
