import { VisitFeedback } from './visit-feedback.types';

export class VisitFeedbackDao {
  private feedback: VisitFeedback[] = [];

  async create(feedback: VisitFeedback): Promise<VisitFeedback> {
    await Promise.resolve();
    this.feedback.push(feedback);
    return feedback;
  }

  async get(id: string): Promise<VisitFeedback | null> {
    await Promise.resolve();
    return this.feedback.find((item) => item.id === id) ?? null;
  }

  async getByReservationId(reservationId: string): Promise<VisitFeedback | null> {
    await Promise.resolve();
    return this.feedback.find((item) => item.reservationId === reservationId) ?? null;
  }

  async list(): Promise<VisitFeedback[]> {
    await Promise.resolve();
    return [...this.feedback];
  }

  async update(feedback: VisitFeedback): Promise<VisitFeedback> {
    await Promise.resolve();
    const index = this.feedback.findIndex((item) => item.id === feedback.id);
    if (index >= 0) {
      this.feedback[index] = feedback;
    }
    return feedback;
  }

  async delete(id: string): Promise<void> {
    await Promise.resolve();
    this.feedback = this.feedback.filter((item) => item.id !== id);
  }
}
