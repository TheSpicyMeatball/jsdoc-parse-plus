// base tag type
export interface ITag {
  tag: string;
  value?: string;
  raw: string;
}

// for tags that can contain a description as part of their value (i.e. @param, @returns, etc)
export interface IDescriptive extends ITag {
  description?: string;
}

// additional keys for the @param tag type
export interface IParam extends IDescriptive {
  name: string;
  optional?: boolean;
  defaultValue?: string;
}

// for tags that contain a type (i.e. @param, @returns, etc)
export interface IType extends IDescriptive {
  type?: string;
}

// for inline link tags like {@link} and {@tutorial}
export type InlineLink = {
  tag: string,
  url: string,
  text: string,
  raw: string,
};

// util configuration types
export type GetCommentsFromFileConfig = { keepIndent?: boolean };
export type ToCommentStringConfig = { indentChars?: number };