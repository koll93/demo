import {ICamera} from 'src/shared/api.interface';

export const LEFT_MENU_WIDTH = 200

// Типы для словарей

export type KeysOfDictionary<T extends {keys: {[index: string]: string}}> = keyof T['keys']
export type ValuesOfDictionary<T extends {keys: {[index: string]: string}}> = T['keys'][KeysOfDictionary<T>]

export enum EMOTIONS {
  neutral,
  happy,
  sad,
  surprise,
  anger,
  fear,
  disgust
}

export const STATUS_PROCESSED_RESEARCH = 'processed'

export interface ICameraSelect extends Required<ICamera> {
  isActive?: boolean,
  label?: string,
  value?: string
}

export type DeepNonNullableRequired<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
}

export interface IArchiveChart {
  emotionNames: string[],
  emotions: number[][][][],
  faces: number[][],
  video: {
    width: number,
    height: number,
    fps: number
  }
}

export const RESEARCH_STATUS = {
  keys: {
    NEW: 'NEW',
    ACTIVE: 'ACTIVE',
    COMPLETE: 'COMPLETE'
  } as const,
  get translation(): {[key in ValuesOfDictionary<typeof RESEARCH_STATUS>]: string} {
    return {
      [this.keys.NEW]: 'Новый',
      [this.keys.ACTIVE]: 'Активный',
      [this.keys.COMPLETE]: 'Архивирован'
    }
  }
}

export const STATISTIC_STATUS = {
  keys: {
    RECORDING: 'recording',
    RECORDED: 'recorded',
    RECORDED_NO_TARGET: 'recorded_no_target',
    PROCESSING: 'processing',
    PROCESSED: 'processed',
    PROCESSED_NO_TARGET: 'processed_no_target',
    PROCESSING_ERROR: 'processing_error'
  } as const,
  get translation(): {[key in ValuesOfDictionary<typeof STATISTIC_STATUS>]: string} {
    return {
      [this.keys.RECORDING]: 'Запись',
      [this.keys.RECORDED]: 'Записан',
      [this.keys.RECORDED_NO_TARGET]: 'Записан, лицо не обнаружено',
      [this.keys.PROCESSING]: 'Обработка',
      [this.keys.PROCESSED]: 'Обработано',
      [this.keys.PROCESSED_NO_TARGET]: 'Обработано, лицо не обнаружено',
      [this.keys.PROCESSING_ERROR]: 'Ошибка'
    }
  }
}

export const TASK_STATUS = {
  keys: {
    NEW: 'NEW',
    ACTIVE: 'ACTIVE',
    COMPLETE: 'COMPLETE',
    CANCELED: 'CANCELED'
  } as const
  // get translation(): {[key in ValuesOfDictionary<typeof RESEARCH_STATUS>]: string} {
  //   return {
  //     [this.keys.NEW]: 'Новый',
  //     [this.keys.ACTIVE]: 'Активный',
  //     [this.keys.COMPLETE]: 'Архивирован'
  //   }
  // }
}
