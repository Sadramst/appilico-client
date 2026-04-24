export interface IAppSetting {
  id: string;
  key: string;
  value: string;
  group: string;
  description: string | null;
}

export interface IUpdateSettingsRequest {
  settings: { key: string; value: string }[];
}
