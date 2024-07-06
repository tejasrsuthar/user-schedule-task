import * as yup from "yup";

// Get the list of valid IANA timezones
const { listTimeZones } = require("timezone-support");
const validTimezones = listTimeZones();

// Define the time format regex
const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Define the time slot schema
const timeSlotSchema = yup.object().shape({
  start: yup
    .string()
    .matches(timeFormatRegex, "Invalid time format, should be HH:mm")
    .required(),
  end: yup
    .string()
    .matches(timeFormatRegex, "Invalid time format, should be HH:mm")
    .required(),
});

// Define the daily schedule schema
const dailyScheduleSchema = yup.array().of(timeSlotSchema).required();

// Define the weekly schedule schema with required days
const weeklyScheduleSchema = yup
  .object()
  .shape({
    Monday: dailyScheduleSchema.required(),
    Tuesday: dailyScheduleSchema.required(),
    Wednesday: dailyScheduleSchema.required(),
    Thursday: dailyScheduleSchema.required(),
    Friday: dailyScheduleSchema.required(),
    Saturday: dailyScheduleSchema.required(),
    Sunday: dailyScheduleSchema.required(),
  })
  .required();

// Define the main schema
export const updateScheduleSchema = yup.object().shape({
  schedule: weeklyScheduleSchema.required(),
  timezone: yup
    .string()
    .oneOf(validTimezones, "Invalid timezone")
    .required("timezone field is required"),
});

export type UpdateSchedule = yup.InferType<typeof updateScheduleSchema>;
