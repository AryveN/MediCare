import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppointmentDialog, Appointment } from "./AppointmentDialog";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  availability: string;
  experience: string;
  bio: string;
  reviewsList: { author: string; rating: number; comment: string; date: string }[];
}

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.8,
    reviews: 127,
    location: "City Medical Center",
    availability: "Mon-Fri, 9:00 AM - 5:00 PM",
    experience: "15 years",
    bio: "Specialized in cardiovascular diseases with extensive experience in heart surgery and preventive care.",
    reviewsList: [
      { author: "John D.", rating: 5, comment: "Excellent doctor, very thorough and caring.", date: "2024-03-15" },
      { author: "Mary S.", rating: 5, comment: "Highly recommend! Professional and knowledgeable.", date: "2024-03-10" },
      { author: "Tom R.", rating: 4, comment: "Good experience overall, wait time was a bit long.", date: "2024-03-05" },
    ],
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    rating: 4.9,
    reviews: 98,
    location: "Skin Care Clinic",
    availability: "Tue-Sat, 10:00 AM - 6:00 PM",
    experience: "12 years",
    bio: "Expert in skin conditions, cosmetic procedures, and advanced dermatological treatments.",
    reviewsList: [
      { author: "Lisa M.", rating: 5, comment: "Amazing results! Very professional.", date: "2024-03-18" },
      { author: "David K.", rating: 5, comment: "Best dermatologist I've ever seen.", date: "2024-03-12" },
    ],
  },
  {
    id: "3",
    name: "Dr. Emily Williams",
    specialty: "Pediatrician",
    rating: 4.7,
    reviews: 156,
    location: "Children's Health Center",
    availability: "Mon-Fri, 8:00 AM - 4:00 PM",
    experience: "10 years",
    bio: "Dedicated to providing compassionate care for children from infancy through adolescence.",
    reviewsList: [
      { author: "Anna P.", rating: 5, comment: "Great with kids! My son loves her.", date: "2024-03-20" },
      { author: "Robert W.", rating: 4, comment: "Professional and caring doctor.", date: "2024-03-14" },
      { author: "Susan L.", rating: 5, comment: "Highly recommended for pediatric care.", date: "2024-03-08" },
    ],
  },
];

export const DoctorBrowse = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [selectedDate] = useState<Date>(new Date());
  const { toast } = useToast();

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowAppointmentDialog(true);
  };

  const handleCloseDetails = () => {
    setSelectedDoctor(null);
  };

  const handleSaveAppointment = (appointment: Appointment) => {
    toast({
      title: "Appointment booked",
      description: `Your appointment with ${selectedDoctor?.name} has been scheduled.`,
    });
    setShowAppointmentDialog(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Browse Doctors & Clinics</h2>
        <p className="text-muted-foreground">Find the right healthcare professional for your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDoctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <span>{doctor.name}</span>
                <Badge variant="secondary">{doctor.specialty}</Badge>
              </CardTitle>
              <CardDescription className="space-y-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{doctor.rating}</span>
                  <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.location}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 text-sm">
                <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">{doctor.availability}</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setSelectedDoctor(doctor)} variant="outline" className="flex-1">
                  View Details
                </Button>
                <Button onClick={() => handleBookAppointment(doctor)} className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Doctor Details Dialog */}
      <Dialog open={!!selectedDoctor && !showAppointmentDialog} onOpenChange={handleCloseDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDoctor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedDoctor.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-lg px-4 py-1">
                    {selectedDoctor.specialty}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-lg">{selectedDoctor.rating}</span>
                    <span className="text-muted-foreground">({selectedDoctor.reviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span>{selectedDoctor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span>{selectedDoctor.availability}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Experience:</span>
                    <span>{selectedDoctor.experience}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">About</h3>
                  <p className="text-muted-foreground">{selectedDoctor.bio}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Patient Reviews</h3>
                  <div className="space-y-4">
                    {selectedDoctor.reviewsList.map((review, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium">{review.author}</span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Button onClick={() => handleBookAppointment(selectedDoctor)} className="w-full" size="lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Appointment Dialog */}
      <AppointmentDialog
        open={showAppointmentDialog}
        onOpenChange={setShowAppointmentDialog}
        appointment={null}
        selectedDate={selectedDate}
        onSave={handleSaveAppointment}
        userType="patient"
      />
    </div>
  );
};
