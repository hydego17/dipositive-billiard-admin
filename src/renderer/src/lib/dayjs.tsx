import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import duration from "dayjs/plugin/duration"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import localizedFormat from "dayjs/plugin/localizedFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import isToday from "dayjs/plugin/isToday"

// Setup Day.js
dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(isToday)

export function DayJsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
