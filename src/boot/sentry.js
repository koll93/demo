import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import { boot } from 'quasar/wrappers';

const sentryDsn = ''

export default boot(({app, store}) => {
  // Sentry.init({
  //   dsn: sentryDsn,
  //   integrations: [new Integrations.BrowserTracing()],
  //   logErrors: true,
  //   attachProps: true,
  //   tracingOptions: {
  //     trackComponents: true,
  //   },
  //
  //   // We recommend adjusting this value in production, or using tracesSampler
  //   // for finer control
  //   tracesSampleRate: 1.0
  // });

  // app.config.errorHandler = function (err) {
  //   !window.__DEV__ && Sentry.captureException(err); // отправка сентри, тк errorHandler, блокирует отправку сентри
  //   store.commit('setError', err)
  //   console.warn('Error', err);
  // }
})


