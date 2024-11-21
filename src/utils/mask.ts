import { MaskableObject, MaskInput } from "../types";

/**
 * Recursively masks specified fields in an object or array with '***'.
 * @param {MaskInput} obj - The object or array to mask. Can be undefined.
 * @param {string[]} [fieldsToMask] - Array of field names to mask.
 *                                    Defaults to ['createdBy', 'updatedBy', 'userName', 'userEmail', 'userRole']
 * @returns {MaskInput} The object or array with specified fields masked
 */
const mask = (
  obj: MaskInput,
  fieldsToMask = [
    "userName",
    "userEmail",
    "userRole",
    "ownerEmail",
    "businessOwnerEmail",
  ]
): MaskInput => {
  /**
   * Implementation:
   * 1. If input is falsy or not an object, return as-is
   * 2. For arrays, recursively mask each element
   * 3. For objects:
   *    - If key matches fieldsToMask, replace value with "***"
   *    - If value is an object, recursively mask it
   *    - If value is a JSON string, parse and mask the parsed object
   *    - Otherwise keep value unchanged
   * This ensures sensitive fields are masked at any nesting level,
   * including within serialized JSON strings.
   */
  const maskString = "***";
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => mask(item, fieldsToMask)) as MaskInput;
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (fieldsToMask.includes(key)) {
        return [key, maskString];
      }

      if (typeof value === "object" && value !== null) {
        return [key, mask(value as MaskableObject, fieldsToMask)];
      }

      if (typeof value === "string" && value.length > 0) {
        try {
          const parsedValue = JSON.parse(value) as MaskableObject;
          return [key, JSON.stringify(mask(parsedValue, fieldsToMask))];
        } catch (err) {
          // Not a valid JSON string
        }
      }

      return [key, value];
    })
  );
};

export default mask;
