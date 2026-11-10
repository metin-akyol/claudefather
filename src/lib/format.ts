const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const monthFmt = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

export const formatDate = (iso: string) => fmt.format(new Date(`${iso}T00:00:00Z`));
export const formatMonth = (iso: string) => monthFmt.format(new Date(`${iso}T00:00:00Z`));
