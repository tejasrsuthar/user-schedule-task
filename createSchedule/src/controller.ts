export class CreateScheduleController {
  constructor() {}

  static getInstance() {
    return new CreateScheduleController();
  }

  validateSchedule() {
    return "validated";
  }

  createSchedule() {
    return "schedule created";
  }
}
