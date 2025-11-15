import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  doctorName: string;
  type: string;
  status: "pending" | "confirmed" | "cancelled";
  patientName?: string;
}

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  selectedDate: Date | null;
  onSave: (appointment: Appointment) => void;
  userType?: "patient" | "doctor";
}

const doctors = [
  "Dr. Sarah Johnson",
  "Dr. Michael Chen",
  "Dr. Emily Williams",
  "Dr. James Brown"
];

const appointmentTypes = [
  "General Checkup",
  "Follow-up",
  "Consultation",
  "Specialist Visit"
];

export const AppointmentDialog = ({
  open,
  onOpenChange,
  appointment,
  selectedDate,
  onSave,
  userType = "patient"
}: AppointmentDialogProps) => {
  const [time, setTime] = useState("09:00");
  const [doctorName, setDoctorName] = useState(doctors[0]);
  const [type, setType] = useState(appointmentTypes[0]);

  useEffect(() => {
    if (appointment) {
      setTime(appointment.time);
      setDoctorName(appointment.doctorName);
      setType(appointment.type);
    } else {
      setTime("09:00");
      setDoctorName(doctors[0]);
      setType(appointmentTypes[0]);
    }
  }, [appointment, open]);

  const handleSave = () => {
    const newAppointment: Appointment = {
      id: appointment?.id || `apt-${Date.now()}`,
      date: appointment?.date || selectedDate || new Date(),
      time,
      doctorName,
      type,
      status: appointment?.status || (userType === "patient" ? "pending" : "confirmed"),
      patientName: appointment?.patientName
    };
    onSave(newAppointment);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Edit Appointment" : userType === "patient" ? "Request Appointment" : "New Appointment"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="text"
              value={(appointment?.date || selectedDate)?.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="doctor">Doctor</Label>
            <Select value={doctorName} onValueChange={setDoctorName}>
              <SelectTrigger id="doctor">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {appointment ? "Update" : userType === "patient" ? "Request" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
