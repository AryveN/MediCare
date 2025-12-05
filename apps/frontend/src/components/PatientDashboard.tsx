import { useState } from "react";
import { Calendar, Clock, User, LogOut, Plus, Edit2, ChevronLeft, ChevronRight, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppointmentDialog, Appointment } from "./AppointmentDialog";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Navbar from "./Navbar";
import { DoctorBrowse } from "./DoctorBrowse";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessagingSystem } from "./MessagingSystem";

interface PatientDashboardProps {
  onLogout: () => void;
}

const PatientDashboard = ({ onLogout }: PatientDashboardProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      date: new Date(2025, 9, 30),
      time: "10:00",
      doctorName: "Dr. Sarah Johnson",
      type: "General Checkup",
      status: "confirmed"
    },
    {
      id: "2",
      date: new Date(2025, 9, 28),
      time: "14:30",
      doctorName: "Dr. Michael Chen",
      type: "Follow-up",
      status: "pending"
    }
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [dayDetailsOpen, setDayDetailsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [messagingOpen, setMessagingOpen] = useState(false);
  const { toast } = useToast();
  const today = new Date();

  // Generate calendar days for current month
  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days
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

  const handleSaveAppointment = (appointment: Appointment) => {
    const existing = appointments.find(a => a.id === appointment.id);
    if (existing) {
      setAppointments(appointments.map(a => 
        a.id === appointment.id ? appointment : a
      ));
      toast({
        title: "Appointment updated",
        description: "Your appointment has been successfully updated.",
      });
    } else {
      setAppointments([...appointments, appointment]);
      toast({
        title: "Appointment created",
        description: "Your appointment has been successfully created.",
      });
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setDialogOpen(true);
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
    setDayDetailsOpen(false);
    setDialogOpen(true);
  };

  const handleDayClick = (date: Date | null) => {
    if (!date || isPastDate(date)) return;
    setSelectedDate(date);
    setDayDetailsOpen(true);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Patient Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, John!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setMessagingOpen(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="browse">
              <Search className="w-4 h-4 mr-2" />
              Browse Doctors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">
                    {monthNames[currentMonth]} {currentYear}
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextMonth}
                >
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
                    disabled={!date || isPastDate(date)}
                    className={`
                      aspect-square p-1 rounded-lg text-sm font-medium
                      transition-all duration-200 relative flex flex-col
                      ${!date ? "invisible" : ""}
                      ${isPastDate(date) ? "text-muted-foreground/40 cursor-not-allowed" : ""}
                      ${isToday(date) ? "ring-2 ring-primary" : "border border-border/50"}
                      ${isSelected(date) ? "bg-primary text-primary-foreground shadow-md" : ""}
                      ${!isPastDate(date) && !isSelected(date) ? "hover:bg-accent hover:scale-105 active:scale-95 cursor-pointer" : ""}
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

            {selectedDate && (
              <div className="mt-6 p-4 bg-accent/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Selected date:</p>
                <p className="font-semibold text-lg mb-3">
                  {selectedDate.toLocaleDateString("en-US", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </p>
                {getAppointmentsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Appointments:</p>
                    {getAppointmentsForDate(selectedDate).map((apt) => (
                      <div 
                        key={apt.id} 
                        className="flex items-center justify-between p-2 bg-background rounded border"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{apt.doctorName}</p>
                            <Badge variant={apt.status === "confirmed" ? "default" : apt.status === "pending" ? "secondary" : "destructive"} className="text-xs">
                              {apt.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{apt.time} - {apt.type}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditAppointment(apt)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No appointments on this date</p>
                )}
              </div>
            )}
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Upcoming</span>
                  <Badge>2 appointments</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <Badge variant="secondary">8 visits</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Doctors</span>
                  <Badge variant="outline">3 active</Badge>
                </div>
              </div>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
              <div className="space-y-3">
                {appointments
                  .filter(apt => apt.date >= today)
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 3)
                  .map((apt) => (
                    <div key={apt.id} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{apt.doctorName}</p>
                          <Badge variant={apt.status === "confirmed" ? "default" : "secondary"} className="text-xs">
                            {apt.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {apt.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, {apt.time}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Profile Card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                Edit Profile
              </Button>
            </Card>
          </div>
        </div>
          </TabsContent>

          <TabsContent value="browse">
            <DoctorBrowse />
          </TabsContent>
        </Tabs>
      </div>

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        appointment={editingAppointment}
        selectedDate={selectedDate}
        onSave={handleSaveAppointment}
        userType="patient"
      />

      <MessagingSystem
        open={messagingOpen}
        onOpenChange={setMessagingOpen}
        userType="patient"
      />

      <Dialog open={dayDetailsOpen} onOpenChange={setDayDetailsOpen}>
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
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{apt.doctorName}</p>
                          <Badge variant={apt.status === "confirmed" ? "default" : apt.status === "pending" ? "secondary" : "destructive"} className="text-xs">
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{apt.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{apt.type}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          handleEditAppointment(apt);
                        }}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
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
              Request Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDashboard;
