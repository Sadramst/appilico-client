export interface IAppSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  group: string;
  updatedAt: string;
  updatedBy: string;
}

export interface IUpdateSettingRequest {
  key: string;
  value: string;
}
