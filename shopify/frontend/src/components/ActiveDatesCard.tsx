import React, { useCallback, useState } from "react";
import { ActiveDatesCard as ActiveDates} from "@shopify/discount-app-components";

export function ActiveDatesCard({ onChange, startsAt, endsAt }) {
  const [startTime, setStartTime] = useState(startsAt);
  const [endTime, setEndTime] = useState(endsAt);
  

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
