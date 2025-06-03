import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadController } from '../file-upload.controller';
import { FileUploadService } from '../file-upload.service';
import { createMock } from '@golevelup/ts-jest';

describe('FileUploadController', () => {
  let controller: FileUploadController;
  let service: FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [
        {
          provide: FileUploadService,
          useValue: createMock<FileUploadService>(),
        },
      ],
    }).compile();

    controller = module.get<FileUploadController>(FileUploadController);
    service = module.get<FileUploadService>(FileUploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.xlsx',
        encoding: '7bit',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: Buffer.from('test content'),
        size: 1024,
      } as Express.Multer.File;

      const mockResult = {
        success: true,
        message: 'File uploaded successfully',
        data: { rows: 10 },
      };

      jest.spyOn(service, 'processFile').mockResolvedValue(mockResult);

      const result = await controller.uploadFile(mockFile);

      expect(result).toEqual(mockResult);
      expect(service.processFile).toHaveBeenCalledWith(mockFile);
    });

    it('should handle invalid file type', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        buffer: Buffer.from('test content'),
        size: 1024,
      } as Express.Multer.File;

      await expect(controller.uploadFile(mockFile)).rejects.toThrow('Invalid file type');
    });

    it('should handle empty file', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.xlsx',
        encoding: '7bit',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: Buffer.from(''),
        size: 0,
      } as Express.Multer.File;

      await expect(controller.uploadFile(mockFile)).rejects.toThrow('File is empty');
    });
  });
}); 