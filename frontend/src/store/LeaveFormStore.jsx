import { atom, selector } from "recoil";

export const leaveFormState = atom({
  key: "leaveFormState",
  default: {
    leaveTypeId: "",
    startDate: new Date(),
    endDate: new Date(),
    leavePeriod: "FullDay",
    startSession: "",
    endSession: "",
    reason: "",
    supportingDoc: "",
    requestedDays: 0
  }
});
export const reasonState = atom({
  key: "reasonState",
  default: ""
});
