interface MemoryInfo {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

// Extend the Performance interface to include the memory property
interface Performance {
  memory?: MemoryInfo;
}
