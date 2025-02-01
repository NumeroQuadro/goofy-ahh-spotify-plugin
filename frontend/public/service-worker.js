// Listen to the widgetinstall event.
self.addEventListener("widgetinstall", event => {
  // The widget just got installed, render it using renderWidget.
  // Pass the event.widget object to the function.
  console.log('widget is trying to load!');
  event.waitUntil(renderWidget(event.widget));
});

async function renderWidget(widget) {
  // Get the template and data URLs from the widget definition.
  const templateUrl = widget.definition.msAcTemplate;
  const dataUrl = widget.definition.data;

  // Fetch the template text and data.
  const template = await (await fetch(templateUrl)).text();
  const data = await (await fetch(dataUrl)).text();

  // Render the widget with the template and data.
  await self.widgets.updateByTag(widget.definition.tag, { template, data });
}

// Update the widgets to their initial states
// when the service worker is activated.
self.addEventListener("activate", event => {
  event.waitUntil(updateWidgets());
});

async function updateWidgets() {
  if (!self.widgets || typeof self.widgets.getByTag !== 'function') {
    console.error("Widgets API is not available. Are you running on a supported Windows 11 environment with the latest Edge?");
    return;
  }
  // Get the widget that match the tag defined in the web app manifest.
  try {
    const widget = await self.widgets.getByTag("spotify");
    if (!widget) {
      console.log('WIDGET IS NULL');
      return;
    }
    // Using the widget definition, get the template and data.
    const template = await (await fetch(widget.definition.msAcTemplate)).text();
    const data = await (await fetch(widget.definition.data)).text();
    // Render the widget with the template and data.
    await self.widgets.updateByTag(widget.definition.tag, { template, data });
  } catch (err) {
    console.error('getting widget by tag cannot be completed!', err);
  }
}


self.addEventListener('widgetclick', async (event) => {
  console.log('event in widget click looks like: ', event);

  const widgetId = event.instanceId;

  console.log('clients looks like this: ', clients);

  const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
  // Filter for clients with a visible window
  if (clientList.length === 0) {
    console.error('No active client available');
  }

  switch (event.action) {
    case 'toggle-playback':
      clientList.forEach(client => client.postMessage({
        type: 'resumePlayback',
        widgetId: widgetId
      }))
      break;
    case 'log-in':
      console.log('log-in event triggered, calling clients...')
      // Open a new window/tab with the constructed URL.
      // clients.openWindow returns a promise.
      await clientList.forEach(value => value.postMessage({
        type: 'loginSpotify',
        widgetId: widgetId
      }))
      break;

    case 'previous-song':
      console.log('prev-song event triggered, calling clients...')

      await clientList.forEach(value => value.postMessage({
        type: 'prevSong',
        widgetId: widgetId
      }))
      break;
    case 'next-song':
      console.log('next-song event triggered, calling clients...')
      // Open a new window/tab with the constructed URL.
      await clientList.forEach(value => value.postMessage({
        type: 'nextSong',
        widgetId: widgetId
      }))
      break;
    default:
      return
  }
});

self.addEventListener("widgetinstall", event => {
  event.waitUntil(onWidgetInstall(event.widget));
});

self.addEventListener("widgetuninstall", event => {
  event.waitUntil(onWidgetUninstall(event.widget));
});

async function onWidgetInstall(widget) {
  // Register a periodic sync, if this wasn't done already.
  // We use the same tag for the sync registration and the widget to
  // avoid registering several periodic syncs for the same widget.
  const tags = await self.registration.periodicSync.getTags();
  if (!tags.includes(widget.definition.tag)) {
    await self.registration.periodicSync.register(widget.definition.tag, {
      minInterval: widget.definition.update
    });
  }

  // And also update the instance.
  await updateWidget(widget);
}

async function onWidgetUninstall(widget) {
  // On uninstall, unregister the periodic sync.
  // If this was the last widget instance, then unregister the periodic sync.
  if (widget.instances.length === 1 && "update" in widget.definition) {
    await self.registration.periodicSync.unregister(widget.definition.tag);
  }
}

// Listen to periodicsync events to update all widget instances
// periodically.
self.addEventListener("periodicsync", async event => {
  const widget = await self.widgets.getByTag(event.tag);

  if (widget && "update" in widget.definition) {
    event.waitUntil(updateWidget(widget));
  }
});

async function updateWidget(widget) {
  // Get the template and data URLs from the widget definition.
  const templateUrl = widget.definition.msAcTemplate;
  const dataUrl = widget.definition.data;

  // Fetch the template text and data.
  const template = await (await fetch(templateUrl)).text();
  const data = await (await fetch(dataUrl)).text();

  // Render the widget with the template and data.
  await self.widgets.updateByTag(widget.definition.tag, { template, data });
}