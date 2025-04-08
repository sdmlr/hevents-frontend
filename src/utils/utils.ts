export function generateCalendarLink(event: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
  }) {
    const formatDateTime = (date: string, time: string) => {
      const iso = new Date(`${date}T${time}`).toISOString();
      return iso.replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
  
    const start = formatDateTime(event.date, event.time);
    const end = formatDateTime(event.date, event.time); // same for now
  
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', event.title);
    url.searchParams.set('dates', `${start}/${end}`);
    url.searchParams.set('details', event.description);
    url.searchParams.set('location', event.location);
  
    return url.toString();
  }
  