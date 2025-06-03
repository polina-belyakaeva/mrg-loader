import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadService } from '../file-upload.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { createMock } from '@golevelup/ts-jest';
import * as ExcelJS from 'exceljs';

describe('FileUploadService', () => {
  let service: FileUploadService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        {
          provide: PrismaService,
          useValue: createMock<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processFile', () => {
    it('should process Excel file successfully', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.xlsx',
        encoding: '7bit',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: Buffer.from('test content'),
        size: 1024,
      } as Express.Multer.File;

      const mockWorkbook = new ExcelJS.Workbook();
      const worksheet = mockWorkbook.addWorksheet('Sheet1');
      worksheet.addRow(['Name', 'Value']);
      worksheet.addRow(['Test 1', 100]);
      worksheet.addRow(['Test 2', 200]);

      jest.spyOn(ExcelJS, 'Workbook').mockImplementation(() => mockWorkbook);
      jest.spyOn(prismaService.data, 'createMany').mockResolvedValue({ count: 2 });

      const result = await service.processFile(mockFile);

      expect(result.success).toBe(true);
      expect(result.data.rows).toBe(2);
      expect(prismaService.data.createMany).toHaveBeenCalled();
    });

    it('should handle empty worksheet', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.xlsx',
        encoding: '7bit',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: Buffer.from('test content'),
        size: 1024,
      } as Express.Multer.File;

      const mockWorkbook = new ExcelJS.Workbook();
      const worksheet = mockWorkbook.addWorksheet('Sheet1');

      jest.spyOn(ExcelJS, 'Workbook').mockImplementation(() => mockWorkbook);

      await expect(service.processFile(mockFile)).rejects.toThrow('Worksheet is empty');
    });

    it('should handle database error', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.xlsx',
        encoding: '7bit',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: Buffer.from('test content'),
        size: 1024,
      } as Express.Multer.File;

      const mockWorkbook = new ExcelJS.Workbook();
      const worksheet = mockWorkbook.addWorksheet('Sheet1');
      worksheet.addRow(['Name', 'Value']);
      worksheet.addRow(['Test 1', 100]);

      jest.spyOn(ExcelJS, 'Workbook').mockImplementation(() => mockWorkbook);
      jest.spyOn(prismaService.data, 'createMany').mockRejectedValue(new Error('Database error'));

      await expect(service.processFile(mockFile)).rejects.toThrow('Failed to save data');
    });
  });
}); 