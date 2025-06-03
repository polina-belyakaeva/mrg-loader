import { Controller, Get, Param, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MRGService } from './mrg.service';
import * as ExcelJS from 'exceljs';
import { MRG } from '../entities/mrg.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('mrg')
@Controller('data')
export class MRGController {
  constructor(private readonly service: MRGService) { }

  @Get()
  @ApiOperation({ summary: 'Получить все записи МРГ' })
  @ApiResponse({ status: 200, description: 'Список всех записей МРГ', type: [MRG] })
  getAll(): Promise<MRG[]> {
    return this.service.findAll();
  }

  @Get(':mg')
  @ApiOperation({ summary: 'Получить записи МРГ по номеру МГ' })
  @ApiResponse({ status: 200, description: 'Список записей МРГ для указанного МГ', type: [MRG] })
  @ApiResponse({ status: 404, description: 'МГ не найден' })
  getByMg(@Param('mg') mg: string): Promise<MRG[]> {
    return this.service.findByMg(mg);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Загрузить данные МРГ из Excel файла' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel файл с данными МРГ'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Данные успешно загружены', type: [MRG] })
  @ApiResponse({ status: 400, description: 'Ошибка при загрузке файла' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async uploadExcel(@UploadedFile() file: Express.Multer.File): Promise<MRG[]> {
    if (!file) {
      throw new HttpException('Файл не был загружен.', HttpStatus.BAD_REQUEST);
    }

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer);
      const worksheet = workbook.worksheets[0];

      if (!worksheet) {
        throw new HttpException('Не удалось прочитать данные из файла Excel.', HttpStatus.BAD_REQUEST);
      }

      const data: Partial<MRG>[] = [];
      worksheet.eachRow((row, index) => {
        if (index <= 2) return;
        const values = Array.isArray(row.values) ? row.values : [];
        const [,
          pipeline,
          mg,
          km,
          date,
          loadLevel,
          avgFlow,
          tvps
        ] = values.slice(0);

        const parsedKm = String(km || '').trim();
        const parsedLoadLevel = String(loadLevel || '').trim();
        const parsedAvgFlow = String(avgFlow || '').trim();
        const parsedTvps = String(tvps || '').trim();

        data.push({
          pipeline: String(pipeline || '-').trim(),
          mg: String(mg || '-').trim(),
          km: parsedKm === '' || parsedKm === '-' ? NaN : parseFloat(parsedKm),
          date: String(date || '-').trim(),
          loadLevel: parsedLoadLevel === '' || parsedLoadLevel === '-' ? NaN : parseFloat(parseFloat(parsedLoadLevel).toFixed(2)),
          avgFlow: parsedAvgFlow === '' || parsedAvgFlow === '-' ? NaN : parseFloat(parsedAvgFlow),
          tvps: parsedTvps === '' || parsedTvps === '-' ? NaN : parseFloat(parsedTvps),
        });
      });

      if (data.length === 0) {
        throw new HttpException('В файле нет данных для загрузки, кроме заголовков.', HttpStatus.BAD_REQUEST);
      }

      return this.service.createMany(data);

    } catch (error) {
      console.error('Error uploading file:', error);
      throw new HttpException('Произошла ошибка при обработке файла.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
