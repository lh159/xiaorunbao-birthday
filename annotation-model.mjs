export function createDefaultAnnotations(ids) {
  return ids.map((id, index) => ({ id, place: "", date: "", story: "", order: index + 1 }));
}

export function normalizeAnnotations(ids, draft) {
  const saved = new Map(Array.isArray(draft) ? draft.map(item => [item?.id, item]) : []);
  return ids.map((id, index) => {
    const item = saved.get(id) || {};
    const rawOrder = Number(item.order);
    return {
      id,
      place: String(item.place ?? "").trim(),
      date: String(item.date ?? "").trim(),
      story: String(item.story ?? "").trim(),
      order: Number.isFinite(rawOrder) ? Math.min(ids.length, Math.max(1, Math.round(rawOrder))) : index + 1,
    };
  });
}

export function sortAnnotations(annotations) {
  return [...annotations].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function createExportPayload(annotations, exportedAt = new Date().toISOString()) {
  return {
    schemaVersion: 1,
    recipient: "小润宝",
    exportedAt,
    photos: sortAnnotations(annotations).map(({ id, place, date, story, order }) => ({ id, place, date, story, order })),
  };
}

export function annotationProgress(annotations) {
  return annotations.filter(item => String(item.place ?? "").trim()).length;
}

export function groupAnnotationsByPlace(annotations) {
  const groups = new Map();
  sortAnnotations(annotations).forEach(photo => {
    const place = String(photo.place || "未命名地点").trim();
    if (!groups.has(place)) groups.set(place, { place, dates: [], photos: [] });
    const group = groups.get(place);
    const date = String(photo.date || "").trim();
    if (date && !group.dates.includes(date)) group.dates.push(date);
    group.photos.push(photo);
  });
  return [...groups.values()];
}
