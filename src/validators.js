export const required = value => (value ? undefined: 'Required');
export const nonEmpty = value =>
  value.trim() !== '' ? undefined : 'Cannot be empty';

export const reqLength = value => (value.length === 5 ? undefined: 'Tracking number must be 5 characters long');

export const isNumber = value => (typeof Number(value) === 'number' ? undefined: 'Each character must be a number');
