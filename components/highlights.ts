export function highlightImagePath(label: string, page: number) {
  const folder = label.toLowerCase().replace(/\s+/g, "-");
  return `/highlights/${folder}/${page}.jpg`;
}

export function highlightLogoPath(label: string) {
  const folder = label.toLowerCase().replace(/\s+/g, "-");
  return `/highlights/${folder}/${folder}_logo.jpg`;
}
