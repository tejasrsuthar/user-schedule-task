import { BadRequestError } from "../errors/badRequest.error";
import { CreateSchedule } from "../schema/create-schedule.schema";
import { listTimeZones } from "timezone-support";
import { logger } from "./logger";
import moment from "moment-timezone";

export const validateSchedule = (schedule: CreateSchedule) => {
  logger.info("validateSchedule:", schedule);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timeFormat = "HH:mm";

  // Check for invalid days or overlapping times
  for (let day of Object.keys(schedule)) {
    if (!daysOfWeek.includes(day)) {
      throw new BadRequestError(`Invalid day: ${day}`);
    }

    const periods = schedule[day];
    for (let period of periods) {
      const { start, end } = period;

      if (
        !moment(start, timeFormat, true).isValid() ||
        !moment(end, timeFormat, true).isValid()
      ) {
        throw new BadRequestError(`Invalid time format for the day: ${day}`);
      }

      if (moment(start, timeFormat).isAfter(moment(end, timeFormat))) {
        throw new BadRequestError(
          `Start time should be before end time for the day: ${day}`
        );
      }
    }

    // Check for overlapping time periods
    for (let i = 0; i < periods.length - 1; i++) {
      const end = moment(periods[i].end, timeFormat);
      const nextStart = moment(periods[i + 1].start, timeFormat);

      if (end.isAfter(nextStart)) {
        throw new BadRequestError(`Overlapping times for day: ${day}`);
      }
    }
  }
};

export const validateTimezone = (timezone: string) => {
  logger.info("validateTimezone:", timezone);
  const timeZones = listTimeZones();

  if (!timeZones.includes(timezone)) {
    throw new BadRequestError("Invalid Timezone");
  }
};
