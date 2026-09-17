import { useEffect, useState } from "react";
import { getPatients } from "../../api/patients";

const Patients = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Your existing UI */}
    </div>
  );
};

export default Patients;