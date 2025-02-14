import { createContext , useState , useContext  } from "react";

export const FormDataContext = createContext();

export const FormDataProvider = ({children}) => {
    const [formData, setFormData] = useState({
      leaveTypeId: '',
      startDate: new Date(),
      endDate: new Date(),
      leavePeriod: 'FullDay',
      startSession: '',
      endSession: '',
      reason: '',
      supportingDocs: [],
      requestedDays: 0,
    });

    return (
      <FormDataContext.Provider value={{ formData, setFormData }}>
          {children}
      </FormDataContext.Provider>
    );
  };

  export const useFormData = () => {
    const context = useContext(FormDataContext);
    if (!context) {
      throw new Error('useFormData must be used within a FormDataProvider');
    }
    return context;
  };