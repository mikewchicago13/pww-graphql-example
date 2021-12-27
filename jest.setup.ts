expect.extend({
  toBeGreaterThanAny(received: any, comparison: any) {
    const pass = received > comparison;
    return {
      message: () => `expected ${received}${pass ? " not" : ""} to be greater than ${comparison}`,
      pass
    }
  },
  toBeGreaterThanOrEqualAny(received: any, comparison: any) {
    const pass = received >= comparison;
    return {
      message: () => `expected ${received}${pass ? " not" : ""} to be greater than or equal ${comparison}`,
      pass
    }
  },
  toBeLessThanAny(received: any, comparison: any) {
    const pass = received < comparison;
    return {
      message: () => `expected ${received}${pass ? " not" : ""} to be less than ${comparison}`,
      pass
    }
  },
  toBeLessThanOrEqualAny(received: any, comparison: any) {
    const pass = received <= comparison;
    return {
      message: () => `expected ${received}${pass ? " not" : ""} to be less than or equal ${comparison}`,
      pass
    }
  },
});