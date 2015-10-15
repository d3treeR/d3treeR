#' @import data.tree

# i think I only use asNode.data.frame and as.list
convert_treemap <- function( treemap, rootname = "root" ){
  #  find where attributes start
  attrPos <- match( "vSize", names(treemap) )


  # get rid of factors
  treemap <- as.data.frame(lapply(
    treemap
    ,function(x){
      if(is.factor(x)) {
        as.character(x)
      } else {
        x
      }
    }
  ),stringsAsFactors = F)

  if(attrPos > 2){
    treemap$pathString <- apply(
      treemap[,1:(attrPos-1)]
      ,MARGIN = 1
      ,function(row){
        paste0(
          c( rootname, row[which(!is.na(row))] )
          ,sep = "/~>/" # assume this will not exist
          ,collapse=""
        )
      }
    )
  } else {
    treemap$pathString <- paste(
      rootname
      ,treemap[,1]
      ,sep = "/~>/"
    )
  }

  dt <- as.Node(
    treemap[,-(1:(attrPos-1))]
    ,pathDelimiter = "/~>/"
  )

  # give an id to each node
  dt$Set( id = 1:dt$totalCount )

  # set size = to vSize
  dt$Set( size = dt$Get("vSize") )

  as.list(dt, unname = TRUE, mode = "explicit" )
}
