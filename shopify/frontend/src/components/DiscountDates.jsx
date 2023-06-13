const [startTime, setStartTime] = useState("2022-06-13T04:30:00.000Z");
const [endTime, setEndTime] = useState("2022-06-14T03:30:00.000Z");

<ActiveDatesCard
startDate={{
    value: startTime,
    onChange: setStartTime,
}}
endDate={{
    value: endTime,
    onChange: setEndTime,
}}
timezoneAbbreviation="EST"
/>
