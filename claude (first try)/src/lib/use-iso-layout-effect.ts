"use client"

import * as React from "react"

/*
  Entrance animations hide their targets themselves rather than shipping an
  opacity-0 class, so content stays visible if the script never runs. Doing it
  in a layout effect means the hide lands before paint, with no flash.
*/
export const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect
