import {api$, video$} from 'boot/axios';
import {DeepNonNullableRequired, IArchiveChart, TASK_STATUS, ValuesOfDictionary} from 'pages/cabinet/cabinet.interface';
import {
  IActiveResearch,
  ICamera,
  ICameraEmotions,
  ICameraIdsList,
  ICreateResearchParams, IDetailedPerson,
  IDetailedResearch,
  IFace,
  IResearch,
  IResearchStatisticsResponse,
  ITask,
  IVideoFragment
} from 'src/shared/api.interface';
import {concatMap, map} from 'rxjs/operators';

export const getActiveCameras = () => {
  return api$.get<DeepNonNullableRequired<ICameraIdsList>>('/cameras/active')
    .pipe(
      map(({data: {camera_ids}}) => camera_ids)
    )
}

export const getCamera = (id: string) => {
  return api$.get<DeepNonNullableRequired<ICamera>>(`/cameras/${id}/`)
}

export const getCameras = () => {
  return api$.get<DeepNonNullableRequired<ICamera>[]>('/cameras/?format=json')
    .pipe(
      map(({data}) => data)
    )
}

export const startCamera = (id: string, slot: number, research_id?: string) => {
  return api$.post(`/cameras/${id}/start/`, {slot, research_id})
}

export const stopCamera = (id: string) => {
  return api$.post(`/cameras/${id}/stop/`)
}

export const stopSlot = (num: string) => {
  return api$.post(`/cameras/slots/${num}/stop/`)
}

export const stopAllCamera = () => {
  return api$.post('/cameras/stop-all/')
}

export const checkActiveCamera = (id: string) => {
  return video$.head(`/video/${id}/master.m3u8`)
}

// Api Chart
export const getChartData = (id: string) => {
  return api$.get<DeepNonNullableRequired<ICameraEmotions>>(`/cameras/latest-values/?camera_id=${id}&format=json`)
}

// Api Research

export const getActiveResearches = () => {
  return api$.get<DeepNonNullableRequired<IActiveResearch>[]>('/researches/active/')
    .pipe(
      map(({data}) => data)
    )
}

export const getResearches = (statusIn: IResearch['status'][], startTime?: string, endTime?: string, filterTitle?: string, filterResearcher?: string) => {
  const params = {
    status__in: statusIn.join(','),
    started_at__gt: startTime,
    stopped_at__lt: endTime,
    title__icontains: filterTitle,
    researcher__icontains: filterResearcher,
  }
  return api$.get<DeepNonNullableRequired<IResearch>[]>('/researches/', {params})
    .pipe(
      map(({data}) => data)
    )
}

export const getResearch = (id: string) => {
  return api$.get<DeepNonNullableRequired<IDetailedResearch>>(`/researches/${id}`)
    .pipe(
      map(({data}) => data)
    )
}

export const createResearch = (data: ICreateResearchParams) => {
  return api$.post<DeepNonNullableRequired<IResearch>>('/researches/', data)
    .pipe(
      map(({data}) => data)
    )
}

export const changeResearch = (id: string, data: IDetailedResearch) => {
  return api$.put<DeepNonNullableRequired<IResearch>>(`/researches/${id}/`, data)
    .pipe(
      map(({data}) => data)
    )
}

export const deleteResearch = (id: string) => {
  return api$.delete(`/researches/${id}/`)
}

export const startResearch = (id: string, camerasIds: string[]) => {
  return api$.post(`/researches/${id}/start/`, {camera_ids: camerasIds})
}

export const stopResearch = (id: string) => {
  return api$.post(`/researches/${id}/stop/`)
}

export const useCameraInResearches = (id: string, isUse: boolean) => {
  return api$.put<DeepNonNullableRequired<ICamera>>(`/cameras/${id}/`, {use_for_research: isUse})
}

// Api Tasks

export const getTasks = (id: string, status: ValuesOfDictionary<typeof TASK_STATUS>[]) => {
  return api$.get<DeepNonNullableRequired<ITask>[]>(`/tasks/?research_id=${id}&status__in=${status.join(',')}`)
    .pipe(
      map(({data}) => data)
    )
}

export const createTask = (id: string, title: string, person_id: string) => {
  return api$.post<DeepNonNullableRequired<ITask>>('/tasks/', {title, research_id: id, person_id})
    .pipe(
      map(({data}) => data)
    )
}

export const finishTask = (id: string) => {
  return api$.post(`/tasks/${id}/stop/`)
}

export const deleteTask = (id: string) => {
  return api$.delete(`/tasks/${id}/`)
}

// Api Faces

export const createPerson = (id: string, title: string, description: string) => {
  return api$.post<DeepNonNullableRequired<IDetailedPerson>>('/persons/', {title, description, research: id})
    .pipe(
      map(({data}) => data)
    )
}

export const deletePerson = (id: string) => {
  return api$.delete(`/persons/${id}`)
}

export const getFaces = (id: string) => {
  return api$.get<DeepNonNullableRequired<IFace>[]>('/persons/', {params: {research_id: id}})
    .pipe(
      map(({data}) => data)
    )
}

export const addFace = (id: string, url: string) => {
  return video$.get(url, {responseType: 'blob'})
    .pipe(
      map(({data}) => {
        const form = new FormData()
        form.append('file', data)
        return form
      }),
      concatMap((form) => api$.post<DeepNonNullableRequired<IFace>>(`/persons/${id}/add-face/`, form)
          .pipe(
            map(({data}) => data)
          )
      )
    )
}

export const deleteFace = (personId: string, faceId: string) => {
  return api$.delete(`/persons/${personId}/delete-face/`, {data: {face_id: faceId}})
}

export const previewCamera = (id: string) => {
  return api$.post<{url: string}>(`/cameras/${id}/preview/`)
    .pipe(
      map(({data}) => data.url)
    )
}

// Api Archive

export const getVideoFragments = (ids: string, status: string, taskIds: string, researchId: string, personIds: string) => {
  const params = {
    camera_id__in: ids,
    task_id__in: taskIds || undefined,
    person_id__in: personIds || undefined,
    status__in: status,
    research_id: researchId,
    format: 'json'
  }
  return api$.get<DeepNonNullableRequired<IVideoFragment>[]>('/video-fragments/', {params})
}

export const getStatistic = (id: string) => {
  return api$.get<IResearchStatisticsResponse>(`/researches/${id}/statistics/`)
    .pipe(
      map(({data}) => data.statistics)
    )
}

export const getExcel = (ids: string[]) => {
  const data = {
    video_fragment_ids: ids,
    redirect: false
  }
  return api$.post('/reports/excel', data)
}

export const getTaskExcel = (taskIds: string[], cameraIds?: string[]) => {
  const data = {
    task_ids: taskIds,
    camera_ids: cameraIds,
    redirect: false
  }
  return api$.post('/reports/tasks', data)
}

export const getExcelBlob = (url: string) => {
  return video$.get(url, {responseType: 'blob'})
}

// Api ArchiveChart

export const getChartArchiveData = (src: string) => {
  return video$.get<IArchiveChart>(src)
}
