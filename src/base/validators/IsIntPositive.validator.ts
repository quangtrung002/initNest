import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'transformInt', async: false })
class IsIntPositiveConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return value >= 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an positive integer`;
  }
}

export function IsIntPositive(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIntPositiveConstraint,
    });
  };
}
