
export interface event_booking {
    id: string; // Unique identifier for the event
    groupId?: string; // Optional group ID for grouped events
    allDay: boolean; // Indicates if the event is all-day
    start: Date; // The start date of the event (Date object)
    end: Date | null; // The end date of the event (Date object, or null if no end specified)
    startStr: string; // ISO8601 string representation of the start date
    endStr: string | null; // ISO8601 string representation of the end date (or null if all-day)
    title: string; // The title of the event
    url?: string; // The URL that will be visited when the event is clicked (optional)
    classNames?: string[]; // An array of CSS class names for custom styling (optional)
    editable?: boolean | null; // Whether the event can be edited (optional, overrides global editable setting)
    startEditable?: boolean | null; // Whether the start time of the event can be edited (optional)
    durationEditable?: boolean | null; // Whether the duration of the event can be edited (optional)
    resourceEditable?: boolean | null; // Whether the resources of the event can be edited (optional)
    display?: 'auto' | 'block' | 'list-item' | 'background' | 'inverse-background' | 'none'; // How to render the event (optional)
    overlap?: boolean; // Whether the event can overlap with others (optional)
    constraint?: string; // An event constraint for scheduling (optional)
    backgroundColor?: string; // The background color of the event (optional)
    borderColor?: string; // The border color of the event (optional)
    textColor?: string; // The text color of the event (optional)
    extendedProps?: Record<string, any>; // Miscellaneous properties (optional)
    source?: string | null; // Reference to the event source (optional)
  }
  