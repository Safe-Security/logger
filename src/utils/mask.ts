import { MaskableObject, MaskInput } from "../types";

/**
 * Recursively masks specified fields in an object or array with '***'.
 * @param {MaskInput} obj - The object or array to mask. Can be undefined.
 * @param {string[]} [fieldsToMask] - Array of field names to mask.
 *                                    Defaults to ['userName', 'userEmail']
 * @param {WeakSet<object>} [visited] - Set of visited objects to avoid circular references.
 * @returns {MaskInput} The object or array with specified fields masked
 */
const mask = (
  obj: MaskInput,
  fieldsToMask: string[] = [],
  visited = new WeakSet<object>()
): MaskInput => {
  const maskFieldsSet = new Set(fieldsToMask.concat(["userName", "userEmail"]));

  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (visited.has(obj)) {
    // Avoid circular references
    return undefined;
  }

  visited.add(obj);

  if (Array.isArray(obj)) {
    return obj.map((item) => mask(item, fieldsToMask, visited)) as MaskInput;
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (maskFieldsSet.has(key)) {
        return [key, getMaskedValue(value as string)];
      }

      if (typeof value === "object" && value !== null) {
        return [key, mask(value as MaskableObject, fieldsToMask, visited)];
      }

      if (typeof value === "string" && value.length > 0) {
        try {
          const parsedValue = JSON.parse(value) as MaskableObject;
          return [
            key,
            JSON.stringify(mask(parsedValue, fieldsToMask, visited)),
          ];
        } catch (err) {
          // Not a valid JSON string
        }
      }

      return [key, value];
    })
  );
};

const getMaskedValue = (value: unknown) => {
  if (!value) {
    return value;
  }

  if (typeof value !== "string") {
    return value;
  }

  // Split the string on delimiters
  const segments = value.split(/[@\s.]/);

  // Process each segment according to rules
  const maskedSegments = segments.map((segment) => {
    if (segment.length <= 2) {
      return segment;
    }
    if (segment.length > 4) {
      const firstTwo = segment.slice(0, 2);
      const lastTwo = segment.slice(-1);
      const middleLength = segment.length - 3;
      const maskedMiddle = "*".repeat(middleLength);
      return `${firstTwo}${maskedMiddle}${lastTwo}`;
    } else {
      // 3-4 characters
      const firstTwo = segment.slice(0, 2);
      const remainingLength = segment.length - 2;
      const masked = "*".repeat(remainingLength);
      return `${firstTwo}${masked}`;
    }
  });

  // Rejoin with original delimiters
  return value
    .split(/(@|\s|\.)/)
    .map((part) => {
      if (part === "@" || part === " " || part === ".") {
        return part;
      }
      return maskedSegments.shift() || part;
    })
    .join("");
};

export default mask;
