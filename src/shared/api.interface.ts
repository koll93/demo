/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ICamera {
  /** Идентификатор */
  id?: string;

  /**
   * Source URL
   * Camera video source url
   */
  source_url?: string;

  /**
   * Title
   * Human-readable camera title
   */
  title?: string;

  /** Position X (map) */
  position_x?: number;

  /** Position Y (map) */
  position_y?: number;

  /** Rotation (map) */
  rotation?: number;
}

export interface ICameraIdsList {
  camera_ids: (string | null)[];
}

export interface IEmotionsRecord {
  /** Dt */
  dt: number;
  v: number[][];
}

export interface ICameraEmotions {
  data: IEmotionsRecord[];
  emotion_names: string[];
}

export interface ICameraPreviewUrl {
  /** Url */
  url: string;
}

export interface IStartCameraParams {
  /** Camera slot */
  slot?: number | null;

  /**
   * Timezone string
   * @pattern ^[+-]\d\d:\d\d$
   */
  timezone?: string | null;

  /** Research */
  research_id?: string | null;
}

export interface IPerson {
  /** Идентификатор */
  id?: string;

  /** Research id */
  research_id?: string;

  /** Название */
  title?: string | null;

  /** Описание */
  description?: string | null;
}

export interface ICreatePerson {
  /** Идентификатор */
  id?: string;

  /** Research */
  research?: string | null;

  /** Название */
  title?: string | null;

  /** Описание */
  description?: string | null;
}

export interface IFace {
  /** Идентификатор */
  id?: string;

  /** Source img url */
  source_img_url?: string;

  /** Face img url */
  face_img_url?: string;

  /** Raw img url */
  raw_img_url?: string;

  /** Detected face data */
  detected_face?: object;
}

export interface IDetailedPerson {
  /** Идентификатор */
  id?: string;

  /** Research id */
  research_id?: string;

  /** Название */
  title?: string | null;

  /** Описание */
  description?: string | null;
  faces?: IFace[];
}

export interface IAddFaceErrorResponse {
  /** Error reason code */
  reason: "__NO_FACE__" | "__MISSING_DATA__" | "__TOO_BIG_FILE__";
}

export interface IFaceIdParams {
  /** Face id */
  face_id: string;
}

export interface IDeleteFaceErrorResponse {
  /** Error reason code */
  reason: "__NOT_FOUND__";
}

export interface IGenerateExcelReport {
  video_fragment_ids: string[];

  /** Redirect */
  redirect?: boolean;

  /**
   * Timezone string
   * @pattern ^[+-]\d\d:\d\d$
   */
  timezone?: string | null;
}

export interface IGenerateTaskExcelReport {
  task_ids: string[];
  camera_ids?: string[] | null;

  /** Redirect */
  redirect?: boolean;

  /**
   * Timezone string
   * @pattern ^[+-]\d\d:\d\d$
   */
  timezone?: string | null;
}

export interface IBasicCamera {
  /** Идентификатор */
  id?: string;

  /**
   * Title
   * Human-readable camera title
   */
  title?: string;
}

export interface IDetailedResearch {
  /** Идентификатор */
  id?: string;

  /** Status */
  status?: "NEW" | "ACTIVE" | "COMPLETE";

  /** Название */
  title?: string;

  /** Описание */
  description?: string;

  /** Исследователь */
  researcher?: string;

  /**
   * Дата начала записи
   * @format date-time
   */
  started_at?: string;

  /**
   * Дата окончания записи
   * @format date-time
   */
  stopped_at?: string;
  cameras?: IBasicCamera[];

  /**
   * Максимальная длительность в минутах
   * При превышении максимальной длительности исследование будет автоматически остановлено
   * @min -2147483648
   * @max 2147483647
   */
  max_duration?: number | null;

  /** Данные сценария (используется frontend-ом) */
  research_scenario?: object | null;
  persons?: IDetailedPerson[];
}

export interface ICreateResearchParams {
  /** Название */
  title?: string;

  /** Описание */
  description?: string;

  /** Исследователь */
  researcher?: string;
}

export interface IResearch {
  /** Идентификатор */
  id?: string;

  /** Status */
  status?: "NEW" | "ACTIVE" | "COMPLETE";

  /** Название */
  title?: string;

  /** Описание */
  description?: string;

  /** Исследователь */
  researcher?: string;

  /**
   * Дата начала записи
   * @format date-time
   */
  started_at?: string;

  /**
   * Дата окончания записи
   * @format date-time
   */
  stopped_at?: string;
  cameras?: IBasicCamera[];

  /**
   * Максимальная длительность в минутах
   * При превышении максимальной длительности исследование будет автоматически остановлено
   * @min -2147483648
   * @max 2147483647
   */
  max_duration?: number | null;

  /** Данные сценария (используется frontend-ом) */
  research_scenario?: object | null;
}

export interface IArchiveCameraStatus {
  /** Camera id */
  camera_id: string;

  /** Is camera worker running? */
  status_ok: boolean;

  /** Latest status update Unix timestamp (seconds) */
  status_ts?: number | null;

  /** Start camera task Unix timestamp (seconds) */
  start_camera_ts?: number | null;

  /**
   * Start recording Unix timestamp (seconds)
   * Defined only if camera is recording now
   */
  start_recording_ts?: number | null;
}

export interface IActiveResearch {
  cameras: IArchiveCameraStatus[];
}

export interface IStartResearchParams {
  camera_ids: string[];

  /**
   * Timezone string
   * @pattern ^[+-]\d\d:\d\d$
   */
  timezone?: string | null;

  /** Max research duration (minutes) */
  max_duration?: number | null;
}

export interface IResearchVideoFragmentStatusStatistics {
  /** Status */
  status:
    | "recording"
    | "recorded"
    | "recorded_no_target"
    | "processing"
    | "processed"
    | "processed_no_target"
    | "processing_error";

  /** Count of video fragments for the status */
  count: number;
}

export interface IResearchStatisticsResponse {
  statistics: IResearchVideoFragmentStatusStatistics[];
}

export interface IResearchTaskTitlesResponse {
  titles: string[];

  /** Title person ids */
  title_person_ids: Record<string, string[]>;
}

export interface ITask {
  /** Идентификатор */
  id?: string;

  /** Research id */
  research_id?: string;

  /** Person id */
  person_id?: string;

  /** Название */
  title?: string;

  /** Описание */
  description?: string | null;

  /**
   * Дата начала выполнения
   * @format date-time
   */
  started_at?: string | null;

  /**
   * Дата окончания выполнения
   * @format date-time
   */
  stopped_at?: string | null;

  /** Status */
  status?: "NEW" | "ACTIVE" | "COMPLETE" | "CANCELED";
}

export interface ICreateTask {
  /** Title */
  title: string;

  /** Description */
  description?: string | null;

  /** Research */
  research_id: string;

  /** Person */
  person_id?: string | null;
}

export interface ITokenObtainPair {
  /** Username */
  username: string;

  /** Password */
  password: string;
}

export interface ITokenObtainPairResponse {
  /** Access */
  access: string;

  /** Refresh */
  refresh: string;
}

export interface ITokenRefresh {
  /** Refresh */
  refresh: string;

  /** Access */
  access?: string;
}

export interface IVideoFragment {
  /** Идентификатор */
  id?: string;

  /** Camera id */
  camera_id?: string;

  /** Video file url */
  video_file_url?: string;

  /** Data file url */
  data_file_url?: string;

  /** Status */
  status?:
    | "recording"
    | "recorded"
    | "recorded_no_target"
    | "processing"
    | "processed"
    | "processed_no_target"
    | "processing_error"
    | null;

  /**
   * Дата начала записи
   * @format date-time
   */
  recording_started_at?: string | null;

  /**
   * Дата окончания записи
   * @format date-time
   */
  recording_stopped_at?: string | null;

  /** Research id */
  research_id?: string;
}
