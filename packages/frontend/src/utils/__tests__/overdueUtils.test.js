import { isOverdue } from '../overdueUtils';

describe('isOverdue', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    // Pin system clock to noon UTC on 2026-04-02 for deterministic date comparisons
    jest.setSystemTime(new Date('2026-04-02T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns false when dueDate is null', () => {
    expect(isOverdue(null, false)).toBe(false);
  });

  it('returns false when dueDate is an invalid string', () => {
    expect(isOverdue('invalid', false)).toBe(false);
  });

  it('returns false when dueDate is in the future', () => {
    expect(isOverdue('2099-01-01', false)).toBe(false);
  });

  it('returns false when dueDate is today', () => {
    expect(isOverdue('2026-04-02', false)).toBe(false);
  });

  it('returns true when dueDate is in the past and todo is incomplete', () => {
    expect(isOverdue('2020-01-01', false)).toBe(true);
  });

  it('returns false when dueDate is in the past but todo is completed (boolean true)', () => {
    expect(isOverdue('2020-01-01', true)).toBe(false);
  });

  it('returns false when dueDate is in the past but todo is completed (integer 1)', () => {
    expect(isOverdue('2020-01-01', 1)).toBe(false);
  });

  it('returns true when dueDate is in the past and todo is incomplete (integer 0)', () => {
    expect(isOverdue('2020-01-01', 0)).toBe(true);
  });
});
