import React, { useState, useEffect, useMemo, memo } from "react";
import {
  format,
  differenceInBusinessDays,
  isWeekend,
  isSameDay,
  addDays
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  AlertCircle,
  FileText,
  Check,
  ChevronRight,
  ChevronLeft,
  Clock,
  Upload,
  Trash2,
  Calendar as CalendarIcon,
  Info
} from "lucide-react";
import {
  fetchLeaveTypes,
  getPresignedUrl,
  submitLeaveRequest,
  uploadFiles
} from "../../api/api";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import confetti from "canvas-confetti";
import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { leaveFormState } from "../../store/LeaveFormStore";
import { useNavigate } from "react-router-dom";

const LeaveRequestForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useRecoilState(leaveFormState);

  const handleNext = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const calculateTotalBusinessDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (formData.leavePeriod === "HalfDay") {
      return formData.startSession ? 0.5 : 0;
    }

    if (formData.leavePeriod === "FullDay") {
      return differenceInBusinessDays(end, start) + 1;
    }

    if (formData.leavePeriod === "Mixed") {
      if (!formData.startSession || !formData.endSession) return 0;

      const totalFullDays = differenceInBusinessDays(end, start) - 1;
      let totalDays = totalFullDays;

      if (formData.startSession === "PreLunch") {
        totalDays += 1;
      } else {
        totalDays += 0.5;
      }

      if (formData.endSession === "PostLunch") {
        totalDays += 1;
      } else {
        totalDays += 0.5;
      }

      if (isSameDay(start, end)) {
        if (
          formData.startSession === "PreLunch" &&
          formData.endSession === "PostLunch"
        ) {
          return 1;
        } else if (
          formData.startSession === "PreLunch" &&
          formData.endSession === "PreLunch"
        ) {
          return 0.5;
        } else if (
          formData.startSession === "PostLunch" &&
          formData.endSession === "PostLunch"
        ) {
          return 0.5;
        } else {
          return 0;
        }
      }

      return Math.max(0, totalDays);
    }
  };

  const pageTransition = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.5, ease: "easeInOut" }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };
  useEffect(() => {
    initializeForm();
  }, []);

  const initializeForm = async () => {
    try {
      setLoading(true);
      const leaveTypesData = await fetchLeaveTypes();
      console.log("leaveTypesData - ", leaveTypesData);
      setLeaveTypes(leaveTypesData);
    } catch (error) {
      toast.error("Failed to initialize form data");
    } finally {
      setLoading(false);
    }
  };

  const LeaveTypeStep = () => (
    <motion.div {...fadeIn} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Select Leave Type
        </h3>
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Available Balance</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leaveTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLeaveTypeSelect(type)}
            className={`p-5 rounded-xl border-2 cursor-pointer transition-all shadow-sm
              ${
                formData.leaveTypeId === type.id
                  ? "border-blue-700 bg-blue-50/50 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 text-lg">
                  {type.leaveType.name}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {type.leaveType.description}
                </p>
                {type.leaveType.requiresProof && (
                  <div className="flex items-center text-amber-600 text-xs">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Requires supporting document
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {type.leaveBalances[0]?.remainingDays}
                </div>
                <p className="text-xs text-gray-500">days remaining</p>
              </div>
            </div>

            {formData.leaveTypeId === type.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 pt-4 border-t border-blue-200"
              >
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Entitled Quota:</span>
                  <span>{type.leaveBalances[0].entitledDays} days</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const handleLeaveTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      leaveTypeId: type.id,
      supportingDocs: []
    }));

    const selectedElement = document.querySelector(
      `[data-leave-type="${type.id}"]`
    );
    if (selectedElement) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const DateSelectionStep = () => {
    const [showDateTooltip, setShowDateTooltip] = useState(false);

    const calendarStyles = `
      .custom-calendar .react-datepicker__day--highlighted {
        background-color: #EFF6FF;
        color: #2563EB;
      }
      .custom-calendar .react-datepicker__day--holiday {
        background-color: #FEF2F2;
        color: #DC2626;
      }
    `;

    const isHolidayOrWeekend = useMemo(() => {
      return (date) => {
        return isWeekend(date);
      };
    }, []);

    const handleLeavePeriodChange = (period) => {
      setFormData((prev) => ({
        ...prev,
        leavePeriod: period,
        startSession: "",
        endSession: "",
        endDate: period === "HalfDay" ? prev.startDate : prev.endDate,
        ...(period === "HalfDay" && { endSession: prev.startSession }),
        ...(period === "FullDay" && { startSession: "", endSession: "" })
      }));
    };

    const handleSessionChange = (sessionType, value) => {
      setFormData((prev) => {
        const newData = { ...prev, [sessionType]: value };

        if (prev.leavePeriod === "HalfDay") {
          newData.endSession = value;
        }

        if (
          prev.leavePeriod === "Mixed" &&
          prev.startDate &&
          prev.endDate &&
          prev.startDate === prev.endDate
        ) {
          if (sessionType === "startSession" && value === "PostLunch") {
            newData.endSession = "PostLunch";
          }
          if (sessionType === "endSession" && value === "PreLunch") {
            newData.startSession = "PreLunch";
          }
        }

        return newData;
      });
    };

    const formatDisplayDate = (date) => {
      if (!date) return "";
      return format(new Date(date), "dd/MM/yyyy");
    };

    const handleDateChange = (dateType, date) => {
      if (!date) return;

      setFormData((prev) => {
        const newDate = format(date, "yyyy-MM-dd");
        const newData = {
          ...prev,
          [dateType]: newDate
        };

        if (prev.leavePeriod === "HalfDay") {
          newData.endDate = newDate;
        }

        if (prev.leavePeriod === "Mixed") {
          if (dateType === "endDate" && newDate === prev.startDate) {
            if (prev.startSession === "PostLunch") {
              newData.endSession = "PostLunch";
            }
          }
          if (dateType === "startDate" && newDate === prev.endDate) {
            if (prev.endSession === "PreLunch") {
              newData.startSession = "PreLunch";
            }
          }
        }

        if (dateType === "endDate" && prev.startDate) {
          const startDate = new Date(prev.startDate);
          if (date < startDate) {
            newData.endDate = prev.startDate;
            if (prev.leavePeriod === "Mixed") {
              newData.endSession = prev.startSession;
            }
          }
        }

        return newData;
      });
    };

    return (
      <motion.div {...pageTransition} className="space-y-6">
        <style>{calendarStyles}</style>

        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">
            Select Leave Duration
          </h3>
          <button
            onClick={() => setShowDateTooltip(!showDateTooltip)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {showDateTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800"
          >
            <ul className="list-disc list-inside space-y-1">
              <li>Weekends are automatically excluded from the calculation</li>
              <li>
                Half-day leaves can be taken for morning or afternoon sessions
              </li>
              <li>
                Mixed leaves allow different sessions for start and end dates
              </li>
            </ul>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Leave Period
            </label>
            <div className="flex gap-3">
              {["FullDay", "HalfDay", "Mixed"].map((period) => (
                <button
                  key={period}
                  onClick={() => handleLeavePeriodChange(period)}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all
                    ${
                      formData.leavePeriod === period
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                >
                  {period.replace(/([A-Z])/g, " $1").trim()}
                </button>
              ))}
            </div>
          </div>

          {(formData.leavePeriod === "HalfDay" ||
            formData.leavePeriod === "Mixed") && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                {formData.leavePeriod === "HalfDay"
                  ? "Session"
                  : "Start Session"}
              </label>
              <div className="flex gap-3">
                {["PreLunch", "PostLunch"].map((session) => (
                  <button
                    key={session}
                    onClick={() => handleSessionChange("startSession", session)}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all
                      ${
                        formData.startSession === session
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                  >
                    {session === "PreLunch" ? "Morning" : "Afternoon"}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <DatePicker
                selected={
                  formData.startDate ? new Date(formData.startDate) : null
                }
                onChange={(date) => handleDateChange("startDate", date)}
                minDate={new Date()}
                filterDate={(date) => !isHolidayOrWeekend(date)}
                dateFormat="dd MMM yyyy"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                calendarClassName="custom-calendar"
                placeholderText="Select start date"
              />
            </div>

            {formData.leavePeriod !== "HalfDay" && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <DatePicker
                  selected={
                    formData.endDate ? new Date(formData.endDate) : null
                  }
                  onChange={(date) => handleDateChange("endDate", date)}
                  minDate={
                    formData.startDate
                      ? new Date(formData.startDate)
                      : new Date()
                  }
                  filterDate={(date) => !isHolidayOrWeekend(date)}
                  dateFormat="dd MMM yyyy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  calendarClassName="custom-calendar"
                  placeholderText="Select end date"
                />
              </div>
            )}
          </div>

          {formData.leavePeriod === "Mixed" && (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Session
              </label>
              <div className="flex gap-3">
                {["PreLunch", "PostLunch"].map((session) => (
                  <button
                    key={session}
                    onClick={() => handleSessionChange("endSession", session)}
                    disabled={!formData.endDate}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all
                    ${
                      formData.endSession === session
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-200"
                    }
                    ${
                      !formData.endDate ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {session === "PreLunch" ? "Morning" : "Afternoon"}
                  </button>
                ))}
              </div>
              {!formData.endDate && (
                <p className="text-sm text-gray-500 mt-1">
                  Please select an end date first
                </p>
              )}
            </div>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-700">
                Total Leave Duration
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                {calculateTotalBusinessDays()}{" "}
                <span className="text-lg">days</span>
              </p>
            </div>
            <div className="text-right">
              {formData.startDate && (
                <p className="text-sm text-gray-500">
                  {formatDisplayDate(formData.startDate)}
                  {formData.endDate &&
                    formData.startDate !== formData.endDate && (
                      <> - {formatDisplayDate(formData.endDate)}</>
                    )}
                </p>
              )}
              {(formData.leavePeriod === "HalfDay" ||
                formData.leavePeriod === "Mixed") && (
                <div className="text-xs text-gray-500 mt-1">
                  {formData.startSession && (
                    <span>
                      Start:{" "}
                      {formData.startSession === "PreLunch"
                        ? "Morning"
                        : "Afternoon"}
                    </span>
                  )}
                  {formData.leavePeriod === "Mixed" && formData.endSession && (
                    <span className="ml-2">
                      End:{" "}
                      {formData.endSession === "PreLunch"
                        ? "Morning"
                        : "Afternoon"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const DetailsStep = memo(() => {
    const [formData, setFormData] = useRecoilState(leaveFormState);
    const [localReason, setLocalReason] = useState(formData.reason);
    const [isUploading, setIsUploading] = useState(false);

    const selectedLeaveType = useMemo(
      () => leaveTypes.find((t) => t.id === formData.leaveTypeId),
      [leaveTypes, formData.leaveTypeId]
    );

    const handleReasonChange = useCallback((event) => {
      setLocalReason(event.target.value);
    }, []);

    const handleReasonBlur = useCallback(() => {
      setFormData((prev) => ({
        ...prev,
        reason: localReason
      }));
    }, [localReason, setFormData]);

    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const maxSize = 10 * 1024 * 1024;
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        return;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 10MB size limit`);
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        console.log("the file is - ", file);
        const response = await uploadFiles(formData);
        const uploadedFile = response.data.file;
        console.log(uploadedFile);

        setFormData((prev) => ({
          ...prev,
          supportingDoc: uploadedFile.url
        }));

        toast.success("File uploaded successfully!");
      } catch (error) {
        toast.error("Error uploading file.");
        console.error("File upload error:", error);
      } finally {
        setIsUploading(false);
      }
    };

    const refreshPresignedUrl = async (key) => {
      try {
        const response = await getPresignedUrl();
        setFormData((prev) => ({
          ...prev,
          supportingDoc: {
            ...prev.supportingDoc,
            url: response.data.url
          }
        }));
      } catch (error) {
        console.error("Error refreshing presigned URL:", error);
        toast.error("Error loading document");
      }
    };

    const handleDocumentClick = async () => {
      if (formData.supportingDoc) {
        await refreshPresignedUrl(formData.supportingDoc.key);
        window.open(formData.supportingDoc.url, "_blank");
      }
    };

    const removeFile = () => {
      setFormData((prev) => ({
        ...prev,
        supportingDoc: null
      }));
    };
    return (
      <motion.div {...pageTransition} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Leave Summary
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Leave Type</label>
                  <p className="font-medium text-gray-900">
                    {selectedLeaveType?.leaveType.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Duration</label>
                  <p className="font-medium text-gray-900">
                    {format(new Date(formData.startDate), "dd MMM yyyy")}
                    {formData.endDate &&
                      formData.startDate !== formData.endDate && (
                        <>
                          {" "}
                          - {format(new Date(formData.endDate), "dd MMM yyyy")}
                        </>
                      )}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Total Days</label>
                  <p className="font-medium text-gray-900">
                    {calculateTotalBusinessDays()} days
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Balance After</label>
                  <p className="font-medium text-gray-900">
                    {(selectedLeaveType?.leaveBalances[0]?.remainingDays || 0) -
                      calculateTotalBusinessDays()}{" "}
                    days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Leave
            </label>
            <textarea
              value={localReason}
              onChange={handleReasonChange}
              onBlur={handleReasonBlur}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Please provide a detailed reason for your leave request..."
            />
          </div>
          {(selectedLeaveType?.leaveType.requiresProof ||
            (selectedLeaveType?.leaveType.name === "Sick Leave" &&
              calculateTotalBusinessDays() > 3)) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Document
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="mt-2 space-y-4">
                {formData.supportingDoc ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className="flex items-center space-x-3 cursor-pointer"
                      onClick={handleDocumentClick}
                    >
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formData.supportingDoc.name}
                      </span>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ) : (
                  <label className="relative block">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={isUploading}
                    />
                    <div className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                      <div className="text-center">
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                        ) : (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">
                              <span className="text-blue-500 font-medium">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, PNG, JPG up to 10MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  });

  const FormProgress = () => {
    const steps = [
      { number: 1, title: "Leave Type", icon: Calendar },
      { number: 2, title: "Duration", icon: Clock },
      { number: 3, title: "Details", icon: FileText }
    ];

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center relative z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: currentStep >= step.number ? 1 : 0.8,
                    opacity: 1
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center
                  ${
                    currentStep > step.number
                      ? "bg-green-500 text-white"
                      : currentStep === step.number
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </motion.div>
                <span
                  className={`mt-2 text-sm font-medium
                ${
                  currentStep === step.number
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 relative">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: currentStep > step.number ? "100%" : "0%"
                    }}
                    className="absolute h-full bg-green-500"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const validateForm = () => {
    const newErrors = {};
    switch (currentStep) {
      case 1:
        if (!formData.leaveTypeId) {
          newErrors.leaveType = "Please select a leave type";
        }
        break;
      case 2:
        if (!formData.startDate) {
          newErrors.startDate = "Start date is required";
        }
        if (!formData.endDate && formData.leavePeriod !== "HalfDay") {
          newErrors.endDate = "End date is required";
        }
        if (
          (formData.leavePeriod === "HalfDay" ||
            formData.leavePeriod === "Mixed") &&
          !formData.startSession
        ) {
          newErrors.session = "Please select a session";
        }
        if (formData.leavePeriod === "Mixed" && !formData.endSession) {
          newErrors.endSession = "Please select end session";
        }

        const selectedLeaveType = leaveTypes.find(
          (t) => t.id === formData.leaveTypeId
        );
        const remainingDays =
          selectedLeaveType?.leaveBalances[0]?.remainingDays || 0;
        if (calculateTotalBusinessDays() > remainingDays) {
          newErrors.duration = "Requested days exceed available balance";
        }
        break;

      case 3:
        if (!formData.reason.trim()) {
          newErrors.reason = "Please provide a reason for your leave";
        }
        if (formData.reason.trim().length < 10) {
          newErrors.reason = "Please provide a more detailed reason";
        }

        const selectedType = leaveTypes.find(
          (t) => t.id === formData.leaveTypeId
        );
        if (selectedType?.leaveType.requiresProof && !formData.supportingDoc) {
          newErrors.supportingDoc =
            "Supporting documents are required for this leave type";
        }
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Please correct the following errors: ${errorMessages}`);
        return;
      }
      setLoading(true);
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "supportingDocs") {
          if (value instanceof Date) {
            submitData.append(key, value.toISOString());
          } else {
            submitData.append(key, value);
          }
        }
      });
      formData.supportingDocs.forEach((file, index) => {
        submitData.append(`supportingDocs`, file);
      });
      submitData.append("totalDays", calculateTotalBusinessDays().toString());
      submitData.append("submissionDate", new Date().toISOString());
      console.log(
        "Submit form data:",
        Object.fromEntries(submitData.entries())
      );
      console.log("submitted data is - ", submitData);
      const submittedLeaveRequest = await submitLeaveRequest(submitData);
      confetti({
        particleCount: 1000,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4F46E5", "#3B82F6", "#60A5FA"]
      });
      toast.success("Leave request submitted successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error("Submit error:", error);
      console.log("-------------");
      toast.error(
        error.message || "Failed to submit leave request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <FormProgress />
        <AnimatePresence mode="wait">
          {currentStep === 1 && <LeaveTypeStep />}
          {currentStep === 2 && <DateSelectionStep />}
          {currentStep === 3 && <DetailsStep />}
          {currentStep === 0 && navigate("/profile")}
        </AnimatePresence>
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className="flex items-center px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <button
            onClick={currentStep === 3 ? handleSubmit : handleNext}
            disabled={loading}
            className="flex items-center px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Clock className="animate-spin w-5 h-5 mr-2" />
                Processing...
              </>
            ) : (
              <>
                {currentStep === 3 ? "Submit Request" : "Continue"}
                {currentStep !== 3 && <ChevronRight className="w-5 h-5 ml-1" />}
              </>
            )}
          </button>
        </div>
        <AnimatePresence>
          {Object.keys(errors).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-4 bg-red-50 rounded-lg"
            >
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Please correct the following errors:
                  </h3>
                  <ul className="mt-2 text-sm text-red-700 space-y-1">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LeaveRequestForm;
