import * as t from 'babel-types';
import variableReference from './variable-reference';

export default function argValueToJS(argumentValue, operationName, clientVar, variablesVar) {
  switch (argumentValue.kind) {
    case 'StringValue':
      return t.stringLiteral(argumentValue.value);
    case 'EnumValue':
      return t.callExpression(
        t.memberExpression(clientVar, t.identifier('enum')),
        [t.stringLiteral(argumentValue.value)]
      );
    case 'IntValue':
      return t.numericLiteral(parseInt(argumentValue.value, 10));
    case 'FloatValue':
      return t.numericLiteral(parseFloat(argumentValue.value));
    case 'BooleanValue':
      return t.booleanLiteral(argumentValue.value);
    case 'ListValue':
      return t.arrayExpression(argumentValue.values.map((value) => argValueToJS(value, operationName, clientVar, variablesVar)));
    case 'ObjectValue':
      return t.objectExpression(argumentValue.fields.map((field) => {
        return t.objectProperty(t.identifier(field.name.value), argValueToJS(field.value, operationName, clientVar, variablesVar));
      }));
    case 'Variable':
      return variableReference(operationName, argumentValue, variablesVar);
    default:
      throw Error(`Unrecognized argument value type "${argumentValue.kind}"`);
  }
}
