import { Router } from "express";
import { authenticate } from "../middleware/isAuthenticated.js";
import { SubmitLeaveRequest } from "../controllers/Employee/SubmitLeaveRequest.js";
import { GetSelfLeaveRequests } from "../controllers/Employee/GetSelfLeaveRequests.js";
import { GetSubordinateLeaveRequests } from "../controllers/Employee/GetSubordinateLeaveRequests.js";
import { PatchLeaveRequest } from "../controllers/Employee/PatchLeaveRequest.js";
import { GetEmployeeProfile } from "../controllers/Employee/GetEmployeeProfile.js";
import { GetLeaveTypes } from "../controllers/Employee/GetLeaveTypes.js";
import { GetLeavePolicies } from "../controllers/Employee/GetLeavePolicies.js";
import { GetHolidaysByYear } from "../controllers/Employee/GetAllHolidays.js";
import { GetAllLeaveBalances } from "../controllers/Employee/GetAllLeaveBalances.js";
import {
  getAllHolidays,
  getApprovedLeaveRequests
} from "../controllers/Employee/HolidayController.js";
import upload from "../middleware/upload.js";
import {
  getPresignedUrl,
  uploadFile
} from "../controllers/Employee/DocumentController.js";

const router = Router();

router.get("/self-leave-request", authenticate, GetSelfLeaveRequests);

router.post("/leave-requests", authenticate, SubmitLeaveRequest);

router.get(
  "/subordinate-leave-request",
  authenticate,
  GetSubordinateLeaveRequests
);

router.patch("/leave-requests/:id", authenticate, PatchLeaveRequest);

router.get("/profile", authenticate, GetEmployeeProfile);

router.get("/leave-types", authenticate, GetLeaveTypes);

router.get("/leave-policies", authenticate, GetLeavePolicies);

router.get("/all-holidays", authenticate, getAllHolidays);

router.get("/approved-leave-requests", authenticate, getApprovedLeaveRequests);

router.get("/holidays/:year", authenticate, GetHolidaysByYear);

router.get("/leave-balances", authenticate, GetAllLeaveBalances);

router.post("/upload", authenticate, upload.single("file"), uploadFile);

router.get("/document/:key", authenticate, getPresignedUrl);

export default router;
