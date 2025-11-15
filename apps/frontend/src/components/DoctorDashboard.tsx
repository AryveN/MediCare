import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, LogOut, Calendar as CalendarIcon, Clock, User, Edit2, X, MessageSquare, Plus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppointmentDialog, Appointment } from "./AppointmentDialog";
import Navbar from "./Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientRecords } from "./PatientRecords";
import { MessagingSystem } from "./MessagingSystem";

interface DoctorDashboardProps {
  onLogout: () => void;
}

const DoctorDashboard = ({ onLogout }: DoctorDashboardProps) => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      date: new Date(2025, 0, 30),
      time: "10:00",
      doctorName: "John Doe",
      type: "Checkup",
      status: "confirmed",
      patientName: "John Doe"
    },
    {
      id: "2",
      date: new Date(2025, 0, 30),
      time: "14:00",
      doctorName: "Jane Smith",
      type: "Consultation",
      status: "pending",
      patientName: "Jane Smith"
    },
    {
      id: "3",
      date: new Date(2025, 1, 5),
      time: "11:00",
      doctorName: "Bob Johnson",
      type: "Follow-up",
      status: "confirmed",
      patientName: "Bob Johnson"
    },
  ]);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isDayDetailsOpen, setIsDayDetailsOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [messagingOpen, setMessagingOpen] = useState(false);
  const today = new Date();

  const pendingAppointments = appointments.filter(apt => apt.status === "pending");
  const confirmedAppointments = appointments.filter(apt => apt.status === "confirmed");

  // Generate calendar days for current month
  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }
    
    return days;
  };

  const days = getDaysInMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isPastDate = (date: Date | null) => {
    if (!date) return false;
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dateOnly < todayOnly;
  };

  const getAppointmentsForDate = (date: Date | null) => {
    if (!date) return [];
    return appointments.filter(apt => 
      apt.date.toDateString() === date.toDateString()
    );
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSaveAppointment = (appointment: Appointment) => {
    const existing = appointments.find(a => a.id === appointment.id);
    if (existing) {
      setAppointments(appointments.map(a => 
        a.id === appointment.id ? appointment : a
      ));
      toast({
        title: "Appointment updated",
        description: "The appointment has been successfully updated.",
      });
    } else {
      setAppointments([...appointments, appointment]);
      toast({
        title: "Appointment created",
        description: "The appointment has been successfully created.",
      });
    }
    setIsAppointmentDialogOpen(false);
    setEditingAppointment(null);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsAppointmentDialogOpen(true);
    setIsDayDetailsOpen(false);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter(a => a.id !== appointmentId));
    toast({
      title: "Appointment cancelled",
      description: "The appointment has been cancelled.",
    });
  };

  const handleMessagePatient = (patientName: string) => {
    setMessagingOpen(true);
  };

  const handleConfirmAppointment = (appointmentId: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: "confirmed" as const } : apt
    ));
    toast({
      title: "Appointment confirmed",
      description: "The appointment has been confirmed.",
    });
  };

  const handleRejectAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter(a => a.id !== appointmentId));
    toast({
      title: "Appointment rejected",
      description: "The appointment request has been rejected.",
    });
  };

  const handleNewAppointment = () => {
    if (!selectedDate) {
      toast({
        title: "Select a date",
        description: "Please select a date first to create an appointment.",
        variant: "destructive",
      });
      return;
    }
    setEditingAppointment(null);
    setIsDayDetailsOpen(false);
    setIsAppointmentDialogOpen(true);
  };

  const handleDayClick = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    setIsDayDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Doctor Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your patient appointments</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setMessagingOpen(true)} variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </Button>
            <Button onClick={onLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="records">Patient Records</TabsTrigger>
            <TabsTrigger value="requests">
              Pending Requests
              {pendingAppointments.length > 0 && (
                <Badge className="ml-2" variant="destructive">{pendingAppointments.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview"
            className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">
                    {monthNames[currentMonth]} {currentYear}
                  </h2>
                </div>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleNewAppointment} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {days.map((date, index) => {
                const dayAppointments = getAppointmentsForDate(date);
                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(date)}
                    disabled={!date}
                    className={`
                      aspect-square p-1 rounded-lg text-sm font-medium
                      transition-all duration-200 relative flex flex-col
                      ${!date ? "invisible" : ""}
                      ${isPastDate(date) ? "text-muted-foreground/40" : ""}
                      ${isToday(date) ? "ring-2 ring-primary" : "border border-border/50"}
                      ${isSelected(date) ? "bg-primary text-primary-foreground shadow-md" : ""}
                      ${date && !isSelected(date) ? "hover:bg-accent hover:scale-105 active:scale-95 cursor-pointer" : ""}
                    `}
                  >
                    {date && (
                      <>
                        <div className="text-xs">{date.getDate()}</div>
                        {dayAppointments.length > 0 && (
                          <div className="flex-1 flex flex-col gap-0.5 mt-0.5 w-full">
                            {dayAppointments.slice(0, 2).map((apt) => (
                              <div
                                key={apt.id}
                                className={`text-[8px] leading-tight px-0.5 py-0.5 rounded truncate ${
                                  isSelected(date) 
                                    ? "bg-primary-foreground/20 text-primary-foreground" 
                                    : "bg-primary/10 text-primary"
                                }`}
                                title={`${apt.time} - ${apt.doctorName}`}
                              >
                                {apt.time}
                              </div>
                            ))}
                            {dayAppointments.length > 2 && (
                              <div className={`text-[8px] ${isSelected(date) ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                +{dayAppointments.length - 2}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Today's Appointments</span>
                  <Badge variant="secondary">
                    {appointments.filter((apt) => apt.date.toDateString() === today.toDateString()).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Patients</span>
                  <Badge variant="secondary">{appointments.length}</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
              <div className="space-y-3">
                {confirmedAppointments
                  .filter(apt => apt.date >= today)
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 3)
                  .map((apt) => (
                    <Card key={apt.id} className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <User className="w-4 h-4 text-primary" />
                              {apt.patientName}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CalendarIcon className="w-3 h-3" />
                              {apt.date.toLocaleDateString("en-US", { 
                                month: "short", 
                                day: "numeric",
                                year: "numeric" 
                              })}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {apt.time}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {apt.type}
                          </Badge>
                        </div>
                        <div className="flex gap-1 pt-2 border-t">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 h-8 text-xs"
                            onClick={() => handleEditAppointment(apt)}
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 h-8 text-xs"
                            onClick={() => handleMessagePatient(apt.patientName || "Patient")}
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-8 px-2"
                            onClick={() => handleCancelAppointment(apt.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </Card>
          </div>
        </div>
          </TabsContent>

          <TabsContent value="records">
            <PatientRecords />
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {pendingAppointments.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No pending appointment requests</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingAppointments.map((apt) => (
                  <Card key={apt.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-semibold">
                            <User className="w-4 h-4 text-primary" />
                            {apt.patientName || "Unknown Patient"}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="w-3 h-3" />
                            {apt.date.toLocaleDateString("en-US", { 
                              month: "short", 
                              day: "numeric",
                              year: "numeric" 
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {apt.time}
                          </div>
                        </div>
                        <Badge variant="secondary">{apt.type}</Badge>
                      </div>
                      
                      <div className="flex gap-2 pt-2 border-t">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleConfirmAppointment(apt.id)}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleRejectAppointment(apt.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Day Details Dialog */}
      <Dialog open={isDayDetailsOpen} onOpenChange={setIsDayDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate?.toLocaleDateString("en-US", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {getAppointmentsForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-medium">Appointments:</p>
                {getAppointmentsForDate(selectedDate).map((apt) => (
                  <Card key={apt.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-semibold">{apt.doctorName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{apt.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{apt.type}</p>
                        </div>
                        <Badge variant="outline">{apt.type}</Badge>
                      </div>
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEditAppointment(apt)}
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleMessagePatient(apt.doctorName)}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancelAppointment(apt.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No appointments on this date</p>
              </div>
            )}
            
            <Button 
              onClick={handleNewAppointment} 
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Appointment Dialog */}
      <AppointmentDialog
        open={isAppointmentDialogOpen}
        onOpenChange={setIsAppointmentDialogOpen}
        appointment={editingAppointment}
        selectedDate={selectedDate}
        onSave={handleSaveAppointment}
        userType="doctor"
      />

      <MessagingSystem
        open={messagingOpen}
        onOpenChange={setMessagingOpen}
        userType="doctor"
      />
    </div>
  );
};

export default DoctorDashboard;
