#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
d3tree <- function(data = NULL, rootname = NULL, width = NULL, height = NULL) {

  meta = NULL

  # accept treemap
  if( inherits(data,"list" ) && names(data)[1] == "tm" ){
    meta = data[-1]
    data = convert_treemap(
      data$tm
      , ifelse(!is.null(rootname),rootname,deparse(substitute(data)))
    )
  }

  # accept data.frame

  # accept data.tree

  # accept JSON string

  # accept list

  # forward options using x
  x = list(
    data = data
    ,meta = meta
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'd3tree',
    x,
    width = width,
    height = height,
    package = 'd3treeR'
  )
}

#' Widget output function for use in Shiny
#'
#' @export
d3treeOutput <- function(outputId, width = '100%', height = '400px'){
  shinyWidgetOutput(outputId, 'd3tree', width, height, package = 'd3treeR')
}

#' Widget render function for use in Shiny
#'
#' @export
renderD3tree <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, d3treeOutput, env, quoted = TRUE)
}
