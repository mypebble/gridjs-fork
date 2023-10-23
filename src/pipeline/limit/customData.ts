import Tabular from '../../tabular';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';

interface CustomDataProps extends PipelineProcessorProps {
  page: number;
  limit: number;
  data: (page: number, limit: number) => Promise<any[]>;
}

class CustomDataLimit extends PipelineProcessor<Tabular, CustomDataProps> {
  protected validateProps(): void {
    if (
      isNaN(Number(this.props.limit)) ||
      isNaN(Number(this.props.page)) ||
      !this.props.data
    ) {
      throw Error('Invalid parameters passed');
    }
  }

  get type(): ProcessorType {
    return ProcessorType.Limit;
  }

  protected async _process(): Promise<Tabular> {
    const data = await this.props.data(this.props.page, this.props.limit);

    const tab = Tabular.fromArray(data);
    tab.length = data.length;

    return tab;
  }
}

export default CustomDataLimit;
