export interface ITasks {
  '@context'?: string;
  '@id'?: string;
  '@type'?: string;
  id: number;
  name: string;
  duration?: string;
  isTerminated: boolean;
  dateStart?: any;
  dateEnd?: any;
}
