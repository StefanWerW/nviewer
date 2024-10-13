import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EventCallback, listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useListener<TType>(
  event: string,
  callback: EventCallback<TType>
) {
  useEffect(() => {
    listen<TType>(event, callback);
  }, []);
}

export function useListenerValue<ListenEvent, Value>({
  event,
  mapToValue,
  initValue,
}: {
  event: string;
  mapToValue: (event: ListenEvent) => Value;
  initValue: Value;
}) {
  const [value, setValue] = useState<Value>(initValue);
  useEffect(() => {
    listen<ListenEvent>(event, (event) => {
      setValue(mapToValue(event.payload));
    });
  }, []);
  return value;
}

export function useListenerHistory<ListenEvent, HistoryPoint>({
  event,
  maxPoints,
  mapToHistory,
}: {
  event: string;
  maxPoints: number;
  mapToHistory: (event: ListenEvent) => HistoryPoint;
}) {
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  useEffect(() => {
    listen<ListenEvent>(event, (event) => {
      setHistory((prev) => {
        const newData = [...prev, mapToHistory(event.payload)];
        while (newData.length > maxPoints) {
          newData.shift();
        }
        return newData;
      });
    });
  }, []);
  return history;
}
