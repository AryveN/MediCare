export class CreateVisitFeedbackDto {
  reservationId!: string;
  rating!: number;
  comment?: string;
  wouldRecommend?: boolean;
  isAnonymous?: boolean;
}
