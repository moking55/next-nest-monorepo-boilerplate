export class TwTransformer {
  // Custom transformation logic
  public transformAtoB(dataFromA: any, fieldMap: Record<string, string>): any {
    const transformed = {};
    for (const [keyA, keyB] of Object.entries(fieldMap)) {
      if (dataFromA.hasOwnProperty(keyA)) {
        transformed[keyB] = dataFromA[keyA];
      }
    }
    return transformed;
  }

  public transformNumberToCommaString(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  public transformCommaStringToNumber(str: string): number {
    return parseFloat(str.replace(/,/g, ''));
  }
}
