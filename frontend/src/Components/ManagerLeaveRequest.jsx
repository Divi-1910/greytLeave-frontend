import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion"
import LeaveRequestTable from "./LeaveRequestTable";

function ManagerLeaveRequest() {
	const [leaveRequests, setLeaveRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("adminToken");
		if (!token) {
			navigate("/admin-login");
		}
		const getLeaveRequests = async () => {
			try {
				const data = await getLeaveRequests();
				setLeaveRequests(data);
			} catch (error) {
				console.log("error in fetching leave requests", error);
			}
		};
	}, []);

	return (
		<AnimatePresence>
						<LeaveRequestTable leaveRequests={leaveRequests} />
		</AnimatePresence>
	);
}

export default ManagerLeaveRequest;
