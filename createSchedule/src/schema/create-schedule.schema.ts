export type TimeSlot = {
  start: string;
  end: string;
};

type DaySchedule = TimeSlot[];

type Schedule = {
  Monday: DaySchedule;
  Tuesday: DaySchedule;
  Wednesday: DaySchedule;
  Thursday: DaySchedule;
  Friday: DaySchedule;
  Saturday: DaySchedule;
  Sunday: DaySchedule;
};

export type CreateSchedule = {
  schedule: Schedule;
  timezone: string;
};

export interface GetScheduleResponse {
  userId: string;
  schedule: Schedule;
  timezone: string;
}

// Reference data
const data = {
  schedule: {
    Monday: [{ start: "09:00", end: "17:00" }],
    Tuesday: [{ start: "13:00", end: "17:00" }],
    Wednesday: [
      { start: "09:00", end: "12:00" },
      { start: "13:00", end: "17:00" },
    ],
    Thursday: [{ start: "09:00", end: "17:00" }],
    Friday: [{ start: "09:00", end: "17:00" }],
    Saturday: [],
    Sunday: [],
  },
  timezone: "America/New_York",
};
