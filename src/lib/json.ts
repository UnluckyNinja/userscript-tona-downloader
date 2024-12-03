export interface Root {
  readableProduct: ReadableProduct
}

export interface ReadableProduct {
  finishReadingNotificationUri: any
  hasPurchased: boolean
  id: string
  imageUrisDigest: string
  isPublic: boolean
  nextReadableProductUri: any
  number: number
  pageStructure: PageStructure
  permalink: string
  pointGettableEpisodeWhenCompleteReading: any
  prevReadableProductUri: string
  publishedAt: string
  series: Series
  showSquareThumbnailInRecommendation: boolean
  title: string
  toc: any
  typeName: string
}

export interface PageStructure {
  choJuGiga: string
  pages: Page[]
  readingDirection: string
  startPosition: string
}

export interface Page {
  type: string
  linkPosition?: string
  contentStart?: string
  height?: number
  src?: string
  width?: number
  contentEnd?: string
}

export interface Series {
  id: string
  thumbnailUri: string
  title: string
}
