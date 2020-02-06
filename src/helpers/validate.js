export function validateRequired(val) {
    return val.trim().length === 0;
}

// // password must be 8 characters or more, must have a capital letter and 1 special character
// export function validatePassword(val) {
//   return new RegExp(
//       "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).*[A-Za-z0-9].{8,}$"
//   ).test(val);

// }

export function validatePassword(val) {
  return new RegExp(
      "^(?=.*[0-9])(?=.*[a-z])(?=\\S+$).*[A-Za-z0-9].{6,}$"
  ).test(val);

}

export function validateEmail(val) {
  return new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  ).test(val);
}
