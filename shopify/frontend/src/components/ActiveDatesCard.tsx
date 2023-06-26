import React, { useCallback, useState } from "react";
import { ActiveDatesCard as ActiveDates} from "@shopify/discount-app-components";

export interface ActiveDatesCardProps{
    onChange: (startsAt: string, endsAt: string) => void
    startsAt: string
    endsAt: string
}

export function ActiveDatesCard(props: ActiveDatesCardProps) {
  const [startTime, setStartTime] = useState(props.startsAt)
  const [endTime, setEndTime] = useState(props.endsAt)
  const onChange = props.onChange

  const setStartsAt = useCallback(
    (start: string) => {
        setStartTime(start)
        onChange(start, endTime)
    },
    [startTime],
  );

  const setEndsAt = useCallback( 
    (end: string) => {
        setEndTime(end)
        onChange(startTime, end)
        },
    [endTime],
  );

  return (
    <ActiveDates
      startDate={{
        value: startTime,
        onChange: setStartsAt,
      }}
      endDate={{
        value: endTime,
        onChange: setEndsAt,
      }}
      timezoneAbbreviation="UTC"
    />
  );
}
