export interface CreateRiveOptions {
  lastNameUpperCase?: boolean;
}

export function createRive(firstName: string, lastName: string, options?: CreateRiveOptions) {
  if (options?.lastNameUpperCase) {
    return firstName + ' ' + lastName.toLocaleUpperCase();
  }
  return firstName + ' ' + lastName;
}
