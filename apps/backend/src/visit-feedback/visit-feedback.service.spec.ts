import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ReservationDaoMock } from '../reservations/mock/reservation.dao.mock';
import { mockReservations, type ReservationMock } from '../reservations/mock/reservation.mock';
import { VisitFeedbackDao } from './visit-feedback.dao';
import { VisitFeedbackService } from './visit-feedback.service';

const defaultUser = { id: 'USER-1', patientId: 'PAT-1' };

function createReservation(
  overrides: Partial<ReservationMock> = {},
): ReservationMock {
  const nowIso = new Date().toISOString();
  return {
    id: 'RES-1',
    doctorId: 'DOC-1',
    patientId: 'PAT-1',
    departmentId: 'DEP-1',
    procedureId: 'PROC-1',
    slotStart: nowIso,
    slotEnd: nowIso,
    status: 'completed',
    createdAt: nowIso,
    updatedAt: nowIso,
    code: 'CODE-1',
    note: 'Note',
    ...overrides,
  };
}

describe('VisitFeedbackService', () => {
  let reservationDao: ReservationDaoMock;
  let feedbackDao: VisitFeedbackDao;
  let service: VisitFeedbackService;

  beforeEach(() => {
    mockReservations.length = 0;
    reservationDao = new ReservationDaoMock();
    feedbackDao = new VisitFeedbackDao();
    service = new VisitFeedbackService(reservationDao, feedbackDao);
  });

  it('creates feedback for completed reservation', async () => {
    mockReservations.push(createReservation());

    const dto = {
      reservationId: 'RES-1',
      rating: 5,
      comment: 'Výborný přístup.',
      wouldRecommend: true,
      isAnonymous: false,
    };

    const result = await service.create(dto, defaultUser);

    expect(result.feedback.id).toBeDefined();
    expect(result.feedback.patientId).toBe('PAT-1');
    expect(result.feedback.doctorId).toBe('DOC-1');
    expect(result.feedback.rating).toBe(5);
    expect(result.unsupportedKeyList).toEqual([]);
  });

  it('throws invalid input error when required fields are missing', async () => {
    const dto = {
      reservationId: 'RES-1',
    } as any;

    await expect(service.create(dto, defaultUser)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws reservationNotFound when reservation does not exist', async () => {
    const dto = { reservationId: 'RES-unknown', rating: 3 };

    await expect(service.create(dto, defaultUser)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('rejects feedback for reservation of another patient', async () => {
    mockReservations.push(
      createReservation({ id: 'RES-2', patientId: 'PAT-OTHER' }),
    );

    const dto = { reservationId: 'RES-2', rating: 4 };

    await expect(service.create(dto, defaultUser)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('rejects feedback when reservation is not completed', async () => {
    mockReservations.push(
      createReservation({ id: 'RES-3', status: 'pending' }),
    );

    const dto = { reservationId: 'RES-3', rating: 4 };

    await expect(service.create(dto, defaultUser)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects feedback when it already exists', async () => {
    mockReservations.push(createReservation());

    await feedbackDao.create({
      id: 'FDB-1',
      reservationId: 'RES-1',
      patientId: 'PAT-1',
      doctorId: 'DOC-1',
      procedureId: 'PROC-1',
      rating: 4,
      comment: 'Existing feedback',
      wouldRecommend: true,
      isAnonymous: false,
      visibility: 'pending',
      responseFromDoctor: undefined,
      helpfulCount: 0,
      reported: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const dto = { reservationId: 'RES-1', rating: 5 };

    await expect(service.create(dto, defaultUser)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
