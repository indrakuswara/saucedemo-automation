import { CONSTANTS } from './constants';
import { Helpers } from './helpers';

export class TestData {
  static standardUser() {
    return CONSTANTS.Users.STANDARD;
  }

  static lockedOutUser() {
    return CONSTANTS.Users.LOCKED_OUT;
  }

  static problemUser() {
    return CONSTANTS.Users.PROBLEM;
  }

  static performanceGlitchUser() {
    return CONSTANTS.Users.PERFORMANCE_GLITCH;
  }

  static errorUser() {
    return CONSTANTS.Users.ERROR;
  }

  static visualUser() {
    return CONSTANTS.Users.VISUAL;
  }

  static invalidCredentials() {
    return [
      {
        description: 'Invalid username with valid password',
        username: 'invalid_user',
        password: CONSTANTS.Users.STANDARD.password,
      },
      {
        description: 'Valid username with invalid password',
        username: CONSTANTS.Users.STANDARD.username,
        password: 'wrong_password',
      },
      {
        description: 'Both credentials invalid',
        username: 'wrong_user',
        password: 'wrong_pass',
      },
    ];
  }

  static emptyFieldCombinations() {
    return [
      { description: 'Both fields empty', username: '', password: '' },
      { description: 'Empty username only', username: '', password: CONSTANTS.Users.STANDARD.password },
      { description: 'Empty password only', username: CONSTANTS.Users.STANDARD.username, password: '' },
    ];
  }

  static whitespaceTestData() {
    return [
      { description: 'Username with only spaces', username: '   ', password: CONSTANTS.Users.STANDARD.password },
      { description: 'Password with only spaces', username: CONSTANTS.Users.STANDARD.username, password: '   ' },
      { description: 'Username with leading/trailing spaces', username: '  standard_user  ', password: CONSTANTS.Users.STANDARD.password },
    ];
  }

  static securityTestData() {
    const password = CONSTANTS.Users.STANDARD.password;
    return [
      ...Helpers.sqlInjectionPayloads().map((payload, i) => ({
        description: `SQL Injection #${i + 1}: ${payload.substring(0, 30)}`,
        username: payload,
        password,
        category: 'SQL_INJECTION' as const,
      })),
      ...Helpers.xssPayloads().map((payload, i) => ({
        description: `XSS #${i + 1}: ${payload.substring(0, 30)}`,
        username: payload,
        password,
        category: 'XSS' as const,
      })),
    ];
  }

  static edgeCaseTestData() {
    const user = CONSTANTS.Users.STANDARD;
    return [
      { description: 'Case-sensitive username (uppercase)', username: user.username.toUpperCase(), password: user.password },
      { description: 'Case-sensitive username (mixed case)', username: 'Standard_User', password: user.password },
      { description: 'Very long username', username: Helpers.longString(1000), password: user.password },
      { description: 'Very long password', username: user.username, password: Helpers.longString(1000) },
      { description: 'Unicode characters in username', username: Helpers.unicodeString(), password: user.password },
      { description: 'Special characters in password', username: user.username, password: 'P@ssw0rd!#$%^&*()' },
      { description: 'Null byte injection', username: 'user\x00admin', password: user.password },
    ];
  }

  static checkoutFormData() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '12345',
    };
  }

  static invalidCheckoutFormData() {
    return [
      { description: 'Empty first name', firstName: '', lastName: 'Doe', postalCode: '12345' },
      { description: 'Empty last name', firstName: 'John', lastName: '', postalCode: '12345' },
      { description: 'Empty postal code', firstName: 'John', lastName: 'Doe', postalCode: '' },
      { description: 'All fields empty', firstName: '', lastName: '', postalCode: '' },
    ];
  }
}
