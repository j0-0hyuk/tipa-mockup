export * from "./types";

export function isVoidElement(element: { type: string }): boolean {
  return element.type === "pic";
}
