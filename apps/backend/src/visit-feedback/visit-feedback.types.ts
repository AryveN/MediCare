export interface VisitFeedback {
  id: string;
  reservationId: string;
  patientId: string;
  doctorId: string;
  procedureId?: string;
  rating: number;
  comment?: string;
  wouldRecommend?: boolean;
  isAnonymous: boolean;
  visibility: 'pending' | 'approved' | 'rejected';
  responseFromDoctor?: string;
  helpfulCount: number;
  reported: boolean;
  createdAt: string;
  updatedAt: string;
}
