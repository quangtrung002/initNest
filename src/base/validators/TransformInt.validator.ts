import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'transformInt', async: false })
class TransformIntConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const parseIntValue = parseInt(value, 10);
    if (isNaN(parseIntValue)) return false;

    args.object[args.property] = parseIntValue;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an integer or a string representing an integer`;
  }
}

export function TransformInt(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: TransformIntConstraint,
    });
  };
}
