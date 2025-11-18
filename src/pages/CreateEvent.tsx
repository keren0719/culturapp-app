import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { CreateEventDialog } from "@/components/CreateEventDialog";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) {
      navigate(-1);
    }
  }, [open, navigate]);

  const handleSuccess = () => {
    navigate("/organizer/dashboard");
  };

  return (
    <CreateEventDialog
      open={open}
      onOpenChange={setOpen}
      onSuccess={handleSuccess}
    />
  );
};

export default CreateEvent;
