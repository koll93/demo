import {Notify, Dialog} from 'quasar'

const errorNotify = (consoleMessage: string = '', configOrMessage?: { message: string, color: string }) => (error?: any) => {
  const config = typeof configOrMessage === 'object' ? configOrMessage : {message: 'Произошла ошибка', color: 'negative'}
  if (error) {
    console.dir(error);
    console.warn('Error: ' + consoleMessage, error);
  }
  Notify.create({...config, position: 'top'});
}

const infoNotify = (message: string, color: string, timeout?: number) => {
  Notify.create({message, color, position: 'top', timeout});
}

export {errorNotify, infoNotify, Dialog}
