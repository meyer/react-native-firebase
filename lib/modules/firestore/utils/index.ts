/**
 * @flow
 */

const buildFieldPathData = (segments: string[], value: any): any => {
  if (segments.length === 1) {
    return {
      [segments[0]]: value,
    };
  }
  return {
    [segments[0]]: buildFieldPathData(segments.slice(1), value),
  };
};

// eslint-disable-next-line import/prefer-default-export
export const mergeFieldPathData = (
  data: any,
  segments: string[],
  value: any
) => {
  if (segments.length === 1) {
    return {
      ...data,
      [segments[0]]: value,
    };
  } else if (data[segments[0]]) {
    return {
      ...data,
      [segments[0]]: mergeFieldPathData(
        data[segments[0]],
        segments.slice(1),
        value
      ),
    };
  }
  return {
    ...data,
    [segments[0]]: buildFieldPathData(segments.slice(1), value),
  };
};
