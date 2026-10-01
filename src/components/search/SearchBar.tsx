"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Check, ChevronDown, Compass, MapPin, Users } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { useSiteSettings } from "@/features/cms/components/settings/SiteSettingsProvider";
import type { SearchOptions } from "@/lib/searchOptions";
import DatePanel, { DATE_LOCALES } from "./DatePanel";
import ParticipantsPanel from "./ParticipantsPanel";
import { fromISODate } from "./dates";

export interface SearchBarInitial {
  destination?: string;
  serviceId?: number;
  date?: string;
  adults?: number;
  children?: number;
}

type Panel = "destination" | "service" | "date" | "participants" | null;

const DEFAULT_SEARCH_SETTINGS = { maxParticipants: 20, showDate: true, showParticipants: true };

export default function SearchBar({
  options,
  initial = {},
  variant = "hero",
}: {
  options: SearchOptions;
  initial?: SearchBarInitial;
  /** hero = floating white bar on a photo; page = bordered bar on a white page. */
  variant?: "hero" | "page";
}) {
  const { t, lang } = useCalmaLang();
  const s = t.search;
  const router = useRouter();
  const settings = useSiteSettings()?.search ?? DEFAULT_SEARCH_SETTINGS;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState<Panel>(null);

  const { destinations, services } = options;
  const [destinationId, setDestinationId] = useState<number | null>(
    () =>
      destinations.find((d) => d.name === initial.destination)?.id ?? destinations[0]?.id ?? null,
  );
  const [serviceId, setServiceId] = useState<number | null>(initial.serviceId ?? null);
  const [date, setDate] = useState<string | null>(initial.date ?? null);
  const [adults, setAdults] = useState(initial.adults ?? 1);
  const [childCount, setChildCount] = useState(initial.children ?? 0);

  const destination = destinations.find((d) => d.id === destinationId) ?? null;
  // A service with no destination is offered everywhere.
  const availableServices = useMemo(
    () =>
      services.filter(
        (sv) =>
          destinationId === null ||
          sv.destinationIds.length === 0 ||
          sv.destinationIds.includes(destinationId),
      ),
    [services, destinationId],
  );
  const service = availableServices.find((sv) => sv.id === serviceId) ?? null;

  useEffect(() => {
    if (serviceId !== null && !availableServices.some((sv) => sv.id === serviceId)) {
      setServiceId(null);
    }
  }, [availableServices, serviceId]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setPanel(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const toggle = (p: Exclude<Panel, null>) => setPanel((cur) => (cur === p ? null : p));

  const total = adults + childCount;
  const participantsText =
    total === 1 ? s.participantOne : s.participantMany.replace("{n}", String(total));
  const dateText = date
    ? fromISODate(date).toLocaleDateString(DATE_LOCALES[lang], {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : s.dateFlexible;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (settings.showDate && date) params.set("date", date);
    if (settings.showParticipants) {
      params.set("adults", String(adults));
      if (childCount > 0) params.set("children", String(childCount));
    }
    setPanel(null);
    if (service) {
      const qs = params.toString();
      router.push(`/services/${service.id}${qs ? `?${qs}` : ""}`);
      return;
    }
    if (destination) params.set("destination", destination.name);
    router.push(`/search?${params.toString()}`);
  };

  // ── Styling ──────────────────────────────────────────────────────────────
  const shell =
    variant === "hero"
      ? "bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,.45)]"
      : "border border-calma-ink/15 bg-white shadow-sm";
  const segment = (open: boolean) =>
    `flex w-full min-w-0 items-center gap-3 rounded-xl px-4 py-2.5 text-start transition-colors lg:rounded-full lg:px-5 ${
      open ? "bg-white ring-1 ring-calma-ink lg:shadow-md" : "hover:bg-calma-ink/[.04]"
    }`;
  const label = "block text-[12px] font-semibold leading-tight text-calma-taupe";
  const value = "block truncate text-[15px] font-semibold leading-snug text-calma-ink";
  const divider = (
    <span aria-hidden="true" className="mx-1 my-3 hidden w-px shrink-0 bg-calma-ink/15 lg:block" />
  );
  const panelBase =
    "absolute top-full z-40 mt-2 overflow-hidden rounded-2xl border border-calma-ink/10 bg-white text-start shadow-[0_16px_48px_-12px_rgba(21,36,46,.35)]";

  const chevron = (open: boolean) => (
    <ChevronDown
      size={16}
      className={`ms-auto shrink-0 text-calma-taupe transition-transform ${open ? "rotate-180" : ""}`}
    />
  );

  const listOption = (
    selected: boolean,
    text: string,
    onPick: () => void,
    key: string | number,
  ) => (
    <li key={key}>
      <button
        type="button"
        role="option"
        aria-selected={selected}
        onClick={onPick}
        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-start text-[15px] transition-colors hover:bg-calma-ink/[.05] ${
          selected ? "font-semibold text-calma-ink" : "text-calma-ink/85"
        }`}
      >
        <span className="truncate">{text}</span>
        {selected && <Check size={16} className="shrink-0 text-calma-olive" />}
      </button>
    </li>
  );

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-[1080px]"
      onKeyDown={(e) => {
        if (e.key === "Escape" && panel) {
          e.stopPropagation();
          setPanel(null);
        }
      }}
    >
      <form
        onSubmit={onSubmit}
        role="search"
        className={`flex flex-col gap-1 rounded-2xl p-2 lg:flex-row lg:items-stretch lg:gap-0 lg:rounded-full lg:p-1.5 ${shell}`}
      >
        {/* Destination — fixed while only one is active; a dropdown once admins add more. */}
        {destinations.length > 0 && (
          <div className="min-w-0 lg:flex-1">
            {destinations.length === 1 ? (
              <div className="flex items-center gap-3 px-4 py-2.5 lg:px-5">
                <MapPin size={18} className="shrink-0 text-calma-ink" aria-hidden="true" />
                <span className="min-w-0">
                  <span className={label}>{s.destinationLabel}</span>
                  <span className={value}>{destinations[0].name}</span>
                </span>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={panel === "destination"}
                  onClick={() => toggle("destination")}
                  className={segment(panel === "destination")}
                >
                  <MapPin size={18} className="shrink-0 text-calma-ink" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className={label}>{s.destinationLabel}</span>
                    <span className={value}>{destination?.name}</span>
                  </span>
                  {chevron(panel === "destination")}
                </button>
                {panel === "destination" && (
                  <div className={`${panelBase} start-0 w-full p-2 lg:w-[320px]`}>
                    <ul
                      role="listbox"
                      aria-label={s.destinationLabel}
                      className="m-0 max-h-[320px] list-none overflow-y-auto p-0"
                    >
                      {destinations.map((d) =>
                        listOption(
                          d.id === destinationId,
                          d.name,
                          () => {
                            setDestinationId(d.id);
                            setPanel(null);
                          },
                          d.id,
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        {destinations.length > 0 && divider}

        {/* Service */}
        <div className="min-w-0 lg:flex-[1.4]">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={panel === "service"}
            onClick={() => toggle("service")}
            className={segment(panel === "service")}
          >
            <Compass size={18} className="shrink-0 text-calma-ink" aria-hidden="true" />
            <span className="min-w-0">
              <span className={label}>{s.serviceLabel}</span>
              <span className={value}>{service?.title ?? s.allServices}</span>
            </span>
            {chevron(panel === "service")}
          </button>
          {panel === "service" && (
            <div className={`${panelBase} start-0 w-full p-2 lg:w-[400px]`}>
              <ul
                role="listbox"
                aria-label={s.serviceLabel}
                className="m-0 max-h-[360px] list-none overflow-y-auto p-0"
              >
                {listOption(
                  serviceId === null,
                  s.allServices,
                  () => {
                    setServiceId(null);
                    setPanel(null);
                  },
                  "all",
                )}
                {availableServices.map((sv) =>
                  listOption(
                    sv.id === serviceId,
                    sv.title,
                    () => {
                      setServiceId(sv.id);
                      setPanel(null);
                    },
                    sv.id,
                  ),
                )}
              </ul>
            </div>
          )}
        </div>

        {settings.showDate && divider}
        {settings.showDate && (
          <div className="min-w-0 lg:flex-1 lg:min-w-[170px]">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={panel === "date"}
              onClick={() => toggle("date")}
              className={segment(panel === "date")}
            >
              <Calendar size={18} className="shrink-0 text-calma-ink" aria-hidden="true" />
              <span className="min-w-0">
                <span className={label}>{s.dateLabel}</span>
                <span className={`${value} first-letter:uppercase`}>{dateText}</span>
              </span>
              {chevron(panel === "date")}
            </button>
            {panel === "date" && (
              <div
                role="dialog"
                aria-label={s.dateLabel}
                className={`${panelBase} inset-x-0 lg:start-auto lg:end-0 lg:w-[700px]`}
              >
                <DatePanel
                  value={date}
                  onChange={(iso) => {
                    setDate(iso);
                    setPanel(null);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {settings.showParticipants && divider}
        {settings.showParticipants && (
          <div className="min-w-0 lg:flex-1 lg:min-w-[170px]">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={panel === "participants"}
              onClick={() => toggle("participants")}
              className={segment(panel === "participants")}
            >
              <Users size={18} className="shrink-0 text-calma-ink" aria-hidden="true" />
              <span className="min-w-0">
                <span className={label}>{s.participantsLabel}</span>
                <span className={value}>{participantsText}</span>
              </span>
              {chevron(panel === "participants")}
            </button>
            {panel === "participants" && (
              <div
                role="dialog"
                aria-label={s.participantsLabel}
                className={`${panelBase} inset-x-0 lg:start-auto lg:end-0 lg:w-[360px]`}
              >
                <ParticipantsPanel
                  adults={adults}
                  childCount={childCount}
                  max={settings.maxParticipants}
                  onChange={(next) => {
                    setAdults(next.adults);
                    setChildCount(next.children);
                  }}
                />
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="mt-1 shrink-0 rounded-xl bg-calma-ink px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-calma-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-calma-olive lg:ms-2 lg:mt-0 lg:rounded-full lg:py-0"
        >
          {t.home.searchBtn}
        </button>
      </form>
    </div>
  );
}
