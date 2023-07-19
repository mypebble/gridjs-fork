import Row from 'src/row';
import Tabular from '../../tabular';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import Cell from 'src/cell';
import { TDataArray } from '../../types';

interface PaginationLimitProps extends PipelineProcessorProps {
  page: number;
  limit: number;
  overrideData?: (page, start, end) => TDataArray;
  overrideDataAsync?: (page, start, end) => Promise<TDataArray>;
}

class PaginationLimit extends PipelineProcessor<Tabular, PaginationLimitProps> {
  protected validateProps(): void {
    if (isNaN(Number(this.props.limit)) || isNaN(Number(this.props.page))) {
      throw Error('Invalid parameters passed');
    }
  }

  get type(): ProcessorType {
    return ProcessorType.Limit;
  }

  protected _process(data: Tabular): Tabular | Promise<Tabular> {
    const page = this.props.page;
    const start = page * this.props.limit;
    const end = (page + 1) * this.props.limit;

    const overrideToRow = (overData: TDataArray) => {
      console.log(overData);
      let rows: Row[] = [];
      for (const rowData of overData) {
        const rowCells = rowData.map((val) => new Cell(val));
        rows.push(Row.fromCells(rowCells));
      }

      return new Tabular(rows);
    };

    if (this.props.overrideData) {
      const data = this.props.overrideData(page, start, end);
      return overrideToRow(data);
    }

    if (this.props.overrideDataAsync) {
      const createTabularRow = async () => {
        const data = await this.props.overrideDataAsync(page, start, end);
        return overrideToRow(data);
      };

      return createTabularRow();
    }

    return new Tabular(data.rows.slice(start, end));
  }
}

export default PaginationLimit;
