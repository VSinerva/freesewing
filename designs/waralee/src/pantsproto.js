export default function (part) {
  let { options, measurements, Point, Path, points, paths, store } = part.shorthand()

  let seatDepth = (measurements.crotchDepth /* - measurements.waistToHips */) * (1 + options.waistRaise)
  let circumference = measurements.seat
  let circumference4 = circumference / 4
  let hem = measurements.inseam * options.hemWidth
  let waistBand = measurements.inseam * options.waistbandWidth
  store.set('waistBand', waistBand )
  store.set('hem', hem )

  points.mWaist = new Point(0, 0)

  let waist = (typeof measurements.waist) == 'undefined' ? measurements.seat : measurements.waist
  let waistBack = (typeof measurements.waistBack) == 'undefined' ? waist /2 : measurements.waistBack

  points.mHip = points.mWaist.shift(270, seatDepth)

  points.fWaistSide = points.mWaist
    .shift(180, options.crotchFront * circumference4)
    .shift(90, store.get('waistBand'))
  points.fWaistCrotchCP = points.fWaistSide.shift(
    270,
    seatDepth * options.crotchFactorFrontVer + store.get('waistBand')
  )
  points.fHipCrotchCP = points.mHip.shift(
    180,
    options.crotchFront * circumference4 * options.crotchFactorFrontHor
  )

  points.fHipSide = points.mHip.shift(180, options.crotchFront * circumference4)

  points.bWaistSide = points.mWaist
    .shift(0, options.crotchBack * circumference4)
    .shift(90, store.get('waistBand'))
    .shift(90, options.backRaise * seatDepth)
  points.bWaistCrotchCP = points.bWaistSide.shift(270, seatDepth * options.crotchFactorBackVer)
  points.bHipCrotchCP = points.mHip.shift(
    0,
    options.crotchBack * circumference4 * options.crotchFactorBackHor
  )

  points.bHipSide = points.mHip.shift(0, options.crotchBack * circumference4)

  points.fCutOutHip = (new Path().move(points.fWaistSide)
  .curve(points.fWaistCrotchCP, points.fHipCrotchCP, points.mHip)).shiftAlong(measurements.waistToHips +hem)
  points.bCutOutHip = (new Path().move(points.bWaistSide)
  .curve(points.bWaistCrotchCP, points.bHipCrotchCP, points.mHip)).shiftAlong(measurements.waistToHips +hem)

  let waistSeatDifferenceBack = measurements.seat /2 -waistBack
  let waistSeatDifferenceFront = measurements.seat /2 -(waist -waistBack)

  points.bWaistAdjusted = points.bWaistSide.shift(0, waistSeatDifferenceBack *options.backWaistAdjustment)
  points.fWaistAdjusted = points.fWaistSide.shift(180, waistSeatDifferenceFront *options.frontWaistAdjustment)

  points.mLeg = points.mHip.shift(270, measurements.inseam * (1 - options.legShortening))
  points.fLegSide = points.mLeg.shift(180, options.crotchFront * circumference4)
  points.bLegSide = points.mLeg.shift(0, options.crotchBack * circumference4)

  points.fWaistFront = points.fWaistSide.shift(180, circumference4)
  points.fWaistFrontOverlap = points.fWaistFront.shift(180, options.waistOverlap * circumference4)
  points.fHipFront = points.fHipSide.shift(180, circumference4)
  points.fHipFrontOverlap = points.fHipFront.shift(180, options.waistOverlap * circumference4)
  points.fLegFront = points.fLegSide.shift(180, circumference4)
  points.fLegFrontOverlap = points.fLegFront.shift(180, options.waistOverlap * circumference4)

  points.mWaist1 = new Point(points.mWaist.x, points.fWaistSide.y)
  points.mWaist2 = new Point(points.mWaist.x, points.bWaistSide.y)


  // Calculate the distance we need to move horizontally to get to the point that will
  // diagonally be the distance we're looking for (circumference/4)
  let bHorDistance = Math.sqrt(
    circumference4 * circumference4 - options.backRaise * seatDepth * options.backRaise * seatDepth
  )
  // Create a point that is this distance from the side.
  points.bWaistBack = points.mWaist
    .shift(90, waistBand)
    .shift(0, options.crotchBack * circumference4 + bHorDistance)

  points.bWaistBackOverlap = points.bWaistBack.shift(0, options.waistOverlap * circumference4)

  points.bHipBack = points.bHipSide.shift(0, circumference4)
  points.bHipBackOverlap = points.bHipBack.shift(0, options.waistOverlap * circumference4)
  points.bLegBack = points.bLegSide.shift(0, circumference4)
  points.bLegBackOverlap = points.bLegBack.shift(0, options.waistOverlap * circumference4)

  points.bWaistSideTemp = points.bWaistSide.shift(0, 2) // This is a trick to make the offset() call work. Without it, the offset is crossing the cutout line.

  paths.waistBack = new Path()
    .move(points.bWaistBackOverlap)
    .line(points.bWaistBack)
    .line(points.bWaistSideTemp) // This is a trick to make the offset() call work. Without it, the offset is crossing the cutout line.
    .line(points.bWaistSide)
    .setRender(false)
  paths.waistFront = new Path()
    .move(points.fWaistSide)
    .line(points.fWaistFront)
    .line(points.fWaistFrontOverlap)
    .setRender(false)
  paths.front = new Path()
    .move(points.fWaistFrontOverlap)
    .line(points.fHipFrontOverlap)
    .line(points.fLegFrontOverlap)
    .setRender(false)
  paths.back = new Path()
    .move(points.bLegBackOverlap)
    .line(points.bHipBackOverlap)
    .line(points.bWaistBackOverlap)
    .setRender(false)
  paths.leg = new Path().move(points.fLegFrontOverlap).line(points.bLegBackOverlap).setRender(false)
  paths.cutout = new Path()
    .move(points.bWaistSide)
    .curve(points.bWaistCrotchCP, points.bHipCrotchCP, points.mHip)
    .curve(points.fHipCrotchCP, points.fWaistCrotchCP, points.fWaistSide)
    .setRender(false)
  paths.cutout2 = new Path()
    .move(points.bWaistAdjusted)
    .curve(points.bWaistCrotchCP, points.bHipCrotchCP, points.mHip)
    .curve(points.fHipCrotchCP, points.fWaistCrotchCP, points.fWaistAdjusted)
    .attr('class', 'lining')
    .setRender(true)

  paths.seam = paths.waistFront
    .join(paths.front)
    .join(paths.leg)
    .join(paths.back)
    .join(paths.waistBack)
    .join(paths.cutout)
    .close()
    .attr('class', 'fabric')
  if (options.frontPocket) {
    points.frontPocketTop = points.fWaistSide
      .shift(
        270,
        options.frontPocketVerticalOffset * (measurements.crotchDepth /*- measurements.waistToHips*/) +
          waistBand * 2
      )
      .shift(180, options.frontPocketHorizontalOffset * measurements.seat)

    points.frontPocketTop2 = points.frontPocketTop.shift(340, 12)
    points.frontPocketBottom = points.frontPocketTop.shift(
      250,
      options.frontPocketSize * (measurements.crotchDepth /*- measurements.waistToHips*/)
    )
    points.frontPocketBottom2 = points.frontPocketBottom.shift(340, 12)

    paths.frontPocket = new Path()
      .move(points.frontPocketTop)
      .line(points.frontPocketBottom)
      .line(points.frontPocketBottom2)
      .line(points.frontPocketTop2)
      .close()
      .attr('class', 'fabric')
      .setRender( false )
  }

  if (options.backPocket) {
    points.backPocketRight = points.bWaistBack
      .shiftTowards(points.bWaistSide, options.backPocketHorizontalOffset * measurements.seat)
      .shift(
        270,
        options.backPocketVerticalOffset * (measurements.crotchDepth /*- measurements.waistToHips*/) +
          waistBand * 2
      )
    points.backPocketLeft = points.bWaistBack
      .shiftTowards(
        points.bWaistSide,
        options.backPocketHorizontalOffset * measurements.seat +
          options.backPocketSize * (measurements.crotchDepth /*- measurements.waistToHips*/)
      )
      .shift(
        270,
        options.backPocketVerticalOffset * (measurements.crotchDepth /*- measurements.waistToHips*/) +
          waistBand * 2
      )
    points.backPocketRight2 = points.backPocketRight.shift(
      points.backPocketRight.angle(points.backPocketLeft) + 90,
      12
    )
    points.backPocketLeft2 = points.backPocketLeft.shift(
      points.backPocketLeft.angle(points.backPocketRight) - 90,
      12
    )

    paths.backPocket = new Path()
      .move(points.backPocketLeft)
      .line(points.backPocketLeft2)
      .line(points.backPocketRight2)
      .line(points.backPocketRight)
      .close()
      .attr('class', 'fabric')
      .setRender( false )
  }

  // part.render = false

  return part
}
