import type { FormatConverter } from "./types";
import { jsonConverter } from "./json-converter";
import { poConverter } from "./po-converter";
import { xliffConverter } from "./xliff-converter";
import { arbConverter } from "./arb-converter";
import { yamlConverter } from "./yaml-converter";
import { csvConverter } from "./csv-converter";
import { androidXmlConverter } from "./android-xml-converter";
import { iosStringsConverter } from "./ios-strings-converter";
import { propertiesConverter } from "./properties-converter";

export type { FormatConverter };

export const CONVERTERS: Record<string, FormatConverter> = {
  json: jsonConverter,
  po: poConverter,
  xliff: xliffConverter,
  arb: arbConverter,
  yaml: yamlConverter,
  csv: csvConverter,
  "android-xml": androidXmlConverter,
  "ios-strings": iosStringsConverter,
  properties: propertiesConverter,
};

export function convert(input: string, sourceFormat: string, targetFormat: string): string {
  const source = CONVERTERS[sourceFormat];
  const target = CONVERTERS[targetFormat];
  if (!source) throw new Error(`Unsupported source format: ${sourceFormat}`);
  if (!target) throw new Error(`Unsupported target format: ${targetFormat}`);
  const data = source.parse(input);
  return target.serialize(data);
}

export {
  jsonConverter,
  poConverter,
  xliffConverter,
  arbConverter,
  yamlConverter,
  csvConverter,
  androidXmlConverter,
  iosStringsConverter,
  propertiesConverter,
};
