import { Router } from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import { GetAllEmployees } from "../controllers/Admin/GetAllEmployees.js";
import { GetEmployeeByID } from "../controllers/Admin/GetEmployeeByID.js";
import { UpdateEmployeeByID } from "../controllers/Admin/UpdateEmployeeByID.js";
import { GetAllRoles } from "../controllers/Admin/GetAllRoles.js";
import { GetAllCountries } from "../controllers/Admin/GetAllCountries.js";
import { GetAllCountriesDetails } from "../controllers/Admin/GetAllCountriesDetails.js";
import { AddNewCountry } from "../controllers/Admin/AddNewCountry.js";
import { GetCountryDetailsByID } from "../controllers/Admin/GetCountryDetailsByID.js";
import { GetHolidayByID } from "../controllers/Admin/GetHolidayByID.js";
import { GetEmployeesByCountryID } from "../controllers/Admin/GetEmployeesByCountryID.js";
import { UpdateHolidayByID } from "../controllers/Admin/UpdateHolidayByID.js";
import { DeleteCountryByID } from "../controllers/Admin/DeleteCountryByID.js";
import { AddNewHoliday } from "../controllers/Admin/AddNewHoliday.js";
import { GetAllLeaveRequests } from "../controllers/Admin/GetAllLeaveRequests.js";
import { getAllDepartments } from "../controllers/Admin/GetAllDepartments.js";
import { createEmployee } from "../controllers/Admin/CreateEmployee.js";

const router = Router();

router.post("/create-employee", isAdmin, createEmployee);

router.get("/departments", getAllDepartments);

router.get("/all-leave-requests", isAdmin, GetAllLeaveRequests);

router.get("/employees", isAdmin, GetAllEmployees);

router.get("/employees/:employeeId", isAdmin, GetEmployeeByID);

router.put("/employees/:employeeId", isAdmin, UpdateEmployeeByID);

router.get("/roles", isAdmin, GetAllRoles);

router.get("/countries", isAdmin, GetAllCountries);

router.get("/country-details", isAdmin, GetAllCountriesDetails);

router.post("/add-country", isAdmin, AddNewCountry);

router.get("/countries/:id", isAdmin, GetCountryDetailsByID);

router.get("/holidays/:holidayId", isAdmin, GetHolidayByID);

router.get("/countries/:id/employees", isAdmin, GetEmployeesByCountryID);

router.put("/holidays/:holidayId", isAdmin, UpdateHolidayByID);

router.post("/holidays", isAdmin, AddNewHoliday);

router.delete("/countries/:countryId", isAdmin, DeleteCountryByID);

export default router;
