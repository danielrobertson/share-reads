import * as Sentry from "@sentry/remix";

Sentry.init({
    dsn: "https://ac73ccb986c0a72f49f143b88e4bffc8@o4508633696632832.ingest.us.sentry.io/4508633699647488",
    tracesSampleRate: 1,
    autoInstrumentRemix: true
})