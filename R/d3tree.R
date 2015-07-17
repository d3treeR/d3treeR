#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
d3tree <- function(message, width = NULL, height = NULL) {

  # forward options using x
  x = list(
    message = message
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
