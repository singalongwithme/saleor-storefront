/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterCutomer
// ====================================================

export interface RegisterCutomer_customerRegister_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface RegisterCutomer_customerRegister {
  __typename: "CustomerRegister";
  errors: RegisterCutomer_customerRegister_errors[] | null;
}

export interface RegisterCutomer {
  customerRegister: RegisterCutomer_customerRegister | null;
}

export interface RegisterCutomerVariables {
  email: string;
  password: string;
}
