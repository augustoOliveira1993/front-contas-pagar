export interface IPermissions {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  roles?: string[];
  permissao_grupos?: string[];
}
