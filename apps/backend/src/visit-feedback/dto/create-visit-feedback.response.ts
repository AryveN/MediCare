import { VisitFeedback } from '../visit-feedback.types';

export class CreateVisitFeedbackResponseDto {
  feedback!: VisitFeedback;
  unsupportedKeyList!: string[];
  invalidTypeKeyMap!: Record<string, string>;
  invalidValueKeyMap!: Record<string, string>;
  missingKeyMap!: Record<string, string>;
}
