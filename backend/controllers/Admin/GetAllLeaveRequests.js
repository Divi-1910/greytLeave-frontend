import prisma from "../../config/prisma.js";

export const GetAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await prisma.leaveRequest.findMany({
      include: {
        employee: true,
        leavePolicy: true,
        approvedBy: true
      }
    });
    res.status(200).json({
      success: true,
      data: leaveRequests
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
