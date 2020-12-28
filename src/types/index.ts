export interface ITag {
  tag: string;
  value?: string;
  raw: string;
}

export interface IDescriptive extends ITag {
  description?: string;
}

export interface IParam extends IDescriptive {
  name: string;
  optional?: boolean;
  defaultValue?: string;
}

export interface IType extends IDescriptive {
  type?: string;
}

export type InlineLink = {
  tag: string,
  url: string,
  text: string,
  raw: string,
};

export type GetJsDocStringsFromFileConfig = { keepIndent?: boolean };
export type ToJsdocStringConfig = { indentChars?: number };