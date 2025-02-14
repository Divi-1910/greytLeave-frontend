import prisma from "../../config/prisma.js";

const getEmployeeId = (req) => {
  return req.employee?.id || req.employee?.employeeId;
};

export const GetLeavePolicies = async (req, res) => {
  try {
    const id = getEmployeeId(req);
    console.log("inside the getleavePolicies ", id);
  } catch (error) {}
};
