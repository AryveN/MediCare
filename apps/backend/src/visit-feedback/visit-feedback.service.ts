import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReservationDaoMock } from '../reservations/mock/reservation.dao.mock';
import { CreateVisitFeedbackDto } from './dto/create-visit-feedback.dto';
import { CreateVisitFeedbackResponseDto } from './dto/create-visit-feedback.response';
import { VisitFeedbackDao } from './visit-feedback.dao';
import { VisitFeedback } from './visit-feedback.types';

const allowedKeys = [
  'reservationId',
  'rating',
  'comment',
  'wouldRecommend',
  'isAnonymous',
];

@Injectable()
export class VisitFeedbackService {
  constructor(
    private readonly reservationDao: ReservationDaoMock,
    private readonly feedbackDao: VisitFeedbackDao,
  ) {}

  async create(
    dto: CreateVisitFeedbackDto,
    currentUser: { id: string; patientId?: string },
  ): Promise<CreateVisitFeedbackResponseDto> {
    const dtoKeys = Object.keys(dto ?? {});
    const unsupportedKeyList = dtoKeys.filter((k) => !allowedKeys.includes(k));

    if (unsupportedKeyList.length > 0) {
      console.warn(
        'visitFeedback/create – unsupported keys in dto:',
        unsupportedKeyList,
      );
    }

    const missingKeyMap: Record<string, string> = {};
    const invalidTypeKeyMap: Record<string, string> = {};
    const invalidValueKeyMap: Record<string, string> = {};

    if (dto.reservationId === undefined) {
      missingKeyMap['reservationId'] = 'reservationId is required';
    } else if (typeof dto.reservationId !== 'string') {
      invalidTypeKeyMap['reservationId'] = 'reservationId must be a string';
    } else if (dto.reservationId.trim().length === 0) {
      invalidValueKeyMap['reservationId'] = 'reservationId must not be empty';
    }

    if (dto.rating === undefined) {
      missingKeyMap['rating'] = 'rating is required';
    } else if (typeof dto.rating !== 'number') {
      invalidTypeKeyMap['rating'] = 'rating must be a number';
    } else if (!Number.isInteger(dto.rating) || dto.rating < 1 || dto.rating > 5) {
      invalidValueKeyMap['rating'] = 'rating must be an integer between 1 and 5';
    }

    if (dto.comment !== undefined) {
      if (typeof dto.comment !== 'string') {
        invalidTypeKeyMap['comment'] = 'comment must be a string';
      } else if (dto.comment.length > 2000) {
        invalidValueKeyMap['comment'] = 'comment must not exceed 2000 characters';
      }
    }

    if (dto.wouldRecommend !== undefined && typeof dto.wouldRecommend !== 'boolean') {
      invalidTypeKeyMap['wouldRecommend'] = 'wouldRecommend must be a boolean';
    }

    if (dto.isAnonymous !== undefined && typeof dto.isAnonymous !== 'boolean') {
      invalidTypeKeyMap['isAnonymous'] = 'isAnonymous must be a boolean';
    }

    if (
      Object.keys(missingKeyMap).length > 0 ||
      Object.keys(invalidTypeKeyMap).length > 0 ||
      Object.keys(invalidValueKeyMap).length > 0
    ) {
      throw new BadRequestException({
        code: 'visitFeedbackCreate/invalidInput',
        message: 'Validace vstupních dat selhala.',
        missingKeyMap,
        invalidTypeKeyMap,
        invalidValueKeyMap,
        unsupportedKeyList,
      });
    }

    const patientId = currentUser.patientId;
    if (!patientId) {
      throw new ForbiddenException({
        code: 'visitFeedbackCreate/unauthorizedFeedback',
        message: 'Nemáte oprávnění hodnotit tuto návštěvu.',
      });
    }

    const reservation = await this.reservationDao.get(dto.reservationId);
    if (!reservation) {
      throw new NotFoundException({
        code: 'visitFeedbackCreate/reservationNotFound',
        message: 'Rezervace nebyla nalezena.',
      });
    }

    if (reservation.patientId !== patientId) {
      throw new ForbiddenException({
        code: 'visitFeedbackCreate/unauthorizedFeedback',
        message: 'Nemáte oprávnění hodnotit tuto návštěvu.',
      });
    }

    if (reservation.status !== 'completed') {
      throw new BadRequestException({
        code: 'visitFeedbackCreate/reservationNotCompleted',
        message: 'Rezervace není dokončená, hodnocení nelze uložit.',
      });
    }

    const existingFeedback = await this.feedbackDao.getByReservationId(
      reservation.id,
    );
    if (existingFeedback) {
      throw new ConflictException({
        code: 'visitFeedbackCreate/feedbackAlreadyExists',
        message: 'Hodnocení pro tuto rezervaci již existuje.',
      });
    }

    const nowIso = new Date().toISOString();

    const feedback: VisitFeedback = {
      id: `FDB-${Date.now()}`,
      reservationId: reservation.id,
      patientId: reservation.patientId,
      doctorId: reservation.doctorId,
      procedureId: reservation.procedureId,
      rating: dto.rating,
      comment: dto.comment,
      wouldRecommend: dto.wouldRecommend,
      isAnonymous: dto.isAnonymous ?? false,
      visibility: 'pending',
      responseFromDoctor: undefined,
      helpfulCount: 0,
      reported: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const saved = await this.feedbackDao.create(feedback);

    return {
      feedback: saved,
      unsupportedKeyList,
      invalidTypeKeyMap: {},
      invalidValueKeyMap: {},
      missingKeyMap: {},
    } satisfies CreateVisitFeedbackResponseDto;
  }
}
